import Image from "next/image";
import { GARDEN_STYLE_LABEL, type GardenStyle } from "@/lib/garden-styles";
import { GlassCard } from "@/components/ui/glass-card";
import { CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PremiumSliderFrame } from "@/components/ui/premium-slider-frame";

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
        {beforeImageUrl ? (
          <PremiumSliderFrame
            beforeSrc={beforeImageUrl}
            afterSrc={templateAfterImage}
            beforeAlt="ก่อนออกแบบสวน"
            afterAlt={GARDEN_STYLE_LABEL[style]}
            afterLabel={`หลัง (${GARDEN_STYLE_LABEL[style]})`}
          />
        ) : (
          <div className="relative aspect-video overflow-hidden rounded-[2rem] border border-border">
            <Image
              src={templateAfterImage}
              alt={GARDEN_STYLE_LABEL[style]}
              fill
              className="object-cover"
              priority
            />
            <span className="absolute right-4 top-4 rounded-full bg-primary/90 px-3 py-1 text-xs font-semibold text-primary-foreground">
              หลัง ({GARDEN_STYLE_LABEL[style]})
            </span>
          </div>
        )}

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
