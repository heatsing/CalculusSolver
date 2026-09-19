import { algebraFaqs } from "@/data/faqs";
import type { CalculatorDefinitionSource } from "@/data/calculator-page-types";

// Former route-level content now lives in this shared data source.
// Add or update a calculator here; the dynamic route, metadata, sitemap, schema, and internal links follow automatically.
export const coreCalculatorPages = {
  "algebra-solver": {
    metadata: { title: "Calculus Solver – Free Online Algebra Calculator", description: "Solve equations, simplify expressions, factor polynomials, and view clear algebra steps.", path: "/algebra-solver", keywords: ["algebra solver", "equation solver", "factor polynomial", "simplify expressions", "step by step algebra", "free algebra help", "online algebra solver"] },
    page: {
      title: "Algebra Solver",
      description: "Solve equations, simplify expressions, factor polynomials, and view clear algebra steps.",
      path: "/algebra-solver",
      mode: "algebra",
      h1: "Algebra Solver",
      subtitle: "Solve equations, systems, polynomials, and algebraic expressions with clear step-by-step explanations.",
      exampleLatex: "2x + 5 = 17 \\\\Rightarrow x = 6",
      howItWorks: [
        { step: "Enter your problem", description: "Type an equation, expression, polynomial, or system." },
        { step: "Choose the method", description: "The solver identifies whether to solve, simplify, expand, or factor." },
        { step: "Review the solution", description: "See the answer, verification status, and each available algebra step." }
      ],
      faqs: algebraFaqs,
      relatedTools: [
        { label: "Equation Solver", href: "/equation-solver" },
        { label: "Quadratic Solver", href: "/quadratic-solver" },
        { label: "Factoring Calculator", href: "/factoring-calculator" },
        { label: "Simplify Calculator", href: "/simplify-calculator" }
      ]
    }
  },
  "average-calculator": {
    metadata: {
  title: "Calculus Solver – Free Online Average Calculator",
  description: "Free average calculator. Find the arithmetic mean of any set of numbers instantly, plus sum, count, and range.",
  path: "/average-calculator",
  keywords: [
    "average calculator",
    "mean calculator",
    "arithmetic mean",
    "average of numbers",
    "statistics calculator"
  ]
},
    page: {
      title: "Average Calculator",
      description: "Free average calculator. Find the arithmetic mean of any set of numbers instantly, plus sum, count, and range.",
      path: "/average-calculator",
      mode: "average",
      h1: "Average Calculator",
      subtitle: "Calculate the arithmetic mean of any list of numbers. Enter your values and get the average, sum, and count instantly.",
      exampleLatex: "\\\\bar{x} = \\\\frac{1}{n}\\\\sum_{i=1}^{n} x_i",
      howItWorks: [
        { step: "Enter your data", description: "Type numbers separated by commas or spaces." },
      { step: "Sum and divide", description: "We add all values and divide by the count." },
      { step: "Get the result", description: "Receive the mean along with the sum and number of data points." }
      ],
      faqs: [
        {
          question: "Can it handle decimals and negatives?",
          answer: "Yes. The calculator accepts any real numbers, including decimals and negative values."
        },
      {
          question: "Does it show the sum and count too?",
          answer: "Yes. Along with the average, you get the total sum and the number of values entered."
        }
      ],
      relatedTools: [
        { label: "Derivative Calculator", href: "/derivative-calculator" },
        { label: "Equation Solver", href: "/equation-solver" },
        { label: "Integral Calculator", href: "/integral-calculator" }
      ]
    }
  },
  "derivative-calculator": {
    metadata: {
  title: "Derivative Calculator – Find Derivatives with Steps | Calculus Solver",
  description:
    "Find the derivative of a function with step-by-step differentiation. Free online derivative calculator for polynomials, trig, exponential, and log functions.",
  path: "/derivative-calculator",
  keywords: [
    "derivative calculator",
    "find derivative",
    "differentiation calculator",
    "step by step derivative",
    "differentiate with steps",
    "dy/dx calculator",
    "free math solver"
  ]
},
    page: {
      title: "Derivative Calculator",
      description: "Find the derivative of a function with step-by-step differentiation. Free online derivative calculator for polynomials, trig, exponential, and log functions.",
      path: "/derivative-calculator",
      mode: "derivative",
      h1: "Derivative Calculator with Steps",
      eyebrow: "Free derivative calculator",
      subtitle: "Find the derivative of a function and see each differentiation rule applied. Enter an expression to differentiate polynomials, trigonometric, exponential, and logarithmic functions step by step.",
      exampleLatex: "\\\\frac{d}{dx}(x^3 - 2x^2 + x) = 3x^2 - 4x + 1",
      howItWorks: [
        {
          step: "Enter your function",
          description: "Type any expression you want to differentiate."
        },
        {
          step: "Identify the operation",
          description: "The solver detects the function and the independent variable."
        },
        {
          step: "Get the derivative",
          description: "Receive the final answer plus a rule-by-rule explanation."
        }
      ],
      faqs: [
        {
          question: "Is this derivative calculator free?",
          answer: "Yes. You can compute derivatives and view step-by-step explanations at no cost."
        },
        {
          question: "Can I see the differentiation rules used?",
          answer: "Each step lists the rule applied, such as power rule, product rule, or chain rule."
        }
      ],
      relatedTools: [
        { label: "Integral Calculator", href: "/integral-calculator" },
        { label: "Definite Integral Calculator", href: "/definite-integral-calculator" },
        { label: "Limit Calculator", href: "/limit-calculator" }
      ],
      heroRelatedTools: [
        { label: "Integral Calculator", href: "/integral-calculator" },
        { label: "Definite Integral Calculator", href: "/definite-integral-calculator" },
        { label: "Limit Calculator", href: "/limit-calculator" },
        { label: "Calculus Calculator", href: "/calculus-calculator" }
      ]
    }
  },
  "equation-solver": {
    metadata: {
  title: "Calculus Solver – Free Online Equation Solver",
  description:
    "Free equation solver with step-by-step solutions. Solve linear, quadratic, polynomial, and systems of equations.",
  path: "/equation-solver",
  keywords: [
    "equation solver",
    "solve for x",
    "algebra solver",
    "quadratic equation solver",
    "system of equations",
    "free math solver"
  ]
},
    page: {
      title: "Equation Solver",
      description: "Free equation solver with step-by-step solutions.",
      path: "/equation-solver",
      mode: "equation",
      h1: "Equation Solver",
      subtitle: "Solve linear, quadratic, polynomial, and systems of equations with step-by-step explanations and verification.",
      exampleLatex: "x^2 - 5x + 6 = 0 \\\\Rightarrow x = 2 \\\\text{ or } x = 3",
      howItWorks: [
        { step: "Enter the equation", description: "Type an equation or system of equations." },
        { step: "Identify the strategy", description: "We choose factoring, quadratic formula, substitution, or elimination." },
        { step: "Verify solutions", description: "Each solution is checked against the original equation." }
      ],
      faqs: [
        {
          question: "Can this solve systems of equations?",
          answer: "Yes. Enter multiple equations separated by 'and' to solve systems."
        },
        {
          question: "Does it show the quadratic formula?",
          answer: "When applicable, the solver shows the quadratic formula and substitution steps."
        }
      ],
      relatedTools: [
        { label: "Quadratic Solver", href: "/quadratic-solver" },
        { label: "Factoring Calculator", href: "/factoring-calculator" },
        { label: "Derivative Calculator", href: "/derivative-calculator" }
      ]
    }
  },
  "exponent-calculator": {
    metadata: {
  title: "Calculus Solver – Free Online Exponential Function Calculator",
  description: "Free exponent calculator. Compute powers, handle negative and fractional exponents, and simplify exponential expressions.",
  path: "/exponent-calculator",
  keywords: [
    "exponent calculator",
    "power calculator",
    "exponentiation",
    "negative exponents",
    "fractional exponents"
  ]
},
    page: {
      title: "Exponential Function Calculator",
      description: "Free exponent calculator. Compute powers, handle negative and fractional exponents, and simplify exponential expressions.",
      path: "/exponent-calculator",
      mode: "exponents",
      h1: "Exponential Function Calculator",
      subtitle: "Calculate any base raised to any power — including negative, fractional, and zero exponents — with step-by-step explanations.",
      exampleLatex: "2^{10} = 1024",
      howItWorks: [
        { step: "Enter base and exponent", description: "Type an expression like 2^10 or use the xⁿ button." },
      { step: "Apply exponent rules", description: "We handle negative, zero, and fractional exponents correctly." },
      { step: "Get the result", description: "Receive the computed value with applicable exponent rules shown." }
      ],
      faqs: [
        {
          question: "What is a negative exponent?",
          answer: "A negative exponent means reciprocal: a^(-n) = 1/a^n. The calculator handles this automatically."
        },
      {
          question: "Can it compute fractional exponents like roots?",
          answer: "Yes. x^(1/2) is the square root, x^(1/3) is the cube root, and so on."
        }
      ],
      relatedTools: [
        { label: "Derivative Calculator", href: "/derivative-calculator" },
        { label: "Equation Solver", href: "/equation-solver" },
        { label: "Integral Calculator", href: "/integral-calculator" }
      ]
    }
  },
  "factoring-calculator": {
    metadata: {
  title: "Calculus Solver – Free Online Factor Calculator",
  description:
    "Free factoring calculator with step-by-step solutions. Factor polynomials, quadratics, and expressions using GCF, grouping, and special product rules.",
  path: "/factoring-calculator",
  keywords: [
    "factoring calculator",
    "factor polynomial",
    "factor quadratic",
    "GCF calculator",
    "factor by grouping",
    "free math solver"
  ]
},
    page: {
      title: "Factoring Calculator",
      description: "Free factoring calculator with step-by-step solutions.",
      path: "/factoring-calculator",
      mode: "factoring",
      h1: "Factoring Calculator",
      subtitle: "Factor polynomials, quadratics, and expressions using GCF, grouping, difference of squares, and other methods.",
      exampleLatex: "x^2 - 5x + 6 = (x - 2)(x - 3)",
      howItWorks: [
        { step: "Enter the expression", description: "Type the polynomial you want to factor." },
        { step: "Identify the method", description: "We detect GCF, grouping, or special-product patterns." },
        { step: "Verify by expanding", description: "The result is checked by expanding back to the original expression." }
      ],
      faqs: [
        {
          question: "Can it factor by grouping?",
          answer: "Yes. The calculator recognizes grouping patterns and shows the intermediate groups."
        },
        {
          question: "Does it handle special products?",
          answer: "Yes. Difference of squares, perfect-square trinomials, and sum/difference of cubes are all supported."
        }
      ],
      relatedTools: [
        { label: "Equation Solver", href: "/equation-solver" },
        { label: "Quadratic Solver", href: "/quadratic-solver" },
        { label: "Derivative Calculator", href: "/derivative-calculator" }
      ]
    }
  },
  "fraction-calculator": {
    metadata: {
  title: "Calculus Solver – Free Online Fraction Calculator",
  description: "Free fraction calculator. Add, subtract, multiply, and divide fractions with step-by-step solutions and simplification.",
  path: "/fraction-calculator",
  keywords: [
    "fraction calculator",
    "add fractions",
    "subtract fractions",
    "multiply fractions",
    "divide fractions"
  ]
},
    page: {
      title: "Fraction Calculator",
      description: "Free fraction calculator. Add, subtract, multiply, and divide fractions with step-by-step solutions and simplification.",
      path: "/fraction-calculator",
      mode: "fractions",
      h1: "Fraction Calculator",
      subtitle: "Perform arithmetic on fractions — add, subtract, multiply, and divide — with automatic simplification and mixed-number output.",
      exampleLatex: "\\\\frac{1}{2} + \\\\frac{1}{3} = \\\\frac{5}{6}",
      howItWorks: [
        { step: "Enter fractions", description: "Type your fractions using / notation, e.g. 1/2 + 1/3." },
      { step: "Find common denominators", description: "For add/subtract, we compute the LCD and convert." },
      { step: "Simplify the result", description: "The answer is reduced to lowest terms automatically." }
      ],
      faqs: [
        {
          question: "Does it output mixed numbers?",
          answer: "Yes. Improper fractions are also shown as mixed numbers when applicable."
        },
      {
          question: "Can I use negative fractions?",
          answer: "Yes. Negative numerators or denominators are handled correctly throughout."
        }
      ],
      relatedTools: [
        { label: "Derivative Calculator", href: "/derivative-calculator" },
        { label: "Equation Solver", href: "/equation-solver" },
        { label: "Integral Calculator", href: "/integral-calculator" }
      ]
    }
  },
  "gradient-calculator": {
    metadata: {
  title: "Calculus Solver – Free Online Gradient Calculator",
  description: "Free gradient calculator. Compute the gradient of a multivariable function, find partial derivatives, and visualize the direction of steepest ascent.",
  path: "/gradient-calculator",
  keywords: [
    "gradient calculator",
    "vector calculus",
    "partial derivatives",
    "gradient of function",
    "multivariable calculus"
  ]
},
    page: {
      title: "Gradient Calculator",
      description: "Free gradient calculator. Compute the gradient of a multivariable function, find partial derivatives, and visualize the direction of steepest ascent.",
      path: "/gradient-calculator",
      mode: "gradient",
      h1: "Gradient Calculator",
      subtitle: "Compute the gradient vector of any scalar function of two or three variables. Get each partial derivative with step-by-step work.",
      exampleLatex: "\\\\nabla f = \\\\left(\\\\frac{\\\\partial f}{\\\\partial x},\\\\ \\\\frac{\\\\partial f}{\\\\partial y}\\\\right)",
      howItWorks: [
        { step: "Enter the function", description: "Type f(x, y) or f(x, y, z) using standard notation." },
      { step: "Compute partials", description: "We differentiate with respect to each variable in turn." },
      { step: "Form the gradient", description: "The partial derivatives combine into the gradient vector." }
      ],
      faqs: [
        {
          question: "How many variables can the function have?",
          answer: "The calculator supports functions of two or three variables. For more variables, enter the expression and we compute each partial."
        },
      {
          question: "Does it show the direction of steepest ascent?",
          answer: "Yes. The gradient vector points in the direction of steepest increase of the function at each point."
        }
      ],
      relatedTools: [
        { label: "Derivative Calculator", href: "/derivative-calculator" },
        { label: "Equation Solver", href: "/equation-solver" },
        { label: "Integral Calculator", href: "/integral-calculator" }
      ]
    }
  },
  "graphing-calculator": {
    metadata: {
  title: "Calculus Solver – Free Online Graphing Calculator",
  description:
    "Free online graphing calculator. Plot functions and explore their curves with an interactive graph and step-by-step analysis.",
  path: "/graphing-calculator",
  keywords: [
    "graphing calculator",
    "online graphing calculator",
    "function grapher",
    "plot a function"
  ]
},
    page: {
      title: "Graphing Calculator",
      description: "Free online graphing calculator for plotting and exploring functions.",
      path: "/graphing-calculator",
      mode: "graph",
      h1: "Graphing Calculator",
      subtitle: "Plot a function, inspect its curve, and explore important features on an interactive graph.",
      exampleLatex: "y = x^2 - 4x + 3",
      howItWorks: [
        { step: "Enter a function", description: "Type a function such as y = x^2 - 4x + 3." },
        { step: "Create the graph", description: "Ask the calculator to graph or plot the expression." },
        { step: "Explore the curve", description: "Inspect the interactive graph and the accompanying analysis." }
      ],
      faqs: [
        {
          question: "What kinds of functions can I graph?",
          answer: "You can graph common polynomial, trigonometric, exponential, logarithmic, and rational functions."
        },
        {
          question: "Can I interact with the graph?",
          answer: "Yes. You can zoom, pan, and inspect the plotted curve."
        }
      ],
      relatedTools: [
        { label: "Calculus Calculator", href: "/calculus-calculator" },
        { label: "Derivative Calculator", href: "/derivative-calculator" },
        { label: "Algebra Calculator", href: "/algebra-solver" }
      ]
    }
  },
  "integral-calculator": {
    metadata: {
  title: "Calculus Solver – Free Online Integral Calculator",
  description:
    "Free integral calculator with step-by-step solutions. Solve indefinite and definite integrals of polynomials, trigonometric, exponential, and logarithmic functions.",
  path: "/integral-calculator",
  keywords: [
    "integral calculator",
    "integration calculator",
    "find integral",
    "antiderivative calculator",
    "step by step integral",
    "free math solver"
  ]
},
    page: {
      title: "Integral Calculator",
      description: "Free integral calculator with step-by-step solutions.",
      path: "/integral-calculator",
      mode: "integral",
      h1: "Integral Calculator",
      subtitle: "Find antiderivatives and definite integrals with detailed explanations of each integration rule.",
      exampleLatex: "\\\\int (2x + \\\\cos x) \\\\, dx = x^2 + \\\\sin x + C",
      howItWorks: [
        { step: "Enter the integrand", description: "Type the expression you want to integrate." },
        { step: "Choose the variable", description: "We detect the integration variable automatically." },
        { step: "Get the antiderivative", description: "See the final answer and each integration step." }
      ],
      faqs: [
        {
          question: "Does the integral calculator show +C?",
          answer: "Yes. Indefinite integrals include the constant of integration and explain why it is needed."
        },
        {
          question: "Can I integrate trigonometric functions?",
          answer: "Yes. sin, cos, tan, and their inverses are all supported."
        }
      ],
      relatedTools: [
        { label: "Derivative Calculator", href: "/derivative-calculator" },
        { label: "Limit Calculator", href: "/limit-calculator" },
        { label: "Equation Solver", href: "/equation-solver" }
      ]
    }
  },
  "lcm-calculator": {
    metadata: {
  title: "Calculus Solver – Free Online LCM Calculator",
  description: "Free LCM calculator. Find the least common multiple of two or more numbers instantly with step-by-step prime factorization.",
  path: "/lcm-calculator",
  keywords: [
    "lcm calculator",
    "least common multiple",
    "lcm finder",
    "lcm of numbers",
    "free math solver"
  ]
},
    page: {
      title: "LCM Calculator",
      description: "Free LCM calculator. Find the least common multiple of two or more numbers instantly with step-by-step prime factorization.",
      path: "/lcm-calculator",
      mode: "lcm",
      h1: "LCM Calculator",
      subtitle: "Find the least common multiple of any set of integers. Enter your numbers and get the LCM with a clear prime-factorization breakdown.",
      exampleLatex: "\\\\mathrm{lcm}(4,\\\\ 6) = 12",
      howItWorks: [
        { step: "Enter numbers", description: "Type two or more integers separated by commas." },
      { step: "Prime factorization", description: "We break each number into its prime factors." },
      { step: "Combine factors", description: "The LCM is the product of the highest power of each prime." }
      ],
      faqs: [
        {
          question: "Can it find the LCM of more than two numbers?",
          answer: "Yes. Enter as many numbers as you need, separated by commas, and the calculator finds the LCM of the entire set."
        },
      {
          question: "Does it work with negative numbers?",
          answer: "Yes. The LCM is always non-negative; the sign of the input does not affect the result."
        }
      ],
      relatedTools: [
        { label: "Derivative Calculator", href: "/derivative-calculator" },
        { label: "Equation Solver", href: "/equation-solver" },
        { label: "Integral Calculator", href: "/integral-calculator" }
      ]
    }
  },
  "limit-calculator": {
    metadata: {
  title: "Calculus Solver – Free Online Limit Calculator",
  description:
    "Free limit calculator with step-by-step solutions. Evaluate one-sided and two-sided limits of functions as x approaches any value.",
  path: "/limit-calculator",
  keywords: [
    "limit calculator",
    "evaluate limit",
    "limit solver",
    "as x approaches",
    "step by step limits",
    "free math solver"
  ]
},
    page: {
      title: "Limit Calculator",
      description: "Free limit calculator with step-by-step solutions.",
      path: "/limit-calculator",
      mode: "limit",
      h1: "Limit Calculator",
      subtitle: "Evaluate one-sided and two-sided limits with detailed reasoning about behavior near the target point.",
      exampleLatex: "\\\\lim_{x \\\\to 0} \\\\frac{\\\\sin x}{x} = 1",
      howItWorks: [
        { step: "Enter the limit", description: "Type the function and the value x is approaching." },
        { step: "Analyze behavior", description: "We examine the function from both sides of the point." },
        { step: "Get the result", description: "Receive the limit value or a clear statement that it does not exist." }
      ],
      faqs: [
        {
          question: "Can I compute one-sided limits?",
          answer: "Yes. Specify left or right in your input and the solver will compute the one-sided limit."
        },
        {
          question: "What if the limit does not exist?",
          answer: "The solver will state that the limit does not exist and explain why, such as divergence or unequal one-sided limits."
        }
      ],
      relatedTools: [
        { label: "Derivative Calculator", href: "/derivative-calculator" },
        { label: "Integral Calculator", href: "/integral-calculator" },
        { label: "Equation Solver", href: "/equation-solver" }
      ]
    }
  },
  "log-calculator": {
    metadata: {
  title: "Calculus Solver – Free Online Logarithm Calculator",
  description: "Free logarithm calculator. Compute log base 10, natural log (ln), and logarithms of any base with step-by-step solutions.",
  path: "/log-calculator",
  keywords: [
    "log calculator",
    "logarithm calculator",
    "natural log",
    "ln calculator",
    "change of base"
  ]
},
    page: {
      title: "Logarithm Calculator",
      description: "Free logarithm calculator. Compute log base 10, natural log (ln), and logarithms of any base with step-by-step solutions.",
      path: "/log-calculator",
      mode: "logarithms",
      h1: "Logarithm Calculator",
      subtitle: "Evaluate logarithms in any base — common log (base 10), natural log (base e), and arbitrary bases — with change-of-base steps shown.",
      exampleLatex: "\\\\log_{10}(1000) = 3",
      howItWorks: [
        { step: "Enter the value", description: "Type the number and optionally the base (default: base 10)." },
      { step: "Apply logarithm rules", description: "We use change-of-base and power rules as needed." },
      { step: "Show the result", description: "Get the logarithm value with each step explained." }
      ],
      faqs: [
        {
          question: "What is the difference between log and ln?",
          answer: "log usually means base 10 (common logarithm), while ln means base e (natural logarithm). This calculator supports both."
        },
      {
          question: "Can I use any base?",
          answer: "Yes. Specify the base as a second argument, e.g. log(8, 2) = 3."
        }
      ],
      relatedTools: [
        { label: "Derivative Calculator", href: "/derivative-calculator" },
        { label: "Equation Solver", href: "/equation-solver" },
        { label: "Integral Calculator", href: "/integral-calculator" }
      ]
    }
  },
  "math-calculator": {
    metadata: {
  title: "Calculus Solver – Free Online Math Calculator",
  description: "Free online math calculator. Evaluate arithmetic, algebraic, and trigonometric expressions with instant results and step-by-step work.",
  path: "/math-calculator",
  keywords: [
    "math calculator",
    "online calculator",
    "expression evaluator",
    "arithmetic calculator",
    "free math solver"
  ]
},
    page: {
      title: "Math Calculator",
      description: "Free online math calculator. Evaluate arithmetic, algebraic, and trigonometric expressions with instant results and step-by-step work.",
      path: "/math-calculator",
      mode: "numeric",
      h1: "Math Calculator",
      subtitle: "Evaluate any mathematical expression — arithmetic, exponents, roots, trigonometry, and more. Get an instant answer with a breakdown of each step.",
      exampleLatex: "2 + 3 \\\\times 4 = 14",
      howItWorks: [
        { step: "Type an expression", description: "Enter any valid math expression using +, −, ×, ÷, ^, and functions." },
      { step: "We parse and evaluate", description: "The calculator applies the correct order of operations." },
      { step: "See the result", description: "Get the final value along with a step-by-step breakdown." }
      ],
      faqs: [
        {
          question: "What functions are supported?",
          answer: "Sin, cos, tan, log, ln, sqrt, abs, factorial, and more — plus constants like π and e."
        },
      {
          question: "Does it follow the order of operations?",
          answer: "Yes. PEMDAS rules are applied automatically: parentheses, exponents, multiplication/division, then addition/subtraction."
        }
      ],
      relatedTools: [
        { label: "Derivative Calculator", href: "/derivative-calculator" },
        { label: "Equation Solver", href: "/equation-solver" },
        { label: "Integral Calculator", href: "/integral-calculator" }
      ]
    }
  },
  "matrix-calculator": {
    metadata: {
  title: "Calculus Solver – Free Online Matrix Calculator",
  description: "Free matrix calculator. Compute determinants, inverses, products, sums, and transpose of matrices with step-by-step solutions.",
  path: "/matrix-calculator",
  keywords: [
    "matrix calculator",
    "matrix multiplication",
    "determinant calculator",
    "inverse matrix",
    "linear algebra"
  ]
},
    page: {
      title: "Matrix Calculator",
      description: "Free matrix calculator. Compute determinants, inverses, products, sums, and transpose of matrices with step-by-step solutions.",
      path: "/matrix-calculator",
      mode: "matrix",
      h1: "Matrix Calculator",
      subtitle: "Perform matrix operations — multiplication, determinant, inverse, transpose, and more — with clear step-by-step explanations.",
      exampleLatex: "\\\\begin{pmatrix} 1 & 2 \\\\\\\\ 3 & 4 \\\\end{pmatrix}",
      howItWorks: [
        { step: "Enter matrices", description: "Type matrices row by row, separating entries with spaces or commas." },
      { step: "Choose an operation", description: "Multiply, find the determinant, compute the inverse, and more." },
      { step: "Get step-by-step work", description: "Each operation is shown with intermediate calculations." }
      ],
      faqs: [
        {
          question: "What sizes of matrices are supported?",
          answer: "Any compatible dimensions — from 1×1 up to large square matrices for determinant and inverse."
        },
      {
          question: "Can it find the inverse of a non-square matrix?",
          answer: "Only square matrices have inverses. For non-square matrices, the calculator can compute the transpose or pseudo-inverse."
        }
      ],
      relatedTools: [
        { label: "Derivative Calculator", href: "/derivative-calculator" },
        { label: "Equation Solver", href: "/equation-solver" },
        { label: "Integral Calculator", href: "/integral-calculator" }
      ]
    }
  },
  "percentage-calculator": {
    metadata: {
  title: "Calculus Solver – Free Online Percentage Calculator",
  description: "Free percentage calculator. Find a percent of a number, calculate percentage change, and convert between fractions and percentages.",
  path: "/percentage-calculator",
  keywords: [
    "percentage calculator",
    "percent of a number",
    "percentage change",
    "percent increase",
    "percent decrease"
  ]
},
    page: {
      title: "Percentage Calculator",
      description: "Free percentage calculator. Find a percent of a number, calculate percentage change, and convert between fractions and percentages.",
      path: "/percentage-calculator",
      mode: "percentage",
      h1: "Percentage Calculator",
      subtitle: "Calculate percentages, percentage change, and percent of a number. Handle increase, decrease, and ratio conversions instantly.",
      exampleLatex: "15\\\\% \\\\text{ of } 200 = 30",
      howItWorks: [
        { step: "Enter your values", description: "Type the percentage and the base number, or two values for a change." },
      { step: "Compute the ratio", description: "We convert the percentage to a decimal and multiply." },
      { step: "Show the result", description: "Get the answer along with the formula used." }
      ],
      faqs: [
        {
          question: "Can it calculate percentage change between two values?",
          answer: "Yes. Enter the original and new values to get the percentage increase or decrease."
        },
      {
          question: "Can I convert a fraction to a percentage?",
          answer: "Yes. Enter a fraction like 3/4 and the calculator returns 75%."
        }
      ],
      relatedTools: [
        { label: "Derivative Calculator", href: "/derivative-calculator" },
        { label: "Equation Solver", href: "/equation-solver" },
        { label: "Integral Calculator", href: "/integral-calculator" }
      ]
    }
  },
  "probability-calculator": {
    metadata: {
  title: "Calculus Solver – Free Online Probability Calculator",
  description: "Free probability calculator. Compute single and combined event probabilities, conditional probability, and expected value.",
  path: "/probability-calculator",
  keywords: [
    "probability calculator",
    "probability of events",
    "conditional probability",
    "combined probability",
    "statistics calculator"
  ]
},
    page: {
      title: "Probability Calculator",
      description: "Free probability calculator. Compute single and combined event probabilities, conditional probability, and expected value.",
      path: "/probability-calculator",
      mode: "probability",
      h1: "Probability Calculator",
      subtitle: "Calculate probabilities for single events, combined events (AND/OR), and conditional probability. Get clear step-by-step reasoning.",
      exampleLatex: "P(A \\\\cap B) = P(A) \\\\times P(B)",
      howItWorks: [
        { step: "Enter probabilities", description: "Provide the probability of each event as a decimal or fraction." },
      { step: "Choose the operation", description: "AND (intersection), OR (union), or conditional (given)." },
      { step: "Apply probability rules", description: "We use the multiplication and addition rules correctly." }
      ],
      faqs: [
        {
          question: "Can it handle dependent events?",
          answer: "Yes. For conditional probability, enter P(A) and P(B|A) and the calculator applies Bayes' rule."
        },
      {
          question: "What about mutually exclusive events?",
          answer: "For OR with mutually exclusive events, the probabilities simply add. The calculator detects this automatically."
        }
      ],
      relatedTools: [
        { label: "Derivative Calculator", href: "/derivative-calculator" },
        { label: "Equation Solver", href: "/equation-solver" },
        { label: "Integral Calculator", href: "/integral-calculator" }
      ]
    }
  },
  "quadratic-solver": {
    metadata: {
  title: "Calculus Solver – Free Online Quadratic Formula Calculator",
  description:
    "Free quadratic equation solver with step-by-step solutions. Solve ax² + bx + c = 0 by factoring, completing the square, or the quadratic formula.",
  path: "/quadratic-solver",
  keywords: [
    "quadratic solver",
    "quadratic equation solver",
    "solve ax2 + bx + c",
    "quadratic formula calculator",
    "discriminant calculator",
    "free math solver"
  ]
},
    page: {
      title: "Quadratic Formula Calculator",
      description: "Free quadratic equation solver with step-by-step solutions.",
      path: "/quadratic-solver",
      mode: "equation",
      h1: "Quadratic Formula Calculator",
      subtitle: "Solve any quadratic equation ax² + bx + c = 0 using factoring, completing the square, or the quadratic formula.",
      exampleLatex: "x^2 - 5x + 6 = 0 \\\\Rightarrow x = \\\\frac{5 \\\\pm \\\\sqrt{1}}{2} \\\\Rightarrow x = 2 \\\\text{ or } x = 3",
      howItWorks: [
        { step: "Enter the quadratic", description: "Type ax² + bx + c = 0 in any form." },
        { step: "Choose a method", description: "We factor when possible; otherwise we use the quadratic formula." },
        { step: "See the roots", description: "Get real or complex roots with verification." }
      ],
      faqs: [
        {
          question: "Can it handle complex roots?",
          answer: "Yes. If the discriminant is negative, the solver returns complex roots in a + bi form."
        },
        {
          question: "Does it show the discriminant?",
          answer: "Yes. The solver computes and explains the discriminant and what it means for the number of roots."
        }
      ],
      relatedTools: [
        { label: "Equation Solver", href: "/equation-solver" },
        { label: "Factoring Calculator", href: "/factoring-calculator" },
        { label: "Derivative Calculator", href: "/derivative-calculator" }
      ]
    }
  },
  "root-calculator": {
    metadata: {
  title: "Calculus Solver – Free Online Square Root Calculator",
  description: "Free root calculator. Compute square roots, cube roots, and nth roots of any number with step-by-step solutions.",
  path: "/root-calculator",
  keywords: [
    "root calculator",
    "square root calculator",
    "cube root calculator",
    "nth root",
    "radical calculator"
  ]
},
    page: {
      title: "Square Root Calculator",
      description: "Free root calculator. Compute square roots, cube roots, and nth roots of any number with step-by-step solutions.",
      path: "/root-calculator",
      mode: "roots",
      h1: "Square Root Calculator",
      subtitle: "Find square roots, cube roots, and nth roots of any real number. Handle negative inputs for odd roots and simplify radicals.",
      exampleLatex: "\\\\sqrt[3]{27} = 3",
      howItWorks: [
        { step: "Enter the number", description: "Type the value and optionally the root degree (default: square root)." },
      { step: "Compute the root", description: "We find the real nth root, handling signs correctly." },
      { step: "Simplify radicals", description: "When possible, the result is shown in simplified radical form." }
      ],
      faqs: [
        {
          question: "Can it compute cube roots of negative numbers?",
          answer: "Yes. The cube root of a negative number is negative: ∛(-8) = -2."
        },
      {
          question: "What about even roots of negative numbers?",
          answer: "Even roots (square, 4th, etc.) of negative numbers are not real. The calculator will indicate this."
        }
      ],
      relatedTools: [
        { label: "Derivative Calculator", href: "/derivative-calculator" },
        { label: "Equation Solver", href: "/equation-solver" },
        { label: "Integral Calculator", href: "/integral-calculator" }
      ]
    }
  },
  "simplify-calculator": {
    metadata: {
  title: "Calculus Solver – Free Online Simplify Calculator",
  description: "Free simplify calculator. Reduce algebraic expressions, combine like terms, and simplify fractions step by step.",
  path: "/simplify-calculator",
  keywords: [
    "simplify calculator",
    "simplify expression",
    "reduce algebraic expression",
    "combine like terms",
    "free math solver"
  ]
},
    page: {
      title: "Simplify Calculator",
      description: "Free simplify calculator. Reduce algebraic expressions, combine like terms, and simplify fractions step by step.",
      path: "/simplify-calculator",
      mode: "simplify",
      h1: "Simplify Calculator",
      subtitle: "Simplify algebraic expressions by combining like terms, canceling common factors, and applying algebraic identities.",
      exampleLatex: "\\\\frac{x^2 - 1}{x - 1} = x + 1",
      howItWorks: [
        { step: "Enter the expression", description: "Type the algebraic expression you want to simplify." },
      { step: "Apply rules", description: "We combine like terms and cancel common factors." },
      { step: "Show the result", description: "Get the simplified form with each step explained." }
      ],
      faqs: [
        {
          question: "Can it simplify rational expressions?",
          answer: "Yes. The calculator factors numerators and denominators and cancels common factors when possible."
        },
      {
          question: "Does it expand or just simplify?",
          answer: "It focuses on simplification — reducing to the most compact equivalent form. Use the Factoring Calculator for factorization."
        }
      ],
      relatedTools: [
        { label: "Derivative Calculator", href: "/derivative-calculator" },
        { label: "Equation Solver", href: "/equation-solver" },
        { label: "Integral Calculator", href: "/integral-calculator" }
      ]
    }
  }
} satisfies Record<string, CalculatorDefinitionSource>;
