import PageHeader from "@/components/dashboard/PageHeader";
import ProfileForm from "@/components/dashboard/ProfileForm";

export default function AdminProfilePage() {
  return (
    <div>
      <PageHeader title="Profile Settings" description="Update your account information" />
      <ProfileForm />
    </div>
  );
}