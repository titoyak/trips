from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from . import models
from .database import engine
from .routers import tours, users, bookings, reviews

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Trips API")

origins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:3000",
    "https://trips-app.vercel.app",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(tours.router, prefix="/api/v1")
app.include_router(users.router, prefix="/api/v1")
app.include_router(bookings.router, prefix="/api/v1")
app.include_router(reviews.router, prefix="/api/v1")

@app.get("/")
def read_root():
    return {"message": "Welcome to Trips API"}
