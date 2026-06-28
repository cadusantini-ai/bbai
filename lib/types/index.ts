import { Timestamp } from "firebase/firestore";

export interface BaseDocument {
  id?: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

// Auth
export interface UserProfile extends BaseDocument {
  uid: string;
  displayName: string;
  email: string;
  photoURL?: string;
  dateOfBirth?: string;
  gender?: "male" | "female" | "other";
  heightCm?: number;
  weightKg?: number;
  goal?: "health" | "fitness" | "bodybuilding" | "weight_loss" | "other";
}

// Nutrition
export interface Meal extends BaseDocument {
  name: string;
  date: string;
  time: string;
  type: "breakfast" | "lunch" | "dinner" | "snack" | "pre_workout" | "post_workout";
  foods: FoodItem[];
  notes?: string;
}

export interface FoodItem {
  name: string;
  quantity: number;
  unit: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

// Training
export interface Workout extends BaseDocument {
  name: string;
  date: string;
  duration: number;
  type: "strength" | "cardio" | "flexibility" | "sport" | "other";
  exercises: Exercise[];
  notes?: string;
  rating?: 1 | 2 | 3 | 4 | 5;
}

export interface Exercise {
  name: string;
  muscleGroup?: string;
  sets: ExerciseSet[];
  notes?: string;
}

export interface ExerciseSet {
  reps?: number;
  weight?: number;
  duration?: number;
  distance?: number;
  rpe?: number;
}

// Medical
export interface Appointment extends BaseDocument {
  doctor: string;
  specialty: string;
  date: string;
  time: string;
  location?: string;
  status: "scheduled" | "completed" | "cancelled";
  notes?: string;
  attachments?: string[];
}

// Medications
export interface Medication extends BaseDocument {
  name: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate?: string;
  times: string[];
  notes?: string;
  active: boolean;
}

// Treatments
export interface Treatment extends BaseDocument {
  name: string;
  type: "medical" | "cycle" | "supplement_protocol" | "therapy" | "other";
  startDate: string;
  endDate?: string;
  description: string;
  items: TreatmentItem[];
  notes?: string;
  active: boolean;
}

export interface TreatmentItem {
  name: string;
  dosage: string;
  frequency: string;
  duration?: string;
}

// Goals
export interface Goal extends BaseDocument {
  title: string;
  description?: string;
  category: "weight" | "strength" | "nutrition" | "health" | "performance" | "other";
  targetValue?: number;
  currentValue?: number;
  unit?: string;
  targetDate?: string;
  status: "active" | "completed" | "paused" | "cancelled";
}

// Vaccines
export interface Vaccine extends BaseDocument {
  name: string;
  date: string;
  nextDose?: string;
  location?: string;
  batch?: string;
  notes?: string;
}

// Health Events
export interface HealthEvent extends BaseDocument {
  title: string;
  type:
    | "illness"
    | "menstrual"
    | "injury"
    | "surgery"
    | "exam"
    | "lab_result"
    | "other";
  date: string;
  endDate?: string;
  description?: string;
  severity?: "low" | "medium" | "high";
  notes?: string;
  attachments?: string[];
}

// Exams
export type ExamStatus = "uploading" | "processing" | "done" | "error";
export type ExamCategory =
  | "hematologia"
  | "bioquimica"
  | "hormonal"
  | "hepatica"
  | "renal"
  | "urina"
  | "imagem"
  | "outros";
export type MarkerStatus = "normal" | "alto" | "baixo" | "desconhecido";

export interface Exam extends BaseDocument {
  fileName: string;
  filePath: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
  status: ExamStatus;
  examDate: string | null;
  labName: string | null;
  category: ExamCategory | null;
  markerCount: number;
  errorMessage: string | null;
  extractedAt: Timestamp | null;
}

export interface ExamMarker extends BaseDocument {
  examId: string;
  examDate: string;
  labName: string;
  category: ExamCategory;
  marker: string;
  markerRaw: string;
  value: number;
  unit: string;
  referenceMin: number | null;
  referenceMax: number | null;
  status: MarkerStatus;
}

// Sleep
export interface SleepLog extends BaseDocument {
  date: string;
  bedtime: string;
  wakeTime: string;
  duration: number;
  quality: 1 | 2 | 3 | 4 | 5;
  notes?: string;
  factors?: string[];
}
