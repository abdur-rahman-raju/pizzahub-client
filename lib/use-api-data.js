"use client";

import { useCallback, useEffect, useState } from "react";
import { apiRequest } from "@/lib/api-private";

export function useApiData(path) {
  const [data, setData] = useState(null);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (!path) return;
    const controller = new AbortController();
    setStatus("loading");

    apiRequest(path, { signal: controller.signal })
      .then((result) => {
        setData(result);
        setStatus("success");
      })
      .catch((err) => {
        if (err.name === "AbortError") return;
        setError(err.message);
        setStatus("error");
      });

    return () => controller.abort();
  }, [path, attempt]);

  const reload = useCallback(() => setAttempt((prev) => prev + 1), []);

  return { data, setData, status, error, reload };
}