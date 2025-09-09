import { rcImpactContract } from "../contracts/rcImpactToken";

export async function getAreaPerToken(): Promise<number> {
  const response = await rcImpactContract.methods.areaPerToken().call() as string;
  const parseEthers = parseFloat(String(response).replace('n', '')) / 10 ** 18
  return parseEthers;
}
