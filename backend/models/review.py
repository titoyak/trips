from sqlalchemy import Column, Integer, Float, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..database import Base

class Review(Base):
    __tablename__ = "reviews"
    
    id = Column(Integer, primary_key=True, index=True)
    review = Column(Text, nullable=False)
    rating = Column(Float, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    tour_id = Column(Integer, ForeignKey("tours.id"))
    user_id = Column(Integer, ForeignKey("users.id"))
    
    tour = relationship("Tour", back_populates="reviews")
    user = relationship("User", back_populates="reviews")
