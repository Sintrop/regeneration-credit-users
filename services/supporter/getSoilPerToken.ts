import { rcImpactContract } from "../contracts/rcImpactToken";

export async function getSoilPerToken(): Promise<number> {
  const response = await rcImpactContract.methods.soilPerToken().call() as string;
  const parseEthers = parseFloat(String(response).replace('n', '')) / 10 ** 14
  return parseEthers;
}
