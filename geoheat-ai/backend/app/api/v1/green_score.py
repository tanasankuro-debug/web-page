from fastapi import APIRouter, Depends, HTTPException

from app.core.deps import get_current_user_id
from app.core.supabase import get_supabase
from app.models.schemas import ApiResponse, GreenScore, GreenScoreCalculateRequest
from app.services.green_score import calculate_green_score

router = APIRouter(prefix="/green-score", tags=["green-score"])

# Deterministic mapping from the mock analysis's `heat_level` to a
# heat-reduction sub-score, per 00_MVP_Specification_FINAL.md §4's decision
# to derive Green Score inputs from analysis output rather than real sensors.
_HEAT_LEVEL_SCORE = {"low": 85, "moderate": 65, "high": 40, "extreme": 15}
_VEGETATION_OBJECT_TYPES = {"tree", "grass", "shrub"}


@router.post("/calculate", response_model=ApiResponse[GreenScore])
async def calculate(
    payload: GreenScoreCalculateRequest, user_id: str = Depends(get_current_user_id)
) -> ApiResponse[GreenScore]:
    supabase = get_supabase()

    project = supabase.table("projects").select("id, user_id").eq("id", payload.project_id).execute()
    if not project.data or project.data[0]["user_id"] != user_id:
        raise HTTPException(status_code=403, detail="Not your project")

    analysis = (
        supabase.table("analysis_results")
        .select("*")
        .eq("project_id", payload.project_id)
        .order("created_at", desc=True)
        .limit(1)
        .execute()
    )
    if not analysis.data:
        raise HTTPException(status_code=400, detail="No analysis found for this project yet")
    latest = analysis.data[0]

    vegetation_score = latest["green_percentage"]
    shade_score = min(100.0, latest["green_percentage"] * 1.2)
    heat_reduction_score = _HEAT_LEVEL_SCORE.get(latest["heat_level"], 50)
    distinct_vegetation = {
        obj["type"] for obj in latest["detected_objects"] if obj["type"] in _VEGETATION_OBJECT_TYPES
    }
    diversity_score = min(100.0, len(distinct_vegetation) * 25)
    maintenance_score = 50.0  # neutral until a garden style is chosen (see garden_designs)

    total_score = calculate_green_score(
        vegetation_score=vegetation_score,
        shade_score=shade_score,
        heat_reduction_score=heat_reduction_score,
        diversity_score=diversity_score,
        maintenance_score=maintenance_score,
    )

    row = {
        "project_id": payload.project_id,
        "user_id": user_id,
        "stage": payload.stage,
        "vegetation_score": vegetation_score,
        "shade_score": shade_score,
        "heat_reduction_score": heat_reduction_score,
        "diversity_score": diversity_score,
        "maintenance_score": maintenance_score,
        "total_score": total_score,
    }
    result = supabase.table("green_scores").insert(row).execute()
    return ApiResponse(data=GreenScore(**result.data[0]))
