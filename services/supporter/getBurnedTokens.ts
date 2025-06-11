import { rcTokenContract } from "../contracts/rctoken";

export async function getBurnedTokens(address: string): Promise<number> {
  const response = await rcTokenContract.methods.certificate(address).call() as string;
  const parseEthers = parseFloat(String(response).replace('n', '')) / 10 ** 18
  return parseEthers;
}
