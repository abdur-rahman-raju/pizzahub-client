import Link from "next/link";
import { Pizza } from "lucide-react";

export default function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2">
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
        <Pizza className="h-5 w-5" />
      </span>
      <span className="text-xl font-bold tracking-tight text-foreground">
        Pizza<span className="text-primary">Hub</span>
      </span>
    </Link>
  );
}