from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from .. import models, schemas
from ..utils import auth, services
from ..database import get_db

router = APIRouter(
    prefix="/bookings",
    tags=["bookings"]
)

@router.post("/", response_model=schemas.Booking)
def create_booking(booking: schemas.BookingCreate, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    # Check if user already has an active booking for this tour
    existing_booking = db.query(models.Booking).filter(
        models.Booking.user_id == current_user.id,
        models.Booking.tour_id == booking.tour_id,
        models.Booking.status == 'booked'
    ).first()

    if existing_booking:
        raise HTTPException(status_code=400, detail="You already have an active booking for this tour.")

    # In a real app, we would verify payment with Stripe here
    db_booking = models.Booking(
        tour_id=booking.tour_id,
        user_id=current_user.id,
        price=booking.price,
        start_date=booking.start_date,
        paid=True,
        status='booked'
    )
    db.add(db_booking)
    db.commit()
    db.refresh(db_booking)
    return db_booking

@router.get("/my-tours", response_model=List[schemas.Booking])
def get_my_bookings(db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    # Update booking statuses before fetching
    services.check_and_update_booking_status(db, current_user.id)
    
    bookings = db.query(models.Booking).filter(models.Booking.user_id == current_user.id).all()
    return bookings

@router.patch("/{booking_id}/cancel", response_model=schemas.Booking)
def cancel_booking(booking_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    booking = db.query(models.Booking).filter(models.Booking.id == booking_id, models.Booking.user_id == current_user.id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    
    booking.status = 'cancelled'
    db.commit()
    db.refresh(booking)
    return booking

@router.patch("/{booking_id}/complete", response_model=schemas.Booking)
def complete_booking(booking_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    booking = db.query(models.Booking).filter(models.Booking.id == booking_id, models.Booking.user_id == current_user.id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    
    booking.status = 'completed'
    db.commit()
    db.refresh(booking)
    return booking
