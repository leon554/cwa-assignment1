import type { ReactNode } from "react";

type AlertVariant = "info" | "warning" | "error";

type AlertBannerProps = {
  variant: AlertVariant;
  children: ReactNode;
};

const VARIANT_CLASS: Record<AlertVariant, string> = {
  info: "border-primary/40 bg-primary/10 text-primary",
  warning: "border-amber-500/40 bg-amber-500/10 text-amber-600 dark:text-amber-400",
  error: "border-red-500/40 bg-red-500/10 text-red-600 dark:text-red-400",
};

function AlertIcon({ variant }: { variant: AlertVariant }) {
  if (variant === "warning") {
    return (
      <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" className="shrink-0">
        <path
          fill="currentColor"
          d="M12 3.2 1.8 21h20.4L12 3.2zm0 6.3a1 1 0 0 1 1 1v4.2a1 1 0 1 1-2 0v-4.2a1 1 0 0 1 1-1zm0 9.1a1.15 1.15 0 1 1 0-2.3 1.15 1.15 0 0 1 0 2.3z"
        />
      </svg>
    );
  }

  if (variant === "error") {
    return (
      <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" className="shrink-0">
        <path
          fill="currentColor"
          d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 11.2a1 1 0 0 1-1-1V7.5a1 1 0 1 1 2 0v4.7a1 1 0 0 1-1 1zm0 3.5a1.2 1.2 0 1 1 0-2.4 1.2 1.2 0 0 1 0 2.4z"
        />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" className="shrink-0">
      <path
        fill="currentColor"
        d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 4.2a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5zM13 17h-2v-6.5h2V17z"
      />
    </svg>
  );
}

export default function AlertBanner({ variant, children }: AlertBannerProps) {
  return (
    <div
      role={variant === "error" ? "alert" : "status"}
      className={`flex items-start gap-2 rounded-lg border px-4 py-3 text-sm ${VARIANT_CLASS[variant]}`}
    >
      <AlertIcon variant={variant} />
      <p>{children}</p>
    </div>
  );
}
