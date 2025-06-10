import { communityContract } from "../contracts/community";
import { DelationProps } from "@/types/user";

export async function getDelations(address: string): Promise<DelationProps[]> {
  const response = await communityContract.methods.getUserDelations(address).call() as DelationProps[];
  return response;
}

