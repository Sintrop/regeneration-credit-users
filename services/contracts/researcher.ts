import Web3 from "web3";

import Researcher from '@/data/abis/ResearcherRules.json'

const provider = new Web3(process.env.NEXT_PUBLIC_RPC_URL);
export const researcherContract = new provider.eth.Contract(Researcher.abi, process.env.NEXT_PUBLIC_RESEARCHER_ADDRESS);