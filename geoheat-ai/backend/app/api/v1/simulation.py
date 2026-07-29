from fastapi import APIRouter

from app.models.schemas import ApiResponse, SimulationRequest, SimulationResult

router = APIRouter(prefix="/simulation", tags=["simulation"])


@router.post("/generate", response_model=ApiResponse[SimulationResult])
async def generate_simulation(payload: SimulationRequest) -> ApiResponse[SimulationResult]:
    # Placeholder until FLUX / OpenAI image-to-image (AI_WORKFLOW doc
    # section 11) is wired in behind a SimulationGeneratorService.
    return ApiResponse(
        data=SimulationResult(
            before="/mock/before.jpg",
            after=f"/mock/after-{payload.garden_style}.jpg",
        )
    )
