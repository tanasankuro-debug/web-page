import uuid

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile

from app.core.deps import get_current_user_id
from app.core.supabase import get_supabase
from app.models.schemas import ApiResponse, ImageUploadResponse, ProjectImage

router = APIRouter(prefix="/images", tags=["images"])

BUCKET = "geoheat-storage"


@router.post("/upload", response_model=ApiResponse[ImageUploadResponse])
async def upload_image(
    image: UploadFile = File(...),
    project_id: str = Form(...),
    image_type: str = Form("before"),
    user_id: str = Depends(get_current_user_id),
) -> ApiResponse[ImageUploadResponse]:
    supabase = get_supabase()

    project = supabase.table("projects").select("id, user_id").eq("id", project_id).execute()
    if not project.data or project.data[0]["user_id"] != user_id:
        raise HTTPException(status_code=403, detail="Not your project")

    contents = await image.read()
    extension = (image.filename or "jpg").split(".")[-1]
    storage_path = f"users/{user_id}/images/{uuid.uuid4()}.{extension}"

    supabase.storage.from_(BUCKET).upload(
        storage_path,
        contents,
        {"content-type": image.content_type or "application/octet-stream"},
    )
    signed = supabase.storage.from_(BUCKET).create_signed_url(storage_path, 3600)

    row = {
        "project_id": project_id,
        "user_id": user_id,
        "image_url": storage_path,
        "image_type": image_type,
    }
    result = supabase.table("project_images").insert(row).execute()
    saved = ProjectImage(**result.data[0])

    return ApiResponse(data=ImageUploadResponse(image_id=saved.id, url=signed["signedURL"]))
