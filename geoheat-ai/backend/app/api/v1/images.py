import uuid

from fastapi import APIRouter, File, Form, UploadFile

from app.models.schemas import ApiResponse, ImageUploadResponse

router = APIRouter(prefix="/images", tags=["images"])


@router.post("/upload", response_model=ApiResponse[ImageUploadResponse])
async def upload_image(
    image: UploadFile = File(...),
    project_id: str = Form(...),
    type: str = Form("before"),
) -> ApiResponse[ImageUploadResponse]:
    # Placeholder: once Supabase Storage is connected, stream `image` into
    # the `geoheat-storage/users/{user_id}/images/` bucket per the
    # DATABASE_SCHEMA doc instead of discarding it.
    image_id = str(uuid.uuid4())
    return ApiResponse(
        data=ImageUploadResponse(image_id=image_id, url=f"storage/{image_id}-{image.filename}")
    )
