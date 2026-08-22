import { Sparkles } from "lucide-react";

export function AssistantCard({ tips, title = "AI Shopping Assistant" }: { tips: string[]; title?: string }) {
  return (
    <section className="card-soft overflow-hidden">
      <div className="gradient-hero flex items-center gap-2 px-4 py-3 text-primary-foreground">
        <Sparkles className="h-4 w-4" />
        <h2 className="text-sm font-semibold">{title}</h2>
        <span className="ml-auto rounded-full bg-primary-foreground/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide">
          Sample
        </span>
      </div>
      <ul className="divide-y divide-border/60">
        {tips.map((tip) => (
          <li key={tip} className="flex gap-2.5 px-4 py-3 text-[13px] leading-relaxed text-foreground">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
            {tip}
          </li>
        ))}
      </ul>
    </section>
  );
}
