import { serve } from "inngest/next";
import { inngest } from "@/lib/inngest/client";
import { scheduledAttendanceSync } from "@/inngest/attendance-sync";
import { asyncExcelImportJob } from "@/inngest/excel-import-job";
import { postAttendanceTriggerJob } from "@/inngest/post-attendance-job";
import { scheduledNotificationDispatcherJob } from "@/inngest/notifications-job";
import { vectorizeNotesJob } from "@/inngest/vectorize-notes";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    scheduledAttendanceSync,
    asyncExcelImportJob,
    postAttendanceTriggerJob,
    scheduledNotificationDispatcherJob,
    vectorizeNotesJob,
  ],
});
