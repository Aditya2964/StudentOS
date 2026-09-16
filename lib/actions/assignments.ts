"use server";

export interface AssignmentData {
  id: string;
  title: string;
  description: string;
  subjectName: string;
  subjectCode: string;
  deadline: string; // ISO string
  maxMarks: number;
  status: "NOT_STARTED" | "DUE_SOON" | "SUBMITTED" | "OVERDUE";
  submittedAt?: string;
  grade?: number;
}

export async function getStudentAssignments(subjectFilter?: string): Promise<AssignmentData[]> {
  // Mock data for development verification
  const allAssignments: AssignmentData[] = [
    {
      id: "asgn-1",
      title: "DBMS Relational Algebra & ER Diagrams",
      description: "Complete Problem Set 3 covering ER to relational schema mapping and normalization rules.",
      subjectName: "Database Management Systems",
      subjectCode: "CS501",
      deadline: "2026-08-15T23:59:00Z",
      maxMarks: 100,
      status: "DUE_SOON",
    },
    {
      id: "asgn-2",
      title: "Operating Systems Process Synchronization",
      description: "Implement Producer-Consumer and Readers-Writers synchronization problem solutions in C/C++.",
      subjectName: "Operating Systems",
      subjectCode: "CS502",
      deadline: "2026-08-18T23:59:00Z",
      maxMarks: 50,
      status: "NOT_STARTED",
    },
    {
      id: "asgn-3",
      title: "Computer Networks Packet Sniffing Lab",
      description: "Analyze Wireshark PCAP files and write down packet header breakdown for TCP 3-way handshake.",
      subjectName: "Computer Networks",
      subjectCode: "CS503",
      deadline: "2026-08-10T23:59:00Z",
      maxMarks: 100,
      status: "SUBMITTED",
      submittedAt: "2026-08-09T16:20:00Z",
      grade: 92,
    },
  ];

  if (subjectFilter && subjectFilter !== "ALL") {
    return allAssignments.filter((a) => a.subjectCode === subjectFilter);
  }

  return allAssignments;
}

export async function submitStudentAssignment(assignmentId: string, fileKey: string) {
  // Simulated assignment submission action
  console.log(`Submitting assignment ${assignmentId} with file ${fileKey}`);
  return { success: true, submittedAt: new Date().toISOString() };
}
