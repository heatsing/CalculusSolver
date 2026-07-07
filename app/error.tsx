"use client";

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";

export default function ErrorPage({ reset }: { reset: () => void }): React.JSX.Element {
  return (
    <>
      <Header />
      <main className="mx-auto flex min-h-[50vh] w-full max-w-content flex-col items-center justify-center px-4 py-20 text-center sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-heading">Something went wrong</h1>
        <p className="mt-4 max-w-md text-body">
          We encountered an unexpected error. Please try again or return to the home page.
        </p>
        <div className="mt-8 flex gap-4">
          <Button onClick={reset}>Try again</Button>
          <Button variant="outline" asChild>
            <a href="/">Go home</a>
          </Button>
        </div>
      </main>
      <Footer />
    </>
  );
}
