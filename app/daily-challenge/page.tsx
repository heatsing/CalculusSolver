import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { DailyChallengeGame } from "@/components/daily-challenge/daily-challenge-game";
import { StructuredData } from "@/components/seo/structured-data";
import { createMetadata, faqPageStructuredData } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Daily Math Challenge | Free Calculus & Algebra Puzzles",
  description:
    "A new math challenge every day. Solve derivatives, integrals, limits, and algebra problems with progressive hints. Track your streak and share your results.",
  path: "/daily-challenge",
  keywords: [
    "daily math challenge",
    "calculus challenge",
    "math puzzle",
    "daily math problem",
    "math streak",
    "free math challenge"
  ]
});

const faqs = [
  {
    question: "What is the Daily Math Challenge?",
    answer:
      "Every day a new math problem is selected — covering derivatives, integrals, limits, and algebra. You get up to 6 progressive hints and must guess the correct answer."
  },
  {
    question: "When does the challenge reset?",
    answer: "The challenge resets at midnight UTC. A new problem appears every day, and the countdown shows the exact time remaining."
  },
  {
    question: "How does scoring work?",
    answer: "You start with 100 points. Each wrong guess or hint skip reduces your score. The fewer hints you use, the higher your final score."
  },
  {
    question: "Does my progress persist if I refresh?",
    answer: "Yes. Your hints, guesses, and completion state are saved locally. Refreshing the page restores your current session."
  },
  {
    question: "What is the streak?",
    answer: "Your streak counts consecutive days you solve the challenge. Miss a day or lose, and the streak resets to zero."
  }
];

export default function DailyChallengePage(): React.JSX.Element {
  return (
    <>
      <StructuredData data={faqPageStructuredData(faqs)} />
      <Header />
      <main id="main-content" tabIndex={-1} className="mx-auto w-full max-w-content px-4 py-10 sm:px-6 lg:px-8 focus-visible:outline-none">
        <nav className="mb-6 text-sm text-body" aria-label="Breadcrumb">
          <a href="/" className="hover:text-heading">Home</a>
          <span className="mx-2">/</span>
          <span className="text-heading">Daily Challenge</span>
        </nav>

        <h1 className="text-4xl font-bold tracking-tight text-heading sm:text-5xl">Daily Math Challenge</h1>
        <p className="mt-4 max-w-2xl text-lg text-body">
          A new problem every day. Use progressive hints, test your skills, and build your streak.
        </p>

        <div className="mt-10">
          <DailyChallengeGame />
        </div>

        <section className="mt-16">
          <h2 className="text-2xl font-bold text-heading">How it works</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-3">
            <div className="rounded-card border border-border bg-white p-5">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">1</span>
              <h3 className="mt-3 font-semibold text-heading">Read the problem</h3>
              <p className="mt-1 text-sm text-body">Each day brings a new calculus or algebra problem across different categories and difficulties.</p>
            </div>
            <div className="rounded-card border border-border bg-white p-5">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">2</span>
              <h3 className="mt-3 font-semibold text-heading">Guess and get hints</h3>
              <p className="mt-1 text-sm text-body">Wrong guesses reveal a new hint. You can also skip to reveal a hint at a higher score cost.</p>
            </div>
            <div className="rounded-card border border-border bg-white p-5">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">3</span>
              <h3 className="mt-3 font-semibold text-heading">Win and share</h3>
              <p className="mt-1 text-sm text-body">Solve the problem to earn points, extend your streak, and share your result without spoiling the answer.</p>
            </div>
          </div>
        </section>

        <section className="mt-16">
          <h2 className="text-2xl font-bold text-heading">Frequently asked questions</h2>
          <div className="mt-6 space-y-4">
            {faqs.map((faq, index) => (
              <details key={index} className="rounded-card border border-border bg-white p-4">
                <summary className="cursor-pointer font-medium text-heading">{faq.question}</summary>
                <p className="mt-2 text-sm text-body">{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
