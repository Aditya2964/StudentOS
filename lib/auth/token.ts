/**
 * Cryptographic Token Utility for StudentOS
 * Provides HMAC-SHA256 signing and verification using Web Crypto API.
 * Portable across Next.js Node runtime, Edge Middleware, and Server Actions.
 */

const DEFAULT_SECRET = process.env.BETTER_AUTH_SECRET || "studentos-auth-secret-key-prod-2026";

function toBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(str: string): Uint8Array {
  let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4) {
    base64 += "=";
  }
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

async function getHmacKey(secret: string = DEFAULT_SECRET): Promise<CryptoKey> {
  const enc = new TextEncoder();
  return await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

export async function signSessionToken<T>(payload: T, secret: string = DEFAULT_SECRET): Promise<string> {
  const jsonStr = JSON.stringify(payload);
  const dataBytes = new TextEncoder().encode(jsonStr);
  const dataBase64Url = toBase64Url(dataBytes);

  const key = await getHmacKey(secret);
  const sigBuffer = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(dataBase64Url)
  );

  const sigBase64Url = toBase64Url(new Uint8Array(sigBuffer));
  return `${dataBase64Url}.${sigBase64Url}`;
}

export async function verifySessionToken<T>(token: string, secret: string = DEFAULT_SECRET): Promise<T | null> {
  if (!token || typeof token !== "string") return null;

  // If token is signed format: payloadBase64.sigBase64
  if (token.includes(".")) {
    const [dataBase64Url, sigBase64Url] = token.split(".");
    if (!dataBase64Url || !sigBase64Url) return null;

    try {
      const key = await getHmacKey(secret);
      const sigBytes = fromBase64Url(sigBase64Url);
      const isValid = await crypto.subtle.verify(
        "HMAC",
        key,
        sigBytes as BufferSource,
        new TextEncoder().encode(dataBase64Url)
      );

      if (!isValid) return null;

      const rawBytes = fromBase64Url(dataBase64Url);
      const jsonStr = new TextDecoder().decode(rawBytes);
      return JSON.parse(jsonStr) as T;
    } catch {
      return null;
    }
  }

  // Graceful fallback for legacy JSON cookies only during dev mode transition
  if (process.env.NODE_ENV !== "production" && token.startsWith("{") && token.endsWith("}")) {
    try {
      return JSON.parse(token) as T;
    } catch {
      return null;
    }
  }

  return null;
}
