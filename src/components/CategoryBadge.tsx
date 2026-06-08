import React from "react";
import {
  Utensils,
  Car,
  Zap,
  Film,
  GraduationCap,
  ShoppingBag,
  TrendingUp,
  LineChart,
  HelpCircle,
  LucideIcon,
} from "lucide-react";

interface CategoryBadgeProps {
  category: string;
  size?: "sm" | "md";
}

export const categoryMeta: Record<
  string,
  { label: string; bg: string; text: string; border: string; icon: LucideIcon }
> = {
  Food: {
    label: "Food",
    bg: "bg-rose-50/70",
    text: "text-rose-700",
    border: "border-rose-200/50",
    icon: Utensils,
  },
  Transportation: {
    label: "Transportation",
    bg: "bg-blue-50/70",
    text: "text-blue-700",
    border: "border-blue-200/50",
    icon: Car,
  },
  Utilities: {
    label: "Utilities",
    bg: "bg-amber-50/70",
    text: "text-amber-700",
    border: "border-amber-200/50",
    icon: Zap,
  },
  Entertainment: {
    label: "Entertainment",
    bg: "bg-purple-50/70",
    text: "text-purple-700",
    border: "border-purple-200/50",
    icon: Film,
  },
  Education: {
    label: "Education",
    bg: "bg-teal-50/70",
    text: "text-teal-700",
    border: "border-teal-200/50",
    icon: GraduationCap,
  },
  Shopping: {
    label: "Shopping",
    bg: "bg-pink-50/70",
    text: "text-pink-700",
    border: "border-pink-200/50",
    icon: ShoppingBag,
  },
  Investment: {
    label: "Investment",
    bg: "bg-indigo-50/70",
    text: "text-indigo-700",
    border: "border-indigo-200/50",
    icon: LineChart,
  },
  Income: {
    label: "Income",
    bg: "bg-emerald-50/70",
    text: "text-emerald-700",
    border: "border-emerald-200/50",
    icon: TrendingUp,
  },
  Others: {
    label: "Others",
    bg: "bg-slate-50/70",
    text: "text-slate-700",
    border: "border-slate-200/50",
    icon: HelpCircle,
  },
};

export default function CategoryBadge({ category, size = "md" }: CategoryBadgeProps) {
  const meta = categoryMeta[category] || categoryMeta["Others"];
  const Icon = meta.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-sans font-medium select-none ${
        meta.bg
      } ${meta.text} ${meta.border} ${
        size === "sm" ? "text-xs px-2 py-0.25" : "text-sm"
      }`}
    >
      <Icon className={size === "sm" ? "h-3 w-3" : "h-3.5 w-3.5"} />
      {meta.label}
    </span>
  );
}
