import Link from "next/link";
import { Camera, Leaf, ArrowRight, ChevronRight, Sparkles, Users, TreePine } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import { GardenShowcase } from "@/components/landing/garden-showcase";
import { HeroVisual } from "@/components/landing/hero-visual";
import { HeatFlowGraphic } from "@/components/landing/heat-flow-graphic";
import { GreenScoreShowcase } from "@/components/dashboard/green-score-showcase";
import { Reveal } from "@/components/motion/reveal";
import { TiltCard } from "@/components/motion/tilt-card";
import { Magnetic } from "@/components/motion/magnetic";
import { AnimatedNumber } from "@/components/ui/animated-number";
import { createClient } from "@/lib/supabase/server";

const greenSubScores = [
  { label: "พืชพรรณ (Vegetation)", value: 28, weight: 30, color: "bg-primary" },
  { label: "ร่มเงา (Shade)", value: 23, weight: 25, color: "bg-sky-blue" },
  { label: "ลดความร้อน (Heat Reduction)", value: 18, weight: 20, color: "bg-heat-orange" },
  { label: "ความหลากหลาย (Diversity)", value: 14, weight: 15, color: "bg-deep-forest" },
  { label: "การดูแลรักษา (Maintenance)", value: 9, weight: 10, color: "bg-muted-foreground" },
];

const trustStats = [
  { icon: TreePine, value: 22, suffix: "+", label: "พันธุ์ไม้ในฐานข้อมูล" },
  { icon: Sparkles, value: 92, suffix: "", label: "Green Score เฉลี่ยหลังออกแบบ" },
  { icon: Users, value: 4, suffix: ".2°C", label: "อุณหภูมิลดลงโดยเฉลี่ย" },
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
          <Reveal className="mx-auto max-w-4xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm font-medium text-muted-foreground backdrop-blur-sm">
              <Leaf className="size-4 text-primary" />
              GeoHeat AI Green Designer
            </span>
            <h1 className="text-display-1 mt-6 font-extrabold">
              เปลี่ยนพื้นที่ร้อน
              <br />
              <span className="text-primary">ให้เป็นพื้นที่สีเขียว</span>
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground md:text-xl">
              AI ช่วยวิเคราะห์พื้นที่ ออกแบบสวน
              และลดความร้อนให้บ้านคุณ ภายในไม่กี่นาที
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-6">
              <Magnetic>
                <Button
                  size="lg"
                  className="rounded-full px-8"
                  render={<Link href="/dashboard/projects/new" />}
                  nativeButton={false}
                >
                  เริ่มวิเคราะห์พื้นที่
                  <ArrowRight className="size-4" />
                </Button>
              </Magnetic>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-1 text-base font-medium text-primary hover:underline"
              >
                ดูตัวอย่างการใช้งาน
                <ChevronRight className="size-4" />
              </Link>
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <HeroVisual />
          </Reveal>
        </section>

        {/* Step 1: AI Scanner — asymmetric split */}
        <section className="border-t border-border bg-background px-6 py-20 md:py-28">
          <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-[1.15fr_0.85fr]">
            <Reveal>
              <span className="text-sm font-semibold uppercase tracking-wide text-primary">
                ขั้นตอนที่ 1
              </span>
              <h2 className="text-display-2 mt-3 font-extrabold">
                ถ่ายภาพ ให้ AI วิเคราะห์ทันที
              </h2>
              <p className="mt-4 max-w-md text-lg text-muted-foreground">
                เปิดกล้องหรือเลือกรูปพื้นที่ของคุณ AI จะตรวจจับพื้นคอนกรีต
                พื้นหญ้า ต้นไม้ และสิ่งกีดขวางโดยอัตโนมัติ
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <TiltCard
                strength={5}
                className="relative aspect-square overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-primary/15 to-primary/5"
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <Camera className="size-24 text-primary" strokeWidth={1.25} />
                </div>
                <div
                  className="absolute inset-10 rounded-3xl border-2 border-dashed border-primary/40"
                  style={{ animation: "grid-pulse 4s ease-in-out infinite" }}
                />
              </TiltCard>
            </Reveal>
          </div>
        </section>

        {/* Step 2: Heat Analysis — full-bleed cinematic panel */}
        <section className="relative overflow-hidden border-t border-border bg-[#08090b] py-24 md:py-32">
          <HeatFlowGraphic className="absolute inset-0 size-full opacity-70" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#08090b] via-transparent to-[#08090b]" />
          <Reveal className="relative mx-auto max-w-2xl px-6 text-center">
            <span className="text-sm font-semibold uppercase tracking-wide text-heat-orange">
              GeoHeat Intelligence
            </span>
            <h2 className="text-display-2 mt-3 font-extrabold">
              รู้ระดับความร้อนที่แท้จริงของพื้นที่คุณ
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              เชื่อมข้อมูลความร้อนพื้นผิวจริงในพื้นที่ วิเคราะห์ Heat
              Level และความเสี่ยงจากความร้อนสะสม
            </p>
          </Reveal>
        </section>

        {/* Step 3: Garden Design */}
        <section className="border-t border-border bg-background px-6 py-20 md:py-28">
          <div className="mx-auto max-w-6xl">
            <Reveal className="mx-auto max-w-2xl text-center">
              <span className="text-sm font-semibold uppercase tracking-wide text-primary">
                ขั้นตอนที่ 3
              </span>
              <h2 className="text-display-2 mt-3 font-extrabold">
                แบบสวนที่ AI ออกแบบมาเพื่อพื้นที่คุณ
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                เลือกสไตล์ที่ชอบ ระบบแนะนำพันธุ์ไม้ งบประมาณ
                และภาพจำลองก่อน-หลังให้ทันที
              </p>
            </Reveal>
            <GardenShowcase />
          </div>
        </section>

        {/* Green Score showcase */}
        <section className="border-t border-border bg-white/[0.02] px-6 py-20 md:py-28">
          <div className="mx-auto max-w-4xl">
            <Reveal className="mx-auto max-w-2xl text-center">
              <span className="text-sm font-semibold uppercase tracking-wide text-primary">
                ผลลัพธ์ที่วัดได้
              </span>
              <h2 className="text-display-2 mt-3 font-extrabold">
                Green Score บอกความเป็นมิตรต่อสิ่งแวดล้อมของพื้นที่คุณ
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                คำนวณจาก 5 องค์ประกอบ ครอบคลุมทั้งพืชพรรณ ร่มเงา
                และผลลดความร้อนจริง — เลื่อนเมาส์ชี้แต่ละแถบเพื่อดูรายละเอียด
              </p>
            </Reveal>
            <Reveal delay={0.1} className="mt-12">
              <GreenScoreShowcase score={92} subScores={greenSubScores} />
            </Reveal>
          </div>
        </section>

        {/* Trust stats trio — asymmetric */}
        <section className="border-t border-border bg-background px-6 py-16 md:py-20">
          <div className="mx-auto grid max-w-5xl gap-4 sm:grid-cols-3">
            {trustStats.map((s, i) => (
              <Reveal key={s.label} delay={i * 0.08}>
                <TiltCard className="glass h-full rounded-3xl p-6 text-center" strength={5}>
                  <span className="mx-auto flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <s.icon className="size-5" />
                  </span>
                  <div className="mt-4 text-3xl font-extrabold tracking-tight">
                    <AnimatedNumber value={s.value} suffix={s.suffix} className="inline" />
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{s.label}</p>
                </TiltCard>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Closing CTA */}
        <section className="bg-primary px-6 py-20 text-center text-primary-foreground md:py-28">
          <Reveal>
            <h2 className="text-display-2 font-extrabold">
              พร้อมเปลี่ยนพื้นที่ร้อนให้เป็นพื้นที่สีเขียวหรือยัง?
            </h2>
            <p className="mx-auto mt-4 max-w-md text-lg opacity-90">
              เริ่มต้นฟรี วิเคราะห์พื้นที่แรกของคุณได้ในไม่กี่นาที
            </p>
            <div className="mt-8">
              <Magnetic>
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
              </Magnetic>
            </div>
          </Reveal>
        </section>
      </main>

      <footer className="border-t border-border py-8 text-center text-sm text-muted-foreground">
        GeoHeat AI Green Designer — MVP
      </footer>
    </div>
  );
}
