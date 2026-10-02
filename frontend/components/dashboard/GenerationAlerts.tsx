import { activityLabel } from "@/components/dashboard/labels";
import type { GenerationAlert } from "@/types/api-types";

type GenerationAlertsProps = {
  alerts: GenerationAlert[];
};

export default function GenerationAlerts({ alerts }: GenerationAlertsProps) {
  return (
    <section className="rounded-xl border border-card-border bg-card p-6 shadow-sm">
      <h3 className="mb-4 text-lg font-semibold">Alerts</h3>
      {alerts.length === 0 ? (
        <p className="text-sm text-muted">There is nothing to show yet.</p>
      ) : (
        <ul className="space-y-3">
          {alerts.map((alert) => (
            <li
              key={`${alert.activityType}-${alert.errorMessage ?? "none"}`}
              className="flex items-start justify-between gap-4 border-b border-card-border pb-3 text-sm last:border-b-0 last:pb-0"
            >
              <div>
                <p className="font-medium">{activityLabel(alert.activityType)}</p>
                <p className="text-muted">{alert.errorMessage ?? "No error message"}</p>
              </div>
              <p className="font-semibold text-primary">{alert.count}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
