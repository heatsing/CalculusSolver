declare module "nerdamer" {
  type NerdamerExpression = {
    toString(): string;
    expand(): NerdamerExpression;
    factor(): NerdamerExpression;
    evaluate(): NerdamerExpression;
  };

  type NerdamerFunction = {
    (expression: string): NerdamerExpression;
    diff(expression: string, variable: string): NerdamerExpression;
    integrate(expression: string, variable: string): NerdamerExpression;
    solveEquations(expression: string, variable: string): unknown;
  };

  const nerdamer: NerdamerFunction;
  export default nerdamer;
}

declare module "nerdamer/Algebra";
declare module "nerdamer/Calculus";
declare module "nerdamer/Solve";
