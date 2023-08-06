import User from "../model/User";
import GetUserDto from "../features/authentication/dtos/GetUserDto";

export type GetUserValues = (
  email: string,
  getAll?: boolean
) => Promise<User | GetUserDto | undefined>;
