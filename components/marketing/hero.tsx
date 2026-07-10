export type HeroProps = {
  title: string;
  subtitle: string;
};

export function Hero({ title, subtitle }: HeroProps): React.JSX.Element {
  return (
    <section className="relative grid min-h-[460px] overflow-hidden border-x border-b border-border lg:grid-cols-12">
      <div className="relative z-10 flex flex-col justify-end bg-white px-6 py-14 sm:px-10 lg:col-span-8 lg:px-12 lg:py-16">
        <p className="mb-8 flex items-center gap-3 text-sm text-body"><span className="h-px w-8 bg-primary" />Mathematics, made inspectable</p>
        <h1 className="max-w-4xl text-5xl font-light leading-[1.06] tracking-[-0.03em] text-heading sm:text-6xl lg:text-7xl">{title}</h1>
        <p className="mt-8 max-w-2xl text-lg leading-relaxed text-body sm:text-xl">{subtitle}</p>
      </div>
      <div aria-hidden="true" className="technical-grid relative min-h-64 border-t border-border bg-secondary-background lg:col-span-4 lg:min-h-0 lg:border-l lg:border-t-0">
        <div className="absolute left-8 top-8 font-mono text-xs text-body">f(x) → result</div>
        <div className="absolute bottom-10 left-8 right-8 border-l-2 border-primary pl-5 font-mono text-3xl font-light text-heading sm:text-4xl">∫ x² dx<br /><span className="text-primary">= x³/3 + C</span></div>
      </div>
    </section>
  );
}
