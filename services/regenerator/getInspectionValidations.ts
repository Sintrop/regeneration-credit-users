import { ValidationProps } from "@/types/validation";
import { getInspectionValidation } from "./getInspectionValidation";

export async function getInspectionValidations(inspectionId: number, validationsCount: number): Promise<ValidationProps[]> {
  if (validationsCount < 1) return [];

  const validations: ValidationProps[] = [];

  for (let i = 0; i < validationsCount; i++) {
    const validation = await getInspectionValidation(inspectionId, i);
    validations.push(validation);
  }
  
  return validations.reverse();
}
