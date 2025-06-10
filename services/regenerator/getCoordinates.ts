import { CoordinateProps } from "@/types/regenerator";
import { regeneratorContract } from "../contracts/regenerator";

export async function getCoordinates(address: string): Promise<CoordinateProps[]> {
  const response = await regeneratorContract.methods.getCoordinates(address).call() as CoordinateProps[];

  const coords: CoordinateProps[] = [];

  for (let i = 0; i < response.length; i++) {
    const data: CoordinateProps = {
      latitude: parseFloat(String(response[i].latitude)),
      longitude: parseFloat(String(response[i].longitude))
    }

    coords.push(data);
  }

  return coords;
}
