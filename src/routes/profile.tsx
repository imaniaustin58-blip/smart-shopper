import { createFileRoute } from "@tanstack/react-router";
import { Bell, ListChecks, MapPin, Store, Wallet } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { useShopping } from "@/lib/shopping-store";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Your Profile — PricePair" },
      {
        name: "description",
        content: "Manage your preferred stores, alert settings and savings summary in PricePair.",
      },
      { property: "og:title", content: "Your Profile — PricePair" },
      {
        property: "og:description",
        content: "Preferred stores, alerts and savings, all in one place.",
      },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const { list, tracked } = useShopping();

  const stats = [
    { label: "List items", value: String(list.length), icon: ListChecks },
    { label: "Tracked", value: String(tracked.length), icon: Bell },
    { label: "Saved YTD", value: "$142.60", icon: Wallet },
  ];

  return (
    <AppShell title="Profile" subtitle="Preferences and savings">
      <section className="card-soft flex items-center gap-3 p-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-full gradient-hero font-display text-lg font-semibold text-primary-foreground">
          MM
        </div>
        <div>
          <p className="font-display text-lg font-semibold">Mani M.</p>
          <p className="text-[12px] text-muted-foreground">Smart shopper · Chicago, IL</p>
        </div>
      </section>

      <section className="mt-3 grid grid-cols-3 gap-3">
        {stats.map(({ label, value, icon: Icon }) => (
          <div key={label} className="card-soft p-3 text-center">
            <Icon className="mx-auto h-4 w-4 text-primary" />
            <p className="mt-1 font-display text-base font-semibold">{value}</p>
            <p className="text-[10px] text-muted-foreground">{label}</p>
          </div>
        ))}
      </section>

      <section className="card-soft mt-3 divide-y divide-border/60">
        <Row icon={Store} title="Preferred retailers" value="Walmart, Target" />
        <Row icon={MapPin} title="Shopping area" value="60614 · 5 mile radius" />
        <Row icon={Bell} title="Price drop alerts" value="On" />
        <Row icon={Wallet} title="Currency" value="USD" />
      </section>

      <p className="mt-5 text-center text-[11px] text-muted-foreground">
        Prototype profile. Accounts and live retailer data can be connected later.
      </p>
    </AppShell>
  );
}

function Row({
  icon: Icon,
  title,
  value,
}: {
  icon: typeof Store;
  title: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 px-4 py-3.5">
      <Icon className="h-4 w-4 text-muted-foreground" />
      <p className="flex-1 text-[13px] font-medium">{title}</p>
      <p className="text-[12px] text-muted-foreground">{value}</p>
    </div>
  );
}
