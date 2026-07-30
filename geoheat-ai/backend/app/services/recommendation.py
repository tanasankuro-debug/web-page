from supabase import Client

from app.models.schemas import GardenStyle, RecommendedPlant

# Rule-based style selection + plant filters, per
# 00_MVP_Specification_FINAL.md §1.1/§2: exactly 3 MVP styles
# (tropical, minimal, low_maintenance) — japanese/edible are dropped.
_STYLE_FILTERS: dict[GardenStyle, dict] = {
    "tropical": {"categories": ["tree", "shrub"], "sunlight": "full_sun"},
    "minimal": {"categories": ["succulent"], "sunlight": None},
    "low_maintenance": {"categories": None, "maintenance_level": "low"},
}

_STYLE_META = {
    "tropical": {"estimated_cost": 6500.0, "cooling_effect": "high"},
    "minimal": {"estimated_cost": 2000.0, "cooling_effect": "medium"},
    "low_maintenance": {"estimated_cost": 3000.0, "cooling_effect": "medium"},
}


def choose_style(*, area: float, temperature: float = 39, sun_exposure_hours: float = 7) -> GardenStyle:
    if area < 10:
        return "minimal"
    if temperature > 38 and sun_exposure_hours > 6:
        return "tropical"
    return "low_maintenance"


def recommend_garden(
    supabase: Client, *, area: float, budget: float | None, style: GardenStyle | None
) -> dict:
    chosen_style: GardenStyle = style or choose_style(area=area)
    filters = _STYLE_FILTERS[chosen_style]

    query = supabase.table("plants").select("*")
    if filters.get("categories"):
        query = query.in_("category", filters["categories"])
    if filters.get("sunlight"):
        query = query.eq("sunlight_requirement", filters["sunlight"])
    if filters.get("maintenance_level"):
        query = query.eq("maintenance_level", filters["maintenance_level"])

    rows = query.order("cooling_score", desc=True).limit(3).execute().data

    plants = [
        RecommendedPlant(plant_id=row["id"], name_th=row["name_th"], quantity=3)
        for row in rows
    ]
    meta = _STYLE_META[chosen_style]

    return {
        "style": chosen_style,
        "plants": [p.model_dump() for p in plants],
        "estimated_cost": budget if budget else meta["estimated_cost"],
        "cooling_effect": meta["cooling_effect"],
        "reasoning": f"เลือกสไตล์ {chosen_style} เพราะเหมาะกับขนาดพื้นที่และสภาพแดดของโครงการนี้",
    }
