"use client";

import BreadCrumb, { BreadcrumbItem } from "@/components/admin/BreadCrumb";
import UploadMedia from "@/components/admin/UploadMedia";
import { ADMIN_DASHBOARD } from "@/routes/admin";

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
  return (
    <div>
      <BreadCrumb items={breadcrumb} />

      <UploadMedia isMultiple={true} />
    </div>
  );
};

export default MediaPage;
