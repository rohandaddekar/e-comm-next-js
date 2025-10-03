"use client";

import BreadCrumb, { BreadcrumbItem } from "@/components/admin/BreadCrumb";
import Media, { IMedia } from "@/components/admin/Media";
import UploadMedia from "@/components/admin/UploadMedia";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
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

  const handleDelete = () => {};

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
              {deleteType === "SD" && <UploadMedia isMultiple={true} />}

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

        <CardContent>
          {status === "pending" ? (
            <div>Loading...</div>
          ) : status === "error" ? (
            <div className="text-red-500 text-sm">
              Error: {(error as Error).message}
            </div>
          ) : (
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
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MediaPage;
