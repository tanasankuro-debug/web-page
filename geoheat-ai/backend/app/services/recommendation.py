from app.models.schemas import GardenRecommendation, RecommendedPlant

# Rule-based layer from AI_WORKFLOW doc section 9. The LLM explanation/
# design-concept layer described there is not wired up yet.
_STYLES: dict[str, GardenRecommendation] = {
    "tropical": GardenRecommendation(
        garden_type="Tropical Garden",
        plants=[
            RecommendedPlant(name="หมากเหลือง", quantity=3),
            RecommendedPlant(name="เฟิร์น", quantity=4),
            RecommendedPlant(name="พลูด่าง", quantity=5),
        ],
        cost=6500,
        cooling="High",
    ),
    "minimal": GardenRecommendation(
        garden_type="Minimal Garden",
        plants=[RecommendedPlant(name="ไม้อวบน้ำ", quantity=6)],
        cost=2500,
        cooling="Medium",
    ),
    "japanese": GardenRecommendation(
        garden_type="Japanese Garden",
        plants=[RecommendedPlant(name="ไผ่แคระ", quantity=4)],
        cost=8000,
        cooling="Medium",
    ),
    "edible": GardenRecommendation(
        garden_type="Edible Garden",
        plants=[
            RecommendedPlant(name="สมุนไพร", quantity=6),
            RecommendedPlant(name="ผักสวนครัว", quantity=6),
        ],
        cost=3500,
        cooling="Medium",
    ),
}


def recommend_garden(
    *, area: float, budget: float | None, style: str | None,
    temperature: float = 39, sun_exposure_hours: float = 7,
) -> GardenRecommendation:
    if style and style.lower() in _STYLES:
        return _STYLES[style.lower()]

    if temperature > 38 and sun_exposure_hours > 6:
        return _STYLES["tropical"]
    if area < 10:
        return _STYLES["minimal"]
    return _STYLES["tropical"]
