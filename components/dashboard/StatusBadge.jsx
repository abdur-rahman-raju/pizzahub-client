const STYLES = {
  pending: "border-amber-200 bg-amber-100 text-amber-800",
  accepted: "border-green-200 bg-green-100 text-green-800",
  approved: "border-green-200 bg-green-100 text-green-800",
  rejected: "border-red-200 bg-red-100 text-red-800",
  cancelled: "border-gray-200 bg-gray-100 text-gray-700",
  inactive: "border-gray-200 bg-gray-100 text-gray-700",
};

export default function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize ${
        STYLES[status] || STYLES.cancelled
      }`}
    >
      {status}
    </span>
  );
}