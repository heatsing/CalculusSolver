"use client";

export default function GlobalError({ reset }: { reset: () => void }): React.JSX.Element {
  return (
    <html>
      <body className="flex min-h-screen flex-col items-center justify-center bg-background text-heading">
        <h1 className="text-4xl font-bold">Something went wrong</h1>
        <p className="mt-4 text-body">We encountered an unexpected error.</p>
        <button
          onClick={reset}
          className="mt-8 rounded-button bg-primary px-5 py-2.5 text-white hover:bg-primary-hover"
        >
          Try again
        </button>
      </body>
    </html>
  );
}
