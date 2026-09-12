import Spinner from "./Spinner";

type LoadingRowProps = {
  label?: string;
};

export default function LoadingRow({ label = "Loading..." }: LoadingRowProps) {
  return (
    <p className="flex items-center gap-2 text-sm text-muted">
      <Spinner size={14} />
      {label}
    </p>
  );
}
