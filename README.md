# Trips (Python + React + Postgres)

This is a rewrite of the Trips application using Python (FastAPI), React, and PostgreSQL.

## Prerequisites

- Python 3.8+
- Node.js 14+
- PostgreSQL

## Setup

### Backend

1. Navigate to the root directory.

2. Install dependencies:
   ```bash
   pip install -r backend/requirements.txt
   ```

3. Seed the database (SQLite):
   ```bash
   python3 backend/seed.py
   ```

4. Run the server:
   ```bash
   python3 -m uvicorn backend.main:app --reload
   ```
   The API will be available at `http://localhost:8000`.
   Documentation is available at `http://localhost:8000/docs`.

### Frontend

1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:5173`.
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:5173`.

## Features Implemented

- **Backend**: FastAPI application with SQLAlchemy ORM.
- **Database**: PostgreSQL schema for Tours.
- **API**: CRUD endpoints for Tours.
- **Frontend**: React application displaying the Tours overview page.

## Next Steps

- Implement User authentication (JWT).
- Migrate User, Review, and Booking models.
- Implement Booking and Payment features.
