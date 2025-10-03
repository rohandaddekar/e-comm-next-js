import {
  CldUploadWidget,
  type CloudinaryUploadWidgetResults,
  type CloudinaryUploadWidgetInfo,
} from "next-cloudinary";
import { Button } from "@/components/ui/button";
import { FiPlus } from "react-icons/fi";
import toast from "react-hot-toast";
import axios, { AxiosError } from "axios";
import { useQueryClient } from "@tanstack/react-query";

interface UploadMediaProps {
  isMultiple?: boolean;
  invalidatesQueries?: string[];
}

interface UploadInfo {
  asset_id: string;
  public_id: string;
  secure_url: string;
  path: string;
  thumbnail_url: string;
}

interface ApiResponse {
  success: boolean;
  message: string;
}

// Extend the Cloudinary type with `files`
interface CloudinaryUploadWidgetInfoWithFiles
  extends CloudinaryUploadWidgetInfo {
  files: {
    uploadInfo?: UploadInfo;
  }[];
}

const UploadMedia: React.FC<UploadMediaProps> = ({
  isMultiple = false,
  invalidatesQueries,
}) => {
  const queryClient = useQueryClient();

  const handleOnError = (error: unknown) => {
    if (!error) {
      toast.error("Failed to upload media. Please try again.");
      return;
    }

    const errorMessage =
      typeof error === "string"
        ? error
        : (error as Error).message || "Upload error occurred";
    toast.error(errorMessage);
  };

  const handleOnQueuesEnd = async (results: CloudinaryUploadWidgetResults) => {
    if (!results.info || typeof results.info === "string") return;

    // Safely assert extended type
    const info = results.info as CloudinaryUploadWidgetInfoWithFiles;

    const uploadedFiles: UploadInfo[] = info.files
      .filter((file) => file.uploadInfo)
      .map((file) => ({
        asset_id: file.uploadInfo!.asset_id,
        public_id: file.uploadInfo!.public_id,
        secure_url: file.uploadInfo!.secure_url,
        path: file.uploadInfo!.path,
        thumbnail_url: file.uploadInfo!.thumbnail_url,
      }));

    if (uploadedFiles.length > 0) {
      try {
        const { data } = await axios.post<ApiResponse>(
          "/api/media/create",
          uploadedFiles
        );

        if (!data.success) {
          throw new Error(
            data.message || "Failed to save media. Please try again."
          );
        }

        if (invalidatesQueries && invalidatesQueries.length > 0) {
          queryClient.invalidateQueries({
            queryKey: invalidatesQueries,
          });
        }
        toast.success(data.message || "Media uploaded successfully.");
      } catch (error) {
        console.error("Upload error: ", error);
        const axiosError = error as AxiosError<{ message: string }>;
        toast.error(axiosError?.response?.data?.message || "Upload failed!");
      }
    }
  };

  return (
    <CldUploadWidget
      signatureEndpoint={"/api/cloudinary-signature"}
      uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
      onError={handleOnError}
      onQueuesEnd={handleOnQueuesEnd}
      config={{
        cloud: {
          cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!,
          apiKey: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
        },
      }}
      options={{
        multiple: isMultiple,
        sources: ["local", "url", "unsplash", "google_drive"],
      }}
    >
      {({ open }) => (
        <Button onClick={() => open?.()}>
          <FiPlus /> Upload Media
        </Button>
      )}
    </CldUploadWidget>
  );
};

export default UploadMedia;
