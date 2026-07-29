from fastapi import APIRouter

from app.models.schemas import ApiResponse, GreenScoreCalculateRequest, GreenScoreResult
from app.services.green_score import calculate_green_score

router = APIRouter(prefix="/green-score", tags=["green-score"])


@router.post("/calculate", response_model=ApiResponse[GreenScoreResult])
async def calculate(payload: GreenScoreCalculateRequest) -> ApiResponse[GreenScoreResult]:
    # Placeholder inputs until this reads the project's real
    # ai_analysis_results row. Numbers mirror the API_SPECIFICATION example.
    result = calculate_green_score(green_coverage=90, shade=75, cooling=80, diversity=70)
    return ApiResponse(data=result)
