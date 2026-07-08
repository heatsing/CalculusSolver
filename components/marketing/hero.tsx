export type HeroProps = {
  title: string;
  subtitle: string;
};

export function Hero({ title, subtitle }: HeroProps): React.JSX.Element {
  return (
    <section className="py-16 text-center sm:py-20">
      <h1 className="mx-auto max-w-2xl text-3xl font-semibold tracking-tight text-heading sm:text-4xl md:text-5xl">
        {title}
      </h1>
      <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-body sm:text-lg">
        {subtitle}
      </p>
    </section>
  );
}
