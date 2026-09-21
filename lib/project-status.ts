import { ProjectStatus } from "@prisma/client";

/** Libellés FR des statuts de projet — source unique pour tout le site. */
const LABELS: Record<ProjectStatus, string> = {
  REALISE: "Réalisé",
  EN_COURS: "En cours",
  AUTRE: "Autre",
};

export const PROJECT_STATUS_ORDER: ProjectStatus[] = [
  ProjectStatus.REALISE,
  ProjectStatus.EN_COURS,
  ProjectStatus.AUTRE,
];

export function projectStatusLabel(status: ProjectStatus | string): string {
  return LABELS[status as ProjectStatus] ?? String(status);
}
