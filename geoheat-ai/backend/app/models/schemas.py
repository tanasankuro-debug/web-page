from __future__ import annotations

from typing import Generic, Literal, TypeVar

from pydantic import BaseModel, Field

T = TypeVar("T")

GardenStyle = Literal["tropical", "minimal", "low_maintenance"]
HeatLevel = Literal["low", "moderate", "high", "extreme"]
CoolingEffect = Literal["low", "medium", "high"]


class ApiResponse(BaseModel, Generic[T]):
    success: bool = True
    data: T | None = None
    message: str = "success"


# ---------------------------------------------------------------------------
# Projects
# ---------------------------------------------------------------------------


class ProjectCreate(BaseModel):
    name: str
    description: str | None = None
    address: str | None = None
    latitude: float | None = None
    longitude: float | None = None


class Project(BaseModel):
    id: str
    user_id: str
    name: str
    description: str | None = None
    address: str | None = None
    latitude: float | None = None
    longitude: float | None = None
    area_size: float | None = None
    status: str = "draft"
    is_demo: bool = False
    created_at: str
    updated_at: str


# ---------------------------------------------------------------------------
# Images
# ---------------------------------------------------------------------------


class ImageUploadResponse(BaseModel):
    image_id: str
    url: str


class ProjectImage(BaseModel):
    id: str
    project_id: str
    image_url: str
    image_type: str
    created_at: str


# ---------------------------------------------------------------------------
# AI analysis
# ---------------------------------------------------------------------------


class DetectedObject(BaseModel):
    type: str
    confidence: float
    bbox: list[int] | None = None


class AnalysisStartRequest(BaseModel):
    project_id: str
    image_id: str


class AnalysisResult(BaseModel):
    id: str
    project_id: str
    image_id: str | None = None
    total_area: float
    green_area: float
    concrete_area: float
    green_percentage: float
    heat_level: HeatLevel
    detected_objects: list[DetectedObject]
    created_at: str


# ---------------------------------------------------------------------------
# Green score
# ---------------------------------------------------------------------------


class GreenScoreCalculateRequest(BaseModel):
    project_id: str
    stage: Literal["current", "projected"] = "current"


class GreenScore(BaseModel):
    id: str
    project_id: str
    stage: str
    vegetation_score: float
    shade_score: float
    heat_reduction_score: float
    diversity_score: float
    maintenance_score: float
    total_score: float
    created_at: str


# ---------------------------------------------------------------------------
# Plants
# ---------------------------------------------------------------------------


class Plant(BaseModel):
    id: str
    name_th: str
    name_en: str | None = None
    scientific_name: str | None = None
    category: str
    sunlight_requirement: str | None = None
    water_requirement: str | None = None
    maintenance_level: str | None = None
    heat_tolerance: float | None = None
    cooling_score: float | None = None
    max_height_m: float | None = None
    min_area_sqm: float | None = None
    image_url: str | None = None
    description: str | None = None


# ---------------------------------------------------------------------------
# Recommendations / garden designs
# ---------------------------------------------------------------------------


class GardenRecommendationRequest(BaseModel):
    project_id: str
    area: float
    budget: float | None = None
    style: GardenStyle | None = None


class RecommendedPlant(BaseModel):
    plant_id: str
    name_th: str
    quantity: int


class Recommendation(BaseModel):
    id: str
    project_id: str
    style: GardenStyle
    plants: list[RecommendedPlant]
    estimated_cost: float
    cooling_effect: CoolingEffect
    reasoning: str | None = None
    created_at: str


# ---------------------------------------------------------------------------
# History / assistant
# ---------------------------------------------------------------------------


class ChatRequest(BaseModel):
    message: str
    project_id: str | None = None


class ChatResponse(BaseModel):
    answer: str


class GeoHeatData(BaseModel):
    temperature: float
    lst: float
    ndvi: float
    risk: str


class ManualMeasurementRequest(BaseModel):
    points: list[tuple[float, float]]


class MeasurementResult(BaseModel):
    area: float
    unit: str = "sqm"


class SimulationRequest(BaseModel):
    project_id: str
    garden_style: GardenStyle
    plants: list[str] = Field(default_factory=list)


class SimulationResult(BaseModel):
    before: str
    after: str
