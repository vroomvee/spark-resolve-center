import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Search, ArrowUpRight, Ticket, Clock, CircleCheck, ListFilter } from "lucide-react";
import { PortalHeading, Status } from "@/components/thump/portal-shell";
import { useDemo } from "@/components/thump/demo-context";
import { Input } from "@/components/ui/input";
import { pageHead, statuses } from "@/lib/thump/data";
export const Route = createFileRoute("/portal/")({
  head: () =>
    pageHead(
      "Client workspace demo",
      "Preview fictional maintenance tickets and the THUMP customer workspace.",
    ),
  component: Dashboard,
});
function Dashboard() {
  const { tickets } = useDemo();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All statuses");
  const visible = tickets.filter(
    (t) =>
      (filter === "All statuses" || t.status === filter) &&
      `${t.title} ${t.id} ${t.site}`.toLowerCase().includes(search.toLowerCase()),
  );
  return (
    <>
      <PortalHeading
        title="Your service overview."
        subtitle="Stay connected to the protection of your spaces."
        action
      />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-9">
        {[
          { label: "Total tickets", count: tickets.length, icon: Ticket },
          {
            label: "Open requests",
            count: tickets.filter((t) => !["Resolved", "Closed"].includes(t.status)).length,
            icon: Clock,
          },
          {
            label: "Resolved requests",
            count: tickets.filter((t) => ["Resolved", "Closed"].includes(t.status)).length,
            icon: CircleCheck,
          },
        ].map(({ label, count, icon: Icon }) => (
          <div className="bg-background border border-border rounded-md p-6" key={label}>
            <div className="flex justify-between items-center text-muted-foreground text-xs">
              {label}
              <Icon className="size-5 text-primary" />
            </div>
            <p className="mt-5 text-4xl font-semibold">{count.toString().padStart(2, "0")}</p>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
        <h2 className="text-xl font-bold">Recent tickets</h2>
        <div className="flex flex-wrap gap-3">
          <div className="relative">
            <Search className="size-4 absolute left-3 top-3 text-muted-foreground" />
            <Input
              aria-label="Search tickets"
              className="bg-background pl-9 h-10"
              placeholder="Search tickets…"
              value={search}
              maxLength={100}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <label className="flex items-center gap-2">
            <ListFilter className="size-4 text-muted-foreground" />
            <select
              aria-label="Filter by status"
              className="select-control w-auto h-10"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option>All statuses</option>
              {statuses.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </label>
        </div>
      </div>
      <div className="border border-border bg-background rounded-md overflow-hidden">
        <div className="hidden md:grid ticket-row bg-muted text-[10px] font-semibold text-muted-foreground uppercase">
          <span>Request</span>
          <span>Site</span>
          <span>Status</span>
          <span>Priority</span>
          <span />
        </div>
        {visible.map((t) => (
          <Link
            key={t.id}
            to="/portal/tickets/$ticketId"
            params={{ ticketId: t.id }}
            search={{ created: false }}
            className="ticket-row grid gap-4 border-t border-border p-5 hover:bg-muted transition-colors"
          >
            <div className="min-w-0">
              <span className="text-[10px] text-muted-foreground font-mono">{t.id}</span>
              <h3 className="text-sm font-semibold mt-1">{t.title}</h3>
              <p className="text-[11px] text-muted-foreground mt-2">{t.date}</p>
            </div>
            <span className="text-xs text-muted-foreground">{t.site}</span>
            <div>
              <Status value={t.status} />
            </div>
            <span
              className={`text-xs ${t.priority === "High" ? "text-primary" : "text-muted-foreground"}`}
            >
              {t.priority}
            </span>
            <ArrowUpRight className="size-4 text-muted-foreground" />
          </Link>
        ))}
        {!visible.length && (
          <div className="p-12 text-center">
            <Ticket className="size-8 mx-auto mb-4 text-muted-foreground" />
            <h3 className="font-semibold">No matching requests</h3>
            <p className="text-sm text-muted-foreground mt-2">Try another search or status.</p>
          </div>
        )}
      </div>
      <p className="text-xs text-muted-foreground mt-5">
        Showing {visible.length} fictional tickets · Demo — Northstar Properties
      </p>
    </>
  );
}
