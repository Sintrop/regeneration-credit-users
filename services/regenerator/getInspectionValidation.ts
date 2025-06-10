import { ValidationProps } from "@/types/validation";
import { validationContract } from "../contracts/validation";

export async function getInspectionValidation(inspectionId: number, position: number): Promise<ValidationProps> {
  const response = await validationContract.methods.inspectionValidations(inspectionId, position).call() as ValidationProps;
  return response;
}
