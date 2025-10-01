import { AiOutlineLogout } from "react-icons/ai";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useState } from "react";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { logout } from "@/store/slices/authSlice";
import { useRouter } from "next/navigation";
import { APP_LOGIN } from "@/routes/app";

const LogoutButton = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      setLoading(true);

      const { data } = await axios.post("/api/auth/logout", {});

      if (!data?.success) throw new Error(data?.message || "Logout failed");

      dispatch(logout());
      router.push(APP_LOGIN);

      toast.success(data?.message || "Logout successful!");
    } catch (error: unknown) {
      console.error("Logout error: ", error);

      const axiosError = error as AxiosError<{ message: string }>;
      toast.error(axiosError?.response?.data?.message || "Logout failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DropdownMenuItem
      className="cursor-pointer"
      onClick={handleLogout}
      disabled={loading}
    >
      <AiOutlineLogout color="red" />
      Logout
    </DropdownMenuItem>
  );
};

export default LogoutButton;
