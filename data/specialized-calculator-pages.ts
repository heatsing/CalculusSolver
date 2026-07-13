import type { CalculatorPageProps } from "@/components/calculator/calculator-page";
import type { CreateMetadataOptions } from "@/lib/seo";

export type SpecializedCalculatorSlug =
  | "inequality"
  | "system-of-equations"
  | "complex-numbers"
  | "asymptote"
  | "definite-integral"
  | "long-division"
  | "pythagorean-theorem"
  | "sequence"
  | "sum-of-series";

type SpecializedCalculatorDefinition = {
  metadata: CreateMetadataOptions;
  page: CalculatorPageProps;
};

export const specializedCalculatorPages: Record<SpecializedCalculatorSlug, SpecializedCalculatorDefinition> = {
  inequality: {
    metadata: {
      title: "Free Inequality Calculator with Steps | Calculus Solver",
      description: "Solve linear and quadratic inequalities online. Get interval notation and step-by-step explanations with this free inequality calculator.",
      path: "/inequality-calculator",
      keywords: ["inequality calculator", "solve inequalities", "interval notation calculator", "quadratic inequality solver"]
    },
    page: {
      title: "Inequality Calculator",
      description: "Solve linear and quadratic inequalities in interval notation.",
      path: "/inequality-calculator",
      mode: "inequality",
      h1: "Inequality Calculator",
      subtitle: "Solve linear and quadratic inequalities and express the real solution set in clear interval notation.",
      exampleLatex: "x^2-5x+6\\leq0\\Rightarrow x\\in[2,3]",
      howItWorks: [
        { step: "Enter the inequality", description: "Type both sides with <, >, ≤, or ≥." },
        { step: "Find boundary points", description: "The calculator solves the related equation and tests each interval." },
        { step: "Read the solution set", description: "Get the final answer in interval notation with endpoints handled correctly." }
      ],
      faqs: [
        { question: "Does it solve quadratic inequalities?", answer: "Yes. It finds the real roots, checks the sign between them, and includes endpoints for ≤ or ≥." },
        { question: "What does union mean in the answer?", answer: "A union joins separate intervals that both satisfy the inequality." }
      ],
      relatedTools: []
    }
  },
  "system-of-equations": {
    metadata: {
      title: "Free System of Equations Calculator | Calculus Solver",
      description: "Solve systems of linear equations online with exact values and step-by-step explanations.",
      path: "/system-of-equations-calculator",
      keywords: ["system of equations calculator", "simultaneous equations solver", "linear system solver"]
    },
    page: {
      title: "System of Equations Calculator",
      description: "Solve simultaneous equations with exact answers.",
      path: "/system-of-equations-calculator",
      mode: "system",
      h1: "System of Equations Calculator",
      subtitle: "Solve two-variable systems of linear equations using exact symbolic elimination.",
      exampleLatex: "\\begin{cases}x+y=5\\\\x-y=1\\end{cases}\\Rightarrow x=3,\\ y=2",
      howItWorks: [
        { step: "Enter each equation", description: "Separate equations with the word and or a semicolon." },
        { step: "Eliminate a variable", description: "The solver combines the equations to isolate one unknown." },
        { step: "Verify both values", description: "The final values are checked in the original system." }
      ],
      faqs: [
        { question: "How should I separate equations?", answer: "Use and, for example: x + y = 5 and x - y = 1." },
        { question: "Can it return exact fractions?", answer: "Yes. When a solution is fractional, the exact fraction is preserved." }
      ],
      relatedTools: []
    }
  },
  "complex-numbers": {
    metadata: {
      title: "Free Complex Numbers Calculator | Calculus Solver",
      description: "Add, subtract, multiply, divide, and evaluate complex numbers online with exact results.",
      path: "/complex-numbers-calculator",
      keywords: ["complex numbers calculator", "imaginary number calculator", "complex arithmetic"]
    },
    page: {
      title: "Complex Numbers Calculator",
      description: "Calculate expressions involving real and imaginary parts.",
      path: "/complex-numbers-calculator",
      mode: "complex",
      h1: "Complex Numbers Calculator",
      subtitle: "Evaluate complex-number arithmetic, powers, magnitudes, and conjugates using i for the imaginary unit.",
      exampleLatex: "(3+4i)(2-i)=10+5i",
      howItWorks: [
        { step: "Enter a complex expression", description: "Use i for the imaginary unit and parentheses to group terms." },
        { step: "Combine real and imaginary parts", description: "The calculator applies complex arithmetic rules exactly." },
        { step: "Get standard form", description: "Results are returned in a + bi form or as an exact real value." }
      ],
      faqs: [
        { question: "How do I enter the imaginary unit?", answer: "Use i, as in 3 + 4i." },
        { question: "Can it calculate magnitude?", answer: "Yes. Use abs(3 + 4i) to calculate the magnitude." }
      ],
      relatedTools: []
    }
  },
  asymptote: {
    metadata: {
      title: "Free Asymptote Calculator with Steps | Calculus Solver",
      description: "Find vertical, horizontal, and slant asymptotes of rational functions online.",
      path: "/asymptote-calculator",
      keywords: ["asymptote calculator", "vertical asymptote", "horizontal asymptote", "slant asymptote"]
    },
    page: {
      title: "Asymptote Calculator",
      description: "Find vertical, horizontal, and slant asymptotes.",
      path: "/asymptote-calculator",
      mode: "asymptote",
      h1: "Asymptote Calculator",
      subtitle: "Analyze rational functions to find vertical, horizontal, and slant asymptotes while excluding removable holes.",
      exampleLatex: "f(x)=\\frac{2x+1}{x-3}\\Rightarrow x=3,\\ y=2",
      howItWorks: [
        { step: "Enter a rational function", description: "Use a numerator divided by a denominator in x." },
        { step: "Analyze the denominator", description: "Real denominator zeros are checked for vertical asymptotes or holes." },
        { step: "Compare polynomial degrees", description: "Degree and division rules determine horizontal or slant behavior." }
      ],
      faqs: [
        { question: "What is a vertical asymptote?", answer: "It is a vertical line x = a approached by the function when the denominator tends to zero without cancellation." },
        { question: "Can a function have a slant asymptote?", answer: "Yes. A slant asymptote occurs when the numerator degree is exactly one greater than the denominator degree." }
      ],
      relatedTools: []
    }
  },
  "definite-integral": {
    metadata: {
      title: "Free Definite Integral Calculator with Steps | Calculus Solver",
      description: "Evaluate definite integrals between two bounds and get exact step-by-step solutions online.",
      path: "/definite-integral-calculator",
      keywords: ["definite integral calculator", "area under curve calculator", "evaluate definite integral"]
    },
    page: {
      title: "Definite Integral Calculator",
      description: "Evaluate bounded integrals exactly.",
      path: "/definite-integral-calculator",
      mode: "definite-integral",
      h1: "Definite Integral Calculator",
      subtitle: "Evaluate an integral between lower and upper bounds and receive an exact result without an integration constant.",
      exampleLatex: "\\int_0^1x^2\\,dx=\\left[\\frac{x^3}{3}\\right]_0^1=\\frac13",
      howItWorks: [
        { step: "Enter the function and bounds", description: "Write an expression followed by from a to b." },
        { step: "Find an antiderivative", description: "The solver integrates the function symbolically." },
        { step: "Apply the bounds", description: "Upper and lower values are substituted and subtracted." }
      ],
      faqs: [
        { question: "Why is there no + C?", answer: "A definite integral evaluates a fixed difference, so the integration constants cancel." },
        { question: "Can I use pi as a bound?", answer: "Yes. Enter pi directly, for example sin(x) from 0 to pi." }
      ],
      relatedTools: []
    }
  },
  "long-division": {
    metadata: {
      title: "Free Long Division Calculator with Remainder | Calculus Solver",
      description: "Divide whole numbers online and get the quotient, remainder, and decimal value.",
      path: "/long-division-calculator",
      keywords: ["long division calculator", "division with remainder", "quotient calculator"]
    },
    page: {
      title: "Long Division Calculator",
      description: "Find quotients, remainders, and decimal values.",
      path: "/long-division-calculator",
      mode: "long-division",
      h1: "Long Division Calculator",
      subtitle: "Divide a dividend by a nonzero divisor and see the whole-number quotient, remainder, and decimal result.",
      exampleLatex: "125\\div4=31\\text{ remainder }1=31.25",
      howItWorks: [
        { step: "Enter dividend and divisor", description: "Write the larger or starting number followed by by and the divisor." },
        { step: "Calculate the quotient", description: "The calculator finds how many whole times the divisor fits." },
        { step: "Find the remainder", description: "Any amount left over is returned with the decimal result." }
      ],
      faqs: [
        { question: "Can the divisor be zero?", answer: "No. Division by zero is undefined, so enter a nonzero divisor." },
        { question: "Does it show a decimal answer?", answer: "Yes. A non-exact division includes both remainder form and decimal form." }
      ],
      relatedTools: []
    }
  },
  "pythagorean-theorem": {
    metadata: {
      title: "Free Pythagorean Theorem Calculator | Calculus Solver",
      description: "Find a missing side of a right triangle using the Pythagorean theorem a² + b² = c².",
      path: "/pythagorean-theorem-calculator",
      keywords: ["pythagorean theorem calculator", "right triangle calculator", "hypotenuse calculator"]
    },
    page: {
      title: "Pythagorean Theorem Calculator",
      description: "Find the missing side of a right triangle.",
      path: "/pythagorean-theorem-calculator",
      mode: "pythagorean",
      h1: "Pythagorean Theorem Calculator",
      subtitle: "Enter any two side lengths of a right triangle to calculate the missing leg or hypotenuse.",
      exampleLatex: "a=3,\\ b=4\\Rightarrow c=\\sqrt{3^2+4^2}=5",
      howItWorks: [
        { step: "Enter two known sides", description: "Use a and b for legs and c for the hypotenuse." },
        { step: "Apply a² + b² = c²", description: "The calculator rearranges the theorem for the missing side." },
        { step: "Calculate the length", description: "The positive square root gives the geometric side length." }
      ],
      faqs: [
        { question: "Which side is c?", answer: "c is the hypotenuse, the longest side opposite the right angle." },
        { question: "Can it solve for a leg?", answer: "Yes. Enter the other leg and the hypotenuse, for example a=5, c=13." }
      ],
      relatedTools: []
    }
  },
  sequence: {
    metadata: {
      title: "Free Sequence Calculator and Pattern Finder | Calculus Solver",
      description: "Identify arithmetic, geometric, and quadratic sequences and calculate the next terms.",
      path: "/sequence-calculator",
      keywords: ["sequence calculator", "next term calculator", "arithmetic sequence", "geometric sequence"]
    },
    page: {
      title: "Sequence Calculator",
      description: "Identify common sequence patterns and calculate next terms.",
      path: "/sequence-calculator",
      mode: "sequence",
      h1: "Sequence Calculator",
      subtitle: "Detect arithmetic, geometric, or quadratic patterns and calculate the next three terms.",
      exampleLatex: "2,5,8,11,\\ldots\\Rightarrow d=3\\Rightarrow14,17,20",
      howItWorks: [
        { step: "Enter at least three terms", description: "Separate the known sequence terms with commas." },
        { step: "Compare differences and ratios", description: "The calculator tests common first- and second-order patterns." },
        { step: "Continue the pattern", description: "The detected rule is used to produce the next three terms." }
      ],
      faqs: [
        { question: "Which sequence types are supported?", answer: "The calculator detects arithmetic, geometric, and constant-second-difference quadratic sequences." },
        { question: "What if no pattern is found?", answer: "It reports that no supported pattern was detected instead of guessing an unreliable rule." }
      ],
      relatedTools: []
    }
  },
  "sum-of-series": {
    metadata: {
      title: "Free Sum of Series Calculator | Calculus Solver",
      description: "Calculate finite arithmetic series, listed terms, and indexed polynomial sums online.",
      path: "/sum-of-series-calculator",
      keywords: ["sum of series calculator", "arithmetic series calculator", "sigma calculator", "finite series sum"]
    },
    page: {
      title: "Sum of Series Calculator",
      description: "Calculate finite series and indexed sums.",
      path: "/sum-of-series-calculator",
      mode: "series-sum",
      h1: "Sum of Series Calculator",
      subtitle: "Add finite arithmetic series, explicit term lists, or indexed polynomial sums with exact results.",
      exampleLatex: "1+2+\\cdots+100=\\frac{100(1+100)}2=5050",
      howItWorks: [
        { step: "Enter the series", description: "Use an ellipsis for arithmetic terms, a comma list, or a formula with bounds." },
        { step: "Identify the finite rule", description: "The calculator determines the term count or evaluates the indexed formula." },
        { step: "Compute the exact sum", description: "The result is returned without rounding when an exact value is available." }
      ],
      faqs: [
        { question: "How do I enter 1 through 100?", answer: "Enter 1 + 2 + ... + 100." },
        { question: "Can I sum a formula?", answer: "Yes. Use a form such as Sum n^2 from 1 to 10." }
      ],
      relatedTools: []
    }
  }
};
