from fastapi import APIRouter, Depends

from app.core.deps import get_current_user_id
from app.core.supabase import get_supabase
from app.models.schemas import ApiResponse, Project

router = APIRouter(prefix="/history", tags=["history"])


@router.get("", response_model=ApiResponse[list[Project]])
async def get_history(user_id: str = Depends(get_current_user_id)) -> ApiResponse[list[Project]]:
    result = (
        get_supabase()
        .table("projects")
        .select("*")
        .eq("user_id", user_id)
        .order("created_at", desc=True)
        .execute()
    )
    return ApiResponse(data=[Project(**row) for row in result.data])
