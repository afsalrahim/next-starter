/**
 * Public configuration constants
 * Safe to use in client and server components
 */

export const PUBLIC_CONFIG = {
    // Site information
    siteName: 'Next Starter',
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',

    // Pagination
    defaultPageSize: 20,
    maxPageSize: 100,

    // Image sizes for responsive variants
    imageSizes: {
        small: 400,
        medium: 800,
        large: 1200,
    },

    // SEO limits
    seo: {
        titleMinLength: 50,
        titleMaxLength: 60,
        descriptionMinLength: 150,
        descriptionMaxLength: 160,
    },

} as const;
