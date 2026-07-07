import type { Metadata } from "next";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy policy for Calculus Solver."
};

export default function PrivacyPage(): React.JSX.Element {
  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-content px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold tracking-tight text-heading">Privacy Policy</h1>
        <div className="prose mt-8 max-w-none text-body">
          <p>
            Calculus Solver is an educational tool. We do not require user accounts, and we do not collect personal
            information.
          </p>
          <h2 className="mt-6 text-xl font-semibold text-heading">Information We Process</h2>
          <p>
            When you submit a math problem, it is sent to our server-side API route and forwarded to DeepSeek for
            processing. Your API key is never exposed to the browser.
          </p>
          <h2 className="mt-6 text-xl font-semibold text-heading">Local Storage</h2>
          <p>
            Your recent problem history is stored only in your browser&apos;s localStorage. It is not transmitted to our
            servers.
          </p>
          <h2 className="mt-6 text-xl font-semibold text-heading">Third-Party Services</h2>
          <p>
            We use DeepSeek for AI math reasoning. Please refer to DeepSeek&apos;s privacy policy for information about how
            they handle API requests.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
