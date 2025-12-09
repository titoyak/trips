from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, JSON, Text, ForeignKey, Table
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..database import Base

# Association table for Tour Guides
tour_guides = Table('tour_guides', Base.metadata,
    Column('tour_id', Integer, ForeignKey('tours.id')),
    Column('user_id', Integer, ForeignKey('users.id'))
)

class Tour(Base):
    __tablename__ = "tours"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(40), unique=True, nullable=False, index=True)
    slug = Column(String, index=True)
    duration = Column(Integer, nullable=False)
    max_group_size = Column(Integer, nullable=False)
    difficulty = Column(String, nullable=False)
    ratings_average = Column(Float, default=4.5)
    ratings_quantity = Column(Integer, default=0)
    price = Column(Float, nullable=False)
    price_discount = Column(Float)
    summary = Column(Text, nullable=False)
    description = Column(Text)
    image_cover = Column(String, nullable=False)
    images = Column(JSON)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    start_dates = Column(JSON)
    secret_tour = Column(Boolean, default=False)
    start_location = Column(JSON)
    locations = Column(JSON)

    # Relationships
    guides = relationship("User", secondary=tour_guides, back_populates="tours_guided")
    reviews = relationship("Review", back_populates="tour")
    bookings = relationship("Booking", back_populates="tour")
