export const ADMIN_DASHBOARD = "/admin/dashboard";

export const ADMIN_MEDIA_SHOW = "/admin/media";
export const ADMIN_MEDIA_EDIT = (id: string) =>
  id ? `/admin/media/edit/${id}` : "";
