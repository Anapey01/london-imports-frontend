export interface Order {
  client_reference: string;
  checker_type: string;
  quantity: number;
  completed_at: string;
  total_price: string;
  commission: string;
  buyer_email: string;
}

export interface LedgerEntry {
  id: string;
  entry_type: string;
  entry_type_display: string;
  amount: string;
  balance_after: string;
  reference: string;
  description: string;
  created_at: string;
}

export interface Payout {
  id: string;
  amount: string;
  momo_network: string;
  momo_number: string;
  status: string;
  status_display: string;
  reference: string;
  notes: string;
  created_at: string;
}
