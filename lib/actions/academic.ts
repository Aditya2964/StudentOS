"use server";

import { db } from "@/lib/db";
import { semesters, classes, subjects } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export interface AddSemesterData {
  name: string;
  academicYear: string;
  startDate: string;
  endDate: string;
  isCurrent?: boolean;
}

export interface AddClassData {
  name: string;
  department: string;
  semesterId?: string;
}

export interface AddSubjectData {
  name: string;
  code: string;
  credits: number;
  semesterId?: string;
}

export async function getAcademicData() {
  try {
    const allSemesters = await db.select().from(semesters).orderBy(desc(semesters.createdAt));
    const allClasses = await db.select().from(classes).orderBy(desc(classes.createdAt));
    const allSubjects = await db.select().from(subjects).orderBy(desc(subjects.createdAt));

    const semesterMap = new Map(allSemesters.map((s) => [s.id, s.name]));

    const enrichedClasses = allClasses.map((c) => ({
      ...c,
      semesterName: c.semesterId ? semesterMap.get(c.semesterId) || null : null,
    }));

    const enrichedSubjects = allSubjects.map((s) => ({
      ...s,
      semesterName: s.semesterId ? semesterMap.get(s.semesterId) || null : null,
    }));

    return {
      semesters: allSemesters,
      classes: enrichedClasses,
      subjects: enrichedSubjects,
    };
  } catch (err) {
    console.error("Failed to fetch academic data:", err);
    return {
      semesters: [],
      classes: [],
      subjects: [],
    };
  }
}

export async function addSemesterAction(data: AddSemesterData) {
  try {
    if (!data.name || !data.academicYear || !data.startDate || !data.endDate) {
      return { success: false, error: "All semester fields are required." };
    }

    if (data.isCurrent) {
      // Unset previous current semesters if this one is current
      await db.update(semesters).set({ isCurrent: false });
    }

    const [newSemester] = await db
      .insert(semesters)
      .values({
        name: data.name.trim(),
        academicYear: data.academicYear.trim(),
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        isCurrent: Boolean(data.isCurrent),
      })
      .returning();

    try {
      revalidatePath("/admin/academic");
      revalidatePath("/admin/timetable");
    } catch {}

    return { success: true, semester: newSemester };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to create semester.",
    };
  }
}

export async function addClassAction(data: AddClassData) {
  try {
    if (!data.name || !data.department) {
      return { success: false, error: "Class name and department are required." };
    }

    const [newClass] = await db
      .insert(classes)
      .values({
        name: data.name.trim(),
        department: data.department.trim(),
        semesterId: data.semesterId || null,
      })
      .returning();

    try {
      revalidatePath("/admin/academic");
      revalidatePath("/admin/timetable");
    } catch {}

    return { success: true, class: newClass };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to create class.",
    };
  }
}

export async function addSubjectAction(data: AddSubjectData) {
  try {
    if (!data.name || !data.code) {
      return { success: false, error: "Subject name and code are required." };
    }

    const [newSubject] = await db
      .insert(subjects)
      .values({
        name: data.name.trim(),
        code: data.code.trim().toUpperCase(),
        credits: Number(data.credits) || 3,
        semesterId: data.semesterId || null,
      })
      .returning();

    try {
      revalidatePath("/admin/academic");
      revalidatePath("/admin/timetable");
      revalidatePath("/student/timetable");
    } catch {}

    return { success: true, subject: newSubject };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to create subject. (Check if code is unique)",
    };
  }
}

export async function deleteSubjectAction(subjectId: string) {
  try {
    await db.delete(subjects).where(eq(subjects.id, subjectId));
    try {
      revalidatePath("/admin/academic");
    } catch {}
    return { success: true };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to delete subject.",
    };
  }
}

export async function deleteClassAction(classId: string) {
  try {
    await db.delete(classes).where(eq(classes.id, classId));
    try {
      revalidatePath("/admin/academic");
    } catch {}
    return { success: true };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to delete class.",
    };
  }
}

export async function deleteSemesterAction(semesterId: string) {
  try {
    await db.delete(semesters).where(eq(semesters.id, semesterId));
    try {
      revalidatePath("/admin/academic");
    } catch {}
    return { success: true };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to delete semester.",
    };
  }
}
