from fastapi import APIRouter

from app.api.v1 import (
    ai_analysis,
    assistant,
    garden,
    geoheat,
    green_score,
    history,
    images,
    measurement,
    projects,
    simulation,
)

api_router = APIRouter()
api_router.include_router(projects.router)
api_router.include_router(images.router)
api_router.include_router(ai_analysis.router)
api_router.include_router(measurement.router)
api_router.include_router(geoheat.router)
api_router.include_router(garden.router)
api_router.include_router(simulation.router)
api_router.include_router(green_score.router)
api_router.include_router(history.router)
api_router.include_router(assistant.router)
