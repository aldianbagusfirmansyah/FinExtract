export interface ExtractedTransaction {
  amount: number;
  transaction_type: "expense" | "income";
  category: "Food" | "Transportation" | "Utilities" | "Entertainment" | "Education" | "Shopping" | "Investment" | "Income" | "Others";
  payment_method: string;
  description: string;
  date: string; // ISO string format
}

export interface SavedTransaction extends ExtractedTransaction {
  id: string;
  rawText: string;
  savedAt: string; // ISO string format
}
