import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Privacy Policy",
  description: "Privacy policy for Calculus Solver.",
  path: "/privacy",
  keywords: ["privacy policy", "data protection", "Calculus Solver privacy"]
});

const lastUpdated = "July 8, 2026";

export default function PrivacyPage(): React.JSX.Element {
  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-content px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold tracking-tight text-heading">Privacy Policy</h1>
        <p className="mt-2 text-sm text-body">Last updated: {lastUpdated}</p>
        <div className="prose mt-8 max-w-none text-body">
          <p>
            Calculus Solver is an educational tool. We do not require user accounts, and we do not
            collect personal information beyond what is described below.
          </p>

          <h2 className="mt-6 text-xl font-semibold text-heading">Information We Process</h2>
          <p>
            When you submit a math problem, it is sent to our server-side API route and forwarded to
            DeepSeek for processing. Your API key is never exposed to the browser.
          </p>

          <h2 className="mt-6 text-xl font-semibold text-heading">Local Storage</h2>
          <p>
            Your recent problem history is stored only in your browser&apos;s localStorage. It is not
            transmitted to our servers and remains under your control.
          </p>

          <h2 className="mt-6 text-xl font-semibold text-heading">Cookies</h2>
          <p>
            Calculus Solver does not use first-party cookies. We rely on minimal analytics that may
            use anonymous cookies to understand overall traffic. No personal data is stored in these
            cookies.
          </p>

          <h2 className="mt-6 text-xl font-semibold text-heading">Data Retention</h2>
          <p>
            We do not retain math problems or results on our servers after they are processed. If
            local history is enabled, it is kept in your browser until you clear it or uninstall the
            application.
          </p>

          <h2 className="mt-6 text-xl font-semibold text-heading">Third-Party Services</h2>
          <p>
            We use DeepSeek for AI math reasoning. Please refer to DeepSeek&apos;s privacy policy for
            information about how they handle API requests.
          </p>

          <h2 className="mt-6 text-xl font-semibold text-heading">Contact</h2>
          <p>
            If you have questions about this privacy policy, please reach out through the feedback
            channels listed on the site.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
