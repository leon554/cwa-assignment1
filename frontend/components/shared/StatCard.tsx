type StatCardProps = {
  label: string;
  value: string;
  status?: string;
};

export default function StatCard({ label, value, status }: StatCardProps) {
  return (
    <div className="rounded-xl border border-card-border bg-card p-5 shadow-sm">
      <p className="text-sm text-muted">{label}</p>
      <p className="mt-1 text-2xl font-bold text-primary">{value}</p>
      {status ? <p className="mt-1 text-sm text-muted">{status}</p> : null}
    </div>
  );
}
