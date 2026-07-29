import uuid

from fastapi import APIRouter, Depends

from app.models.schemas import (
    AnalysisResult,
    AnalysisStartRequest,
    AnalysisStartResponse,
    AnalysisStatus,
    ApiResponse,
)
from app.services.ai.base import AIService
from app.services.ai.mock_service import get_ai_service

router = APIRouter(prefix="/ai", tags=["ai"])

# Synchronous mock pipeline, so every task is "completed" immediately.
# A real pipeline would push this through a queue (see SYSTEM_ARCHITECTURE
# doc, Layer 3) and update status as YOLO/SAM/Depth stages finish.
_RESULTS: dict[str, AnalysisResult] = {}


@router.post("/analyze", response_model=ApiResponse[AnalysisStartResponse])
async def start_analysis(
    payload: AnalysisStartRequest, ai_service: AIService = Depends(get_ai_service)
) -> ApiResponse[AnalysisStartResponse]:
    task_id = f"analysis_task_{uuid.uuid4().hex[:8]}"
    _RESULTS[task_id] = await ai_service.analyze_image(payload.image_id)
    return ApiResponse(data=AnalysisStartResponse(task_id=task_id, status="processing"))


@router.get("/analyze/status/{task_id}", response_model=ApiResponse[AnalysisStatus])
async def analysis_status(task_id: str) -> ApiResponse[AnalysisStatus]:
    status = "completed" if task_id in _RESULTS else "failed"
    return ApiResponse(data=AnalysisStatus(status=status))


@router.get("/result/{task_id}", response_model=ApiResponse[AnalysisResult])
async def analysis_result(task_id: str) -> ApiResponse[AnalysisResult]:
    result = _RESULTS.get(task_id)
    if result is None:
        return ApiResponse(success=False, message="not found", data=None)
    return ApiResponse(data=result)
