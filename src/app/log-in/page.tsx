import { redirect } from "next/navigation";

export default function LogInRedirect() {
  redirect("/login");
  return null;
}
