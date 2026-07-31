import { useContext } from "react";
import { TrainingDataContext } from "./TrainingDataContext";

export function useTrainingData() {
  const value = useContext(TrainingDataContext);

  if (value === undefined) {
    throw new Error("useTrainingData must be used within TrainingDataProvider.");
  }

  return value;
}
