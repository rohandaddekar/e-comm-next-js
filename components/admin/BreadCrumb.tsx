import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export interface BreadcrumbItem {
  label: string;
  href: string | null;
}

interface BreadCrumbProps {
  items: BreadcrumbItem[];
}

const BreadCrumb: React.FC<BreadCrumbProps> = ({ items }) => {
  return (
    <Breadcrumb className="mb-5">
      <BreadcrumbList>
        {items.length > 0 &&
          items.map((item, index) =>
            index !== items.length - 1 ? (
              <div key={index} className="flex items-center">
                <BreadcrumbItem>
                  <BreadcrumbLink href={item.href ?? undefined}>
                    {item.label}
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="ms-2 mt-0.5" />
              </div>
            ) : (
              <BreadcrumbItem key={index}>
                <BreadcrumbLink aria-current="page" href={undefined}>
                  {item.label}
                </BreadcrumbLink>
              </BreadcrumbItem>
            )
          )}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default BreadCrumb;
