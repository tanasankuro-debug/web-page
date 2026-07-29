import Link from "next/link";
import { Leaf } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-full flex-1 flex-col items-center justify-center px-6 py-16">
      <Link href="/" className="mb-8 flex items-center gap-2 font-bold">
        <span className="flex size-8 items-center justify-center rounded-xl bg-primary text-primary-foreground">
          <Leaf className="size-4" />
        </span>
        <span>GeoHeat AI</span>
      </Link>
      <div className="w-full max-w-sm">{children}</div>
    </div>
  );
}
