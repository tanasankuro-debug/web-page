from app.models.schemas import DetectedObject
from app.services.ai.base import AIService, RawAnalysis, RawArea


class MockAIService(AIService):
    """Deterministic stand-in for the YOLOv11 + SAM 2 pipeline.

    Returns the same shape the real pipeline will, per
    04_AI_WorkFLOW.md / 12_AI_Model_Specification.md, so routes and the
    frontend can be built against it today. Permanent for MVP per
    00_MVP_Specification_FINAL.md §2 (no GPU hosting budget identified).
    """

    async def analyze_image(self, image_id: str) -> RawAnalysis:
        return RawAnalysis(
            area=RawArea(total=25, green=5, concrete=20),
            objects=[
                DetectedObject(type="concrete", confidence=0.95, bbox=[120, 200, 500, 700]),
                DetectedObject(type="tree", confidence=0.91, bbox=[50, 60, 150, 260]),
            ],
            heat_level="high",
        )


def get_ai_service() -> AIService:
    # `ai_provider` in core.config picks Mock vs. a future RealYOLOService.
    return MockAIService()
