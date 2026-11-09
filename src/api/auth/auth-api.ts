import { API_URLS } from "@/constants/API_URLS";
import { IUserData } from "@/interface/user.interface";
import axiosInstance from "@/lib/axios";

export const postLoginQuery = async (
  email: string,
  password: string,
): Promise<IUserData> => {
  const response = await axiosInstance.post(API_URLS.LOGIN, {
    email,
    password,
  });
  return response.data;
};
