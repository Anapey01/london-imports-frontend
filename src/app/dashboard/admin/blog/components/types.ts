export interface Section {
    id: string;
    type: 'text' | 'image';
    content: string;
    file?: File;
    previewUrl?: string;
}

export interface BlogPost {
    id: number;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    category: string;
    image: string | null;  // Changed from featured_image
    is_published: boolean;
    is_featured: boolean;
    read_time_minutes: number;
    published_at: string | null;
    created_at: string;
    seo_title: string;     // Added
    seo_keywords: string;  // Added
}
