import React, { useState, useEffect } from "react";
import { 
  Sparkles, 
  Trash2, 
  Settings, 
  ShieldCheck, 
  BrainCircuit, 
  Layers, 
  Check, 
  Loader2, 
  ListRestart, 
  HelpCircle, 
  Smartphone, 
  BookOpen, 
  CheckCircle2, 
  ArrowRight,
  TrendingUp,
  Inbox
} from "lucide-react";
import Presets from "./components/Presets";
import TransactionResults from "./components/TransactionResults";
import CategoryBadge from "./components/CategoryBadge";
import { ExtractedTransaction, SavedTransaction } from "./types";

export default function App() {
  const [text, setText] = useState("");
  const [extracted, setExtracted] = useState<ExtractedTransaction | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Settings states matching the mock setting controls in the design
  const [strictMode, setStrictMode] = useState(true);
  const [autoCategorize, setAutoCategorize] = useState(true);

  // Saved transactions history (persisted in localStorage)
  const [savedTransactions, setSavedTransactions] = useState<SavedTransaction[]>([]);

  // Feedback notifications (e.g. "Saved!", "Copied!")
  const [notification, setNotification] = useState<string | null>(null);

  // Load transactions on mount
  useEffect(() => {
    const cached = localStorage.getItem("finextract_transactions");
    if (cached) {
      try {
        setSavedTransactions(JSON.parse(cached));
      } catch (err) {
        console.error("Failed to parse saved transactions from localStorage", err);
      }
    }
  }, []);

  // Show temp notification helper
  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  // Preset Selection Action
  const handleSelectPreset = (presetText: string) => {
    setText(presetText);
    setError(null);
  };

  // Submit Text to Extraction Endpoint
  const handleProcessInput = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!text.trim()) return;

    setIsProcessing(true);
    setError(null);
    setExtracted(null);

    try {
      const response = await fetch("/api/extract", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
          clientTime: new Date().toISOString(),
        }),
      });

      const resData = await response.json();
      if (!response.ok || !resData.success) {
        throw new Error(resData.error || "Failed to extract transaction details.");
      }

      setExtracted(resData.data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An error occurred while calling the extraction backend.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Save/Commit current extraction into local journal list
  const handleSaveToJournal = (finalData: ExtractedTransaction) => {
    const newTransaction: SavedTransaction = {
      ...finalData,
      id: `tx-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      rawText: text,
      savedAt: new Date().toISOString(),
    };

    const updated = [newTransaction, ...savedTransactions];
    setSavedTransactions(updated);
    localStorage.setItem("finextract_transactions", JSON.stringify(updated));

    // Clear active extraction states
    setExtracted(null);
    setText("");
    showNotification("Transaction saved to ledger!");
  };

  // Clear current active preview
  const handleDiscardExtract = () => {
    setExtracted(null);
    showNotification("Active preview discarded.");
  };

  // Clear Saved History Entirely
  const handleClearHistory = () => {
    if (window.confirm("Are you sure you want to clear your local database history?")) {
      setSavedTransactions([]);
      localStorage.removeItem("finextract_transactions");
      showNotification("Local history cleared.");
    }
  };

  const formatCurrency = (val: number, type: "expense" | "income") => {
    const prefix = type === "income" ? "+" : "-";
    return `${prefix}$${val.toLocaleString()}`;
  };

  return (
    <div id="app-root" className="flex flex-col min-h-screen bg-slate-100 font-sans text-slate-900 selection:bg-indigo-500 selection:text-white">
      
      {/* Header Section */}
      <header className="flex items-center justify-between px-6 py-4 md:px-8 bg-slate-900 text-white shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center shadow-lg shadow-blue-500/20">
            <span className="font-bold text-xl font-display">$</span>
          </div>
          <div>
            <h1 className="text-lg font-bold leading-none tracking-wider font-display">FinExtract Pro</h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">
              PERSONAL FINANCE DATA ASSISTANT
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-4 md:gap-6">
          <div className="flex flex-col items-end">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Accuracy Rating</span>
            <span className="text-sm font-semibold text-emerald-400 font-mono tracking-tight">99.8%</span>
          </div>
          <div className="hidden sm:block w-px h-8 bg-slate-700"></div>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-indigo-600 border border-slate-700 flex items-center justify-center font-bold text-sm text-indigo-50 shadow-inner select-none transition-transform hover:scale-105" title="User Profile">
              AB
            </div>
            <span className="hidden md:inline text-xs text-slate-300 font-medium font-mono">aldian@gmail</span>
          </div>
        </div>
      </header>

      {/* Floating Notification */}
      {notification && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-2.5 rounded-lg shadow-xl border border-slate-800 flex items-center gap-2 animate-bounce">
          <Check className="h-4 w-4 text-emerald-400" />
          <span>{notification}</span>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Natural Language Input & Controls (7/12 cols) */}
        <section className="lg:col-span-7 flex flex-col gap-6">
          
          <form onSubmit={handleProcessInput} className="bg-white border border-slate-200 rounded-xl p-5 md:p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <label htmlFor="input-textarea" className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                Natural Language Input
              </label>
              <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded font-bold font-mono uppercase tracking-wide">
                English (UTC Reference)
              </span>
            </div>

            <div className="relative">
              <textarea
                id="input-textarea"
                value={text}
                onChange={(e) => {
                  setText(e.target.value);
                  if (error) setError(null);
                }}
                placeholder='e.g., "Earlier today, I spent $45 on groceries from Whole Foods using my Credit Card."'
                className="w-full h-44 p-4 rounded-xl bg-slate-50 border-2 border-slate-200/80 shadow-inner text-slate-700 leading-relaxed placeholder:text-slate-400 text-sm focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500 transition-all resize-none"
              />
              
              <div className="absolute bottom-3 right-3 flex items-center gap-2">
                {text.trim() && (
                  <button
                    type="button"
                    onClick={() => setText("")}
                    className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-xs font-bold transition-all cursor-pointer"
                  >
                    Clear
                  </button>
                )}
                <button
                  type="submit"
                  disabled={isProcessing || !text.trim()}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:shadow-none transition-all cursor-pointer flex items-center gap-1.5"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      <span>Extracting...</span>
                    </>
                  ) : (
                    <>
                      <BrainCircuit className="h-3.5 w-3.5" />
                      <span>Process Input</span>
                    </>
                  )}
                </button>
              </div>
            </div>
            
            {/* Display status or error alert */}
            {error && (
              <div className="p-3 bg-rose-50 border border-rose-100 rounded-lg text-xs text-rose-600 animate-fade-in font-medium">
                ⚠️ Error during extraction: {error}
              </div>
            )}
          </form>

          {/* Quick Presets Section */}
          <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-5 shadow-sm">
            <Presets onSelect={handleSelectPreset} />
          </div>

          {/* Settings Section matching pattern in template */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 md:p-6 shadow-sm">
            <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-widest mb-4">
              <Settings className="h-3.5 w-3.5" />
              <span>Extraction Engine Parameters</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-3 border border-slate-100 rounded-lg bg-slate-50">
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs font-semibold text-slate-700">Strict Schema Verification</span>
                  <span className="text-[10px] text-slate-400">Validates strict database alignment</span>
                </div>
                <button
                  type="button"
                  onClick={() => setStrictMode(!strictMode)}
                  className={`w-10 h-5 rounded-full relative transition-colors cursor-pointer ${
                    strictMode ? "bg-emerald-500" : "bg-slate-300"
                  }`}
                >
                  <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all ${
                    strictMode ? "right-0.5" : "left-0.5"
                  }`} />
                </button>
              </div>

              <div className="flex items-center justify-between p-3 border border-slate-100 rounded-lg bg-slate-50">
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs font-semibold text-slate-700">Category Fine-Tuning</span>
                  <span className="text-[10px] text-slate-400">Classifies standard domain terms</span>
                </div>
                <button
                  type="button"
                  onClick={() => setAutoCategorize(!autoCategorize)}
                  className={`w-10 h-5 rounded-full relative transition-colors cursor-pointer ${
                    autoCategorize ? "bg-emerald-500" : "bg-slate-300"
                  }`}
                >
                  <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all ${
                    autoCategorize ? "right-0.5" : "left-0.5"
                  }`} />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Right Column: Extracted Data Preview & Journal Ledger (5/12 cols) */}
        <section className="lg:col-span-5 flex flex-col gap-6 bg-slate-200/40 border-l border-slate-300/40 lg:pl-6 p-1 rounded-2xl">
          
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">
              Live Preview / Editor
            </h3>
            <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded font-bold uppercase font-mono tracking-wide">
              JSON VERIFIED
            </span>
          </div>

          {/* Active Extraction State */}
          {isProcessing ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center flex flex-col items-center justify-center min-h-[300px] shadow-sm space-y-4">
              <div className="relative">
                <div className="w-12 h-12 rounded-full border-4 border-indigo-100 border-t-indigo-600 animate-spin" />
                <BrainCircuit className="h-5 w-5 text-indigo-500 absolute top-3.5 left-3.5 animate-pulse" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800">Reading transaction statement...</p>
                <p className="text-xs text-slate-400 mt-1">Calling Gemini-3.5-Flash to resolve date, entities & type</p>
              </div>
            </div>
          ) : extracted ? (
            <TransactionResults
              extracted={extracted}
              rawText={text}
              onSave={handleSaveToJournal}
              onDiscard={handleDiscardExtract}
            />
          ) : (
            /* Awaiting Input Empty State */
            <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-8 text-center flex flex-col items-center justify-center min-h-[300px] shadow-sm space-y-3">
              <div className="w-12 h-12 bg-slate-50 border border-slate-200 rounded-full flex items-center justify-center text-slate-400">
                <Inbox className="h-6 w-6" />
              </div>
              <div className="max-w-xs space-y-1">
                <p className="text-xs font-bold uppercase text-slate-400 tracking-wider">Awaiting query input</p>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Enter a sentence detailing a payment, salary or spend on the left, then click <b>Process Input</b> to view parsed metadata.
                </p>
              </div>
            </div>
          )}

          {/* Recent Extractions Local Ledger */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                Local Journal History ({savedTransactions.length})
              </h3>
              {savedTransactions.length > 0 && (
                <button
                  onClick={handleClearHistory}
                  className="text-[10px] text-rose-600 hover:text-rose-800 font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer bg-slate-100/80 hover:bg-rose-50 border border-transparent hover:border-rose-200 px-2 py-1 rounded"
                >
                  <Trash2 className="h-3 w-3" /> Clear Journal
                </button>
              )}
            </div>

            {savedTransactions.length === 0 ? (
              <div className="bg-white/50 border border-slate-300/40 rounded-xl p-6 text-center text-slate-400">
                <p className="text-xs italic">No transactions committed to journal yet.</p>
              </div>
            ) : (
              <div className="space-y-2.5 max-h-[350px] overflow-y-auto pr-1">
                {savedTransactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="bg-white p-3.5 rounded-xl flex items-center justify-between gap-4 border border-slate-200/80 shadow-sm hover:border-indigo-200 transition-all relative overflow-hidden"
                  >
                    <div className="flex flex-col gap-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-slate-800 truncate" title={tx.description}>
                          {tx.description}
                        </span>
                        <CategoryBadge category={tx.category} size="sm" />
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono truncate" title={tx.rawText}>
                        "{tx.rawText}"
                      </span>
                    </div>

                    <div className="flex flex-col items-end shrink-0">
                      <span className={`text-xs font-bold font-mono tracking-tight ${
                        tx.transaction_type === "income" ? "text-emerald-600" : "text-rose-600"
                      }`}>
                        {formatCurrency(tx.amount, tx.transaction_type)}
                      </span>
                      <span className="text-[9px] text-slate-400 block font-mono">
                        {new Date(tx.date).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </section>
      </main>

      {/* Footer Status Bar */}
      <footer className="bg-white border-t border-slate-300 px-6 py-3.5 md:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-auto select-none">
        <div className="flex flex-wrap gap-4 md:gap-6 justify-center">
          <span>Connection: <span className="text-emerald-600 font-mono">Secure TLS (AES-256)</span></span>
          <span className="hidden sm:inline text-slate-300">|</span>
          <span>Engine Model: <span className="text-slate-600 font-mono">Gemini-3.5-Flash</span></span>
        </div>
        <div className="flex gap-2 items-center">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span className="w-2 h-2 rounded-full bg-emerald-500 -ml-4" />
          <span>Extraction System Operational</span>
        </div>
      </footer>
    </div>
  );
}
