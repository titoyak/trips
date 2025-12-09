from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import models, schemas
from ..utils import auth
from ..database import get_db

router = APIRouter(
    prefix="/users",
    tags=["users"]
)

@router.post("/signup", response_model=schemas.Token)
def signup(user: schemas.UserCreate, db: Session = Depends(get_db)):
    if user.password != user.passwordConfirm:
        raise HTTPException(status_code=400, detail="Passwords do not match")
    
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    try:
        hashed_password = auth.get_password_hash(user.password)
        new_user = models.User(
            name=user.name,
            email=user.email,
            password=hashed_password,
            role=user.role
        )
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        
        access_token = auth.create_access_token(data={"sub": new_user.email})
        return {"access_token": access_token, "token_type": "bearer"}
    except Exception as e:
        print(f"Signup Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/login", response_model=schemas.Token)
def login(user_credentials: schemas.UserLogin, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == user_credentials.email).first()
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    if not auth.verify_password(user_credentials.password, user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    access_token = auth.create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me", response_model=schemas.User)
def read_users_me(current_user: models.User = Depends(auth.get_current_user)):
    return current_user

@router.patch("/updateMe", response_model=schemas.User)
def update_user_me(user_update: schemas.UserUpdate, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    if user_update.name:
        current_user.name = user_update.name
    if user_update.email:
        current_user.email = user_update.email
    if user_update.photo:
        current_user.photo = user_update.photo
    
    db.commit()
    db.refresh(current_user)
    return current_user

@router.patch("/updateMyPassword", response_model=schemas.Token)
def update_password_me(password_update: schemas.UserPasswordUpdate, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    if not auth.verify_password(password_update.passwordCurrent, current_user.password):
        raise HTTPException(status_code=401, detail="Incorrect current password")
    
    if password_update.password != password_update.passwordConfirm:
        raise HTTPException(status_code=400, detail="Passwords do not match")
    
    hashed_password = auth.get_password_hash(password_update.password)
    current_user.password = hashed_password
    db.commit()
    
    access_token = auth.create_access_token(data={"sub": current_user.email})
    return {"access_token": access_token, "token_type": "bearer"}
