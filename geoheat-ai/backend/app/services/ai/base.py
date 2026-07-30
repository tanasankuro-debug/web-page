from abc import ABC, abstractmethod

from pydantic import BaseModel

from app.models.schemas import DetectedObject, HeatLevel


class RawArea(BaseModel):
    total: float
    green: float
    concrete: float


class RawAnalysis(BaseModel):
    """Raw pipeline output, before it's persisted as an `analysis_results` row."""

    area: RawArea
    objects: list[DetectedObject]
    heat_level: HeatLevel


class AIService(ABC):
    """Adapter interface for area/object analysis.

    Swap MockAIService for a RealYOLOService (or similar) once real
    models are available — nothing calling this interface needs to change.
    See 04_AI_WorkFLOW.md / 12_AI_Model_Specification.md.
    """

    @abstractmethod
    async def analyze_image(self, image_id: str) -> RawAnalysis: ...
