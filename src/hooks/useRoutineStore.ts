import "react-native-get-random-values";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { v4 as uuidv4 } from "uuid";

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

type NewExerciseData = {
  name: string;
  reps: string;
  urlVideo?: string;
};

type UpdateRoutineData = {
  name?: string;
  day?: string;
};

type UpdateExerciseData = {
  name?: string;
  reps?: string;
  urlVideo?: string;
};

interface RoutineState {
  routines: Routine[];
  addRoutine: (name: string, day: string) => void;
  addExerciseToRoutine: (
    routineId: string,
    exerciseData: NewExerciseData
  ) => void;
  deleteRoutine: (routineId: string) => void;
  deleteExercise: (routineId: string, exerciseId: string) => void;
  updateRoutine: (routineId: string, data: UpdateRoutineData) => void;
  updateExercise: (
    routineId: string,
    exerciseId: string,
    data: UpdateExerciseData
  ) => void;
}

export const useRoutineStore = create<RoutineState>()(
  persist(
    (set) => ({
      routines: [],
      addRoutine: (name, day) => {
        const newRoutine: Routine = {
          id: uuidv4(),
          name: name,
          day: day,
          exercises: [],
        };
        set((state) => ({
          routines: [...state.routines, newRoutine],
        }));
      },

      addExerciseToRoutine: (routineId, exerciseData) => {
        const newExercise: Exercise = {
          id: uuidv4(),
          name: exerciseData.name,
          reps: exerciseData.reps,
          urlVideo: exerciseData.urlVideo || "",
        };
        set((state) => ({
          routines: state.routines.map((routine) => {
            if (routine.id === routineId) {
              return {
                ...routine,
                exercises: [...routine.exercises, newExercise],
              };
            }
            return routine;
          }),
        }));
      },

      deleteRoutine: (routineId) => {
        set((state) => ({
          routines: state.routines.filter((r) => r.id !== routineId),
        }));
      },
      deleteExercise: (routineId, exerciseId) => {
        set((state) => ({
          routines: state.routines.map((routine) => {
            if (routine.id === routineId) {
              return {
                ...routine,
                exercises: routine.exercises.filter(
                  (ex) => ex.id !== exerciseId
                ),
              };
            }
            return routine;
          }),
        }));
      },

      updateRoutine: (routineId, data) => {
        set((state) => ({
          routines: state.routines.map((routine) => {
            if (routine.id === routineId) {
              return { ...routine, ...data };
            }
            return routine;
          }),
        }));
      },

      updateExercise: (routineId, exerciseId, data) => {
        set((state) => ({
          routines: state.routines.map((routine) => {
            if (routine.id === routineId) {
              return {
                ...routine,
                exercises: routine.exercises.map((exercise) => {
                  if (exercise.id === exerciseId) {
                    return { ...exercise, ...data };
                  }
                  return exercise;
                }),
              };
            }
            return routine;
          }),
        }));
      },
    }),

    {
      name: "fitflow-routines-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
