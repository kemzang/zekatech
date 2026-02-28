"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  AreaChart,
  Area,
  LineChart,
  Line,
} from "recharts";

const CHART_COLORS = {
  primary: "#2dd4bf",
  secondary: "#f59e0b",
  accent: "#a78bfa",
  muted: "#64748b",
  success: "#22c55e",
  destructive: "#ef4444",
};

type ProjectsByStatusItem = { name: string; count: number };
type ContactsByMonthItem = { month: string; demandes: number };
type ContactsByServiceItem = { name: string; count: number };
type ReadUnreadItem = { name: string; value: number };
type NewsletterByMonthItem = { month: string; abonnes: number };

type DashboardChartsProps = {
  projectsByStatus: ProjectsByStatusItem[];
  contactsByMonth: ContactsByMonthItem[];
  contactsByService: ContactsByServiceItem[];
  contactsReadUnread: ReadUnreadItem[];
  newsletterByMonth: NewsletterByMonthItem[];
};

export function DashboardCharts({
  projectsByStatus,
  contactsByMonth,
  contactsByService,
  contactsReadUnread,
  newsletterByMonth,
}: DashboardChartsProps) {
  const pieColors = [CHART_COLORS.primary, CHART_COLORS.destructive];

  return (
    <div className="mt-10 space-y-10">
      <section>
        <h2 className="text-lg font-semibold text-foreground mb-4">
          Représentations graphiques
        </h2>
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Projets par statut */}
          <div className="rounded-lg border border-border bg-surface p-4">
            <h3 className="text-sm font-medium text-muted-foreground mb-4">
              Projets par statut
            </h3>
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={projectsByStatus}
                  margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="var(--border)"
                    opacity={0.5}
                  />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                    axisLine={{ stroke: "var(--border)" }}
                    tickLine={{ stroke: "var(--border)" }}
                  />
                  <YAxis
                    tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                    axisLine={{ stroke: "var(--border)" }}
                    tickLine={{ stroke: "var(--border)" }}
                    allowDecimals={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--surface-elevated)",
                      border: "1px solid var(--border)",
                      borderRadius: "var(--radius-md)",
                      color: "var(--foreground)",
                    }}
                    labelStyle={{ color: "var(--muted-foreground)" }}
                    formatter={(value: number | undefined) => [value ?? 0, "Projets"]}
                  />
                  <Bar
                    dataKey="count"
                    fill={CHART_COLORS.primary}
                    radius={[4, 4, 0, 0]}
                    name="Projets"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Contacts lus / non lus */}
          <div className="rounded-lg border border-border bg-surface p-4">
            <h3 className="text-sm font-medium text-muted-foreground mb-4">
              Demandes de contact (lus / non lus)
            </h3>
            <div className="h-[260px] flex items-center justify-center">
              {contactsReadUnread.every((d) => d.value === 0) ? (
                <p className="text-sm text-muted-foreground">
                  Aucune demande pour le moment
                </p>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={contactsReadUnread}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={2}
                      label={({ name, percent }) =>
                        `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
                      }
                      labelLine={{ stroke: "var(--border)" }}
                    >
                      {contactsReadUnread.map((_, index) => (
                        <Cell
                          key={index}
                          fill={pieColors[index % pieColors.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "var(--surface-elevated)",
                        border: "1px solid var(--border)",
                        borderRadius: "var(--radius-md)",
                        color: "var(--foreground)",
                      }}
                      formatter={(value: number | undefined) => [value ?? 0, "Demandes"]}
                    />
                    <Legend
                      wrapperStyle={{ fontSize: 12 }}
                      formatter={(value) => (
                        <span style={{ color: "var(--foreground)" }}>
                          {value}
                        </span>
                      )}
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Demandes de contact par mois */}
          <div className="rounded-lg border border-border bg-surface p-4 lg:col-span-2">
            <h3 className="text-sm font-medium text-muted-foreground mb-4">
              Demandes de contact par mois
            </h3>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={contactsByMonth}
                  margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient
                      id="fillContacts"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor={CHART_COLORS.primary}
                        stopOpacity={0.4}
                      />
                      <stop
                        offset="100%"
                        stopColor={CHART_COLORS.primary}
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="var(--border)"
                    opacity={0.5}
                  />
                  <XAxis
                    dataKey="month"
                    tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                    axisLine={{ stroke: "var(--border)" }}
                    tickLine={{ stroke: "var(--border)" }}
                  />
                  <YAxis
                    tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                    axisLine={{ stroke: "var(--border)" }}
                    tickLine={{ stroke: "var(--border)" }}
                    allowDecimals={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--surface-elevated)",
                      border: "1px solid var(--border)",
                      borderRadius: "var(--radius-md)",
                      color: "var(--foreground)",
                    }}
                    formatter={(value: number | undefined) => [value ?? 0, "Demandes"]}
                  />
                  <Area
                    type="monotone"
                    dataKey="demandes"
                    stroke={CHART_COLORS.primary}
                    strokeWidth={2}
                    fill="url(#fillContacts)"
                    name="Demandes"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Demandes par service */}
          <div className="rounded-lg border border-border bg-surface p-4">
            <h3 className="text-sm font-medium text-muted-foreground mb-4">
              Demandes par type de service
            </h3>
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={contactsByService}
                  layout="vertical"
                  margin={{ top: 8, right: 24, left: 60, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="var(--border)"
                    opacity={0.5}
                    horizontal={false}
                  />
                  <XAxis
                    type="number"
                    tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                    axisLine={{ stroke: "var(--border)" }}
                    tickLine={{ stroke: "var(--border)" }}
                    allowDecimals={false}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={56}
                    tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                    axisLine={{ stroke: "var(--border)" }}
                    tickLine={{ stroke: "var(--border)" }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--surface-elevated)",
                      border: "1px solid var(--border)",
                      borderRadius: "var(--radius-md)",
                      color: "var(--foreground)",
                    }}
                    formatter={(value: number | undefined) => [value ?? 0, "Demandes"]}
                  />
                  <Bar
                    dataKey="count"
                    fill={CHART_COLORS.secondary}
                    radius={[0, 4, 4, 0]}
                    name="Demandes"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Évolution abonnés newsletter */}
          <div className="rounded-lg border border-border bg-surface p-4">
            <h3 className="text-sm font-medium text-muted-foreground mb-4">
              Évolution des abonnés newsletter
            </h3>
            <div className="h-[260px]">
              {newsletterByMonth.length <= 1 ? (
                <div className="h-full flex items-center justify-center">
                  <p className="text-sm text-muted-foreground">
                    Données insuffisantes pour l&apos;évolution
                  </p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={newsletterByMonth}
                    margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="var(--border)"
                      opacity={0.5}
                    />
                    <XAxis
                      dataKey="month"
                      tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                      axisLine={{ stroke: "var(--border)" }}
                      tickLine={{ stroke: "var(--border)" }}
                    />
                    <YAxis
                      tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                      axisLine={{ stroke: "var(--border)" }}
                      tickLine={{ stroke: "var(--border)" }}
                      allowDecimals={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "var(--surface-elevated)",
                        border: "1px solid var(--border)",
                        borderRadius: "var(--radius-md)",
                        color: "var(--foreground)",
                      }}
                      formatter={(value: number | undefined) => [value ?? 0, "Abonnés"]}
                    />
                    <Line
                      type="monotone"
                      dataKey="abonnes"
                      stroke={CHART_COLORS.accent}
                      strokeWidth={2}
                      dot={{ fill: CHART_COLORS.accent, r: 4 }}
                      activeDot={{ r: 6 }}
                      name="Abonnés"
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
