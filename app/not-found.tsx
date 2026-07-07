import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";

export default function NotFoundPage(): React.JSX.Element {
  return (
    <>
      <Header />
      <main className="mx-auto flex min-h-[50vh] w-full max-w-content flex-col items-center justify-center px-4 py-20 text-center sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-heading">Page not found</h1>
        <p className="mt-4 text-body">The page you are looking for does not exist.</p>
        <Button className="mt-8" asChild>
          <a href="/">Go home</a>
        </Button>
      </main>
      <Footer />
    </>
  );
}
