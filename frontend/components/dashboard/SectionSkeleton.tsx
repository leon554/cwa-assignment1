type SectionSkeletonProps = {
  section: string;
};

export default function SectionSkeleton({ section }: SectionSkeletonProps) {
  return (
    <section
      className="animate-pulse rounded-xl border border-card-border bg-card p-6 shadow-sm"
      aria-busy="true"
    >
      <p className="text-sm text-muted">Loading {section}</p>
      <div className="mt-4 h-16 rounded bg-card-border" />
    </section>
  );
}
