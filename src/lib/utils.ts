export function cn(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}
export const accentClass = (section: string) =>
  ({
    algorithms: "text-accent-algorithms",
    os: "text-accent-os",
    networking: "text-accent-networking",
    systems: "text-accent-systems",
    languages: "text-accent-languages",
  })[section] ?? "text-muted";
