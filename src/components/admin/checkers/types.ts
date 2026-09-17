export interface AgentPayoutItem {
    id: string;
    reference: string;
    amount: string;
    momo_network: string;
    momo_number: string;
    status: string;
    status_display: string;
    notes: string;
    created_at: string;
    updated_at: string;
    agent: {
        id: string;
        store_name: string;
        slug: string;
        email: string;
        momo_network: string;
        momo_number: string;
        wallet_balance: string;
        total_checkers_sold: number;
        total_sales_value: string;
        lifetime_commission: string;
    };
}

export interface AgentListItem {
    id: string;
    store_name: string;
    slug: string;
    email: string;
    momo_network: string;
    momo_number: string;
    wallet_balance: string;
    total_checkers_sold: number;
    total_sales_value: string;
    lifetime_earnings: string;
    is_approved: boolean;
    created_at: string;
}

export interface CheckerAnalyticsData {
    selected_category: 'ALL' | 'WASSCE' | 'BECE';
    selected_period: string;
    start_date_str: string;
    end_date_str: string;
    since_upload_timestamp: string | null;

    active_revenue: string;
    active_profit: string;
    active_cost: string;
    active_margin: string;
    active_sold: number;
    active_available: number;
    active_total: number;
    active_reserved: number;
    active_pending: string;
    active_unsold_val: string;
    active_unsold_profit: string;
    total_potential: string;
    total_potential_net_profit: string;

    cost_per_unit: string;
    sparkline_revenue: number[];
    sparkline_profit: number[];

    total_wassce: number;
    total_bece: number;
    sold_wassce: number;
    sold_bece: number;
    available_wassce: number;
    available_bece: number;
    reserved_wassce: number;
    reserved_bece: number;

    revenue_wassce: string;
    revenue_bece: string;
    revenue_all: string;
}

export type MainTabType = 'resellers' | 'vouchers';
export type ResellerSubTabType = 'agents' | 'pending' | 'history';
export type CheckerCategoryType = 'ALL' | 'WASSCE' | 'BECE';
