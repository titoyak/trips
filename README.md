# Trips (Python + React)

## Prerequisites

- Python 3.8+
- Node.js 14+

## Setup

### Backend

1. Navigate to the root directory.

2. Create and activate a virtual environment (optional but recommended):

   ```bash
   python3 -m venv .venv
   source .venv/bin/activate  # On Windows use `.venv\Scripts\activate`
   ```

3. Install dependencies:

   ```bash
   pip install -r backend/requirements.txt
   ```

4. Seed the database (SQLite):

   ```bash
   python3 backend/seed.py
   ```

5. Run the server:
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

## Features Implemented

- **Backend**: FastAPI application with SQLAlchemy ORM.
- **Database**: SQLite (default) or PostgreSQL.
- **API**: CRUD endpoints for Tours, Users, Reviews, and Bookings.
- **Frontend**: React application with Vite.

## Project Structure

- `backend/`: FastAPI application code.
- `frontend/`: React application code.
- `dev_data/`: Data for seeding the database.
