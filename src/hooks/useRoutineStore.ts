import "react-native-get-random-values";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { v4 as uuidv4 } from "uuid";

import {
  Routine,
  Exercise,
  WorkoutSession,
  NewExerciseData,
  UpdateRoutineData,
  UpdateExerciseData,
  RoutineSchedule,
  ExerciseMetrics,
} from "@/src/types/routine";

interface RoutineState {
  routines: Routine[];
  sessions: WorkoutSession[];
  addRoutine: (name: string, days: string[], schedule: RoutineSchedule) => void;
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
  addWorkoutSession: (sessionData: Omit<WorkoutSession, "id">) => void;
}

export const useRoutineStore = create<RoutineState>()(
  persist(
    (set) => ({
      routines: [],
      sessions: [],
      addRoutine: (name, days, schedule) => {
        const newRoutine: Routine = {
          id: uuidv4(),
          name: name,
          days: days,
          schedule: schedule || "any",
          exercises: [],
        };
        set((state) => ({
          routines: [...state.routines, newRoutine],
        }));
      },
      addExerciseToRoutine: (routineId, exerciseData) => {
        const metrics: ExerciseMetrics = exerciseData.metrics || {};

        const newExercise: Exercise = {
          id: uuidv4(),
          name: exerciseData.name,
          type: exerciseData.type || "other",
          metrics: metrics,
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
              const updatedData: Partial<Routine> = {};
              if (data.name !== undefined) updatedData.name = data.name;
              if (data.days !== undefined) updatedData.days = data.days;
              if (data.schedule !== undefined)
                updatedData.schedule = data.schedule;

              return { ...routine, ...updatedData };
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
                    const updatedData: Partial<Exercise> = {};
                    if (data.name !== undefined) updatedData.name = data.name;
                    if (data.type !== undefined) updatedData.type = data.type;
                    if (data.metrics !== undefined)
                      updatedData.metrics = {
                        ...exercise.metrics,
                        ...data.metrics,
                      };
                    if (data.urlVideo !== undefined)
                      updatedData.urlVideo = data.urlVideo;

                    return { ...exercise, ...updatedData };
                  }
                  return exercise;
                }),
              };
            }
            return routine;
          }),
        }));
      },
      addWorkoutSession: (sessionData) => {
        const newSession: WorkoutSession = {
          ...sessionData,
          id: uuidv4(),
        };
        set((state) => ({
          sessions: [...state.sessions, newSession],
        }));
      },
    }),

    {
      name: "fitflow-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
