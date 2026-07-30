# Weights per Prompt camera/00_MVP_Specification_FINAL.md §4 (FINAL,
# supersedes the earlier 40/25/25/10 formula from 04_AI_WorkFLOW.md):
# Vegetation 30%, Shade 25%, Heat Reduction 20%, Diversity 15%, Maintenance 10%.
_WEIGHTS = {
    "vegetation": 0.30,
    "shade": 0.25,
    "heat_reduction": 0.20,
    "diversity": 0.15,
    "maintenance": 0.10,
}


def calculate_green_score(
    *,
    vegetation_score: float,
    shade_score: float,
    heat_reduction_score: float,
    diversity_score: float,
    maintenance_score: float,
) -> float:
    total = (
        vegetation_score * _WEIGHTS["vegetation"]
        + shade_score * _WEIGHTS["shade"]
        + heat_reduction_score * _WEIGHTS["heat_reduction"]
        + diversity_score * _WEIGHTS["diversity"]
        + maintenance_score * _WEIGHTS["maintenance"]
    )
    return round(total, 1)
