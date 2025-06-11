import Web3 from "web3";

import RcToken from '@/data/abis/RegenerationCredit.json'

const provider = new Web3(process.env.NEXT_PUBLIC_RPC_URL);
export const rcTokenContract = new provider.eth.Contract(RcToken.abi, process.env.NEXT_PUBLIC_RCTOKEN_ADDRESS);