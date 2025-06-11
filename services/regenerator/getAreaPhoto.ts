import { regeneratorContract } from "../contracts/regenerator";

export async function getAreaPhoto(address: string): Promise<string> {
  const response = await regeneratorContract.methods.areaPhoto(address).call() as string;
  return response;
}
