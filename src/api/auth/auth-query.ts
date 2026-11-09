import { useMutation } from "@tanstack/react-query";
import { postLoginQuery } from "./auth-api";

export const usePostLoginQuery = () => {
  const mutation = useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      const response = await postLoginQuery(data.email, data.password);
      return response;
    },
  });

  return mutation;
};
