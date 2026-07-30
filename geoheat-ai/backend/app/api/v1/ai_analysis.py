from fastapi import APIRouter, Depends, HTTPException

from app.core.deps import get_current_user_id
from app.core.supabase import get_supabase
from app.models.schemas import AnalysisResult, AnalysisStartRequest, ApiResponse
from app.services.ai.base import AIService
from app.services.ai.mock_service import get_ai_service

router = APIRouter(prefix="/ai", tags=["ai"])


@router.post("/analyze", response_model=ApiResponse[AnalysisResult])
async def start_analysis(
    payload: AnalysisStartRequest,
    user_id: str = Depends(get_current_user_id),
    ai_service: AIService = Depends(get_ai_service),
) -> ApiResponse[AnalysisResult]:
    supabase = get_supabase()

    project = supabase.table("projects").select("id, user_id").eq("id", payload.project_id).execute()
    if not project.data or project.data[0]["user_id"] != user_id:
        raise HTTPException(status_code=403, detail="Not your project")

    mock = await ai_service.analyze_image(payload.image_id)

    row = {
        "project_id": payload.project_id,
        "user_id": user_id,
        "image_id": payload.image_id,
        "total_area": mock.area.total,
        "green_area": mock.area.green,
        "concrete_area": mock.area.concrete,
        "green_percentage": round(mock.area.green / mock.area.total * 100, 1),
        "heat_level": mock.heat_level,
        "detected_objects": [obj.model_dump() for obj in mock.objects],
    }
    result = supabase.table("analysis_results").insert(row).execute()
    saved = result.data[0]

    return ApiResponse(
        data=AnalysisResult(
            id=saved["id"],
            project_id=saved["project_id"],
            image_id=saved["image_id"],
            total_area=saved["total_area"],
            green_area=saved["green_area"],
            concrete_area=saved["concrete_area"],
            green_percentage=saved["green_percentage"],
            heat_level=saved["heat_level"],
            detected_objects=saved["detected_objects"],
            created_at=saved["created_at"],
        )
    )


@router.get("/result/{analysis_id}", response_model=ApiResponse[AnalysisResult])
async def get_analysis_result(
    analysis_id: str, user_id: str = Depends(get_current_user_id)
) -> ApiResponse[AnalysisResult]:
    supabase = get_supabase()
    result = supabase.table("analysis_results").select("*").eq("id", analysis_id).execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Analysis not found")

    row = result.data[0]
    project = supabase.table("projects").select("user_id, is_demo").eq("id", row["project_id"]).execute()
    owner = project.data[0] if project.data else None
    if not owner or (owner["user_id"] != user_id and not owner["is_demo"]):
        raise HTTPException(status_code=403, detail="Not your project")

    return ApiResponse(data=AnalysisResult(**row))
