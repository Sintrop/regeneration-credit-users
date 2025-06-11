import { supporterContract } from "../contracts/supporter";

export async function getCalculatorCertificates(address: string, id: number): Promise<number> {
  const response = await supporterContract.methods.calculatorItemCertificates(address, id).call();
  const parseEthers = parseFloat(String(response).replace('n', '')) / 10 ** 18
  return parseEthers;
}
