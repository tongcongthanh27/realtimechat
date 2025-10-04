import { useLazyQuery, useMutation } from "@apollo/client/react";
import type { CreateRoomResponse, GetListRoomResponse } from "../types/index";
import { CREATE_ROOM_MUTATION } from "../mutations/room";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store";
import { GET_LIST_ROOM_QUERY } from "../querys/room";

export const useCreateRoom = () => {
  const [createRoomMutation, { data, loading, error }] = useMutation<CreateRoomResponse>(CREATE_ROOM_MUTATION);
  const token = useSelector((state: RootState) => state.user.token);
  const createRoom = async (name: string, memberIds: string[]) => {
    try {
      const response = await createRoomMutation({
        variables: { name, memberIds },
        context: {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        },
      });
      return response.data?.createRoom;
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

  return { createRoom, data, loading, error };
};

export const useGetRoomList = (receiverId: string) => {
  const token = useSelector((state: RootState) => state.user.token);
  const [loadRooms, { data, loading, error }] = useLazyQuery<GetListRoomResponse>(GET_LIST_ROOM_QUERY, {
    fetchPolicy: "network-only",
  });

  const getRoomList = async () => {
    loadRooms({
      variables: { receiverId },
      context: {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      },
    });
  };

  return { getRoomList, data: data?.getListRoom, loading, error };
};
