import Image from "next/image";
import Link from "next/link";
import { Camera, Flame, Leaf, ArrowRight, ChevronRight } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";

const scoreComponents = [
  { label: "พืชพรรณ (Vegetation)", weight: 30, color: "bg-primary" },
  { label: "ร่มเงา (Shade)", weight: 25, color: "bg-sky-blue" },
  { label: "ลดความร้อน (Heat Reduction)", weight: 20, color: "bg-heat-orange" },
  { label: "ความหลากหลาย (Diversity)", weight: 15, color: "bg-deep-forest" },
  { label: "การดูแลรักษา (Maintenance)", weight: 10, color: "bg-muted-foreground" },
];

export default async function LandingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="flex min-h-full flex-col">
      <Navbar
        user={
          user
            ? { email: user.email!, fullName: user.user_metadata?.full_name }
            : null
        }
      />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden px-6 pt-20 pb-16 md:pt-28 md:pb-24">
          <div className="mx-auto max-w-4xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm font-medium text-muted-foreground backdrop-blur-sm">
              <Leaf className="size-4 text-primary" />
              GeoHeat AI Green Designer
            </span>
            <h1 className="mt-6 text-5xl font-extrabold leading-[1.05] tracking-tight md:text-7xl lg:text-8xl">
              เปลี่ยนพื้นที่ร้อน
              <br />
              <span className="text-primary">ให้เป็นพื้นที่สีเขียว</span>
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground md:text-xl">
              AI ช่วยวิเคราะห์พื้นที่ ออกแบบสวน
              และลดความร้อนให้บ้านคุณ ภายในไม่กี่นาที
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-6">
              <Button
                size="lg"
                className="rounded-full px-8"
                render={<Link href="/dashboard/projects/new" />}
                nativeButton={false}
              >
                เริ่มวิเคราะห์พื้นที่
                <ArrowRight className="size-4" />
              </Button>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-1 text-base font-medium text-primary hover:underline"
              >
                ดูตัวอย่างการใช้งาน
                <ChevronRight className="size-4" />
              </Link>
            </div>
          </div>

          <div className="relative mx-auto mt-16 max-w-5xl">
            <div className="absolute -inset-x-10 -inset-y-6 -z-10 rounded-[3rem] bg-primary/15 blur-[80px]" />
            <div className="relative aspect-[1200/800] w-full overflow-hidden rounded-[2.5rem] shadow-2xl ring-1 ring-border">
              <Image
                src="/illustrations/hero-transform.svg"
                alt="พื้นที่คอนกรีตร้อนเปลี่ยนเป็นสวนสีเขียวด้วย AI"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </section>

        {/* Step 1: AI Scanner */}
        <section className="border-t border-border bg-background px-6 py-20 md:py-28">
          <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2">
            <div>
              <span className="text-sm font-semibold uppercase tracking-wide text-primary">
                ขั้นตอนที่ 1
              </span>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight md:text-5xl">
                ถ่ายภาพ ให้ AI วิเคราะห์ทันที
              </h2>
              <p className="mt-4 max-w-md text-lg text-muted-foreground">
                เปิดกล้องหรือเลือกรูปพื้นที่ของคุณ AI จะตรวจจับพื้นคอนกรีต
                พื้นหญ้า ต้นไม้ และสิ่งกีดขวางโดยอัตโนมัติ
              </p>
            </div>
            <div className="relative aspect-square overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-primary/15 to-primary/5">
              <div className="absolute inset-0 flex items-center justify-center">
                <Camera className="size-24 text-primary" strokeWidth={1.25} />
              </div>
              <div className="absolute inset-10 rounded-3xl border-2 border-dashed border-primary/40" />
            </div>
          </div>
        </section>

        {/* Step 2: Heat Analysis — subtly elevated panel for rhythm */}
        <section className="border-t border-border bg-white/[0.02] px-6 py-20 md:py-28">
          <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2">
            <div className="relative order-2 aspect-square overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-heat-orange/25 to-heat-orange/5 md:order-1">
              <div className="absolute inset-0 flex items-center justify-center">
                <Flame className="size-24 text-heat-orange" strokeWidth={1.25} />
              </div>
              <div className="absolute inset-10 rounded-full border-2 border-dashed border-heat-orange/40" />
            </div>
            <div className="order-1 md:order-2">
              <span className="text-sm font-semibold uppercase tracking-wide text-primary">
                GeoHeat Intelligence
              </span>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight md:text-5xl">
                รู้ระดับความร้อนที่แท้จริงของพื้นที่คุณ
              </h2>
              <p className="mt-4 max-w-md text-lg text-muted-foreground">
                เชื่อมข้อมูลความร้อนพื้นผิวจริงในพื้นที่ วิเคราะห์ Heat
                Level และความเสี่ยงจากความร้อนสะสม
              </p>
            </div>
          </div>
        </section>

        {/* Step 3: Garden Design */}
        <section className="border-t border-border bg-background px-6 py-20 md:py-28">
          <div className="mx-auto max-w-6xl">
            <div className="mx-auto max-w-2xl text-center">
              <span className="text-sm font-semibold uppercase tracking-wide text-primary">
                ขั้นตอนที่ 3
              </span>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight md:text-5xl">
                แบบสวนที่ AI ออกแบบมาเพื่อพื้นที่คุณ
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                เลือกสไตล์ที่ชอบ ระบบแนะนำพันธุ์ไม้ งบประมาณ
                และภาพจำลองก่อน-หลังให้ทันที
              </p>
            </div>
            <div className="mt-12 grid items-center gap-4 sm:grid-cols-2">
              <div className="relative aspect-video overflow-hidden rounded-[2rem] shadow-xl ring-1 ring-border">
                <Image
                  src="/illustrations/before-backyard.svg"
                  alt="ก่อนออกแบบสวน"
                  fill
                  className="object-cover"
                />
                <span className="absolute left-4 top-4 rounded-full bg-background/90 px-3 py-1 text-xs font-semibold">
                  ก่อน
                </span>
              </div>
              <div className="relative aspect-video overflow-hidden rounded-[2rem] shadow-xl ring-1 ring-primary/30">
                <Image
                  src="/illustrations/after-tropical.svg"
                  alt="หลังออกแบบสวน สไตล์ Tropical"
                  fill
                  className="object-cover"
                />
                <span className="absolute left-4 top-4 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                  หลัง
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Green Score breakdown */}
        <section className="border-t border-border bg-white/[0.02] px-6 py-20 md:py-28">
          <div className="mx-auto max-w-4xl">
            <div className="mx-auto max-w-2xl text-center">
              <span className="text-sm font-semibold uppercase tracking-wide text-primary">
                ผลลัพธ์ที่วัดได้
              </span>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight md:text-5xl">
                Green Score บอกความเป็นมิตรต่อสิ่งแวดล้อมของพื้นที่คุณ
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                คำนวณจาก 5 องค์ประกอบ ครอบคลุมทั้งพืชพรรณ ร่มเงา
                และผลลดความร้อนจริง
              </p>
            </div>
            <div className="mt-12 flex flex-col gap-5">
              {scoreComponents.map((c) => (
                <div key={c.label}>
                  <div className="mb-2 flex items-center justify-between text-sm font-medium">
                    <span>{c.label}</span>
                    <span className="text-muted-foreground">{c.weight}%</span>
                  </div>
                  <div className="h-3 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className={`h-full rounded-full ${c.color}`}
                      style={{ width: `${c.weight}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Closing CTA */}
        <section className="bg-primary px-6 py-20 text-center text-primary-foreground md:py-28">
          <h2 className="text-3xl font-extrabold tracking-tight md:text-5xl">
            พร้อมเปลี่ยนพื้นที่ร้อนให้เป็นพื้นที่สีเขียวหรือยัง?
          </h2>
          <p className="mx-auto mt-4 max-w-md text-lg opacity-90">
            เริ่มต้นฟรี วิเคราะห์พื้นที่แรกของคุณได้ในไม่กี่นาที
          </p>
          <div className="mt-8">
            <Button
              size="lg"
              variant="secondary"
              className="rounded-full px-8"
              render={<Link href="/dashboard/projects/new" />}
              nativeButton={false}
            >
              เริ่มต้นฟรี
              <ArrowRight className="size-4" />
            </Button>
          </div>
        </section>
      </main>

      <footer className="border-t border-border py-8 text-center text-sm text-muted-foreground">
        GeoHeat AI Green Designer — MVP
      </footer>
    </div>
  );
}
