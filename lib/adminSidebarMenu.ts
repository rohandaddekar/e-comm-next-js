import { AiOutlineDashboard } from "react-icons/ai";
import { BiCategory } from "react-icons/bi";
import { IoShirtOutline } from "react-icons/io5";
import { MdOutlineShoppingBag } from "react-icons/md";
import { LuUserRound } from "react-icons/lu";
import { IoMdStarOutline } from "react-icons/io";
import { MdOutlinePermMedia } from "react-icons/md";
import { RiCoupon2Line } from "react-icons/ri";
import { ADMIN_DASHBOARD } from "@/routes/admin";

interface AdminSidebarMenuItem {
  title: string;
  url: string;
  icon: React.ComponentType;
  subMenu?: {
    title: string;
    url: string;
  }[];
}

export const adminSidebarMenu: AdminSidebarMenuItem[] = [
  {
    title: "Dashboard",
    url: ADMIN_DASHBOARD,
    icon: AiOutlineDashboard,
  },
  {
    title: "Category",
    url: "#",
    icon: BiCategory,
    subMenu: [
      {
        title: "Add Category",
        url: "#",
      },
      {
        title: "All Category",
        url: "#",
      },
    ],
  },
  {
    title: "Products",
    url: "#",
    icon: IoShirtOutline,
    subMenu: [
      {
        title: "Add Product",
        url: "#",
      },
      {
        title: "All Variant",
        url: "#",
      },
      {
        title: "All Products",
        url: "#",
      },
      {
        title: "Product Variants",
        url: "#",
      },
    ],
  },
  {
    title: "Coupons",
    url: "#",
    icon: RiCoupon2Line,
    subMenu: [
      {
        title: "Add Coupon",
        url: "#",
      },
      {
        title: "All Coupons",
        url: "#",
      },
    ],
  },
  {
    title: "Orders",
    url: "#",
    icon: MdOutlineShoppingBag,
  },
  {
    title: "Customers",
    url: "#",
    icon: LuUserRound,
  },
  {
    title: "Rating & Reviews",
    url: "#",
    icon: IoMdStarOutline,
  },
  {
    title: "Media",
    url: "#",
    icon: MdOutlinePermMedia,
  },
];
