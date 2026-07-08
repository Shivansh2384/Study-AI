import type { Metadata } from "next";
import DashboardView from "@/components/dashboard/DashboardView";
import PageTransition from "@/components/PageTransition";

export const metadata: Metadata = {
  title: "Learning Intelligence Dashboard",
  description:
    "Track learning patterns, misconceptions, and conceptual growth with NeuroLearn AI's diagnostic intelligence.",
  openGraph: {
    title: "Learning Intelligence Dashboard | NeuroLearn AI",
    description:
      "Track learning patterns, misconceptions, and conceptual growth with NeuroLearn AI.",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
};

export default function DashboardPage() {
  return (
    <PageTransition>
      <DashboardView />
    </PageTransition>
  );
}
