import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LatexBlock } from "@/components/solver/latex-render";

export function PreviewCards(): React.JSX.Element {
  return (
    <div className="mt-8 grid gap-5 md:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Answer</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg bg-secondary-background p-3">
            <LatexBlock latex="-x^2\\cos(x) + 2x\\sin(x) + 2\\cos(x) + C" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Steps</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal space-y-1 pl-4 text-sm text-body">
            <li>Apply integration by parts</li>
            <li>Differentiate u and integrate dv</li>
            <li>Substitute and simplify</li>
          </ol>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Graph</CardTitle>
        </CardHeader>
        <CardContent>
          <svg viewBox="0 0 200 100" className="h-24 w-full">
            <path
              d="M10,90 Q50,10 100,50 T190,20"
              fill="none"
              stroke="#6D3EF2"
              strokeWidth="3"
            />
            <line x1="0" y1="90" x2="200" y2="90" stroke="#E4E7EC" strokeWidth="1" />
            <line x1="100" y1="0" x2="100" y2="100" stroke="#E4E7EC" strokeWidth="1" />
          </svg>
        </CardContent>
      </Card>
    </div>
  );
}
