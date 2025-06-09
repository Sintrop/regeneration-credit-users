import { RegeneratorProps } from "@/types/regenerator";
import { regeneratorContract } from "../contracts/regenerator";

export async function getRegenerator(address: string): Promise<RegeneratorProps> {
  const response = await regeneratorContract.methods.getRegenerator(address).call() as RegeneratorProps;

  const data: RegeneratorProps = {
    id: parseInt(String(response.id).replace('n', '')),
    coordinatesCount: parseInt(String(response.coordinatesCount).replace('n', '')),
    createdAt: parseInt(String(response.createdAt).replace('n', '')),
    lastRequestAt: parseInt(String(response.lastRequestAt).replace('n', '')),
    name: response.name,
    pendingInspection: response.pendingInspection,
    proofPhoto: response.proofPhoto,
    pool: {
      currentEra: parseInt(String(response.pool.currentEra).replace('n', '')),
      onContractPool: response.pool.onContractPool
    },
    regenerationScore: {
      score: parseInt(String(response.regenerationScore.score).replace('n', '')),
    },
    regeneratorWallet: response.regeneratorWallet,
    totalArea: parseInt(String(response.totalArea).replace('n', '')),
    totalInspections: parseInt(String(response.totalInspections).replace('n', ''))
  }
  
  return data;
}
