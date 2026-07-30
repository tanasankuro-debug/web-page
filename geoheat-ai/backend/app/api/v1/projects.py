from fastapi import APIRouter, Depends, HTTPException

from app.core.deps import get_current_user_id
from app.core.supabase import get_supabase
from app.models.schemas import ApiResponse, Project, ProjectCreate

router = APIRouter(prefix="/projects", tags=["projects"])


@router.post("", response_model=ApiResponse[Project])
async def create_project(
    payload: ProjectCreate, user_id: str = Depends(get_current_user_id)
) -> ApiResponse[Project]:
    row = {**payload.model_dump(), "user_id": user_id}
    result = get_supabase().table("projects").insert(row).execute()
    return ApiResponse(data=Project(**result.data[0]))


@router.get("", response_model=ApiResponse[list[Project]])
async def list_projects(user_id: str = Depends(get_current_user_id)) -> ApiResponse[list[Project]]:
    result = (
        get_supabase()
        .table("projects")
        .select("*")
        .or_(f"user_id.eq.{user_id},is_demo.eq.true")
        .order("created_at", desc=True)
        .execute()
    )
    return ApiResponse(data=[Project(**row) for row in result.data])


@router.get("/{project_id}", response_model=ApiResponse[Project])
async def get_project(
    project_id: str, user_id: str = Depends(get_current_user_id)
) -> ApiResponse[Project]:
    result = get_supabase().table("projects").select("*").eq("id", project_id).execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Project not found")
    project = result.data[0]
    if project["user_id"] != user_id and not project["is_demo"]:
        raise HTTPException(status_code=403, detail="Not your project")
    return ApiResponse(data=Project(**project))


@router.delete("/{project_id}", response_model=ApiResponse[None])
async def delete_project(
    project_id: str, user_id: str = Depends(get_current_user_id)
) -> ApiResponse[None]:
    get_supabase().table("projects").delete().eq("id", project_id).eq("user_id", user_id).execute()
    return ApiResponse(data=None)
