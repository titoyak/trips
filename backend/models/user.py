from sqlalchemy import Column, Integer, String, Boolean, DateTime
from sqlalchemy.orm import relationship
from ..database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    photo = Column(String, default='default.jpg')
    role = Column(String, default='tourist') # admin, tourist, guide
    password = Column(String, nullable=False)
    password_changed_at = Column(DateTime(timezone=True))
    active = Column(Boolean, default=True)

    # Relationships
    # Use string for secondary to avoid circular import
    tours_guided = relationship("Tour", secondary="tour_guides", back_populates="guides")
    reviews = relationship("Review", back_populates="user")
    bookings = relationship("Booking", back_populates="user")
