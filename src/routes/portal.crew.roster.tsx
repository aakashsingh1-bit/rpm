import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Panel } from "@/components/portal/Module";
import { Button } from "@/components/ui/button";
import { CREW } from "@/lib/crew-data";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/portal/crew/roster")({
  component: RosterPage,
});

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
type Shift = "D" | "N" | "O" | "L";
const NEXT: Record<Shift, Shift> = { D: "N", N: "L", L: "O", O: "D" };
// Sample roster: memberId -> array of 7 day/off/night codes
const INITIAL_ROSTER: Record<string, Shift[]> = {
  "rashid-al-ameri":   ["D", "D", "D", "O", "D", "D", "O"],
  "fatima-yousif":     ["D", "D", "O", "D", "D", "D", "O"],
  "yusuf-al-marzooqi": ["D", "D", "D", "D", "O", "O", "D"],
  "layla-hussein":     ["D", "O", "D", "D", "D", "D", "O"],
  "omar-saleh":        ["N", "N", "N", "O", "N", "N", "O"],
  "mira-jamal":        ["D", "D", "D", "O", "D", "D", "D"],
  "ali-al-kaabi":      ["O", "D", "D", "D", "D", "D", "O"],
  "hamad-al-dhaheri":  ["L", "L", "L", "L", "L", "L", "L"],
};

function RosterPage() {
  const [weekOffset, setWeekOffset] = useState(0);
  const [roster, setRoster] = useState<Record<string, Shift[]>>(INITIAL_ROSTER);
  const start = new Date();
  start.setDate(start.getDate() - start.getDay() + 1 + weekOffset * 7);
  const dates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d;
  });

  const cycle = (id: string, dayIdx: number) => {
    setRoster((prev) => {
      const week = [...(prev[id] ?? (["O","O","O","O","O","O","O"] as Shift[]))];
      week[dayIdx] = NEXT[week[dayIdx]];
      return { ...prev, [id]: week };
    });
  };
  const setShift = (id: string, dayIdx: number, s: Shift) => {
    setRoster((prev) => {
      const week = [...(prev[id] ?? (["O","O","O","O","O","O","O"] as Shift[]))];
      week[dayIdx] = s;
      return { ...prev, [id]: week };
    });
  };

  return (
    <Panel
      title="Shift roster"
      subtitle={`Week of ${dates[0].toDateString()}`}
      actions={
        <div className="flex items-center gap-1">
          <Button size="icon" variant="outline" className="h-8 w-8" onClick={() => setWeekOffset((w) => w - 1)}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="outline" onClick={() => setWeekOffset(0)}>This week</Button>
          <Button size="icon" variant="outline" className="h-8 w-8" onClick={() => setWeekOffset((w) => w + 1)}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button size="sm" className="ml-2 bg-gradient-primary text-primary-foreground" onClick={() => toast.success("Roster published")}>
            <Plus className="h-3.5 w-3.5 mr-1" /> Publish
          </Button>
        </div>
      }
    >
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-[10px] uppercase tracking-widest text-muted-foreground border-b border-border">
              <th className="text-left py-2 px-3 w-56">Crew</th>
              {DAYS.map((d, i) => (
                <th key={d} className="text-center py-2 px-2">
                  <div>{d}</div>
                  <div className="text-[9px] font-mono normal-case text-muted-foreground/70">{dates[i].getDate()}</div>
                </th>
              ))}
              <th className="text-right py-2 px-3">Hrs</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {CREW.map((c) => {
              const week: Shift[] = roster[c.id] ?? ["O", "O", "O", "O", "O", "O", "O"];
              const hrs = week.filter((s) => s === "D" || s === "N").length * 12;
              return (
                <tr key={c.id} className="hover:bg-accent/20">
                  <td className="py-2 px-3">
                    <Link to="/portal/crew/$id" params={{ id: c.id }} className="flex items-center gap-2 group">
                      <div className="h-7 w-7 rounded-full bg-gradient-primary grid place-items-center text-[10px] font-semibold text-primary-foreground">
                        {c.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                      </div>
                      <div>
                        <div className="text-sm font-medium group-hover:text-primary transition-colors">{c.name}</div>
                        <div className="text-[10px] text-muted-foreground">{c.role}</div>
                      </div>
                    </Link>
                  </td>
                  {week.map((s, i) => (
                    <td key={i} className="py-2 px-1 text-center">
                      <div className="inline-flex flex-col items-stretch gap-1 w-full max-w-[64px] mx-auto">
                        <button
                          onClick={() => cycle(c.id, i)}
                          title="Click to cycle shift"
                          className={`inline-flex items-center justify-center h-8 w-full rounded text-[11px] font-mono font-semibold transition-transform hover:scale-105 ${
                            s === "D" ? "bg-primary/15 text-primary border border-primary/30"
                              : s === "N" ? "bg-info/15 text-info border border-info/30"
                              : s === "L" ? "bg-warning/15 text-warning border border-warning/30"
                              : "bg-surface text-muted-foreground border border-border"
                          }`}
                        >
                          {s === "D" ? "Day" : s === "N" ? "Night" : s === "L" ? "Leave" : "Off"}
                        </button>
                        <select
                          value={s}
                          onChange={(e) => setShift(c.id, i, e.target.value as Shift)}
                          className="h-5 w-full text-[9px] rounded border border-border bg-surface text-muted-foreground"
                          aria-label={`Shift for ${c.name} on ${DAYS[i]}`}
                        >
                          <option value="D">Day</option>
                          <option value="N">Night</option>
                          <option value="L">Leave</option>
                          <option value="O">Off</option>
                        </select>
                      </div>
                    </td>
                  ))}
                  <td className="py-2 px-3 text-right font-mono text-xs">{hrs}h</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="flex items-center gap-4 mt-4 text-[10px] text-muted-foreground">
        <Legend color="bg-primary/60" label="Day" />
        <Legend color="bg-info/60" label="Night" />
        <Legend color="bg-warning/60" label="Leave" />
        <Legend color="bg-surface border border-border" label="Off" />
      </div>
    </Panel>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return <div className="flex items-center gap-1.5"><span className={`h-2 w-3 rounded-sm ${color}`} /> {label}</div>;
}
