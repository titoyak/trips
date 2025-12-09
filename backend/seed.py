import json
import os
import sys

# Add the parent directory to sys.path so we can import backend modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.database import SessionLocal, engine
from backend import models

def seed_data():
    db = SessionLocal()

    # Create tables
    models.Base.metadata.create_all(bind=engine)

    # --- Seed Tours ---
    if db.query(models.Tour).count() == 0:
        print("Seeding tours...")
        try:
            # dev_data is now in the project root, so we go up one level from backend/
            with open(os.path.join(os.path.dirname(os.path.dirname(__file__)), 'dev_data/data/tours.json')) as f:
                tours_data = json.load(f)

            for tour in tours_data:
                new_tour = models.Tour(
                    name=tour['name'],
                    slug=tour['name'].lower().replace(' ', '-'),
                    duration=tour['duration'],
                    max_group_size=tour['max_group_size'],
                    difficulty=tour['difficulty'],
                    ratings_average=tour.get('ratings_average'),
                    ratings_quantity=tour.get('ratings_quantity'),
                    price=tour['price'],
                    price_discount=tour.get('price_discount'),
                    summary=tour['summary'],
                    description=tour.get('description'),
                    image_cover=tour['image_cover'],
                    images=tour.get('images'),
                    start_dates=tour.get('start_dates'),
                    secret_tour=tour.get('secret_tour', False),
                    start_location=tour.get('start_location'),
                    locations=tour.get('locations')
                )
                db.add(new_tour)
            db.commit()
            print("Tours seeded successfully!")
        except Exception as e:
            print(f"Error seeding tours: {e}")
            db.rollback()
    else:
        print("Tours already exist. Skipping.")

    # --- Seed Users ---
    if db.query(models.User).count() == 0:
        print("Seeding users...")
        try:
            with open(os.path.join(os.path.dirname(os.path.dirname(__file__)), 'dev_data/data/users.json')) as f:
                users_data = json.load(f)

            for user in users_data:
                # Hash the password 'test1234' for all users for testing purposes
                # Or use the existing hash if you can verify it matches the algorithm
                # For simplicity, let's set a known password for everyone
                from passlib.context import CryptContext
                pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")
                hashed_password = pwd_context.hash("test1234")

                new_user = models.User(
                    name=user['name'],
                    email=user['email'],
                    photo=user['photo'],
                    role=user['role'],
                    password=hashed_password, # Use the new hashed password
                    active=user.get('active', True)
                )
                db.add(new_user)
            db.commit()
            print("Users seeded successfully!")
        except Exception as e:
            print(f"Error seeding users: {e}")
            db.rollback()
    else:
        print("Users already exist. Skipping.")

    # --- Seed Reviews ---
    if db.query(models.Review).count() == 0:
        print("Seeding reviews...")
        try:
            # Load data files to build maps
            with open(os.path.join(os.path.dirname(os.path.dirname(__file__)), 'dev_data/data/tours.json')) as f:
                tours_data = json.load(f)
            
            with open(os.path.join(os.path.dirname(os.path.dirname(__file__)), 'dev_data/data/users.json')) as f:
                users_data = json.load(f)

            with open(os.path.join(os.path.dirname(os.path.dirname(__file__)), 'dev_data/data/reviews.json')) as f:
                reviews_data = json.load(f)

            # Build maps: MongoDB _id -> Unique Field
            tour_id_map = {t['_id']: t['name'] for t in tours_data}
            user_id_map = {u['_id']: u['email'] for u in users_data}

            # Fetch current DB objects to get SQL IDs
            db_tours = {t.name: t.id for t in db.query(models.Tour).all()}
            db_users = {u.email: u.id for u in db.query(models.User).all()}

            for review in reviews_data:
                tour_mongo_id = review['tour']
                user_mongo_id = review['user']

                tour_name = tour_id_map.get(tour_mongo_id)
                user_email = user_id_map.get(user_mongo_id)

                if tour_name and user_email:
                    tour_id = db_tours.get(tour_name)
                    user_id = db_users.get(user_email)

                    if tour_id and user_id:
                        new_review = models.Review(
                            review=review['review'],
                            rating=review['rating'],
                            tour_id=tour_id,
                            user_id=user_id
                        )
                        db.add(new_review)
            
            db.commit()
            print("Reviews seeded successfully!")
        except Exception as e:
            print(f"Error seeding reviews: {e}")
            db.rollback()
    else:
        print("Reviews already exist. Skipping.")

    db.close()

if __name__ == "__main__":
    seed_data()
