export type ExerciseType = "strength" | "cardio" | "stretch" | "other";
export type RoutineSchedule = "morning" | "afternoon" | "evening" | "any";
export type ExerciseLogStatus = "completed" | "skipped" | "partially_completed";

export interface ExerciseMetrics {
  sets?: number | string;
  reps?: number | string;
  weight?: number | string;
  duration?: number;
  distance?: number;
}

export interface Exercise {
  id: string;
  name: string;
  type: ExerciseType;
  metrics: ExerciseMetrics;
  urlVideo?: string;
}

export interface Routine {
  id: string;
  name: string;
  days: string[];
  schedule: RoutineSchedule;
  exercises: Exercise[];
}

export interface ExerciseLog {
  exerciseId: string;
  name: string;
  type: ExerciseType;
  plannedMetrics: ExerciseMetrics;
  actualMetrics: ExerciseMetrics;
  status: ExerciseLogStatus;
}

export interface WorkoutSession {
  id: string;
  routineId: string | null;
  routineName: string;
  startedAt: string;
  completedAt: string;
  duration: number;
  exercisesLogged: ExerciseLog[];
  notes?: string;
}

export type NewExerciseData = Omit<Exercise, "id">;
export type UpdateRoutineData = Partial<Omit<Routine, "id" | "exercises">>;
export type UpdateExerciseData = Partial<Omit<Exercise, "id">>;
