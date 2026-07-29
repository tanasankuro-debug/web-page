from fastapi import APIRouter

from app.models.schemas import ApiResponse, ChatRequest, ChatResponse

router = APIRouter(prefix="/assistant", tags=["assistant"])


@router.post("/chat", response_model=ApiResponse[ChatResponse])
async def chat(payload: ChatRequest) -> ApiResponse[ChatResponse]:
    # Placeholder until this calls an LLM with the project's analysis
    # context (AI_WORKFLOW doc section 14).
    return ApiResponse(
        data=ChatResponse(answer="พื้นที่นี้เหมาะกับไม้ทนแดด")
    )
