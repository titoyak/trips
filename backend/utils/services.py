from sqlalchemy.orm import Session
from datetime import datetime, timedelta, timezone
from .. import models

def check_and_update_booking_status(db: Session, user_id: int):
    """
    Checks all bookings for a user and updates their status to 'completed'
    if the tour has finished.
    """
    bookings = db.query(models.Booking).filter(models.Booking.user_id == user_id).all()
    
    now = datetime.now(timezone.utc)
    updated = False
    
    for booking in bookings:
        if booking.status == 'booked' and booking.start_date:
            # Accessing booking.tour triggers lazy loading if not already loaded
            # Ideally, we should eager load if performance becomes an issue, 
            # but for this logic, it's acceptable.
            tour_duration = booking.tour.duration
            end_date = booking.start_date + timedelta(days=tour_duration)
            
            if now > end_date:
                booking.status = 'completed'
                updated = True
    
    if updated:
        db.commit()
