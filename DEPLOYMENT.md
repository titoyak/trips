# Deployment Guide for Vercel

This project is configured to be deployed on [Vercel](https://vercel.com) as a monorepo containing a React frontend and a FastAPI backend.

## Prerequisites

1.  **Vercel Account**: Sign up at [vercel.com](https://vercel.com).
2.  **Vercel CLI** (Optional): Install with `npm i -g vercel` for deploying from the terminal.
3.  **PostgreSQL Database**: You need a hosted PostgreSQL database. Vercel Postgres, Supabase, or Neon are good options.

## Project Structure

- `frontend/`: React application (Vite)
- `backend/`: FastAPI application
- `vercel.json`: Configuration for Vercel deployment

## Deployment Steps

### 1. Database Setup

Create a PostgreSQL database and get the connection string. It should look like:
`postgres://user:password@host:port/database`

### 2. Environment Variables

You need to set the following environment variable in your Vercel project settings:

- `DATABASE_URL`: Your PostgreSQL connection string.

### 3. Deploying via Vercel Dashboard (Recommended)

1.  Push your code to a Git repository (GitHub, GitLab, Bitbucket).
2.  Import the project in Vercel.
3.  Vercel should detect the configuration from `vercel.json`.
4.  **Important**: In the "Environment Variables" section, add `DATABASE_URL`.
5.  Click **Deploy**.

### 4. Deploying via CLI

Run the following command from the root of the project:

```bash
vercel
```

Follow the prompts. When asked to link to an existing project, say yes or create a new one.
When asked for environment variables, you can add them in the dashboard later or use `vercel env add`.

## Configuration Details

- **Frontend**: The frontend is built using Vite. The build output is served statically.
- **Backend**: The backend is a Python serverless function. Requests to `/api/*` are rewritten to `backend/main.py`.
- **CORS**: The backend is configured to allow requests from the Vercel deployment.

## Troubleshooting

- **Database Connection**: If the backend fails to connect, check your `DATABASE_URL`. Ensure it includes `sslmode=require` if needed (the code attempts to handle this automatically).
- **Build Errors**: Check the build logs in Vercel. Ensure `backend/requirements.txt` has all dependencies.
