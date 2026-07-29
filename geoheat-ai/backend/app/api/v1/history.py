from fastapi import APIRouter

from app.models.schemas import ApiResponse, HistoryItem

router = APIRouter(prefix="/history", tags=["history"])


@router.get("", response_model=ApiResponse[list[HistoryItem]])
async def get_history() -> ApiResponse[list[HistoryItem]]:
    return ApiResponse(
        data=[HistoryItem(project="หลังบ้าน", date="2026-07-30", score=82)]
    )
