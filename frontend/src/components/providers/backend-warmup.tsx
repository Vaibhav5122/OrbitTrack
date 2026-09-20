"use client";

import { useEffect } from "react";

export function BackendWarmup() {
  useEffect(() => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
      const healthUrl = apiUrl.replace(/\/api\/?$/, "") + "/health";

      fetch(healthUrl, { method: "GET", credentials: "omit" })
        .then((res) => {
          if (res.ok) {
          }
        })
        .catch(() => {
        });
    } catch {
    }
  }, []);

  return null;
}
