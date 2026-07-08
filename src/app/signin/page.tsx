import type { Metadata } from "next";
import SignInView from "./SignInView";

export const metadata: Metadata = { title: "Sign In" };

export default function SignInPage() {
  return <SignInView />;
}
