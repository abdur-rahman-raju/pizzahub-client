import ItemDetails from "@/components/menu/ItemDetails";

export const metadata = {
  title: "Menu Item | PizzaHub",
};

export default async function MenuItemPage({ params }) {
  const { id } = await params;
  return <ItemDetails id={id} />;
}