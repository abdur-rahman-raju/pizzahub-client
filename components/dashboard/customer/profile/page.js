import PageHeader from "@/components/dashboard/PageHeader";
import ProfileForm from "@/components/dashboard/ProfileForm";

export default function CustomerProfilePage() {
  return (
    <div>
      <PageHeader title="Profile Settings" description="Update your personal information" />
      <ProfileForm />
    </div>
  );
}