export function AmbientBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-background">
      <div className="bg-grid absolute inset-0 opacity-60 [mask-image:radial-gradient(ellipse_80%_60%_at_50%_0%,black,transparent)]" />
      <div className="absolute -top-40 left-1/4 size-[560px] rounded-full bg-primary/15 blur-[140px]" />
      <div className="absolute top-1/3 -right-40 size-[520px] rounded-full bg-sky-blue/10 blur-[140px]" />
      <div className="absolute bottom-0 left-1/3 size-[480px] rounded-full bg-primary/10 blur-[160px]" />
    </div>
  );
}
