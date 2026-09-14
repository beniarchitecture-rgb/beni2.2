import { useEffect, useState } from "react";

import { siteConfig } from "@/data/siteConfig";
import { fetchProjects } from "@/lib/api";

export default function useProjects() {
  const [projects, setProjects] = useState(siteConfig.projects);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    fetchProjects()
      .then((data) => {
        if (alive && Array.isArray(data) && data.length > 0) setProjects(data);
      })
      .catch(() => {})
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, []);

  return { projects, loading };
}
