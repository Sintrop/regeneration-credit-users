import { CalculatorItemProps } from "@/types/researcher";
import { researcherContract } from "../contracts/researcher";

export async function getCalculatorItem(id: number): Promise<CalculatorItemProps> {
  const response = await researcherContract.methods.getCalculatorItem(id).call() as CalculatorItemProps;
  
  const data: CalculatorItemProps = {
    id: parseInt(String(response.id).replace('n', '')),
    createdBy: response.createdBy,
    justification: response.justification,
    title: response.title,
    carbonImpact: parseInt(String(response.carbonImpact).replace('n', '')),
    unit: response.unit
  }

  return data;
}
