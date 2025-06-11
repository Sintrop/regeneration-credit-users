import { rcImpactContract } from "../contracts/rcImpactToken";

export async function getBioPerToken(): Promise<number> {
  const response = await rcImpactContract.methods.biodiversityPerToken().call() as string;
  const parseEthers = parseFloat(String(response).replace('n', '')) / 10 ** 14
  return parseEthers;
}
