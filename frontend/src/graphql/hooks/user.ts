import { useMutation } from "@apollo/client/react";
import { LOGIN_MUTATION, REGISTER_MUTATION } from "../mutations/user";
import toast from "react-hot-toast";

interface RegisterResponse {
  register: {
    user: {
      id: string;
      username: string;
    };
  };
}
export const useRegister = () => {
  const [registerMutation, { data, loading, error }] = useMutation<RegisterResponse>(REGISTER_MUTATION);

  const register = async (username: string, password: string) => {
    try {
      const response = await registerMutation({
        variables: { username, password },
      });
      return response.data?.register;
    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message);
        // console.error("Register mutation failed:", err.message);
      } else {
        toast.error("Something went wrong");
        // console.error("Register mutation failed:", err);
      }
      throw err;
    }
  };

  return { register, data, loading, error };
};

interface LoginResponse {
  login: {
    token: string;
    user: {
      id: string;
      username: string;
    };
  };
}
export const useLogin = () => {
  const [loginMuation, { data, loading, error }] = useMutation<LoginResponse>(LOGIN_MUTATION);
  const login = async (username: string, password: string) => {
    const response = await loginMuation({ variables: { username, password } });
    return response.data?.login;
  };

  return { login, data, loading, error };
};
