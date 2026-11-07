import { AdminOverview } from "@/components/dashboard/admin/AdminScreens";
import { CompanyOverview } from "@/components/dashboard/company/CompanyScreens";
import { SchoolOverview } from "@/components/dashboard/school/SchoolScreens";
import { StudentOverview } from "@/components/dashboard/student/StudentScreens";
import type { Role } from "@/data/users";

/*
  Role landing pages. Every role uses the same visual language, from Aston's student
  dashboard design (Checkpoints 7–10).
*/

export function RoleOverview({ role }: { role: Role }) {
  switch (role) {
    case "student":
      return <StudentOverview />;
    case "school":
      return <SchoolOverview />;
    case "company":
      return <CompanyOverview />;
    case "admin":
      return <AdminOverview />;
  }
}
