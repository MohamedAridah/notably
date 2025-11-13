import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";

interface BreadCrumbUIProps {
  breadCrumbs: {
    label: string;
    href: string;
    className?: string;
  }[];
}

export default function BreadCrumbUI({ breadCrumbs }: BreadCrumbUIProps) {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadCrumbs.map((breadCrumb, index, array) => (
          <React.Fragment key={index}>
            <BreadcrumbItem key={index}>
              <BreadcrumbLink className={breadCrumb.className} asChild>
                <Link href={breadCrumb.href}>{breadCrumb.label}</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            {array.length === ++index ? null : <BreadcrumbSeparator />}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
