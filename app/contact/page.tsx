import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({ title: "Contact Calculus Solver", description: "Contact Calculus Solver about incorrect answers, accessibility, privacy, or general support.", path: "/contact" });

export default function ContactPage(): React.JSX.Element {
  return <><Header /><main id="main-content" tabIndex={-1} className="mx-auto max-w-[900px] px-4 py-12 sm:px-6 lg:px-8"><p className="text-sm font-semibold text-primary">Contact</p><h1 className="mt-2 text-4xl font-bold text-heading sm:text-5xl">Tell us what needs attention</h1><p className="mt-5 max-w-2xl text-lg leading-8 text-body">Report an incorrect result, accessibility problem, privacy concern, or broken page. Include the page URL and the exact math input when reporting a solver issue.</p><a href="mailto:contact@calculussolver.net" className="mt-8 inline-flex min-h-12 items-center rounded-lg bg-primary px-6 font-semibold text-white hover:bg-primary-hover">contact@calculussolver.net</a><p className="mt-4 text-sm text-body">Do not include passwords, API keys, or other sensitive personal information.</p></main><Footer /></>;
}
