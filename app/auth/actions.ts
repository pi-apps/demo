"use server"

import { redirect } from "next/navigation"

export async function signOutAction() {
  redirect("/auth/login")
}
