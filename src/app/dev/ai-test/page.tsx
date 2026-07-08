import type { Metadata } from "next";
import AITestSandbox from "./AITestSandbox";

export const metadata: Metadata = {
  title: "AI Testing Sandbox | NeuroLearn Dev",
  robots: "noindex, nofollow",
};

export default function AITestPage() {
  return <AITestSandbox />;
}
