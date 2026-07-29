from __future__ import annotations

from typing import Generic, TypeVar

from pydantic import BaseModel, Field

T = TypeVar("T")


class ApiError(BaseModel):
    code: str
    message: str


class ApiResponse(BaseModel, Generic[T]):
    success: bool = True
    data: T | None = None
    message: str = "success"


# ---------------------------------------------------------------------------
# Auth (Supabase Auth is the source of truth; these mirror it for API docs)
# ---------------------------------------------------------------------------


class RegisterRequest(BaseModel):
    email: str
    password: str
    full_name: str


class LoginRequest(BaseModel):
    email: str
    password: str


# ---------------------------------------------------------------------------
# Projects
# ---------------------------------------------------------------------------


class Location(BaseModel):
    lat: float
    lng: float


class ProjectCreate(BaseModel):
    name: str
    description: str | None = None
    location: Location | None = None


class Project(BaseModel):
    id: str
    name: str
    description: str | None = None
    location: Location | None = None
    area_size: float | None = None
    status: str = "draft"
    green_score: float | None = None


# ---------------------------------------------------------------------------
# Images
# ---------------------------------------------------------------------------


class ImageUploadResponse(BaseModel):
    image_id: str
    url: str


class ProjectImage(BaseModel):
    url: str
    type: str


# ---------------------------------------------------------------------------
# AI analysis (see AI_WORKFLOW doc: YOLO -> SAM -> Depth -> area calc)
# ---------------------------------------------------------------------------


class DetectedObject(BaseModel):
    name: str
    confidence: float
    bbox: list[int] | None = None


class AreaBreakdown(BaseModel):
    total: float
    green: float
    concrete: float


class AnalysisStartRequest(BaseModel):
    project_id: str
    image_id: str


class AnalysisStartResponse(BaseModel):
    task_id: str
    status: str = "processing"


class AnalysisStatus(BaseModel):
    status: str = Field(description="pending | processing | completed | failed")


class AnalysisResult(BaseModel):
    area: AreaBreakdown
    objects: list[DetectedObject]
    heat_level: str


# ---------------------------------------------------------------------------
# Area measurement
# ---------------------------------------------------------------------------


class ManualMeasurementRequest(BaseModel):
    points: list[tuple[float, float]]


class MeasurementResult(BaseModel):
    area: float
    unit: str = "sqm"


# ---------------------------------------------------------------------------
# GeoHeat / GIS
# ---------------------------------------------------------------------------


class GeoHeatData(BaseModel):
    temperature: float
    lst: float
    ndvi: float
    risk: str


# ---------------------------------------------------------------------------
# Garden recommendation
# ---------------------------------------------------------------------------


class GardenRecommendationRequest(BaseModel):
    project_id: str
    area: float
    budget: float | None = None
    style: str | None = None


class RecommendedPlant(BaseModel):
    name: str
    quantity: int


class GardenRecommendation(BaseModel):
    garden_type: str
    plants: list[RecommendedPlant]
    cost: float
    cooling: str


class Plant(BaseModel):
    name: str
    score: float


# ---------------------------------------------------------------------------
# Simulation
# ---------------------------------------------------------------------------


class SimulationRequest(BaseModel):
    project_id: str
    garden_style: str
    plants: list[str] = Field(default_factory=list)


class SimulationResult(BaseModel):
    before: str
    after: str


# ---------------------------------------------------------------------------
# Green score
# ---------------------------------------------------------------------------


class GreenScoreDetail(BaseModel):
    green: float
    shade: float
    cooling: float
    diversity: float = 0


class GreenScoreResult(BaseModel):
    score: float
    detail: GreenScoreDetail


class GreenScoreCalculateRequest(BaseModel):
    project_id: str


# ---------------------------------------------------------------------------
# History / assistant / admin
# ---------------------------------------------------------------------------


class HistoryItem(BaseModel):
    project: str
    date: str
    score: float


class ChatRequest(BaseModel):
    message: str
    project_id: str | None = None


class ChatResponse(BaseModel):
    answer: str
