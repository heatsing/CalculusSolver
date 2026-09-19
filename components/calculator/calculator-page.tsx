import { ToolCalculatorWorkspace } from "@/components/calculator/tool-calculator-workspace";
import { ScientificCalculusCalculator } from "@/components/calculator/scientific-calculus-calculator";
import { StructuredData } from "@/components/seo/structured-data";
import type { CalculatorEducationalContent } from "@/data/calculator-pages";
import type { CalculatorQualityContent } from "@/data/calculator-quality-content";
import {
  breadcrumbStructuredData,
  calculatorApplicationStructuredData,
  faqPageStructuredData,
  webPageStructuredData
} from "@/lib/seo";
import {
  CalculatorBenefits,
  CalculatorExample,
  CalculatorFaqs,
  CalculatorFooter,
  CalculatorHeader,
  CalculatorHero,
  CalculatorHowTo,
  CalculatorDeepLearningContent,
  CalculatorLearningContent,
  CalculatorRelatedTools,
  CalculatorTopicLinks,
  type CalculatorFaq,
  type CalculatorStep,
  type CalculatorToolLink
} from "@/components/calculator/calculator-layout";

export type CalculatorPageProps = {
  title: string;
  description: string;
  path: string;
  mode: string;
  h1: string;
  subtitle: string;
  eyebrow?: string;
  exampleLatex: string;
  howItWorks: CalculatorStep[];
  faqs: CalculatorFaq[];
  relatedTools: CalculatorToolLink[];
  heroRelatedTools?: readonly CalculatorToolLink[];
  category?: string;
  updatedAt?: string;
  educationalContent?: CalculatorEducationalContent;
  qualityContent?: CalculatorQualityContent;
  learningLinks?: readonly { label: string; href: string }[];
};

export function CalculatorPage({ title, description, path, mode, h1, subtitle, eyebrow, exampleLatex, howItWorks, faqs, relatedTools, heroRelatedTools = [], category = "Mathematics", updatedAt, educationalContent, qualityContent, learningLinks = [] }: CalculatorPageProps): React.JSX.Element {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[#f6f9fe] text-[#0a234f]">
      <StructuredData data={webPageStructuredData({ name: h1, description, path, updatedAt })} />
      <StructuredData data={calculatorApplicationStructuredData({ name: title, description, path, category, features: howItWorks.map((item) => item.description) })} />
      <StructuredData data={breadcrumbStructuredData([{ name: "Home", path: "/" }, { name: "Calculators", path: "/calculators" }, { name: h1, path }])} />
      <StructuredData data={faqPageStructuredData(faqs)} />
      <CalculatorHeader />
      <main id="main-content" tabIndex={-1} className="mx-auto w-full max-w-[1240px] px-4 py-10 focus-visible:outline-none sm:px-6 lg:px-8">
        <CalculatorHero h1={h1} subtitle={subtitle} eyebrow={eyebrow} relatedLinks={heroRelatedTools} />
        {path === "/derivative-calculator" || path === "/integral-calculator" || path === "/limit-calculator"
          ? <ScientificCalculusCalculator variant={path === "/derivative-calculator" ? "derivative" : path === "/integral-calculator" ? "integral" : "limit"} />
          : <ToolCalculatorWorkspace title={title} mode={mode} />}
        <div className="mt-6"><CalculatorBenefits /></div>
        <CalculatorHowTo title={title} steps={howItWorks} />
        <CalculatorExample latex={exampleLatex} />
        {qualityContent && <CalculatorDeepLearningContent title={title} content={qualityContent} />}
        {!qualityContent && <CalculatorTopicLinks links={learningLinks} />}
        {educationalContent && <CalculatorLearningContent title={title} content={educationalContent} />}
        <CalculatorFaqs faqs={faqs} />
        <CalculatorRelatedTools tools={relatedTools} />
      </main>
      <CalculatorFooter />
    </div>
  );
}
