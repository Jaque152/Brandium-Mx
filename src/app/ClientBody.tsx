"use client";

import { useEffect } from "react";

export function ClientBody({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    document.body.className = "antialiased";
  }, []);

  return <body className="antialiased">{children}</body>;
}
