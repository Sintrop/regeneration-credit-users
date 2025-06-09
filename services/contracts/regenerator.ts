import Web3 from "web3";

import RegeneratorAbi from '@/data/abis/RegeneratorRules.json'

const provider = new Web3(process.env.NEXT_APP_RPC_URL);
export const regeneratorContract = new provider.eth.Contract(RegeneratorAbi.abi, process.env.NEXT_APP_REGENERATOR_ADDRESS);