import { useLazyQuery, useMutation, useSubscription } from "@apollo/client/react";
import type { GetListMessageResponse, MessageAddedPayload, PostMessageResponse } from "../types/index";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store";
import { POST_MESSAGE_MUTATION } from "../mutations/message";
import { GET_LIST_MESSAGE_QUERY } from "../querys/message";
import { MESSAGE_ADDED_SUBSCRIPTION } from "../subscriptions/message";
export const usePostMessage = () => {
  const [postMessageMutation, { data, loading, error }] = useMutation<PostMessageResponse>(POST_MESSAGE_MUTATION);
  const token = useSelector((state: RootState) => state.user.token);
  const postMessage = async (content: string, receiverId: string) => {
    try {
      const response = await postMessageMutation({
        variables: { content, receiverId },
        context: {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        },
      });
      return response.data?.postMessage;
    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("Something went wrong");
        // console.error("Register mutation failed:", err);
      }
      throw err;
    }
  };

  return { postMessage, data, loading, error };
};

export const useGetMessageList = () => {
  const token = useSelector((state: RootState) => state.user.token);
  const [loadMessages, { data, loading, error }] = useLazyQuery<GetListMessageResponse>(GET_LIST_MESSAGE_QUERY, {
    fetchPolicy: "network-only",
  });

  const getMessageList = async (receiverId: string) => {
    loadMessages({
      variables: { receiverId },
      context: {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      },
    });
  };

  return { getMessageList, data: data?.getListMessage, loading, error };
};
export const useMessageAdded = (receiverId: string) => {
  const { data, loading, error } = useSubscription<MessageAddedPayload>(MESSAGE_ADDED_SUBSCRIPTION, {
    variables: { receiverId },
    // skip: !receiverId,
  });

  // data.messageAdded chính là message mới được push về
  return {
    data: data?.messageAdded,
    loading,
    error,
  };
};
