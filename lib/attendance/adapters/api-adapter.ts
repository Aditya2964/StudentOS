import { NormalizedAttendanceRecord } from "../types";

export interface BiometricApiConfig {
  apiUrl: string;
  apiKey: string;
  startDate?: string;
  endDate?: string;
}

export async function fetchBiometricApiAttendance(
  config: BiometricApiConfig
): Promise<NormalizedAttendanceRecord[]> {
  const { apiUrl, apiKey, startDate, endDate } = config;

  if (!apiUrl) {
    throw new Error("Biometric API URL is not configured.");
  }

  const queryParams = new URLSearchParams();
  if (startDate) queryParams.set("startDate", startDate);
  if (endDate) queryParams.set("endDate", endDate);

  const endpoint = `${apiUrl}?${queryParams.toString()}`;

  const response = await fetch(endpoint, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Biometric API HTTP error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  const rawRecords: any[] = Array.isArray(data) ? data : data.records || [];

  return rawRecords.map((item) => ({
    studentId: String(item.studentId || item.rollNo || item.empCode).trim(),
    date: item.date || new Date().toISOString().split("T")[0],
    checkIn: item.checkIn || item.punchIn || null,
    checkOut: item.checkOut || item.punchOut || null,
    status: item.status === "A" ? "ABSENT" : "PRESENT",
    source: "API_SYNC",
  }));
}
