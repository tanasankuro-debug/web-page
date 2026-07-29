import Link from "next/link";
import { Camera, Flame, Sprout, ArrowRight } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { CardContent } from "@/components/ui/card";

const steps = [
  { n: "01", title: "Scan", desc: "ถ่ายรูปหรือเปิดกล้องสด แตะ 4 มุม" },
  { n: "02", title: "Analyze", desc: "AI คำนวณพื้นที่และวิเคราะห์ความร้อน" },
  { n: "03", title: "Design", desc: "รับคำแนะนำแบบสวนที่เหมาะกับพื้นที่" },
  { n: "04", title: "Improve", desc: "ดูภาพจำลองก่อน/หลัง และ Green Score" },
];

const features = [
  {
    icon: Camera,
    title: "AI Area Scanner",
    desc: "ถ่ายภาพพื้นที่ ให้ AI ตรวจจับพื้นปูน หญ้า ต้นไม้ และสิ่งกีดขวาง",
  },
  {
    icon: Flame,
    title: "Heat Analysis",
    desc: "เชื่อมข้อมูล GeoHeat วิเคราะห์อุณหภูมิพื้นผิวและความเสี่ยงความร้อน",
  },
  {
    icon: Sprout,
    title: "Garden Design",
    desc: "AI แนะนำรูปแบบสวน พันธุ์ไม้ งบประมาณ และผลลดความร้อนโดยประมาณ",
  },
];

export default function LandingPage() {
  return (
    <div className="flex min-h-full flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div
            className="pointer-events-none absolute inset-0 -z-10 opacity-40"
            style={{
              background:
                "radial-gradient(60% 50% at 50% 0%, color-mix(in oklch, var(--eco-green) 25%, transparent), transparent)",
            }}
          />
          <div className="mx-auto grid max-w-[1440px] gap-10 px-6 py-20 md:grid-cols-2 md:items-center md:py-28">
            <div>
              <h1 className="text-4xl font-extrabold leading-tight tracking-tight md:text-6xl">
                เปลี่ยนพื้นที่ร้อน
                <br />
                <span className="text-primary">ให้เป็นพื้นที่สีเขียว</span>
              </h1>
              <p className="mt-6 max-w-md text-lg text-muted-foreground">
                AI ช่วยออกแบบสวนที่เหมาะกับบ้านคุณ
                พร้อมวิเคราะห์ผลต่อความร้อน
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button
                  size="lg"
                  className="rounded-2xl"
                  render={<Link href="/dashboard/scanner" />}
                >
                  เริ่มวิเคราะห์พื้นที่
                  <ArrowRight className="size-4" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-2xl"
                  render={<Link href="/dashboard" />}
                >
                  ดูตัวอย่าง
                </Button>
              </div>
            </div>

            <GlassCard className="p-6">
              <CardContent className="grid gap-4 p-0">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">พื้นที่ของคุณ</span>
                  <span className="rounded-full bg-heat-orange/15 px-2.5 py-0.5 text-xs font-semibold text-heat-orange">
                    Heat Level: สูง
                  </span>
                </div>
                <div className="text-5xl font-extrabold text-heat-orange">39°C</div>
                <div className="h-px bg-border" />
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Green Score</span>
                  <span className="font-bold text-primary">62/100</span>
                </div>
              </CardContent>
            </GlassCard>
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="mx-auto max-w-[1440px] px-6 py-20">
          <h2 className="text-center text-2xl font-bold md:text-3xl">
            How it Works
          </h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step) => (
              <GlassCard key={step.n} className="p-6">
                <CardContent className="p-0">
                  <div className="text-sm font-mono text-primary">{step.n}</div>
                  <div className="mt-2 text-lg font-bold">{step.title}</div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {step.desc}
                  </p>
                </CardContent>
              </GlassCard>
            ))}
          </div>
        </section>

        {/* GeoHeat Intelligence */}
        <section id="geoheat" className="mx-auto max-w-[1440px] px-6 pb-24">
          <h2 className="text-center text-2xl font-bold md:text-3xl">
            GeoHeat Intelligence
          </h2>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {features.map((f) => (
              <GlassCard key={f.title} className="p-6">
                <CardContent className="p-0">
                  <span className="flex size-10 items-center justify-center rounded-xl bg-primary/15 text-primary">
                    <f.icon className="size-5" />
                  </span>
                  <div className="mt-4 text-lg font-bold">{f.title}</div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {f.desc}
                  </p>
                </CardContent>
              </GlassCard>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 py-8 text-center text-sm text-muted-foreground">
        GeoHeat AI Green Designer — MVP
      </footer>
    </div>
  );
}
