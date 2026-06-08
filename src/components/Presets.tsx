import React from "react";
import { Sparkles, ArrowRight, CornerDownLeft } from "lucide-react";

interface Preset {
  id: string;
  title: string;
  text: string;
  type: "expense" | "income";
  category: string;
}

const PRESETS: Preset[] = [
  {
    id: "p1",
    title: "Grocery Shopping",
    text: "Spent $84 at Whole Foods for weekly groceries last night with credit card.",
    type: "expense",
    category: "Food",
  },
  {
    id: "p2",
    title: "Salary Inflow",
    text: "Received my monthly salary of $3450 today via bank transfer onto my debit.",
    type: "income",
    category: "Income",
  },
  {
    id: "p3",
    title: "Electric Bill",
    text: "Paid $142 electricity bill yesterday afternoon using an e-wallet.",
    type: "expense",
    category: "Utilities",
  },
  {
    id: "p4",
    title: "Movie Tickets",
    text: "$32 yesterday night for cinema tickets with cash.",
    type: "expense",
    category: "Entertainment",
  },
  {
    id: "p5",
    title: "Stock Purchase",
    text: "Invested $500 on Friday afternoon into S&P 500 ETF with my debit card.",
    type: "income", // wait, investment is technically money out or in depending on state, but category: Investment, type: expense of liquidity
    category: "Investment",
  },
];

interface PresetsProps {
  onSelect: (text: string) => void;
}

export default function Presets({ onSelect }: PresetsProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold uppercase tracking-wider">
        <Sparkles className="h-3.5 w-3.5 text-blue-500 animate-pulse" />
        <span>Try these financial presets</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
        {PRESETS.map((preset) => (
          <button
            key={preset.id}
            onClick={() => onSelect(preset.text)}
            className="group flex flex-col justify-between text-left p-3.5 rounded-xl border border-slate-100 bg-white hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 cursor-pointer shadow-sm active:scale-[0.99] relative overflow-hidden"
          >
            {/* Hover color bar indicators */}
            <div
              className={`absolute top-0 bottom-0 left-0 w-1 transition-all group-hover:w-1.5 ${
                preset.category === "Income"
                  ? "bg-emerald-500"
                  : "bg-indigo-400"
              }`}
            />
            <div className="pl-2.5 space-y-1">
              <span className="text-xs font-medium text-slate-400">
                {preset.category}
              </span>
              <p className="text-sm font-sans text-slate-700 font-medium leading-relaxed group-hover:text-slate-900">
                "{preset.text}"
              </p>
            </div>
            
            <span className="self-end mt-2 flex items-center gap-1 text-[11px] font-medium text-slate-400 group-hover:text-slate-600 transition-colors">
              Load Query <CornerDownLeft className="h-3 w-3" />
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
