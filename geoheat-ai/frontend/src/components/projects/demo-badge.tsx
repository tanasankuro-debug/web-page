import { Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function DemoBadge() {
  return (
    <Badge className="gap-1 rounded-full bg-sky-blue/15 text-sky-blue hover:bg-sky-blue/15">
      <Sparkles className="size-3" />
      Demo
    </Badge>
  );
}
