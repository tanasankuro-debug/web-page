from app.models.schemas import GreenScoreDetail, GreenScoreResult

# Weights from AI_WORKFLOW doc section 12:
# Green Coverage 40%, Shade 25%, Heat Reduction 25%, Diversity 10%.
_WEIGHTS = {"green": 0.40, "shade": 0.25, "cooling": 0.25, "diversity": 0.10}


def calculate_green_score(
    *, green_coverage: float, shade: float, cooling: float, diversity: float = 0,
) -> GreenScoreResult:
    score = (
        green_coverage * _WEIGHTS["green"]
        + shade * _WEIGHTS["shade"]
        + cooling * _WEIGHTS["cooling"]
        + diversity * _WEIGHTS["diversity"]
    )
    return GreenScoreResult(
        score=round(score, 1),
        detail=GreenScoreDetail(
            green=green_coverage, shade=shade, cooling=cooling, diversity=diversity
        ),
    )
