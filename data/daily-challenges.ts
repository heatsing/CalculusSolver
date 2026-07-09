export type DailyChallengeCategory = "Derivatives" | "Integrals" | "Limits" | "Algebra";
export type DailyChallengeDifficulty = "Easy" | "Medium" | "Advanced";

export type DailyChallenge = {
  id: string;
  category: DailyChallengeCategory;
  difficulty: DailyChallengeDifficulty;
  problem: string;
  problemLatex: string;
  symbol: string;
  operation: string;
  answer: string;
  answerLatex: string;
  acceptableAnswers: string[];
  hints: [string, string, string, string, string, string];
};

export const dailyChallenges: DailyChallenge[] = [
  {
    id: "deriv-x-squared",
    category: "Derivatives",
    difficulty: "Easy",
    problem: "Find the derivative of x²",
    problemLatex: "\\frac{d}{dx} x^2",
    symbol: "d/dx",
    operation: "derivative",
    answer: "2*x",
    answerLatex: "2x",
    acceptableAnswers: ["2*x", "2x"],
    hints: [
      "This is a differentiation problem.",
      "It uses the most basic rule in calculus.",
      "Apply the power rule: bring the exponent down, then reduce it by one.",
      "For x^n, the derivative is n*x^(n-1).",
      "Here n = 2, so the result is 2 * x^1.",
      "The answer is a simple monomial of degree 1."
    ]
  },
  {
    id: "deriv-x-cubed",
    category: "Derivatives",
    difficulty: "Easy",
    problem: "Find the derivative of x³",
    problemLatex: "\\frac{d}{dx} x^3",
    symbol: "d/dx",
    operation: "derivative",
    answer: "3*x^2",
    answerLatex: "3x^2",
    acceptableAnswers: ["3*x^2", "3x^2"],
    hints: [
      "This is a differentiation problem.",
      "Use the power rule for polynomial terms.",
      "Bring the exponent 3 down as a coefficient.",
      "Reduce the exponent by 1 to get 2.",
      "The coefficient is 3 and the new exponent is 2.",
      "The answer is 3 times x squared."
    ]
  },
  {
    id: "deriv-sin-x",
    category: "Derivatives",
    difficulty: "Easy",
    problem: "Find the derivative of sin(x)",
    problemLatex: "\\frac{d}{dx} \\sin(x)",
    symbol: "d/dx",
    operation: "derivative",
    answer: "cos(x)",
    answerLatex: "\\cos(x)",
    acceptableAnswers: ["cos(x)", "cosx"],
    hints: [
      "This is a differentiation problem involving a trigonometric function.",
      "Recall the standard derivatives of trig functions.",
      "The derivative of sine is a related trig function.",
      "It starts with the letter 'c'.",
      "The derivative of sin(x) is cos(x).",
      "The answer is cosine of x."
    ]
  },
  {
    id: "deriv-cos-x",
    category: "Derivatives",
    difficulty: "Easy",
    problem: "Find the derivative of cos(x)",
    problemLatex: "\\frac{d}{dx} \\cos(x)",
    symbol: "d/dx",
    operation: "derivative",
    answer: "-sin(x)",
    answerLatex: "-\\sin(x)",
    acceptableAnswers: ["-sin(x)", "-sinx"],
    hints: [
      "This is a differentiation problem involving a trigonometric function.",
      "Recall the standard derivatives of trig functions.",
      "The derivative of cosine is related to sine, but with a sign change.",
      "There is a negative sign involved.",
      "The derivative of cos(x) is the negative of sin(x).",
      "The answer is negative sine of x."
    ]
  },
  {
    id: "deriv-e-to-x",
    category: "Derivatives",
    difficulty: "Easy",
    problem: "Find the derivative of eˣ",
    problemLatex: "\\frac{d}{dx} e^x",
    symbol: "d/dx",
    operation: "derivative",
    answer: "e^x",
    answerLatex: "e^x",
    acceptableAnswers: ["e^x", "exp(x)", "e**x"],
    hints: [
      "This is a differentiation problem involving an exponential function.",
      "This function has a special property: it is its own derivative.",
      "No rule application changes the expression.",
      "The derivative equals the original function.",
      "d/dx of e^x = e^x.",
      "The answer is the same as the input: e to the x."
    ]
  },
  {
    id: "deriv-ln-x",
    category: "Derivatives",
    difficulty: "Medium",
    problem: "Find the derivative of ln(x)",
    problemLatex: "\\frac{d}{dx} \\ln(x)",
    symbol: "d/dx",
    operation: "derivative",
    answer: "1/x",
    answerLatex: "\\frac{1}{x}",
    acceptableAnswers: ["1/x", "x^(-1)", "1/x"],
    hints: [
      "This is a differentiation problem involving a logarithmic function.",
      "The natural log has a well-known derivative.",
      "The result is a simple fraction.",
      "The numerator is 1.",
      "The denominator is the original argument x.",
      "The answer is 1 divided by x."
    ]
  },
  {
    id: "deriv-product-rule",
    category: "Derivatives",
    difficulty: "Medium",
    problem: "Find the derivative of x·sin(x)",
    problemLatex: "\\frac{d}{dx} \\left(x \\sin(x)\\right)",
    symbol: "d/dx",
    operation: "derivative",
    answer: "sin(x)+x*cos(x)",
    answerLatex: "\\sin(x) + x\\cos(x)",
    acceptableAnswers: ["sin(x)+x*cos(x)", "sinx+xcosx"],
    hints: [
      "This is a differentiation problem with a product of two functions.",
      "You need a rule that handles products of functions.",
      "Use the product rule: (fg)' = f'g + fg'.",
      "Here f = x (so f' = 1) and g = sin(x) (so g' = cos(x)).",
      "Apply: 1*sin(x) + x*cos(x).",
      "The answer is sin(x) plus x times cos(x)."
    ]
  },
  {
    id: "integral-x",
    category: "Integrals",
    difficulty: "Easy",
    problem: "Evaluate ∫ x dx",
    problemLatex: "\\int x \\, dx",
    symbol: "∫",
    operation: "integral",
    answer: "x^2/2",
    answerLatex: "\\frac{x^2}{2} + C",
    acceptableAnswers: ["x^2/2", "x**2/2", "0.5*x^2"],
    hints: [
      "This is an integration problem.",
      "Use the reverse of the power rule.",
      "Add 1 to the exponent, then divide by the new exponent.",
      "x becomes x², divided by 2.",
      "Don't forget the constant of integration C.",
      "The answer is x squared over 2, plus C."
    ]
  },
  {
    id: "integral-x-squared",
    category: "Integrals",
    difficulty: "Easy",
    problem: "Evaluate ∫ x² dx",
    problemLatex: "\\int x^2 \\, dx",
    symbol: "∫",
    operation: "integral",
    answer: "x^3/3",
    answerLatex: "\\frac{x^3}{3} + C",
    acceptableAnswers: ["x^3/3", "x**3/3"],
    hints: [
      "This is an integration problem.",
      "Use the power rule for integration.",
      "Add 1 to the exponent: 2 + 1 = 3.",
      "Divide by the new exponent 3.",
      "Include the constant of integration C.",
      "The answer is x cubed over 3, plus C."
    ]
  },
  {
    id: "integral-cos-x",
    category: "Integrals",
    difficulty: "Easy",
    problem: "Evaluate ∫ cos(x) dx",
    problemLatex: "\\int \\cos(x) \\, dx",
    symbol: "∫",
    operation: "integral",
    answer: "sin(x)",
    answerLatex: "\\sin(x) + C",
    acceptableAnswers: ["sin(x)", "sinx"],
    hints: [
      "This is an integration problem involving a trigonometric function.",
      "Think: what function has cos(x) as its derivative?",
      "The antiderivative of cosine is a related trig function.",
      "It starts with the letter 's'.",
      "The integral of cos(x) is sin(x).",
      "The answer is sine of x, plus C."
    ]
  },
  {
    id: "integral-sin-x",
    category: "Integrals",
    difficulty: "Easy",
    problem: "Evaluate ∫ sin(x) dx",
    problemLatex: "\\int \\sin(x) \\, dx",
    symbol: "∫",
    operation: "integral",
    answer: "-cos(x)",
    answerLatex: "-\\cos(x) + C",
    acceptableAnswers: ["-cos(x)", "-cosx"],
    hints: [
      "This is an integration problem involving a trigonometric function.",
      "Think: what function has sin(x) as its derivative?",
      "The antiderivative of sine involves cosine.",
      "There is a negative sign.",
      "The integral of sin(x) is -cos(x).",
      "The answer is negative cosine of x, plus C."
    ]
  },
  {
    id: "integral-e-to-x",
    category: "Integrals",
    difficulty: "Easy",
    problem: "Evaluate ∫ eˣ dx",
    problemLatex: "\\int e^x \\, dx",
    symbol: "∫",
    operation: "integral",
    answer: "e^x",
    answerLatex: "e^x + C",
    acceptableAnswers: ["e^x", "exp(x)"],
    hints: [
      "This is an integration problem involving an exponential function.",
      "This function has a special property: it is its own integral.",
      "No transformation is needed.",
      "The integral equals the integrand.",
      "∫ e^x dx = e^x + C.",
      "The answer is e to the x, plus C."
    ]
  },
  {
    id: "integral-linear",
    category: "Integrals",
    difficulty: "Medium",
    problem: "Evaluate ∫ (2x + 3) dx",
    problemLatex: "\\int (2x + 3) \\, dx",
    symbol: "∫",
    operation: "integral",
    answer: "x^2+3*x",
    answerLatex: "x^2 + 3x + C",
    acceptableAnswers: ["x^2+3*x", "x**2+3*x", "x^2+3x"],
    hints: [
      "This is an integration problem with a sum of terms.",
      "Integrate each term separately using linearity.",
      "The integral of 2x is x² (reverse power rule).",
      "The integral of the constant 3 is 3x.",
      "Combine the results and add C.",
      "The answer is x squared plus 3x, plus C."
    ]
  },
  {
    id: "limit-sin-over-x",
    category: "Limits",
    difficulty: "Advanced",
    problem: "Evaluate lim(x→0) sin(x)/x",
    problemLatex: "\\lim_{x \\to 0} \\frac{\\sin(x)}{x}",
    symbol: "lim",
    operation: "limit",
    answer: "1",
    answerLatex: "1",
    acceptableAnswers: ["1"],
    hints: [
      "This is a limit evaluation problem.",
      "This is one of the most famous limits in calculus.",
      "Direct substitution gives 0/0, an indeterminate form.",
      "You can use L'Hôpital's rule or a geometric argument.",
      "The sine function near 0 behaves almost like the identity function.",
      "The limit equals 1."
    ]
  },
  {
    id: "limit-e-definition",
    category: "Limits",
    difficulty: "Advanced",
    problem: "Evaluate lim(x→∞) (1 + 1/x)ˣ",
    problemLatex: "\\lim_{x \\to \\infty} \\left(1 + \\frac{1}{x}\\right)^x",
    symbol: "lim",
    operation: "limit",
    answer: "e",
    answerLatex: "e",
    acceptableAnswers: ["e"],
    hints: [
      "This is a limit evaluation problem as x approaches infinity.",
      "This limit defines a famous mathematical constant.",
      "The base approaches 1, but the exponent grows without bound.",
      "The result is an irrational number approximately equal to 2.718.",
      "This is the definition of Euler's number.",
      "The answer is e."
    ]
  },
  {
    id: "limit-rational",
    category: "Limits",
    difficulty: "Medium",
    problem: "Evaluate lim(x→2) (x² - 4)/(x - 2)",
    problemLatex: "\\lim_{x \\to 2} \\frac{x^2 - 4}{x - 2}",
    symbol: "lim",
    operation: "limit",
    answer: "4",
    answerLatex: "4",
    acceptableAnswers: ["4"],
    hints: [
      "This is a limit evaluation problem.",
      "Direct substitution gives 0/0, so you need to simplify first.",
      "Factor the numerator: x² - 4 = (x-2)(x+2).",
      "Cancel the common factor (x - 2).",
      "You are left with lim(x→2) of (x + 2).",
      "Substitute x = 2 to get the answer 4."
    ]
  },
  {
    id: "solve-linear-1",
    category: "Algebra",
    difficulty: "Easy",
    problem: "Solve 2x + 5 = 17",
    problemLatex: "2x + 5 = 17",
    symbol: "x",
    operation: "solve_equation",
    answer: "6",
    answerLatex: "x = 6",
    acceptableAnswers: ["6", "x=6"],
    hints: [
      "This is a linear equation to solve for x.",
      "Isolate the variable term on one side.",
      "Subtract 5 from both sides: 2x = 12.",
      "Divide both sides by 2.",
      "x = 12 / 2.",
      "The answer is x = 6."
    ]
  },
  {
    id: "solve-linear-2",
    category: "Algebra",
    difficulty: "Easy",
    problem: "Solve 3x - 7 = 14",
    problemLatex: "3x - 7 = 14",
    symbol: "x",
    operation: "solve_equation",
    answer: "7",
    answerLatex: "x = 7",
    acceptableAnswers: ["7", "x=7"],
    hints: [
      "This is a linear equation to solve for x.",
      "Isolate the variable term.",
      "Add 7 to both sides: 3x = 21.",
      "Divide both sides by 3.",
      "x = 21 / 3.",
      "The answer is x = 7."
    ]
  },
  {
    id: "solve-quadratic",
    category: "Algebra",
    difficulty: "Medium",
    problem: "Solve x² - 9 = 0",
    problemLatex: "x^2 - 9 = 0",
    symbol: "x",
    operation: "solve_equation",
    answer: "3,-3",
    answerLatex: "x = \\pm 3",
    acceptableAnswers: ["3,-3", "-3,3", "x=3,x=-3", "+-3", "±3"],
    hints: [
      "This is a quadratic equation to solve for x.",
      "Rearrange: x² = 9.",
      "Take the square root of both sides.",
      "Remember there are two solutions: positive and negative.",
      "The square root of 9 is 3.",
      "The answers are x = 3 and x = -3."
    ]
  },
  {
    id: "factor-difference-squares",
    category: "Algebra",
    difficulty: "Medium",
    problem: "Factor x² - 1",
    problemLatex: "x^2 - 1",
    symbol: "( )",
    operation: "factor",
    answer: "(x-1)(x+1)",
    answerLatex: "(x-1)(x+1)",
    acceptableAnswers: ["(x-1)(x+1)", "(x+1)(x-1)"],
    hints: [
      "This is a factoring problem.",
      "Recognize the form: a difference of two squares.",
      "x² - 1 = x² - 1².",
      "The pattern is a² - b² = (a-b)(a+b).",
      "Here a = x and b = 1.",
      "The answer is (x - 1)(x + 1)."
    ]
  },
  {
    id: "expand-binomial",
    category: "Algebra",
    difficulty: "Medium",
    problem: "Expand (x + 2)²",
    problemLatex: "(x + 2)^2",
    symbol: "( )",
    operation: "expand",
    answer: "x^2+4*x+4",
    answerLatex: "x^2 + 4x + 4",
    acceptableAnswers: ["x^2+4*x+4", "x^2+4x+4", "x**2+4*x+4"],
    hints: [
      "This is an expansion problem using a binomial.",
      "Use the formula (a + b)² = a² + 2ab + b².",
      "Here a = x and b = 2.",
      "a² = x².",
      "2ab = 2 * x * 2 = 4x, and b² = 4.",
      "The answer is x² + 4x + 4."
    ]
  },
  {
    id: "simplify-rational",
    category: "Algebra",
    difficulty: "Easy",
    problem: "Simplify (x² + x) / x",
    problemLatex: "\\frac{x^2 + x}{x}",
    symbol: "/",
    operation: "simplify",
    answer: "x+1",
    answerLatex: "x + 1",
    acceptableAnswers: ["x+1", "1+x"],
    hints: [
      "This is a simplification problem.",
      "Factor the numerator first.",
      "x² + x = x(x + 1).",
      "Cancel the common factor x (assuming x ≠ 0).",
      "You are left with (x + 1).",
      "The answer is x + 1."
    ]
  },
  {
    id: "deriv-chain-rule",
    category: "Derivatives",
    difficulty: "Advanced",
    problem: "Find the derivative of (3x + 1)⁴",
    problemLatex: "\\frac{d}{dx} (3x + 1)^4",
    symbol: "d/dx",
    operation: "derivative",
    answer: "12*(3*x+1)^3",
    answerLatex: "12(3x+1)^3",
    acceptableAnswers: ["12*(3*x+1)^3", "12(3x+1)^3"],
    hints: [
      "This is a differentiation problem requiring a multi-step rule.",
      "The outer function is a power, the inner is linear.",
      "Use the chain rule: d/dx [f(g(x))] = f'(g(x)) * g'(x).",
      "The derivative of the outer part: 4*(3x+1)³.",
      "Multiply by the derivative of the inner: 3.",
      "Combine: 4 * 3 * (3x+1)³ = 12(3x+1)³."
    ]
  },
  {
    id: "integral-substitution",
    category: "Integrals",
    difficulty: "Advanced",
    problem: "Evaluate ∫ 2x·(x² + 1) dx",
    problemLatex: "\\int 2x(x^2 + 1) \\, dx",
    symbol: "∫",
    operation: "integral",
    answer: "x^2*(x^2+2)/2",
    answerLatex: "\\frac{x^4}{2} + x^2 + C",
    acceptableAnswers: ["x^4/2+x^2", "x**4/2+x**2"],
    hints: [
      "This is an integration problem that can be solved by expanding first.",
      "Distribute: 2x * (x² + 1) = 2x³ + 2x.",
      "Integrate each term using the power rule.",
      "∫ 2x³ dx = 2x⁴/4 = x⁴/2.",
      "∫ 2x dx = x².",
      "Combine: x⁴/2 + x² + C."
    ]
  }
];
