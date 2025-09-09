import { communityContract } from "../contracts/community";

interface ReturnGetUserProps {
  success: boolean
  userType: number
}
export async function getUser(address: string): Promise<ReturnGetUserProps> {
  try {
    const response = await communityContract.methods.getUser(address).call() as string;
    return {
      success: true,
      userType: parseInt(String(response).replace('n', ''))
    }
  } catch (e) {
    console.log(e)
    return {
      success: false,
      userType: 0
    }
  }
}
