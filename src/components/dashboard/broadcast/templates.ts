import { 
    CreditCard, 
    Package, 
    FileText, 
    Anchor, 
    MapPin, 
    CheckCircle, 
    Users, 
    Edit3,
    type LucideIcon 
} from 'lucide-react';

export interface LogisticsTemplate {
    id: string;
    title: string;
    target: string;
    subject: string;
    message: string;
    icon: LucideIcon;
    badge: string;
}

export interface SmsTemplate {
    id: string;
    title: string;
    target: string;
    message: string;
    icon: LucideIcon;
    badge: string;
}

export interface JourneyFilter {
    key: string;
    label: string;
    icon: LucideIcon;
}

export const LOGISTICS_TEMPLATES: LogisticsTemplate[] = [
    {
        id: 'payment-reminder',
        title: 'Payment Reminder (Unpaid Orders)',
        target: 'state:PENDING_PAYMENT',
        subject: 'Action Required: Complete Payment for Order #{{ORDER_ID}}',
        message: 'Hello {{FIRST_NAME}},\n\nThis is a friendly reminder that a pending balance of GHS {{AMOUNT_DUE}} remains due for your order #{{ORDER_ID}} ({{ITEMS}}).\n\nPlease complete your payment securely via Mobile Money on our portal to avoid any delays in shipping and delivery:\n{{PAY_URL}}\n\nThank you for choosing London\'s Imports.',
        icon: CreditCard,
        badge: 'Unpaid Orders Only'
    },
    {
        id: 'gz-arrived',
        title: 'Guangzhou Arrival',
        target: 'state:OPEN_FOR_BATCH',
        subject: 'Shipment Update: Goods Arrived at Guangzhou Warehouse',
        message: 'Hello {{FIRST_NAME}},\n\nWe are pleased to inform you that your items ({{ITEMS}}) for order #{{ORDER_ID}} have been successfully received and sorted at our Guangzhou Sorting Facility. They are now being prepared for the next available shipment batch.\n\nThank you for choosing London\'s Imports.',
        icon: Package,
        badge: 'GZ Warehouse Only'
    },
    {
        id: 'container-loaded',
        title: 'Container Loaded',
        target: 'state:IN_FULFILLMENT',
        subject: 'Logistics Update: Your Shipment is Now Loaded',
        message: 'Hello {{FIRST_NAME}},\n\nGood news! Your items ({{ITEMS}}) for order #{{ORDER_ID}} have been securely packed and loaded into our current container batch. The shipment is now finalizing documentation and will depart shortly.\n\nStay tuned for further updates.',
        icon: FileText,
        badge: 'Loaded Batch Only'
    },
    {
        id: 'transit-start',
        title: 'International Transit',
        target: 'state:IN_TRANSIT',
        subject: 'Transit Update: Goods are on the way to Ghana',
        message: 'Hello {{FIRST_NAME}},\n\nYour shipment for order #{{ORDER_ID}} ({{ITEMS}}) has officially departed and is currently in international transit toward Tema Port. Approximate transit times: Air (7-14 days), Sea (30-45 days).\n\nWe will notify you the moment it docks in Ghana.',
        icon: Anchor,
        badge: 'In Transit Only'
    },
    {
        id: 'ghana-arrived',
        title: 'Arrived at Accra Hub',
        target: 'state:ARRIVED',
        subject: 'Shipment Arrival: Your items are now at London\'s Imports Accra Hub!',
        message: 'Hello {{FIRST_NAME}},\n\nGreat news! Your shipment for order #{{ORDER_ID}} ({{ITEMS}}) has successfully arrived at London\'s Imports in Ghana and has passed sorting.\n\nYou can now come for collection at our center or wait for our last-mile delivery team to contact you.\n\nLocation: https://maps.app.goo.gl/F32KNuagHcczTtsFA\n\nThank you for choosing London\'s Imports.',
        icon: MapPin,
        badge: 'Arrived Hub Only'
    },
    {
        id: 'out-for-delivery',
        title: 'Out for Delivery',
        target: 'state:OUT_FOR_DELIVERY',
        subject: 'Delivery Alert: Your package is out for delivery today',
        message: 'Hello {{FIRST_NAME}},\n\nYour order #{{ORDER_ID}} ({{ITEMS}}) has been dispatched and is out for delivery with our courier today.\n\nPlease ensure you or someone designated is available at your delivery location with your phone reachable.\n\nThank you for shopping with London\'s Imports.',
        icon: Package,
        badge: 'Out for Delivery Only'
    },
    {
        id: 'delivered',
        title: 'Delivered / Completed',
        target: 'state:DELIVERED',
        subject: 'Package Delivered: Order #{{ORDER_ID}} Complete',
        message: 'Hello {{FIRST_NAME}},\n\nYour order #{{ORDER_ID}} ({{ITEMS}}) has been marked as delivered. We hope you love your items!\n\nIf you have any feedback or need assistance, please feel free to reach out to us at +233545247009.\n\nThank you for choosing London\'s Imports.',
        icon: CheckCircle,
        badge: 'Delivered Orders Only'
    },
    {
        id: 'weekly-drop',
        title: 'Weekly China Arrivals Drop',
        target: 'customers',
        subject: 'New Arrivals: Weekly China Shipment Just Dropped!',
        message: 'Hello {{FIRST_NAME}},\n\nOur latest weekly shipment of trending electronics, fashion, and home essentials has arrived from China!\n\nExplore all fresh arrivals and exclusive limited-quantity deals before they sell out:\nhttps://londonsimports.com/products\n\nHappy shopping,\nLondon\'s Imports Team',
        icon: Users,
        badge: 'All Customers'
    }
];

export const SMS_TEMPLATES: SmsTemplate[] = [
    {
        id: 'sms-payment-reminder',
        title: 'Payment Reminder',
        target: 'state:PENDING_PAYMENT',
        message: "Hi {{FIRST_NAME}}, your order #{{ORDER_ID}} ({{ITEMS}}) has a pending balance of GHS {{AMOUNT_DUE}}. Pay securely via Momo here: {{PAY_URL}}",
        icon: CreditCard,
        badge: 'Unpaid Orders Only'
    },
    {
        id: 'sms-gz-arrived',
        title: 'Guangzhou Arrival',
        target: 'state:OPEN_FOR_BATCH',
        message: "Hi {{FIRST_NAME}}, your items ({{ITEMS}}) for order #{{ORDER_ID}} have arrived at our Guangzhou warehouse and are sorting for packing.",
        icon: Package,
        badge: 'GZ Warehouse Only'
    },
    {
        id: 'sms-container-loaded',
        title: 'Container Loaded',
        target: 'state:IN_FULFILLMENT',
        message: "Hi {{FIRST_NAME}}, order #{{ORDER_ID}} ({{ITEMS}}) is packed and loaded into the container batch. Preparing for customs & departure.",
        icon: FileText,
        badge: 'Loaded Batch Only'
    },
    {
        id: 'sms-in-transit',
        title: 'International Transit',
        target: 'state:IN_TRANSIT',
        message: "Hi {{FIRST_NAME}}, order #{{ORDER_ID}} ({{ITEMS}}) is now in international transit toward Ghana. We will alert you upon port arrival.",
        icon: Anchor,
        badge: 'In Transit Only'
    },
    {
        id: 'sms-ghana-arrived',
        title: 'Arrived at Accra Hub',
        target: 'state:ARRIVED',
        message: "Hi {{FIRST_NAME}}, good news! Order #{{ORDER_ID}} ({{ITEMS}}) has arrived at our Accra Hub and passed sorting. Ready for pickup or delivery: https://maps.app.goo.gl/F32KNuagHcczTtsFA",
        icon: MapPin,
        badge: 'Arrived Hub Only'
    },
    {
        id: 'sms-out-for-delivery',
        title: 'Out for Delivery',
        target: 'state:OUT_FOR_DELIVERY',
        message: "Hi {{FIRST_NAME}}, your order #{{ORDER_ID}} ({{ITEMS}}) is out for delivery today with our dispatch courier! Please be on standby to receive your package.",
        icon: Package,
        badge: 'Out for Delivery Only'
    },
    {
        id: 'sms-delivered',
        title: 'Delivered / Completed',
        target: 'state:DELIVERED',
        message: "Hi {{FIRST_NAME}}, order #{{ORDER_ID}} ({{ITEMS}}) has been delivered! Thank you for shopping with us. For help, contact +233545247009.",
        icon: CheckCircle,
        badge: 'Delivered Orders Only'
    },
    {
        id: 'sms-flash-deal',
        title: 'Weekly China Arrivals Drop',
        target: 'customers',
        message: "Hi {{FIRST_NAME}}, new weekly China arrival drop is live! Browse discounted electronics & fashion items: https://londonsimports.com/products",
        icon: Users,
        badge: 'All Customers'
    }
];

export const JOURNEY_FILTERS: JourneyFilter[] = [
    { key: 'customers', label: 'All Active Customers', icon: Users },
    { key: 'state:PENDING_PAYMENT', label: 'Unpaid (Pending Payment)', icon: CreditCard },
    { key: 'state:OPEN_FOR_BATCH', label: 'At GZ Warehouse', icon: Package },
    { key: 'state:IN_FULFILLMENT', label: 'Loaded / Packed', icon: FileText },
    { key: 'state:IN_TRANSIT', label: 'International Transit', icon: Anchor },
    { key: 'state:ARRIVED', label: 'Arrived in Ghana Hub', icon: MapPin },
    { key: 'state:OUT_FOR_DELIVERY', label: 'Out for Local Delivery', icon: Package },
    { key: 'state:DELIVERED', label: 'Delivered / Completed', icon: CheckCircle },
    { key: 'manual', label: 'Manual Email List', icon: Edit3 },
];

export const SMS_JOURNEY_FILTERS: JourneyFilter[] = [
    { key: 'customers', label: 'All Active Customers', icon: Users },
    { key: 'state:PENDING_PAYMENT', label: 'Unpaid (Pending Payment)', icon: CreditCard },
    { key: 'state:OPEN_FOR_BATCH', label: 'At GZ Warehouse', icon: Package },
    { key: 'state:IN_FULFILLMENT', label: 'Loaded / Packed', icon: FileText },
    { key: 'state:IN_TRANSIT', label: 'International Transit', icon: Anchor },
    { key: 'state:ARRIVED', label: 'Arrived in Ghana Hub', icon: MapPin },
    { key: 'state:OUT_FOR_DELIVERY', label: 'Out for Local Delivery', icon: Package },
    { key: 'state:DELIVERED', label: 'Delivered / Completed', icon: CheckCircle },
    { key: 'manual', label: 'Manual Phone Numbers', icon: Edit3 },
];
