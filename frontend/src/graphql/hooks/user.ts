import { useLazyQuery, useMutation } from "@apollo/client/react";
import { LOGIN_MUTATION, REGISTER_MUTATION } from "../mutations/user";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store";
import type { ListUserResponse, LoginResponse, RegisterResponse } from "../types/index";
import { GET_LIST_USER_QUERY } from "../querys/user";

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

export const useLogin = () => {
  const [loginMuation, { data, loading, error }] = useMutation<LoginResponse>(LOGIN_MUTATION);
  const login = async (username: string, password: string) => {
    const response = await loginMuation({ variables: { username, password } });
    return response.data?.login;
  };

  return { login, data, loading, error };
};

export const useGetUserList = () => {
  const token = useSelector((state: RootState) => state.user.token);
  const [loadUsers, { data, loading, error }] = useLazyQuery<ListUserResponse>(GET_LIST_USER_QUERY, {
    fetchPolicy: "network-only",
  });

  const getUserList = () => {
    loadUsers({
      context: {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      },
    });
  };

  return { getUserList, data: data?.getListUser, loading, error };
};
