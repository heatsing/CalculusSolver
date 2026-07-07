import { CheckCircle2, ListOrdered, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LatexBlock } from "@/components/solver/latex-render";

export function PreviewCards(): React.JSX.Element {
  return (
    <div className="mt-10 grid gap-5 md:grid-cols-3">
      <Card className="border-border/80">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base font-semibold">
            <CheckCircle2 className="h-5 w-5 text-primary" />
            Answer
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-xl bg-secondary-background p-4 text-center">
            <LatexBlock latex="-x^2\\cos(x) + 2x\\sin(x) + 2\\cos(x) + C" />
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/80">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base font-semibold">
            <ListOrdered className="h-5 w-5 text-primary" />
            Steps
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="space-y-3 text-sm text-body">
            <li className="flex items-start gap-3">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary-soft text-xs font-semibold text-primary">
                1
              </span>
              Apply integration by parts
            </li>
            <li className="flex items-start gap-3">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary-soft text-xs font-semibold text-primary">
                2
              </span>
              Differentiate u and integrate dv
            </li>
            <li className="flex items-start gap-3">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary-soft text-xs font-semibold text-primary">
                3
              </span>
              Substitute and simplify
            </li>
          </ol>
        </CardContent>
      </Card>

      <Card className="border-border/80">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base font-semibold">
            <TrendingUp className="h-5 w-5 text-primary" />
            Graph
          </CardTitle>
        </CardHeader>
        <CardContent>
          <svg viewBox="0 0 200 120" className="h-28 w-full">
            <line x1="10" y1="110" x2="190" y2="110" stroke="#E4E7EC" strokeWidth="1" />
            <line x1="100" y1="10" x2="100" y2="110" stroke="#E4E7EC" strokeWidth="1" />
            <path
              d="M10,90 C30,110 50,10 70,50 C90,90 110,90 130,50 C150,10 170,110 190,90"
              fill="none"
              stroke="#6D3EF2"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <text x="180" y="105" fontSize="8" fill="#667085">x</text>
            <text x="105" y="15" fontSize="8" fill="#667085">y</text>
          </svg>
        </CardContent>
      </Card>
    </div>
  );
}
