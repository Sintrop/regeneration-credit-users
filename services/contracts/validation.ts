import Web3 from "web3";

import ValidationAbi from '@/data/abis/ValidationRules.json'

const provider = new Web3(process.env.NEXT_PUBLIC_RPC_URL);
export const validationContract = new provider.eth.Contract(ValidationAbi.abi, process.env.NEXT_PUBLIC_VALIDATION_ADDRESS);