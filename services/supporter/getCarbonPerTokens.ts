import { rcImpactContract } from "../contracts/rcImpactToken";

export async function getCarbonPerToken(): Promise<number> {
  const response = await rcImpactContract.methods.carbonPerToken().call() as string;
  const parseEthers = parseFloat(String(response).replace('n', '')) / 10 ** 14
  return parseEthers;
}
