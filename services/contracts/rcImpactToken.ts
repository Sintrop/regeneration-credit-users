import Web3 from "web3";

import RcTokenImpact from '@/data/abis/RegenerationCreditImpact.json'

const provider = new Web3(process.env.NEXT_PUBLIC_RPC_URL);
export const rcImpactContract = new provider.eth.Contract(RcTokenImpact.abi, process.env.NEXT_PUBLIC_RCIMPACT_ADDRESS);