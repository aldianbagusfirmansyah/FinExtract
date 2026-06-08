import React, { useState, useEffect } from "react";
import { ExtractedTransaction } from "../types";
import { Check, Edit2, RotateCcw, Save, Trash2, Calendar, CreditCard, DollarSign, Wallet, FileText, CheckCircle2 } from "lucide-react";
import CategoryBadge, { categoryMeta } from "./CategoryBadge";

interface TransactionResultsProps {
  extracted: ExtractedTransaction;
  rawText: string;
  onSave: (finalData: ExtractedTransaction) => void;
  onDiscard: () => void;
}

export default function TransactionResults({
  extracted,
  rawText,
  onSave,
  onDiscard,
}: TransactionResultsProps) {
  const [formData, setFormData] = useState<ExtractedTransaction>({ ...extracted });
  const [isEditing, setIsEditing] = useState(false);

  // Sync state if a new extraction is loaded
  useEffect(() => {
    setFormData({ ...extracted });
    setIsEditing(false);
  }, [extracted]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name === "amount") {
      setFormData((prev) => ({
        ...prev,
        [name]: Math.max(0, parseInt(value) || 0),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const formattedDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString(undefined, {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return isoString;
    }
  };

  // Convert ISO string to HTML Local DateTime input format
  const toLocalDateTime = (isoString: string) => {
    try {
      const d = new Date(isoString);
      const tzOffset = d.getTimezoneOffset() * 60000;
      const localISOTime = new Date(d.getTime() - tzOffset)
        .toISOString()
        .slice(0, 16);
      return localISOTime;
    } catch {
      return new Date().toISOString().slice(0, 16);
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const selected = new Date(e.target.value);
      setFormData((prev) => ({
        ...prev,
        date: selected.toISOString(),
      }));
    } catch (err) {
      console.error("Invalid date entered", err);
    }
  };

  const handleSaveClick = () => {
    onSave(formData);
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-md space-y-6">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-b-slate-100 pb-4">
        <div>
          <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md tracking-wider uppercase inline-block mb-1">
            Extraction Success
          </span>
          <h2 className="text-lg font-display font-semibold text-slate-800">
            Preview Extracted Details
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
              isEditing
                ? "bg-slate-100 text-slate-700 border-slate-200"
                : "bg-white hover:bg-slate-50 text-slate-600 border-slate-200"
            }`}
          >
            {isEditing ? (
              <>
                <RotateCcw className="h-3.5 w-3.5" /> Cancel Edits
              </>
            ) : (
              <>
                <Edit2 className="h-3.5 w-3.5" /> Adjust Fields
              </>
            )}
          </button>
          <button
            onClick={onDiscard}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-rose-200/50 hover:bg-rose-50 text-rose-600 transition-colors cursor-pointer"
          >
            <Trash2 className="h-3.5 w-3.5" /> Discard
          </button>
        </div>
      </div>

      {/* Raw entry display */}
      <div className="bg-slate-50/70 rounded-xl p-3.5 border border-slate-100/80 text-xs space-y-1">
        <span className="font-semibold text-slate-400 uppercase tracking-wider block">
          Original Input text
        </span>
        <blockquote className="italic text-slate-600 leading-relaxed font-sans">
          "{rawText}"
        </blockquote>
      </div>

      {isEditing ? (
        /* EDITING MODE FORM */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-500">Amount</label>
            <div className="relative rounded-lg shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <span className="text-slate-400 font-medium">$</span>
              </div>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                className="block w-full rounded-lg border border-slate-200 pl-8 pr-3 py-2 text-sm focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-400"
                min="0"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-500">
              Transaction Type
            </label>
            <select
              name="transaction_type"
              value={formData.transaction_type}
              onChange={handleChange}
              className="block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-400 bg-white"
            >
              <option value="expense">Expense (Outgoing Money)</option>
              <option value="income">Income (Incoming Money)</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-500">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-400 bg-white"
            >
              {Object.keys(categoryMeta).map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-500">
              Payment Method
            </label>
            <input
              type="text"
              name="payment_method"
              value={formData.payment_method}
              onChange={handleChange}
              placeholder="e.g. Cash, Credit, Debit, E-Wallet"
              className="block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-400"
            />
          </div>

          <div className="space-y-1.5 md:col-span-2">
            <label className="text-xs font-medium text-slate-500">
              Description
            </label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Summary of item/service..."
              className="block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-400"
            />
          </div>

          <div className="space-y-1.5 md:col-span-2">
            <label className="text-xs font-medium text-slate-500">
              Date & Time
            </label>
            <input
              type="datetime-local"
              value={toLocalDateTime(formData.date)}
              onChange={handleDateChange}
              className="block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-400 bg-white"
            />
          </div>
        </div>
      ) : (
        /* READ-ONLY CARD STRUCTURE */
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 bg-slate-50/40 p-5 rounded-xl border border-slate-100">
          {/* Main Stat column */}
          <div className="flex sm:flex-col items-center sm:items-start justify-between sm:justify-center p-4 rounded-xl bg-white border border-slate-100/50 shadow-sm sm:col-span-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Extracted Amount
            </span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl font-display font-bold text-slate-800">
                ${formData.amount.toLocaleString()}
              </span>
              <span className="text-xs text-slate-400 font-sans font-medium">
                USD
              </span>
            </div>
            <span
              className={`mt-2 text-xs font-semibold px-2.5 py-0.5 rounded-full inline-block ${
                formData.transaction_type === "income"
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-rose-50 text-rose-700"
              }`}
            >
              {formData.transaction_type.toUpperCase()}
            </span>
          </div>

          {/* Structured Details columns */}
          <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-slate-400 text-xs">
                <FileText className="h-3.5 w-3.5" />
                <span>Description</span>
              </div>
              <p className="text-sm font-sans font-medium text-slate-800 leading-snug">
                {formData.description || "—"}
              </p>
            </div>

            <div className="space-y-1">
              <div className="text-slate-400 text-xs">Category</div>
              <div>
                <CategoryBadge category={formData.category} size="sm" />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-slate-400 text-xs">
                <CreditCard className="h-3.5 w-3.5" />
                <span>Payment Method</span>
              </div>
              <p className="text-sm font-sans font-medium text-slate-700">
                {formData.payment_method || "Unknown"}
              </p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-slate-400 text-xs">
                <Calendar className="h-3.5 w-3.5" />
                <span>Transaction Date</span>
              </div>
              <p className="text-xs font-mono text-slate-600">
                {formattedDate(formData.date)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Primary save call-to-action button */}
      <button
        onClick={handleSaveClick}
        className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium shadow-md transition-all cursor-pointer active:scale-[0.99]"
      >
        <CheckCircle2 className="h-5 w-5" />
        <span>Save Transaction to Journal</span>
      </button>
    </div>
  );
}
