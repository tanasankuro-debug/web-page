from fastapi import APIRouter

from app.models.schemas import ApiResponse, Project, ProjectCreate

router = APIRouter(prefix="/projects", tags=["projects"])

# In-memory placeholder store until the Supabase `projects` table is wired
# up (blocked on freeing a free-tier project slot — see DATABASE_SCHEMA doc).
_PROJECTS: dict[str, Project] = {}


@router.post("", response_model=ApiResponse[Project])
async def create_project(payload: ProjectCreate) -> ApiResponse[Project]:
    project_id = str(len(_PROJECTS) + 1)
    project = Project(id=project_id, name=payload.name, description=payload.description,
                       location=payload.location)
    _PROJECTS[project_id] = project
    return ApiResponse(data=project)


@router.get("", response_model=ApiResponse[list[Project]])
async def list_projects() -> ApiResponse[list[Project]]:
    return ApiResponse(data=list(_PROJECTS.values()))


@router.get("/{project_id}", response_model=ApiResponse[Project])
async def get_project(project_id: str) -> ApiResponse[Project]:
    project = _PROJECTS.get(project_id)
    if project is None:
        return ApiResponse(success=False, message="not found", data=None)
    return ApiResponse(data=project)


@router.delete("/{project_id}", response_model=ApiResponse[None])
async def delete_project(project_id: str) -> ApiResponse[None]:
    _PROJECTS.pop(project_id, None)
    return ApiResponse(data=None)
