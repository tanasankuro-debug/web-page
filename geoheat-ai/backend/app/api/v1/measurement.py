from fastapi import APIRouter

from app.models.schemas import ApiResponse, ManualMeasurementRequest, MeasurementResult

router = APIRouter(prefix="/measurement", tags=["measurement"])


@router.post("/manual", response_model=ApiResponse[MeasurementResult])
async def manual_measurement(payload: ManualMeasurementRequest) -> ApiResponse[MeasurementResult]:
    points = payload.points
    if len(points) < 3:
        return ApiResponse(success=False, message="need at least 3 points", data=None)

    # Shoelace formula for polygon area from user-tapped corner points
    # (AI_WORKFLOW doc section 6, "Current MVP Method"). Assumes `points`
    # are already in meters (client-side calibration); a raw-pixel input
    # would need a scale factor from a reference object or camera depth.
    area = 0.0
    for i in range(len(points)):
        x1, y1 = points[i]
        x2, y2 = points[(i + 1) % len(points)]
        area += x1 * y2 - x2 * y1
    area = abs(area) / 2

    return ApiResponse(data=MeasurementResult(area=round(area, 2)))
