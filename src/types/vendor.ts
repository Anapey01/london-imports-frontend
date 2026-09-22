export interface VendorFormData {
    // Account
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    password: string;
    password_confirm: string;
    // Business
    business_name: string;
    description: string;
    whatsapp: string;
    ghana_card_number?: string;
    business_certificate_number?: string;
    // Location
    city: string;
    region: string;
    address: string;
    // Bank
    bank_name: string;
    bank_account_number: string;
    bank_account_name: string;
}
