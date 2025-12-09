from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from typing import List
from .. import models, schemas
from ..utils import auth
from ..database import get_db

router = APIRouter(
    prefix="/tours",
    tags=["tours"]
)

@router.post("/", response_model=schemas.Tour)
def create_tour(tour: schemas.TourCreate, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    if current_user.role != 'admin':
        raise HTTPException(status_code=403, detail="You do not have permission to perform this action")

    db_tour = models.Tour(
        name=tour.name,
        duration=tour.duration,
        max_group_size=tour.max_group_size,
        difficulty=tour.difficulty,
        price=tour.price,
        summary=tour.summary,
        image_cover=tour.image_cover,
        ratings_average=tour.ratings_average,
        ratings_quantity=tour.ratings_quantity,
        price_discount=tour.price_discount,
        description=tour.description,
        images=tour.images,
        start_dates=tour.start_dates,
        secret_tour=tour.secret_tour,
        start_location=tour.start_location,
        locations=tour.locations
    )
    # Simple slug generation
    db_tour.slug = tour.name.lower().replace(" ", "-")
    
    db.add(db_tour)
    db.commit()
    db.refresh(db_tour)
    return db_tour

@router.get("/", response_model=List[schemas.Tour])
def get_tours(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    tours = db.query(models.Tour).offset(skip).limit(limit).all()
    return tours

@router.get("/{tour_id}", response_model=schemas.Tour)
def get_tour(tour_id: int, db: Session = Depends(get_db)):
    tour = db.query(models.Tour).options(
        joinedload(models.Tour.guides),
        joinedload(models.Tour.reviews).joinedload(models.Review.user)
    ).filter(models.Tour.id == tour_id).first()
    
    if tour is None:
        raise HTTPException(status_code=404, detail="Tour not found")
    return tour

@router.post("/{tour_id}/reviews", response_model=schemas.Review)
def create_review(tour_id: int, review: schemas.ReviewCreate, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    tour = db.query(models.Tour).filter(models.Tour.id == tour_id).first()
    if not tour:
        raise HTTPException(status_code=404, detail="Tour not found")
    
    # Check if user has booked the tour
    booking = db.query(models.Booking).filter(
        models.Booking.tour_id == tour_id,
        models.Booking.user_id == current_user.id,
        models.Booking.status == 'completed'
    ).first()

    if not booking:
        raise HTTPException(status_code=403, detail="You can only review tours you have completed.")
        
    db_review = models.Review(
        review=review.review,
        rating=review.rating,
        tour_id=tour_id,
        user_id=current_user.id
    )
    db.add(db_review)
    db.commit()
    db.refresh(db_review)
    return db_review
