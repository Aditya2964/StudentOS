"use server";

import { db } from "@/lib/db";
import { timetables, exams, classes, subjects, teachers, users } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { formatErrorMessage } from "@/lib/utils/error-formatter";
import { assertAdmin, assertTeacherOrAdmin } from "@/lib/auth/rbac";

export interface AddTimetableSlotData {
  classId: string;
  subjectId: string;
  teacherId?: string;
  dayOfWeek: number; // 1 = Monday ... 7 = Sunday
  startTime: string; // "09:00"
  endTime: string; // "10:00"
  room: string; // "Room 302"
}

export interface AddExamData {
  examType: string;
  subjectId: string;
  date: string;
  startTime: string;
  endTime: string;
  room: string;
  instructions?: string;
}

export async function getTimetableData(classIdFilter?: string) {
  try {
    // 1. Fetch reference lists
    const allClasses = await db.select().from(classes).orderBy(desc(classes.createdAt));
    const allSubjects = await db.select().from(subjects).orderBy(desc(subjects.createdAt));

    // Fetch teachers with their user details
    const allTeachersData = await db
      .select({
        id: teachers.id,
        teacherId: teachers.teacherId,
        department: teachers.department,
        userId: teachers.userId,
        name: users.name,
      })
      .from(teachers)
      .innerJoin(users, eq(teachers.userId, users.id));

    // 2. Fetch timetable slots (filtered by class if specified)
    const query = db
      .select({
        id: timetables.id,
        classId: timetables.classId,
        subjectId: timetables.subjectId,
        teacherId: timetables.teacherId,
        dayOfWeek: timetables.dayOfWeek,
        startTime: timetables.startTime,
        endTime: timetables.endTime,
        room: timetables.room,
        createdAt: timetables.createdAt,
        className: classes.name,
        subjectName: subjects.name,
        subjectCode: subjects.code,
      })
      .from(timetables)
      .leftJoin(classes, eq(timetables.classId, classes.id))
      .leftJoin(subjects, eq(timetables.subjectId, subjects.id));

    const rawSlots = classIdFilter
      ? (await query.where(eq(timetables.classId, classIdFilter))).sort((a, b) => a.dayOfWeek - b.dayOfWeek)
      : await query.orderBy(timetables.dayOfWeek, timetables.startTime);

    const teacherMap = new Map(allTeachersData.map((t) => [t.id, t.name]));
    const classMap = new Map(allClasses.map((c) => [c.id, c.name]));

    const enrichedSlots = rawSlots.map((slot) => ({
      ...slot,
      teacherName: slot.teacherId ? teacherMap.get(slot.teacherId) || "Faculty" : "Unassigned",
    }));

    // 3. Fetch all exams
    const rawExams = await db
      .select({
        id: exams.id,
        examType: exams.examType,
        subjectId: exams.subjectId,
        date: exams.date,
        startTime: exams.startTime,
        endTime: exams.endTime,
        room: exams.room,
        instructions: exams.instructions,
        createdAt: exams.createdAt,
        subjectName: subjects.name,
        subjectCode: subjects.code,
      })
      .from(exams)
      .leftJoin(subjects, eq(exams.subjectId, subjects.id))
      .orderBy(exams.date, exams.startTime);

    return {
      classes: allClasses,
      subjects: allSubjects,
      teachers: allTeachersData,
      timetableSlots: enrichedSlots,
      exams: rawExams,
      activeClassName: classIdFilter ? classMap.get(classIdFilter) || null : null,
    };
  } catch (err) {
    console.error("Failed to fetch timetable data:", err);
    return {
      classes: [],
      subjects: [],
      teachers: [],
      timetableSlots: [],
      exams: [],
      activeClassName: null,
    };
  }
}

export async function addTimetableSlotAction(data: AddTimetableSlotData) {
  try {
    await assertAdmin();

    if (!data.classId || !data.subjectId || !data.startTime || !data.endTime || !data.room) {
      return { success: false, error: "Class, Subject, Day, Timings, and Room are required." };
    }

    const [newSlot] = await db
      .insert(timetables)
      .values({
        classId: data.classId,
        subjectId: data.subjectId,
        teacherId: data.teacherId || null,
        dayOfWeek: Number(data.dayOfWeek) || 1,
        startTime: data.startTime.trim(),
        endTime: data.endTime.trim(),
        room: data.room.trim(),
      })
      .returning();

    try {
      revalidatePath("/admin/timetable");
      revalidatePath("/student/timetable");
      revalidatePath("/student/dashboard");
    } catch {}

    return { success: true, slot: newSlot };
  } catch (err: unknown) {
    return {
      success: false,
      error: formatErrorMessage(err, "Failed to create timetable slot."),
    };
  }
}

export async function deleteTimetableSlotAction(slotId: string) {
  try {
    await assertAdmin();
    await db.delete(timetables).where(eq(timetables.id, slotId));
    try {
      revalidatePath("/admin/timetable");
      revalidatePath("/student/timetable");
      revalidatePath("/student/dashboard");
    } catch {}
    return { success: true };
  } catch (err: unknown) {
    return {
      success: false,
      error: formatErrorMessage(err, "Failed to delete slot."),
    };
  }
}

export async function addExamAction(data: AddExamData) {
  try {
    await assertTeacherOrAdmin();

    if (!data.examType || !data.subjectId || !data.date || !data.startTime || !data.endTime || !data.room) {
      return { success: false, error: "All required exam details must be provided." };
    }

    const [newExam] = await db
      .insert(exams)
      .values({
        examType: data.examType.trim(),
        subjectId: data.subjectId,
        date: data.date.trim(),
        startTime: data.startTime.trim(),
        endTime: data.endTime.trim(),
        room: data.room.trim(),
        instructions: data.instructions ? data.instructions.trim() : null,
      })
      .returning();

    try {
      revalidatePath("/admin/timetable");
      revalidatePath("/student/exams");
      revalidatePath("/student/dashboard");
    } catch {}

    return { success: true, exam: newExam };
  } catch (err: unknown) {
    return {
      success: false,
      error: formatErrorMessage(err, "Failed to schedule exam."),
    };
  }
}

export async function deleteExamAction(examId: string) {
  try {
    await assertAdmin();
    await db.delete(exams).where(eq(exams.id, examId));
    try {
      revalidatePath("/admin/timetable");
      revalidatePath("/student/exams");
    } catch {}
    return { success: true };
  } catch (err: unknown) {
    return {
      success: false,
      error: formatErrorMessage(err, "Failed to delete exam."),
    };
  }
}
