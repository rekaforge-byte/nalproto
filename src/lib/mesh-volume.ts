// Client-side mesh volume estimation for STL and 3MF files.
// Volume is computed via the signed-tetrahedron-sum method (divergence theorem),
// which works for any closed (watertight) triangle mesh, regardless of orientation.
// Units are assumed to be millimeters, per the STL/3MF convention.

export type MeshStats = {
  volumeMm3: number;
  boundingBoxMm: { x: number; y: number; z: number };
  triangleCount: number;
};

function signedTetraVolume(
  ax: number, ay: number, az: number,
  bx: number, by: number, bz: number,
  cx: number, cy: number, cz: number
): number {
  return (
    (ax * (by * cz - bz * cy) -
      ay * (bx * cz - bz * cx) +
      az * (bx * cy - by * cx)) / 6
  );
}

function statsFromTriangles(vertices: Float32Array): MeshStats {
  let volume = 0;
  let minX = Infinity, minY = Infinity, minZ = Infinity;
  let maxX = -Infinity, maxY = -Infinity, maxZ = -Infinity;
  const triangleCount = vertices.length / 9;

  for (let i = 0; i < vertices.length; i += 9) {
    const ax = vertices[i], ay = vertices[i + 1], az = vertices[i + 2];
    const bx = vertices[i + 3], by = vertices[i + 4], bz = vertices[i + 5];
    const cx = vertices[i + 6], cy = vertices[i + 7], cz = vertices[i + 8];

    volume += signedTetraVolume(ax, ay, az, bx, by, bz, cx, cy, cz);

    minX = Math.min(minX, ax, bx, cx);
    minY = Math.min(minY, ay, by, cy);
    minZ = Math.min(minZ, az, bz, cz);
    maxX = Math.max(maxX, ax, bx, cx);
    maxY = Math.max(maxY, ay, by, cy);
    maxZ = Math.max(maxZ, az, bz, cz);
  }

  return {
    volumeMm3: Math.abs(volume),
    boundingBoxMm: {
      x: maxX - minX,
      y: maxY - minY,
      z: maxZ - minZ,
    },
    triangleCount,
  };
}

function isBinarySTL(buffer: ArrayBuffer): boolean {
  if (buffer.byteLength < 84) return false;
  const view = new DataView(buffer);
  const triCount = view.getUint32(80, true);
  const expectedSize = 84 + triCount * 50;
  return expectedSize === buffer.byteLength;
}

function parseBinarySTL(buffer: ArrayBuffer): MeshStats {
  const view = new DataView(buffer);
  const triCount = view.getUint32(80, true);
  const vertices = new Float32Array(triCount * 9);
  let offset = 84;
  let vi = 0;

  for (let t = 0; t < triCount; t++) {
    offset += 12; // skip normal
    for (let v = 0; v < 3; v++) {
      vertices[vi++] = view.getFloat32(offset, true);
      vertices[vi++] = view.getFloat32(offset + 4, true);
      vertices[vi++] = view.getFloat32(offset + 8, true);
      offset += 12;
    }
    offset += 2; // attribute byte count
  }

  return statsFromTriangles(vertices);
}

function parseAsciiSTL(text: string): MeshStats {
  const coords: number[] = [];
  const vertexRegex = /vertex\s+([-\d.eE+]+)\s+([-\d.eE+]+)\s+([-\d.eE+]+)/g;
  let match: RegExpExecArray | null;
  while ((match = vertexRegex.exec(text)) !== null) {
    coords.push(parseFloat(match[1]), parseFloat(match[2]), parseFloat(match[3]));
  }
  return statsFromTriangles(new Float32Array(coords));
}

export async function parseSTL(file: File): Promise<MeshStats> {
  const buffer = await file.arrayBuffer();
  if (isBinarySTL(buffer)) {
    return parseBinarySTL(buffer);
  }
  const text = new TextDecoder().decode(buffer);
  return parseAsciiSTL(text);
}

export async function parse3MF(file: File): Promise<MeshStats> {
  const JSZip = (await import("jszip")).default;
  const zip = await JSZip.loadAsync(file);

  // Find the main model file (usually 3D/3dmodel.model)
  const modelEntry =
    zip.file("3D/3dmodel.model") ||
    Object.values(zip.files).find((f) => f.name.toLowerCase().endsWith(".model"));

  if (!modelEntry) throw new Error("No 3D model data found inside this .3mf file.");

  const xmlText = await modelEntry.async("text");
  const parser = new DOMParser();
  const doc = parser.parseFromString(xmlText, "application/xml");

  const parserError = doc.querySelector("parsererror");
  if (parserError) throw new Error("Could not read the .3mf model data.");

  const meshes = Array.from(doc.getElementsByTagName("mesh"));
  if (meshes.length === 0) throw new Error("No mesh geometry found inside this .3mf file.");

  let allCoords: number[] = [];

  for (const mesh of meshes) {
    const vertexEls = Array.from(mesh.getElementsByTagName("vertex"));
    const px: number[] = [];
    const py: number[] = [];
    const pz: number[] = [];
    for (const v of vertexEls) {
      px.push(parseFloat(v.getAttribute("x") || "0"));
      py.push(parseFloat(v.getAttribute("y") || "0"));
      pz.push(parseFloat(v.getAttribute("z") || "0"));
    }

    const triangleEls = Array.from(mesh.getElementsByTagName("triangle"));
    for (const tri of triangleEls) {
      const v1 = parseInt(tri.getAttribute("v1") || "0", 10);
      const v2 = parseInt(tri.getAttribute("v2") || "0", 10);
      const v3 = parseInt(tri.getAttribute("v3") || "0", 10);
      allCoords.push(px[v1], py[v1], pz[v1]);
      allCoords.push(px[v2], py[v2], pz[v2]);
      allCoords.push(px[v3], py[v3], pz[v3]);
    }
  }

  return statsFromTriangles(new Float32Array(allCoords));
}

export async function parseMeshFile(file: File): Promise<MeshStats> {
  const name = file.name.toLowerCase();
  if (name.endsWith(".stl")) return parseSTL(file);
  if (name.endsWith(".3mf")) return parse3MF(file);
  throw new Error("Unsupported file type. Please upload a .stl or .3mf file.");
}
