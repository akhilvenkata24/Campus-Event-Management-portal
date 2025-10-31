Backend for Campus Event Portal

Quick start:

1. Copy `.env.example` to `.env` and update `MONGO_URI` and `JWT_SECRET`.
2. Install dependencies: `npm install express mongoose dotenv cors helmet morgan bcryptjs jsonwebtoken`
3. Start server: `node server.js` or from repo root: `npm run start:server`

API endpoints:
- GET / -> health
- POST /api/auth/register -> register
- POST /api/auth/login -> login
- GET /api/events -> list events
- POST /api/events -> create event
