import PageHeader from "@/components/dashboard/PageHeader";
import MenuItemForm from "@/components/dashboard/MenuItemForm";

export default function AddMenuItemPage() {
  return (
    <div>
      <PageHeader
        title="Add Menu Item"
        description="New items are reviewed by an admin before they appear on the menu"
      />
      <MenuItemForm />
    </div>
  );
}