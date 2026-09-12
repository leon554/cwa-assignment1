"use client";
import { useEffect, useState } from "react";
import { getHealth } from "@/service/api-service";
import Spinner from "../shared/Spinner";

export default function HealthCheck() {
  const [status, setStatus] = useState<string | null>(null);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    checkHealth()
  }, []);

  async function checkHealth(){
    setChecking(true)
    try {
      const health = await getHealth()
      setStatus(health.status)
    } catch {
      setStatus("error")
    }
    setChecking(false)
  }

  return (
    <fieldset className="mt-6">
      <legend className="mb-3 text-lg font-semibold">Health Status</legend>
      <div className="flex gap-3 items-center ">
        <button
          type="button"
          onClick={() => checkHealth()}
          disabled={checking}
          className={`flex items-center gap-2 rounded-md border px-4 py-2 text-sm font-medium capitalize
              border-primary bg-primary text-white
              hover:cursor-pointer active:scale-95 transition-all duration-200
              disabled:cursor-not-allowed disabled:opacity-50`}
        >
          {checking && <Spinner size={15} />}
          Check Health
        </button>
        <p className="">
          API status: {checking ? "checking..." : status?.toUpperCase() ?? "unknown"}
        </p>
      </div>
    </fieldset>
  )
}
