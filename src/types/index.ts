
export type UserRole = 'student' | 'teacher' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface Course {
  id: string;
  code: string;
  name: string;
  description: string;
  credits: number;
  teacherId: string;
  teacherName: string;
}

export interface Notice {
  id: string;
  title: string;
  content: string;
  date: string;
  important: boolean;
  author: string;
}

export interface Grade {
  courseId: string;
  courseName: string;
  grade: string;
  score: number;
}

export interface Attendance {
  courseId: string;
  courseName: string;
  attended: number;
  total: number;
  percentage: number;
}

export interface PerformanceData {
  grades: Grade[];
  attendance: Attendance[];
}

export interface CourseContent {
  id: string;
  courseId: string;
  title: string;
  type: 'lecture' | 'assignment' | 'resource';
  content: string;
  date: string;
}

export interface Assignment {
  id: string;
  courseId: string;
  title: string;
  description: string;
  dueDate: string;
  maxScore: number;
}

export interface StudentAssignment {
  id: string;
  assignmentId: string;
  studentId: string;
  submissionDate?: string;
  score?: number;
  feedback?: string;
  status: 'pending' | 'submitted' | 'graded';
}
