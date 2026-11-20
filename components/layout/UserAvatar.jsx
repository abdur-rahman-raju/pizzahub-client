export default function UserAvatar({ user, className = "h-8 w-8" }) {
  if (user.image) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={user.image}
        alt={user.name || "User"}
        referrerPolicy="no-referrer"
        className={`${className} rounded-full object-cover`}
      />
    );
  }

  return (
    <span
      className={`${className} flex items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground`}
    >
      {user.name?.charAt(0).toUpperCase() || "U"}
    </span>
  );
}