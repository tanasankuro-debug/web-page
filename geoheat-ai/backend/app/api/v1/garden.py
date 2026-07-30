from fastapi import APIRouter, Depends, HTTPException

from app.core.deps import get_current_user_id
from app.core.supabase import get_supabase
from app.models.schemas import (
    ApiResponse,
    GardenRecommendationRequest,
    Plant,
    Recommendation,
)
from app.services.recommendation import recommend_garden

router = APIRouter(tags=["garden"])


@router.post("/garden/recommend", response_model=ApiResponse[Recommendation])
async def garden_recommend(
    payload: GardenRecommendationRequest, user_id: str = Depends(get_current_user_id)
) -> ApiResponse[Recommendation]:
    supabase = get_supabase()

    project = supabase.table("projects").select("id, user_id").eq("id", payload.project_id).execute()
    if not project.data or project.data[0]["user_id"] != user_id:
        raise HTTPException(status_code=403, detail="Not your project")

    recommendation = recommend_garden(
        supabase, area=payload.area, budget=payload.budget, style=payload.style
    )
    row = {**recommendation, "project_id": payload.project_id, "user_id": user_id}
    result = supabase.table("recommendations").insert(row).execute()
    return ApiResponse(data=Recommendation(**result.data[0]))


@router.get("/plants", response_model=ApiResponse[list[Plant]])
async def list_plants(
    category: str | None = None, maintenance_level: str | None = None
) -> ApiResponse[list[Plant]]:
    query = get_supabase().table("plants").select("*")
    if category:
        query = query.eq("category", category)
    if maintenance_level:
        query = query.eq("maintenance_level", maintenance_level)
    rows = query.order("cooling_score", desc=True).execute().data
    return ApiResponse(data=[Plant(**row) for row in rows])
