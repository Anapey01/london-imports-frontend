export interface PricingTier {
  min_quantity: number;
  max_quantity: number | null;
  price_per_unit: string;
}

export interface PricingData {
  [key: string]: PricingTier[];
}

export interface VoucherDetail {
  serial: string;
  pin: string;
}

export interface HistoryItem {
  client_reference: string;
  checker_type: string;
  quantity: number;
  completed_at: string;
  vouchers: VoucherDetail[];
}
