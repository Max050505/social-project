import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { registerUser, signInUser, singOutUser } from "./authService";
import { currentUser } from "./authService";
export const queryClient = new QueryClient();

export const userRegister = () => {
  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      registerUser(email, password),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["currentUser"] }),
  });
};

export const loginUser = () => {
  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      signInUser(email, password),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["currentUser"] }),
  });
};

export const logOut = () => {
  return useMutation({
    mutationFn: () => singOutUser(),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["currentUser"] }),
  });
};

export const useCurrentUser = () => useQuery({
  queryKey:['currentUser'],
  queryFn: currentUser,
})
