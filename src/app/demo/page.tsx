import type { Metadata } from "next";
import DemoShell from "@/components/demo/DemoShell";

export const metadata: Metadata = {
  title: "Live Demo | AI-Powered Learning Analysis",
  description:
    "Experience how NeuroLearn AI discovers why students struggle and helps rebuild understanding through diagnostic learning.",
  openGraph: {
    title: "NeuroLearn AI Demo | AI-Powered Learning Analysis",
    description:
      "Experience how NeuroLearn AI discovers why students struggle and helps rebuild understanding.",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
};

export default function DemoPage() {
  return <DemoShell />;
}
