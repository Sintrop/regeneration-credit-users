import { regeneratorContract } from "../contracts/regenerator";

export async function getProjectDescription(address: string): Promise<string> {
  const response = await regeneratorContract.methods.projectDescriptions(address).call() as string;
  return response;
}
