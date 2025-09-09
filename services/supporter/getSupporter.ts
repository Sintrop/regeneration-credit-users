import { SupporterProps } from "@/types/supporter";
import { supporterContract } from "../contracts/supporter";

export async function getSupporter(address: string): Promise<SupporterProps> {
  const response = await supporterContract.methods.getSupporter(address).call() as SupporterProps;

  const data: SupporterProps = {
    id: parseInt(String(response.id).replace('n', '')),
    createdAt: parseInt(String(response.createdAt).replace('n', '')),
    name: response.name,
    offsetsCount: parseInt(String(response.offsetsCount).replace('n', '')),
    publicationsCount: parseInt(String(response.publicationsCount).replace('n', '')),
    profilePhoto: response.profilePhoto,
    reductionItemsCount: parseInt(String(response.reductionItemsCount).replace('n', '')),
    supporterWallet: response.supporterWallet,
    description: response.description
  }

  return data;
}
