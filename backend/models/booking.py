from sqlalchemy import Column, Integer, Float, String, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..database import Base

class Booking(Base):
    __tablename__ = "bookings"

    id = Column(Integer, primary_key=True, index=True)
    price = Column(Float, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    start_date = Column(DateTime(timezone=True))
    paid = Column(Boolean, default=True)
    status = Column(String, default='booked') # booked, cancelled, completed

    tour_id = Column(Integer, ForeignKey("tours.id"))
    user_id = Column(Integer, ForeignKey("users.id"))

    tour = relationship("Tour", back_populates="bookings")
    user = relationship("User", back_populates="bookings")
