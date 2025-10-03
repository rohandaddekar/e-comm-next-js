import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BsThreeDotsVertical } from "react-icons/bs";
import Link from "next/link";
import { ADMIN_MEDIA_EDIT } from "@/routes/admin";
import { MdOutlineEdit } from "react-icons/md";
import { IoIosLink } from "react-icons/io";
import { LuTrash } from "react-icons/lu";
import toast from "react-hot-toast";

export interface IMedia {
  _id: string;
  secure_url: string;
  alt: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

interface MediaProps {
  media: IMedia;
  onDelete: (id: string) => void;
  deleteType: "SD" | "PD" | "RSD";
  selectedMedia: string[];
  setSelectedMedia: (ids: string[]) => void;
}

const Media: React.FC<MediaProps> = ({
  media,
  onDelete,
  deleteType,
  selectedMedia,
  setSelectedMedia,
}) => {
  const handleCheck = () => {
    let newSelectedMedia = [];

    if (selectedMedia.includes(media._id)) {
      newSelectedMedia = selectedMedia.filter((id) => id !== media._id);
    } else {
      newSelectedMedia = [...selectedMedia, media._id];
    }

    setSelectedMedia(newSelectedMedia);
  };

  const handleCopyLink = async (link: string) => {
    await navigator.clipboard.writeText(link);
    toast.success("Link Copied to Clipboard");
  };

  return (
    <div className="border border-gray-200 dark:border-gray-800 relative group rounded overflow-hidden">
      <div className="absolute top-2 left-2 z-20">
        <Checkbox
          checked={selectedMedia?.includes(media._id)}
          onCheckedChange={handleCheck}
          className="border-primary cursor-pointer"
        />
      </div>
      <div className="absolute top-2 right-2 z-20">
        <DropdownMenu>
          <DropdownMenuTrigger>
            <span className="w-7 h-7 flex items-center justify-center rounded-full bg-black/50 cursor-pointer hover:bg-black/60 transition">
              <BsThreeDotsVertical color="#FFFFFF" />
            </span>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {deleteType === "SD" && (
              <>
                <DropdownMenuItem asChild>
                  <Link href={ADMIN_MEDIA_EDIT(media._id)}>
                    <MdOutlineEdit /> Edit
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleCopyLink(media.secure_url)}
                >
                  <IoIosLink /> Copy Link
                </DropdownMenuItem>
              </>
            )}

            <DropdownMenuItem>
              <LuTrash color="red" />{" "}
              {deleteType === "SD" ? "Move Into Trash" : "Delete Permanently"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="w-full h-full absolute z-10 transition-all duration-150 ease-in group-hover:bg-black/30"></div>
      <div className="">
        <Image
          src={media?.secure_url}
          alt={media?.alt}
          height={300}
          width={300}
          className="object-cover w-full sm:h-[200px] h-[150px]"
        />
      </div>
    </div>
  );
};

export default Media;
