from app.models.schemas import AnalysisResult, AreaBreakdown, DetectedObject
from app.services.ai.base import AIService


class MockAIService(AIService):
    """Deterministic stand-in for the YOLOv11 + SAM 2 pipeline.

    Returns the same shape the real pipeline will, per
    AI_WORKFLOW_geoheat_ai_green_designer.md section 5-6, so routes and
    the frontend can be built against it today.
    """

    async def analyze_image(self, image_id: str) -> AnalysisResult:
        return AnalysisResult(
            area=AreaBreakdown(total=25, green=5, concrete=20),
            objects=[
                DetectedObject(name="concrete", confidence=0.95, bbox=[120, 200, 500, 700]),
                DetectedObject(name="tree", confidence=0.91, bbox=[50, 60, 150, 260]),
            ],
            heat_level="high",
        )


def get_ai_service() -> AIService:
    # `ai_provider` in core.config picks Mock vs. a future RealYOLOService.
    return MockAIService()
