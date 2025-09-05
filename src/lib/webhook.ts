import crypto from "crypto";

export function verifyWebhookSignature(
  signature: string,
  rawBody: string,
  secret: string
): boolean {
  try {
    // Parse signature header: t=<timestamp>,v1=<signature>
    const match = signature.match(/t=(\d+),v1=(.+)/);
    if (!match) {
      return false;
    }

    const timestamp = parseInt(match[1], 10);
    const providedSignature = match[2];

    // Check freshness (within 5 minutes)
    const now = Math.floor(Date.now() / 1000);
    if (Math.abs(now - timestamp) > 300) {
      return false;
    }

    // Compute expected signature
    const payload = `${timestamp}.${rawBody}`;
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(payload)
      .digest("base64");

    // Constant-time comparison
    return crypto.timingSafeEqual(
      Buffer.from(providedSignature, "base64"),
      Buffer.from(expectedSignature, "base64")
    );
  } catch (error) {
    console.error("Webhook verification error:", error);
    return false;
  }
}

export function generateTestSignature(
  timestamp: number,
  rawBody: string,
  secret: string
): string {
  const payload = `${timestamp}.${rawBody}`;
  const signature = crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("base64");
  return `t=${timestamp},v1=${signature}`;
}
