"use client";
import { useEffect, useState } from "react";

export default function HealthCheck() {
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    checkHealth()
  }, []);

  function checkHealth(){
    setStatus(null)
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/health`)
      .then((res) => res.json())
      .then((data) => setStatus(data.status))
      .catch(() => setStatus("error"));
  }

  return (
    <fieldset className="mt-6">
      <legend className="mb-3 text-lg font-semibold">Health Status</legend>
      <div className="flex gap-3 items-center ">
        <button
          type="button"
          onClick={() => checkHealth()}
          className={`rounded-md border px-4 py-2 text-sm font-medium capitalize
              border-primary bg-primary text-white
              hover:cursor-pointer active:scale-95 transition-all duration-200`}
        >
          Check Health
        </button>
        <p className="">
          API status: {status?.toUpperCase() ?? "checking..."}
        </p>
      </div>
    </fieldset>
  )
}
