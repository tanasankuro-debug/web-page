from fastapi import APIRouter

from app.models.schemas import ApiResponse, GeoHeatData

router = APIRouter(prefix="/geoheat", tags=["geoheat"])


@router.get("/data", response_model=ApiResponse[GeoHeatData])
async def get_heat_data(lat: float, lng: float, date: str | None = None) -> ApiResponse[GeoHeatData]:
    # Placeholder until this queries the real `geoheat_environment_data`
    # table (populated from the main GeoHeat GIS/LST pipeline, not this app).
    return ApiResponse(
        data=GeoHeatData(temperature=39, lst=42, ndvi=0.18, risk="high")
    )
