import type { FaqItem } from "@/components/marketing/faq";

export const calculusFaqs: FaqItem[] = [
  {
    question: "What calculus operations are supported?",
    answer:
      "Calculus Solver supports derivatives, higher-order derivatives, indefinite and definite integrals, limits, and function graphing."
  },
  {
    question: "Does the solver show integration constants?",
    answer:
      "Yes. Indefinite integrals include +C in the answer and the steps explain why the constant is needed."
  },
  {
    question: "How are limits verified?",
    answer:
      "Limits are difficult to verify symbolically in the browser. We mark them as partially verified and use numerical sampling as a sanity check."
  }
];

export const algebraFaqs: FaqItem[] = [
  {
    question: "What algebra operations are supported?",
    answer:
      "Algebra Solver supports solving linear and quadratic equations, systems of equations, factoring, expanding, simplifying, and inequalities."
  },
  {
    question: "How do I enter a system of equations?",
    answer:
      "Write both equations in one line connected by 'and', for example: 'Solve x + y = 5 and x − y = 1'."
  },
  {
    question: "Are the solutions verified?",
    answer:
      "Yes. For equations, the solver substitutes solutions back into the original equation and reports the verification status."
  }
];
