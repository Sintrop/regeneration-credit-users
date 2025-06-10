import Web3 from "web3";

import CommunityAbi from '@/data/abis/CommunityRules.json'

const provider = new Web3(process.env.NEXT_PUBLIC_RPC_URL);
export const communityContract = new provider.eth.Contract(CommunityAbi.abi, process.env.NEXT_PUBLIC_COMMUNITY_ADDRESS);