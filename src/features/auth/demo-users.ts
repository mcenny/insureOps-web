import type { User } from "@/types";

export const DEMO_USERS: User[] = [
  {
    id: "user_amina",
    name: "Amina Yusuf",
    email: "amina.yusuf@insureops.demo",
    role: "operations_manager",
  },
  {
    id: "user_daniel",
    name: "Daniel Okafor",
    email: "daniel.okafor@insureops.demo",
    role: "claims_reviewer",
  },
  {
    id: "user_tolu",
    name: "Tolu Martins",
    email: "tolu.martins@insureops.demo",
    role: "finance_admin",
  },
  {
    id: "user_grace",
    name: "Grace Adeyemi",
    email: "grace.adeyemi@insureops.demo",
    role: "support_agent",
  },
  {
    id: "user_philemon",
    name: "Philemon Eniola",
    email: "philemon@insureops.demo",
    role: "super_admin",
  },
];

export function getDemoUser(id: string): User | undefined {
  return DEMO_USERS.find((u) => u.id === id);
}
