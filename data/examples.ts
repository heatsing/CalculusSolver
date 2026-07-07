export type ExampleCategory = "All" | "Algebra" | "Derivatives" | "Integrals" | "Limits" | "Graphs";
export type Difficulty = "Easy" | "Medium" | "Advanced";

export type Example = {
  id: string;
  category: Exclude<ExampleCategory, "All">;
  difficulty: Difficulty;
  problem: string;
  symbol: string;
  operation: string;
};

export const examplesData: Example[] = [
  {
    id: "integral-by-parts",
    category: "Integrals",
    difficulty: "Advanced",
    problem: "Solve ∫ x² sin(x) dx",
    symbol: "∫",
    operation: "integral"
  },
  {
    id: "derivative-polynomial",
    category: "Derivatives",
    difficulty: "Easy",
    problem: "Find the derivative of x³ + 2x",
    symbol: "d/dx",
    operation: "derivative"
  },
  {
    id: "limit-sinc",
    category: "Limits",
    difficulty: "Medium",
    problem: "Evaluate lim x→0 sin(x)/x",
    symbol: "lim",
    operation: "limit"
  },
  {
    id: "linear-equation",
    category: "Algebra",
    difficulty: "Easy",
    problem: "Solve 2x + 5 = 17",
    symbol: "x",
    operation: "solve_equation"
  },
  {
    id: "factor-difference-squares",
    category: "Algebra",
    difficulty: "Easy",
    problem: "Factor x² − 9",
    symbol: "( )",
    operation: "factor"
  },
  {
    id: "expand-binomial",
    category: "Algebra",
    difficulty: "Easy",
    problem: "Expand (x + 3)²",
    symbol: "(a+b)²",
    operation: "expand"
  },
  {
    id: "simplify-rational",
    category: "Algebra",
    difficulty: "Medium",
    problem: "Simplify (x² − 1)/(x − 1)",
    symbol: "÷",
    operation: "simplify"
  },
  {
    id: "graph-parabola",
    category: "Graphs",
    difficulty: "Easy",
    problem: "Graph y = x² − 4x + 3",
    symbol: "ƒ",
    operation: "graph"
  },
  {
    id: "definite-integral",
    category: "Integrals",
    difficulty: "Medium",
    problem: "∫₀¹ x² dx",
    symbol: "∫",
    operation: "integral"
  },
  {
    id: "quadratic-equation",
    category: "Algebra",
    difficulty: "Medium",
    problem: "Solve x² − 5x + 6 = 0",
    symbol: "x",
    operation: "solve_equation"
  },
  {
    id: "second-derivative",
    category: "Derivatives",
    difficulty: "Medium",
    problem: "d²/dx² (x⁴)",
    symbol: "d²/dx²",
    operation: "derivative"
  },
  {
    id: "system-equations",
    category: "Algebra",
    difficulty: "Medium",
    problem: "Solve x + y = 5 and x − y = 1",
    symbol: "{ }",
    operation: "solve_system"
  }
];

export const homeExamples = examplesData.slice(0, 6);
