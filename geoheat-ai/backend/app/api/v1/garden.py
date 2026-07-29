from fastapi import APIRouter

from app.models.schemas import ApiResponse, GardenRecommendation, GardenRecommendationRequest, Plant
from app.services.recommendation import recommend_garden

router = APIRouter(tags=["garden"])

_PLANT_CATALOG = [
    Plant(name="Snake Plant", score=90),
    Plant(name="หมากเหลือง", score=85),
    Plant(name="เฟิร์น", score=78),
]


@router.post("/garden/recommend", response_model=ApiResponse[GardenRecommendation])
async def garden_recommend(payload: GardenRecommendationRequest) -> ApiResponse[GardenRecommendation]:
    recommendation = recommend_garden(area=payload.area, budget=payload.budget, style=payload.style)
    return ApiResponse(data=recommendation)


@router.get("/plants/recommend", response_model=ApiResponse[list[Plant]])
async def plants_recommend(
    sun: str | None = None, area: float | None = None, maintenance: str | None = None
) -> ApiResponse[list[Plant]]:
    return ApiResponse(data=_PLANT_CATALOG)
