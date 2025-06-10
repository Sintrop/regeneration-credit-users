import Web3 from "web3";

import SupporterAbi from '@/data/abis/SupporterRules.json'

const provider = new Web3(process.env.NEXT_PUBLIC_RPC_URL);
export const supporterContract = new provider.eth.Contract(SupporterAbi.abi, process.env.NEXT_PUBLIC_SUPPORTER_ADDRESS);