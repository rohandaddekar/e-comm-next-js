import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";

interface UseDeleteMutation {
  queryKey: string;
  endpoint: string;
}

const useDeleteMutation = ({ queryKey, endpoint }: UseDeleteMutation) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      ids,
      deleteType,
    }: {
      ids: string[];
      deleteType: "SD" | "PD" | "RSD";
    }) => {
      const { data } = await axios({
        url: endpoint,
        method: deleteType === "PD" ? "DELETE" : "PUT",
        data: { ids, deleteType },
      });

      if (!data.success) {
        throw new Error(data.message || "Error occurred during deletion");
      }

      return data;
    },
    onSuccess: (data) => {
      toast.success(data.message || "Media deleted successfully");
      queryClient.invalidateQueries({ queryKey: [queryKey] });
    },
    onError: (error) => {
      toast.error((error as Error).message || "Error occurred during deletion");
    },
  });
};
export default useDeleteMutation;
