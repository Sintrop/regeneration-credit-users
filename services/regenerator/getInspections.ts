import { InspectionProps } from "@/types/inspection";
import { inspectionContract } from "../contracts/inspection";
import { getInspection } from "./getInspection";

export async function getInspections(address: string): Promise<InspectionProps[]> {
  const response = await inspectionContract.methods.getInspectionsHistory(address).call() as string[];

  const inspections: InspectionProps[] = [];  
  
  for (let i = 0; i < response.length; i++) {
    const inspection = await getInspection(parseInt(response[i]))
    inspections.push(inspection);
  }

  return inspections.reverse();
}
