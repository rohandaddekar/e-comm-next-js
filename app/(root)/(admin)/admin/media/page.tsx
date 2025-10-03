"use client";

import BreadCrumb, { BreadcrumbItem } from "@/components/admin/BreadCrumb";
import Media, { IMedia } from "@/components/admin/Media";
import UploadMedia from "@/components/admin/UploadMedia";
import AppButton from "@/components/app/Button";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import useDeleteMutation from "@/hooks/useDeleteMutation";
import { ADMIN_DASHBOARD, ADMIN_MEDIA_SHOW } from "@/routes/admin";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Fragment, useEffect, useState } from "react";

const breadcrumb: BreadcrumbItem[] = [
  {
    label: "Home",
    href: ADMIN_DASHBOARD,
  },
  {
    label: "Media",
    href: null,
  },
];

const MediaPage = () => {
  const [deleteType, setDeleteType] = useState<"SD" | "PD" | "RSD">("SD");
  const [selectedMedia, setSelectedMedia] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState<boolean>(false);

  const searchParams = useSearchParams();

  const fetchMedias = async ({
    page,
    limit = 10,
    deleteType,
  }: {
    page: number;
    limit: number;
    deleteType: "SD" | "PD" | "RSD";
  }) => {
    const { data } = await axios.get(
      `/api/media?page=${page}&limit=${limit}&deleteType=${deleteType}`
    );
    return data;
  };

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["medias", deleteType],
    queryFn: async ({ pageParam }) =>
      fetchMedias({ page: pageParam, limit: 10, deleteType }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages) => {
      const nextPage = pages.length;
      return lastPage.data.hasMore ? nextPage : undefined;
    },
  });

  const deleteMutation = useDeleteMutation({
    queryKey: "medias",
    endpoint: "/api/media/delete",
  });

  const handleDelete = (
    selectedMedia: string[],
    deleteType: "SD" | "PD" | "RSD"
  ) => {
    let confirm = true;

    if (deleteType === "PD") {
      confirm = window.confirm(
        "Are you sure you want to delete the selected media permanently? This action cannot be undone."
      );
    }

    if (confirm) {
      deleteMutation.mutate({
        ids: selectedMedia,
        deleteType,
      });
    }

    setSelectAll(false);
    setSelectedMedia([]);
  };

  const handleSelectAll = () => {
    setSelectAll(!selectAll);
  };

  useEffect(() => {
    if (searchParams) {
      const trashof = searchParams.get("trashof");
      setSelectedMedia([]);

      if (trashof) {
        setDeleteType("PD");
      } else {
        setDeleteType("SD");
      }
    }
  }, [searchParams]);

  useEffect(() => {
    if (selectAll) {
      const ids =
        data?.pages?.flatMap((page) =>
          page.data.medias.map((media: IMedia) => media._id)
        ) || [];
      setSelectedMedia(ids);
    } else {
      setSelectedMedia([]);
    }
  }, [selectAll]);

  return (
    <div>
      <BreadCrumb items={breadcrumb} />

      <Card className="py-0 rounded shadow-sm">
        <CardHeader className="pt-3 px-3 border-b [.border-b]:pb-2">
          <div className="flex justify-between items-center">
            <h4 className="font-semibold text-xl uppercase">
              {deleteType === "SD" ? "Media" : "Media Trash"}
            </h4>

            <div className="flex items-center gap-3">
              {deleteType === "SD" && (
                <UploadMedia
                  isMultiple={true}
                  invalidatesQueries={["medias"]}
                />
              )}

              <div className="flex gap-3">
                {deleteType === "SD" ? (
                  <Button type="button" variant={"destructive"}>
                    <Link href={`${ADMIN_MEDIA_SHOW}?trashof=media`}>
                      Trash
                    </Link>
                  </Button>
                ) : (
                  <Button type="button" variant={"outline"}>
                    <Link href={`${ADMIN_MEDIA_SHOW}`}>Back To Media</Link>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pb-5">
          {selectedMedia.length > 0 && (
            <div className="py-2 px-3 bg-violet-200 text-black mb-2 rounded flex justify-between items-center">
              <Label>
                <Checkbox
                  checked={selectAll}
                  onCheckedChange={handleSelectAll}
                  className="border-primary"
                />
                Select All
              </Label>

              <div className="flex gap-2 items-center">
                {deleteType === "SD" ? (
                  <Button
                    variant={"destructive"}
                    onClick={() => handleDelete(selectedMedia, deleteType)}
                  >
                    Move Into Trash
                  </Button>
                ) : (
                  <>
                    <Button
                      className="bg-green-500 hover:bg-green-600"
                      onClick={() => handleDelete(selectedMedia, "RSD")}
                    >
                      Restore
                    </Button>
                    <Button
                      variant={"destructive"}
                      onClick={() => handleDelete(selectedMedia, deleteType)}
                    >
                      Delete Permanently
                    </Button>
                  </>
                )}
              </div>
            </div>
          )}

          {status === "pending" ? (
            <div>Loading...</div>
          ) : status === "error" ? (
            <div className="text-red-500 text-sm">
              Error: {(error as Error).message}
            </div>
          ) : (
            <>
              {data?.pages?.flatMap((page) =>
                page.data.medias.map((media: IMedia) => media._id)
              ).length === 0 && (
                <div className="text-center">No media found.</div>
              )}

              <div className="grid lg:grid-cols-5 sm:grid-cols-3 grid-cols-2 gap-2 mb-5">
                {data?.pages?.map((page, idx) => (
                  <Fragment key={idx}>
                    {page?.data?.medias?.map((media: IMedia) => (
                      <Media
                        key={media._id}
                        media={media}
                        onDelete={handleDelete}
                        deleteType={deleteType}
                        selectedMedia={selectedMedia}
                        setSelectedMedia={setSelectedMedia}
                      />
                    ))}
                  </Fragment>
                ))}
              </div>
            </>
          )}

          {hasNextPage && (
            <AppButton
              type="button"
              onClick={() => fetchNextPage()}
              text="Load More"
              loading={isFetchingNextPage || isFetching}
              disabled={isFetchingNextPage || isFetching}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MediaPage;
