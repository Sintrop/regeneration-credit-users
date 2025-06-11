import { rcImpactContract } from "../contracts/rcImpactToken";

export async function getTreesPerToken(): Promise<number> {
  const response = await rcImpactContract.methods.treesPerToken().call() as string;
  const parseEthers = parseFloat(String(response).replace('n', '')) / 10 ** 14
  return parseEthers;
}
