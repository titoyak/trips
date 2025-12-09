from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

# --- User Schemas ---
class UserBase(BaseModel):
    name: str
    email: str

class UserCreate(UserBase):
    password: str
    passwordConfirm: str
    role: Optional[str] = 'user'

class UserLogin(BaseModel):
    email: str
    password: str

class UserUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    photo: Optional[str] = None

class UserPasswordUpdate(BaseModel):
    passwordCurrent: str
    password: str
    passwordConfirm: str

class User(UserBase):
    id: int
    photo: str
    role: str
    active: bool

    class Config:
        from_attributes = True

# --- Review Schemas ---
class ReviewBase(BaseModel):
    review: str
    rating: float

class ReviewCreate(ReviewBase):
    pass
    # user_id will be taken from current_user

class ReviewPublic(ReviewBase):
    id: int
    created_at: datetime
    user: User

    class Config:
        from_attributes = True

# --- Tour Schemas ---
class TourBase(BaseModel):
    name: str
    duration: int
    max_group_size: int
    difficulty: str
    price: float
    summary: str
    image_cover: str
    
    # Optional fields with defaults or None
    ratings_average: Optional[float] = 4.5
    ratings_quantity: Optional[int] = 0
    price_discount: Optional[float] = None
    description: Optional[str] = None
    images: Optional[List[str]] = []
    start_dates: Optional[List[datetime]] = []
    secret_tour: Optional[bool] = False
    start_location: Optional[dict] = None
    locations: Optional[List[dict]] = []

class TourCreate(TourBase):
    pass

class Tour(TourBase):
    id: int
    slug: Optional[str] = None
    created_at: datetime
    guides: List[User] = []
    reviews: List[ReviewPublic] = []

    class Config:
        from_attributes = True

class Review(ReviewPublic):
    tour: Optional[Tour] = None

# Update forward refs
Review.update_forward_refs()

# --- Booking Schemas ---
class BookingBase(BaseModel):
    tour_id: int
    price: float
    start_date: datetime

class BookingCreate(BookingBase):
    pass

class Booking(BookingBase):
    id: int
    created_at: datetime
    start_date: Optional[datetime] = None
    status: str
    paid: bool = True
    tour: Tour
    user: User

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str
