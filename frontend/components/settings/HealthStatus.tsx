import { getHealth } from "@/service/api-service";

type IndicatorProps = {
  tone: "green" | "amber" | "red";
  label: string;
  detail: string;
};

const DOT_COLOR = {
  green: "bg-green-500",
  amber: "bg-amber-500",
  red: "bg-red-500",
} as const;

function Indicator({ tone, label, detail }: IndicatorProps) {
  return (
    <div className="mt-6">
      <h3 className="mb-3 text-lg font-semibold">Health Status</h3>
      <p className="flex items-center gap-2 text-sm">
        <span className={`inline-block size-2.5 rounded-full ${DOT_COLOR[tone]}`} aria-hidden="true" />
        <span className="font-medium">{label}.</span>
        <span className="text-muted">{detail}</span>
      </p>
    </div>
  );
}

export default async function HealthStatus() {
  let tone: IndicatorProps["tone"] = "red";
  let label = "Unavailable";
  let detail = "The API could not be reached";

  try {
    const health = await getHealth();
    if (health.status === "ok" && health.db === "connected") {
      tone = "green";
      label = "Healthy";
      detail = "Database connected";
    } else {
      tone = "amber";
      label = "Degraded";
      detail = "Database unreachable";
    }
  } catch {
    tone = "red";
    label = "Unavailable";
    detail = "The API could not be reached";
  }

  return <Indicator tone={tone} label={label} detail={detail} />;
}
