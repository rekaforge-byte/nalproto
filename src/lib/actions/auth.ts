"use server";

import { AuthError } from "next-auth";
import { signIn, signOut } from "@/lib/auth";
import { redirect } from "next/navigation";

export type LoginFormState = {
  error?: string;
};

export async function loginAction(
  _prevState: LoginFormState,
  formData: FormData
): Promise<LoginFormState> {
  const email = String(formData.get("email") || "");
  const password = String(formData.get("password") || "");
  const callbackUrl = String(formData.get("callbackUrl") || "/admin/produk");

  try {
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
  } catch (err) {
    if (err instanceof AuthError) {
      return { error: "Incorrect email or password." };
    }
    throw err;
  }

  redirect(callbackUrl);
}

export async function signOutAction() {
  "use server";
  await signOut({ redirectTo: "/" });
}
