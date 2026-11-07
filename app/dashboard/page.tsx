import { redirect } from "next/navigation";

// /dashboard on its own goes to the "Sign in as…" screen.
export default function DashboardIndex() {
  redirect("/sign-in");
}
