"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { GlassCard } from "@/components/ui/glass-card";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FloatingInput } from "@/components/ui/floating-input";
import { Button } from "@/components/ui/button";

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const supabase = createClient();
    const { error } =
      mode === "login"
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({
            email,
            password,
            options: { data: { full_name: fullName } },
          });

    if (error) {
      setLoading(false);
      toast.error(error.message);
      return;
    }

    if (mode === "register") {
      toast.success("สร้างบัญชีสำเร็จ กรุณายืนยันอีเมลของคุณ");
      router.push("/login");
    } else {
      router.push("/dashboard");
    }
  }

  return (
    <GlassCard className="p-6">
      <CardHeader className="p-0">
        <CardTitle className="text-2xl font-extrabold tracking-tight">
          {mode === "login" ? "เข้าสู่ระบบ" : "สร้างบัญชีใหม่"}
        </CardTitle>
      </CardHeader>
      <CardContent className="mt-6 p-0">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {mode === "register" && (
            <FloatingInput
              id="full_name"
              label="ชื่อ"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          )}
          <FloatingInput
            id="email"
            label="อีเมล"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <FloatingInput
            id="password"
            label="รหัสผ่าน"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={6}
            required
          />
          <Button type="submit" className="mt-2 rounded-xl" disabled={loading}>
            {loading && <Loader2 className="size-4 animate-spin" />}
            {loading
              ? "กำลังดำเนินการ..."
              : mode === "login"
                ? "เข้าสู่ระบบ"
                : "สร้างบัญชี"}
          </Button>
        </form>

        <p className="mt-4 text-center text-sm text-muted-foreground">
          {mode === "login" ? (
            <>
              ยังไม่มีบัญชี?{" "}
              <Link href="/register" className="text-primary hover:underline">
                สร้างบัญชี
              </Link>
            </>
          ) : (
            <>
              มีบัญชีอยู่แล้ว?{" "}
              <Link href="/login" className="text-primary hover:underline">
                เข้าสู่ระบบ
              </Link>
            </>
          )}
        </p>
      </CardContent>
    </GlassCard>
  );
}
