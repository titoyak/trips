from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from .. import models, schemas
from ..utils import auth
from ..database import get_db

router = APIRouter(
    prefix="/reviews",
    tags=["reviews"]
)

@router.get("/my-reviews", response_model=List[schemas.Review])
def get_my_reviews(db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    reviews = db.query(models.Review).filter(models.Review.user_id == current_user.id).all()
    return reviews
