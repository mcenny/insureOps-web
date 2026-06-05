import { LoginScreen } from "@/features/auth/components/LoginScreen";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "Sign in — try the demo",
  description:
    "Pick a demo persona and explore InsureOps — claims reviewer, finance admin, operations manager, and more. No password required.",
  path: "/login",
});

export default function LoginPage() {
  return <LoginScreen />;
}
