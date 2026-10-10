/**
 * Centralized error formatting helper for StudentOS.
 * Sanitizes raw SQL errors, database query dumps, and network failures into user-friendly messages.
 */
export function formatErrorMessage(err: unknown, defaultMessage = "An unexpected error occurred."): string {
  if (!err) return defaultMessage;

  const rawMsg = err instanceof Error ? err.message : String(err);

  // Check for database connection issues
  if (
    rawMsg.includes("ENOTFOUND") ||
    rawMsg.includes("tenant/user") ||
    rawMsg.includes("ECONNREFUSED") ||
    rawMsg.includes("ETIMEDOUT") ||
    rawMsg.includes("PostgresError")
  ) {
    return "Database Connection Failed: Unable to connect to Supabase/PostgreSQL. Your database may be offline or credentials in .env.local need to be updated.";
  }

  // Check for raw SQL query leaks
  if (
    rawMsg.includes("Failed query:") ||
    rawMsg.includes("select \"") ||
    rawMsg.includes("insert into") ||
    rawMsg.includes("update \"") ||
    rawMsg.includes("delete from")
  ) {
    return "A database operation failed while processing your request. Please try again or contact support.";
  }

  // If the error message is concise and contains no stack trace / query dumps, return it directly
  if (rawMsg.length < 250 && !rawMsg.includes("\n") && !rawMsg.includes("at ") && !rawMsg.includes("params:")) {
    return rawMsg;
  }

  return defaultMessage;
}
