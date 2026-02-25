"use client";

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

export function NewsletterExport({ emails }: { emails: string[] }) {
  function downloadCsv() {
    const header = "email\n";
    const rows = emails.join("\n");
    const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `newsletter-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <Button variant="outline" onClick={downloadCsv} disabled={emails.length === 0}>
      <Download className="size-4" />
      Exporter en CSV
    </Button>
  );
}
