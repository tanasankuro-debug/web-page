import Image from "next/image";
import { GARDEN_STYLE_LABEL, type GardenStyle } from "@/lib/garden-styles";
import { GlassCard } from "@/components/ui/glass-card";
import { CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface RecommendedPlant {
  plant_id: string;
  name_th: string;
  quantity: number;
}

export function GardenDesignResult({
  style,
  estimatedCost,
  coolingEffect,
  templateAfterImage,
  beforeImageUrl,
  plants,
  description,
}: {
  style: GardenStyle;
  estimatedCost: number;
  coolingEffect: string;
  templateAfterImage: string;
  beforeImageUrl: string | null;
  plants: RecommendedPlant[];
  description?: string | null;
}) {
  return (
    <GlassCard className="p-6">
      <CardContent className="flex flex-col gap-6 p-0">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <div className="mb-2 text-xs text-muted-foreground">ก่อน</div>
            <div className="relative aspect-video overflow-hidden rounded-xl border border-white/10">
              {beforeImageUrl ? (
                <Image src={beforeImageUrl} alt="before" fill className="object-cover" unoptimized priority />
              ) : (
                <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                  ไม่มีรูปพื้นที่
                </div>
              )}
            </div>
          </div>
          <div>
            <div className="mb-2 text-xs text-muted-foreground">หลัง ({GARDEN_STYLE_LABEL[style]})</div>
            <div className="relative aspect-video overflow-hidden rounded-xl border border-white/10">
              <Image
                src={templateAfterImage}
                alt={GARDEN_STYLE_LABEL[style]}
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Badge className="rounded-full bg-primary/15 text-primary hover:bg-primary/15">
            ค่าใช้จ่ายโดยประมาณ ฿{estimatedCost.toLocaleString()}
          </Badge>
          <Badge variant="secondary" className="rounded-full">
            ผลลดความร้อน: {coolingEffect}
          </Badge>
        </div>

        {plants.length > 0 && (
          <div>
            <div className="mb-2 text-sm font-semibold text-muted-foreground">ต้นไม้แนะนำ</div>
            <div className="flex flex-wrap gap-2">
              {plants.map((plant) => (
                <Badge key={plant.plant_id} variant="secondary" className="rounded-full">
                  {plant.name_th} × {plant.quantity}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </CardContent>
    </GlassCard>
  );
}
