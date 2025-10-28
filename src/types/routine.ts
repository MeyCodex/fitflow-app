export interface Exercise {
  id: string;
  name: string;
  reps: string;
  urlVideo: string;
}

export interface Routine {
  id: string;
  name: string;
  day: string;
  exercises: Exercise[];
}

export type NewExerciseData = Omit<Exercise, "id">;
export type UpdateRoutineData = Partial<Omit<Routine, "id" | "exercises">>;
export type UpdateExerciseData = Partial<Omit<Exercise, "id">>;
