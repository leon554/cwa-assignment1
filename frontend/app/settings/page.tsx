import HealthCheck from "@/components/settings/HealthCheck";
import SettingsForm from "@/components/settings/SettingsForm";
import { LAYOUT_COOKIE, THEME_COOKIE } from "@/types/settings";
import { cookies } from "next/headers";

export default async function SettingsPage() {
  return (
    <div className="mx-auto w-full max-w-2xl flex-1 px-4 py-8 sm:px-6">
      <h2 className="mb-2 text-2xl font-bold text-primary">Settings</h2>
      <p className="mb-8 text-muted">
        Customise the appearance and layout of the activity builder.
      </p>
      <div className="rounded-xl border border-card-border bg-card p-6 shadow-sm">
        <SettingsForm/>
        <HealthCheck/>
      </div>
    </div>
  );
}
