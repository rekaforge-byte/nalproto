// Client-side mesh volume estimation for STL and 3MF files.
// Volume is computed via the signed-tetrahedron-sum method (divergence theorem),
// which works for any closed (watertight) triangle mesh, regardless of orientation.
// Units are assumed to be millimeters, per the STL/3MF convention.

export type MeshStats = {
  volumeMm3: number;
  boundingBoxMm: { x: number; y: number; z: number };
  triangleCount: number;
};

// ---------- shared accumulator ----------

type Accumulator = {
  volume: number;
  minX: number;
  minY: number;
  minZ: number;
  maxX: number;
  maxY: number;
  maxZ: number;
  triangleCount: number;
};

function newAccumulator(): Accumulator {
  return {
    volume: 0,
    minX: Infinity,
    minY: Infinity,
    minZ: Infinity,
    maxX: -Infinity,
    maxY: -Infinity,
    maxZ: -Infinity,
    triangleCount: 0,
  };
}

function accumulateTriangles(acc: Accumulator, vertices: Float32Array | number[]) {
  for (let i = 0; i < vertices.length; i += 9) {
    const ax = vertices[i], ay = vertices[i + 1], az = vertices[i + 2];
    const bx = vertices[i + 3], by = vertices[i + 4], bz = vertices[i + 5];
    const cx = vertices[i + 6], cy = vertices[i + 7], cz = vertices[i + 8];

    acc.volume +=
      (ax * (by * cz - bz * cy) -
        ay * (bx * cz - bz * cx) +
        az * (bx * cy - by * cx)) / 6;

    acc.minX = Math.min(acc.minX, ax, bx, cx);
    acc.minY = Math.min(acc.minY, ay, by, cy);
    acc.minZ = Math.min(acc.minZ, az, bz, cz);
    acc.maxX = Math.max(acc.maxX, ax, bx, cx);
    acc.maxY = Math.max(acc.maxY, ay, by, cy);
    acc.maxZ = Math.max(acc.maxZ, az, bz, cz);
    acc.triangleCount += 1;
  }
}

function finalizeStats(acc: Accumulator): MeshStats {
  if (acc.triangleCount === 0) {
    return { volumeMm3: 0, boundingBoxMm: { x: 0, y: 0, z: 0 }, triangleCount: 0 };
  }
  return {
    volumeMm3: Math.abs(acc.volume),
    boundingBoxMm: {
      x: acc.maxX - acc.minX,
      y: acc.maxY - acc.minY,
      z: acc.maxZ - acc.minZ,
    },
    triangleCount: acc.triangleCount,
  };
}

// ---------- STL ----------

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
  const acc = newAccumulator();
  let offset = 84;
  const tri = new Float32Array(9);

  for (let t = 0; t < triCount; t++) {
    offset += 12; // skip normal
    for (let v = 0; v < 3; v++) {
      tri[v * 3] = view.getFloat32(offset, true);
      tri[v * 3 + 1] = view.getFloat32(offset + 4, true);
      tri[v * 3 + 2] = view.getFloat32(offset + 8, true);
      offset += 12;
    }
    offset += 2; // attribute byte count
    accumulateTriangles(acc, tri);
  }

  return finalizeStats(acc);
}

function parseAsciiSTL(text: string): MeshStats {
  const acc = newAccumulator();
  const coords: number[] = [];
  const vertexRegex = /vertex\s+([-\d.eE+]+)\s+([-\d.eE+]+)\s+([-\d.eE+]+)/g;
  let match: RegExpExecArray | null;
  while ((match = vertexRegex.exec(text)) !== null) {
    coords.push(parseFloat(match[1]), parseFloat(match[2]), parseFloat(match[3]));
    if (coords.length === 9) {
      accumulateTriangles(acc, coords);
      coords.length = 0;
    }
  }
  return finalizeStats(acc);
}

export async function parseSTL(file: File): Promise<MeshStats> {
  const buffer = await file.arrayBuffer();
  if (isBinarySTL(buffer)) {
    return parseBinarySTL(buffer);
  }
  const text = new TextDecoder().decode(buffer);
  return parseAsciiSTL(text);
}

// ---------- 3MF ----------
// 3MF files (especially those exported by Bambu Studio / OrcaSlicer) often split
// each part's geometry into separate "Objects/*.model" files, with the root
// "3D/3dmodel.model" only containing <build> placement items and <components>
// references that point at those files — each with its own transform matrix.
// To get an accurate volume we have to resolve that whole reference graph and
// apply every transform (translation, rotation, and any scaling) before summing.

type Mat4 = number[]; // row-major 4x4, row-vector convention: p' = p * M

function identity(): Mat4 {
  return [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
}

function parseTransform(str: string | null): Mat4 {
  if (!str) return identity();
  const v = str.trim().split(/\s+/).map(Number);
  if (v.length !== 12 || v.some((n) => Number.isNaN(n))) return identity();
  // 3MF order: m00 m01 m02 m10 m11 m12 m20 m21 m22 m30(tx) m31(ty) m32(tz)
  return [
    v[0], v[1], v[2], 0,
    v[3], v[4], v[5], 0,
    v[6], v[7], v[8], 0,
    v[9], v[10], v[11], 1,
  ];
}

function multiply(a: Mat4, b: Mat4): Mat4 {
  const r = new Array(16).fill(0);
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      let sum = 0;
      for (let k = 0; k < 4; k++) sum += a[i * 4 + k] * b[k * 4 + j];
      r[i * 4 + j] = sum;
    }
  }
  return r;
}

function applyTransform(m: Mat4, x: number, y: number, z: number): [number, number, number] {
  const nx = x * m[0] + y * m[4] + z * m[8] + m[12];
  const ny = x * m[1] + y * m[5] + z * m[9] + m[13];
  const nz = x * m[2] + y * m[6] + z * m[10] + m[14];
  return [nx, ny, nz];
}

function getPathAttr(el: Element): string | null {
  const direct = el.getAttribute("p:path");
  if (direct) return direct;
  for (let i = 0; i < el.attributes.length; i++) {
    const attr = el.attributes[i];
    if (attr.localName === "path" || attr.name.toLowerCase().endsWith(":path")) {
      return attr.value;
    }
  }
  return null;
}

function normalizePath(path: string, fallback: string): string {
  const p = path || fallback;
  return p.startsWith("/") ? p.slice(1) : p;
}

type ObjectMap = Map<string, Map<string, Element>>; // filePath -> (objectId -> <object> element)

function extractMeshVertices(meshEl: Element, transform: Mat4, acc: Accumulator) {
  const vertexEls = meshEl.getElementsByTagName("vertex");
  const px: number[] = [];
  const py: number[] = [];
  const pz: number[] = [];
  for (let i = 0; i < vertexEls.length; i++) {
    const v = vertexEls[i];
    const [x, y, z] = applyTransform(
      transform,
      parseFloat(v.getAttribute("x") || "0"),
      parseFloat(v.getAttribute("y") || "0"),
      parseFloat(v.getAttribute("z") || "0")
    );
    px.push(x);
    py.push(y);
    pz.push(z);
  }

  const triangleEls = meshEl.getElementsByTagName("triangle");
  const tri = new Float32Array(9);
  for (let i = 0; i < triangleEls.length; i++) {
    const t = triangleEls[i];
    const v1 = parseInt(t.getAttribute("v1") || "0", 10);
    const v2 = parseInt(t.getAttribute("v2") || "0", 10);
    const v3 = parseInt(t.getAttribute("v3") || "0", 10);
    tri[0] = px[v1]; tri[1] = py[v1]; tri[2] = pz[v1];
    tri[3] = px[v2]; tri[4] = py[v2]; tri[5] = pz[v2];
    tri[6] = px[v3]; tri[7] = py[v3]; tri[8] = pz[v3];
    accumulateTriangles(acc, tri);
  }
}

function resolveObject(
  path: string,
  objectId: string,
  transform: Mat4,
  objectMap: ObjectMap,
  acc: Accumulator,
  depth: number
) {
  if (depth > 12) return; // guard against pathological/cyclic references
  const objectsInFile = objectMap.get(path);
  const obj = objectsInFile?.get(objectId);
  if (!obj) return;

  // An <object> has either a direct <mesh>, or a <components> list — never both.
  let meshEl: Element | null = null;
  for (let i = 0; i < obj.children.length; i++) {
    if (obj.children[i].tagName === "mesh") {
      meshEl = obj.children[i];
      break;
    }
  }

  if (meshEl) {
    extractMeshVertices(meshEl, transform, acc);
    return;
  }

  let componentsEl: Element | null = null;
  for (let i = 0; i < obj.children.length; i++) {
    if (obj.children[i].tagName === "components") {
      componentsEl = obj.children[i];
      break;
    }
  }
  if (!componentsEl) return;

  const componentEls = componentsEl.getElementsByTagName("component");
  for (let i = 0; i < componentEls.length; i++) {
    const comp = componentEls[i];
    const compObjectId = comp.getAttribute("objectid");
    if (!compObjectId) continue;
    const compPathRaw = getPathAttr(comp);
    const compPath = compPathRaw ? normalizePath(compPathRaw, path) : path;
    const compTransform = parseTransform(comp.getAttribute("transform"));
    const combined = multiply(compTransform, transform);
    resolveObject(compPath, compObjectId, combined, objectMap, acc, depth + 1);
  }
}

export async function parse3MF(file: File): Promise<MeshStats> {
  const JSZip = (await import("jszip")).default;
  const zip = await JSZip.loadAsync(file);

  const modelFiles = Object.values(zip.files).filter(
    (f) => !f.dir && f.name.toLowerCase().endsWith(".model")
  );
  if (modelFiles.length === 0) {
    throw new Error("No 3D model data found inside this .3mf file.");
  }

  const rootEntry =
    zip.file("3D/3dmodel.model") || modelFiles.find((f) => f.name.toLowerCase().includes("3dmodel.model"));
  if (!rootEntry) {
    throw new Error("Could not find the main model file inside this .3mf archive.");
  }
  const rootPath = normalizePath(rootEntry.name, rootEntry.name);

  const parser = new DOMParser();
  const objectMap: ObjectMap = new Map();
  const docsByPath = new Map<string, Document>();

  for (const entry of modelFiles) {
    const text = await entry.async("text");
    const doc = parser.parseFromString(text, "application/xml");
    if (doc.querySelector("parsererror")) continue;
    const normPath = normalizePath(entry.name, entry.name);
    docsByPath.set(normPath, doc);

    const objectEls = doc.getElementsByTagName("object");
    const idMap = new Map<string, Element>();
    for (let i = 0; i < objectEls.length; i++) {
      const id = objectEls[i].getAttribute("id");
      if (id) idMap.set(id, objectEls[i]);
    }
    objectMap.set(normPath, idMap);
  }

  const rootDoc = docsByPath.get(rootPath);
  if (!rootDoc) throw new Error("Could not read the .3mf model data.");

  const buildEls = rootDoc.getElementsByTagName("build");
  if (buildEls.length === 0) throw new Error("No build items found inside this .3mf file.");

  const itemEls = buildEls[0].getElementsByTagName("item");
  const acc = newAccumulator();

  for (let i = 0; i < itemEls.length; i++) {
    const item = itemEls[i];
    if (item.getAttribute("printable") === "0") continue;
    const objectId = item.getAttribute("objectid");
    if (!objectId) continue;
    const transform = parseTransform(item.getAttribute("transform"));
    resolveObject(rootPath, objectId, transform, objectMap, acc, 0);
  }

  if (acc.triangleCount === 0) {
    throw new Error("No printable mesh geometry found inside this .3mf file.");
  }

  return finalizeStats(acc);
}

export async function parseMeshFile(file: File): Promise<MeshStats> {
  const name = file.name.toLowerCase();
  if (name.endsWith(".stl")) return parseSTL(file);
  if (name.endsWith(".3mf")) return parse3MF(file);
  throw new Error("Unsupported file type. Please upload a .stl or .3mf file.");
}
