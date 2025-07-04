import { regeneratorContract } from "../contracts/regenerator";

export async function getDescription(address: string): Promise<string> {
  const response = await regeneratorContract.methods.projectDescriptions(address).call() as string;
  return response;
}
