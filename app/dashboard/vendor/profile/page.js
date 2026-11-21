import PageHeader from "@/components/dashboard/PageHeader";
import ProfileForm from "@/components/dashboard/ProfileForm";

export default function VendorProfilePage() {
  return (
    <div>
      <PageHeader title="Profile Settings" description="Update your shop information" />
      <ProfileForm />
    </div>
  );
}
