type BuilderLayoutProps = {
  section1: React.ReactNode;
  section2?: React.ReactNode;
  title: string;
};

export default function BuilderLayout({section1, section2, title}: BuilderLayoutProps) {
  return (
    <div className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6">
      <h2 className="mb-6 text-2xl font-bold text-primary">{title}</h2>
      <div className={`builder-grid grid grid-cols-1 gap-6 ${section2 && "lg:grid-cols-[320px_1fr]"}`}>
        <section
          aria-label="Activity configuration"
          className="builder-section rounded-xl border border-card-border bg-card p-5 shadow-sm"
        >
          {section1}
        </section>
        {section2 && 
          <section
            aria-label="Activity preview"
            className="builder-section rounded-xl border border-card-border bg-card p-5 shadow-sm"
          >
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted">
              Preview
            </h3>
            {section2}
          </section>
        }
      </div>
    </div>
  );
}
