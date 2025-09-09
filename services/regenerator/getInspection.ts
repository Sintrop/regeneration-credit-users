import { InspectionProps } from "@/types/inspection";
import { inspectionContract } from "../contracts/inspection";

export async function getInspection(inspectionId: number): Promise<InspectionProps> {
  const response = await inspectionContract.methods.getInspection(inspectionId).call() as InspectionProps;

  const data: InspectionProps = {
    id: parseInt(String(response.id).replace('n', '')),
    acceptedAt: parseInt(String(response.acceptedAt).replace('n', '')),
    biodiversityResult: parseInt(String(response.biodiversityResult).replace('n', '')),
    createdAt: parseInt(String(response.createdAt).replace('n', '')),
    inspectedAt: parseInt(String(response.inspectedAt).replace('n', '')),
    inspectedAtEra: parseInt(String(response.inspectedAtEra).replace('n', '')),
    inspector: response.inspector,
    invalidatedAt: parseInt(String(response.invalidatedAt).replace('n', '')),
    proofPhotos: response.proofPhotos,
    regenerationScore: parseInt(String(response.regenerationScore).replace('n', '')),
    regenerator: response.regenerator,
    justificationReport: response.justificationReport,
    status: parseInt(String(response.status).replace('n', '')),
    treesResult: parseInt(String(response.treesResult).replace('n', '')),
    validationsCount: parseInt(String(response.validationsCount).replace('n', ''))
  }

  return data;
}
