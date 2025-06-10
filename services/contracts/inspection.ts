import Web3 from "web3";

import InspectionAbi from '@/data/abis/InspectionRules.json'

const provider = new Web3(process.env.NEXT_PUBLIC_RPC_URL);
export const inspectionContract = new provider.eth.Contract(InspectionAbi.abi, process.env.NEXT_PUBLIC_INSPECTION_ADDRESS);