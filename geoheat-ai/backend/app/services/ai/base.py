from abc import ABC, abstractmethod

from app.models.schemas import AnalysisResult


class AIService(ABC):
    """Adapter interface for area/object analysis.

    Swap MockAIService for a RealYOLOService (or similar) once real
    models are available — nothing calling this interface needs to change.
    See AI_WORKFLOW_geoheat_ai_green_designer.md, section 17.
    """

    @abstractmethod
    async def analyze_image(self, image_id: str) -> AnalysisResult: ...
