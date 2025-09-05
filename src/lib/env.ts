/**
 * Environment variable validation and configuration
 */

export const env = {
  // Webhook secret for signature verification
  WEBHOOK_SECRET: process.env.WEBHOOK_SECRET || "shh_super_secret",

  // Environment
  NODE_ENV: process.env.NODE_ENV || "development",

  // API base URL
  API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || "",
} as const;

// Validate required environment variables in production
if (env.NODE_ENV === "production") {
  if (
    !process.env.WEBHOOK_SECRET ||
    process.env.WEBHOOK_SECRET === "shh_super_secret"
  ) {
    throw new Error(
      "WEBHOOK_SECRET must be set to a secure value in production"
    );
  }
}
