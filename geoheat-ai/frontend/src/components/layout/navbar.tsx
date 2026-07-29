import Link from "next/link";
import { Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";

const links = [
  { href: "#how-it-works", label: "วิธีใช้งาน" },
  { href: "#geoheat", label: "GeoHeat Intelligence" },
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2 font-bold">
          <span className="flex size-8 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Leaf className="size-4" />
          </span>
          <span>GeoHeat AI</span>
        </Link>

        <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
          {links.map((link) => (
            <a key={link.href} href={link.href} className="hover:text-foreground">
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Button variant="ghost" render={<Link href="/login" />}>
            เข้าสู่ระบบ
          </Button>
          <Button className="rounded-xl" render={<Link href="/dashboard" />}>
            เริ่มวิเคราะห์พื้นที่
          </Button>
        </div>
      </div>
    </header>
  );
}
