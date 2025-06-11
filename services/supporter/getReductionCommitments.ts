import { CalculatorItemProps } from "@/types/researcher";
import { supporterContract } from "../contracts/supporter";
import { getCalculatorItem } from "./getCalculatorItem";

export async function getReductionCommitments(address: string): Promise<CalculatorItemProps[]> {
  const response = await supporterContract.methods.getReductionCommitments(address).call() as string[];
  
  const items: CalculatorItemProps[] = [];

  for (let i = 0; i < response.length; i++) {
    const item = await getCalculatorItem(parseInt(String(response[i]).replace('n', '')))
    items.push(item);
  }

  return items;
}
