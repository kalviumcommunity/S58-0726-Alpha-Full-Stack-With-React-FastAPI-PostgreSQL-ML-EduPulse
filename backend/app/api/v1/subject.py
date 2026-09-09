from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.base import SessionLocal
from app.schemas.subject import SubjectCreate, SubjectResponse, SubjectUpdate
from app.services.subject import create_subject, delete_subject, get_subject, get_subjects, update_subject


router = APIRouter(
    prefix="/subjects",
    tags=["Subjects"],
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/", response_model=list[SubjectResponse])
def list_subjects(db: Session = Depends(get_db)):
    return get_subjects(db)


@router.get("/{subject_id}", response_model=SubjectResponse)
def read_subject(
    subject_id: int,
    db: Session = Depends(get_db),
):
    subject = get_subject(db, subject_id)

    if subject is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Subject not found",
        )

    return subject


@router.delete("/{subject_id}")
def remove_subject(
    subject_id: int,
    db: Session = Depends(get_db),
):
    try:
        result = delete_subject(db, subject_id)
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=str(exc),
        )

    if result is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Subject not found",
        )

    return {"message": result}


@router.patch("/{subject_id}", response_model=SubjectResponse)
def edit_subject(
    subject_id: int,
    subject_data: SubjectUpdate,
    db: Session = Depends(get_db),
):
    try:
        subject = update_subject(db, subject_id, subject_data)
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=str(exc),
        )

    if subject is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Subject not found",
        )

    return subject


@router.post(
    "/",
    response_model=SubjectResponse,
    status_code=status.HTTP_201_CREATED,
)
def add_subject(
    subject_data: SubjectCreate,
    db: Session = Depends(get_db),
):
    try:
        return create_subject(db, subject_data)
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=str(exc),
        )
