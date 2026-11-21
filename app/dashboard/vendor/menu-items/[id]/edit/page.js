"use client";

import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import PageHeader from "@/components/dashboard/PageHeader";
import MenuItemForm from "@/components/dashboard/MenuItemForm";
import { ErrorState } from "@/components/dashboard/States";
import { useApiData } from "@/lib/use-api-data";

export default function EditMenuItemPage() {
  const { id } = useParams();
  const { data: item, status, error, reload } = useApiData(`/api/menu-items/${id}`);

  return (
    <div>
      <PageHeader title="Edit Menu Item" description="Update your item details" />

      {status === "loading" && (
        <div className="flex justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}

      {status === "error" && <ErrorState message={error} onRetry={reload} />}

      {status === "success" && <MenuItemForm key={item._id} item={item} />}
    </div>
  );
}