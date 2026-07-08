import type { Metadata } from "next";
import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import Problem from "@/components/landing/Problem";
import Solution from "@/components/landing/Solution";
import HowItWorks from "@/components/landing/HowItWorks";
import ExplainBack from "@/components/landing/ExplainBack";
import CTA from "@/components/landing/CTA";
import Footer from "@/components/landing/Footer";
import PageTransition from "@/components/PageTransition";

export const metadata: Metadata = {
  title: "NeuroLearn AI | Discover Why Students Struggle",
  description:
    "NeuroLearn AI uses artificial intelligence to identify student misconceptions and guide deeper understanding.",
};

export default function HomePage() {
  return (
    <PageTransition>
      <Navbar />
      <main>
        <Hero />
        <Problem />
        <Solution />
        <HowItWorks />
        <ExplainBack />
        <CTA />
      </main>
      <Footer />
    </PageTransition>
  );
}
