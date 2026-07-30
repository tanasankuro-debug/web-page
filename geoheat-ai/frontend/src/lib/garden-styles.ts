export type GardenStyle = "tropical" | "minimal" | "low_maintenance";

export const GARDEN_STYLE_LABEL: Record<GardenStyle, string> = {
  tropical: "Tropical",
  minimal: "Minimal",
  low_maintenance: "Low-Maintenance",
};

// Static template "after" images per §1.1 item 8 of 00_MVP_Specification_FINAL.md —
// one illustration per style, not AI-generated, reused across every project
// that picks that style (including seeded demo projects' garden_designs rows).
export const GARDEN_STYLE_IMAGE: Record<GardenStyle, string> = {
  tropical: "/illustrations/after-tropical.svg",
  minimal: "/illustrations/after-minimal.svg",
  low_maintenance: "/illustrations/after-low-maintenance.svg",
};
