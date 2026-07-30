# BeamWise AI — Backend Service

This is the Node.js backend for the BeamWise AI Decision Support Platform for Reinforced Concrete Beams.


## Tech Stack
- Node.js
- Express.js
- MySQL (`mysql2` with Promises)
- JWT Authentication (`jsonwebtoken`)
- Password Hashing (`bcryptjs`)

## Getting Started

1. **Environment Variables**: Create a `.env` file in the root directory:
   ```env
   PORT=5000
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=structural_ai_db
   JWT_SECRET=your_jwt_secret_key
   ```

2. **Database Setup**: Execute the `database/schema.sql` script in your MySQL environment to create the required `users`, `projects`, and `beam_designs` tables.

3. **Install Dependencies**:
   ```bash
   npm install
   ```

4. **Run Server**:
   ```bash
   node server.js
   ```

## Modules Implemented

### Module 1: Authentication & User Management
- User Registration (`/api/auth/register`)
- User Login (`/api/auth/login`)
- Get Profile (`/api/auth/profile`)

### Module 2 & 3: Project Workspace & Beam Design Module
- Project Management CRUD (`/api/projects`)
- Role-based Dashboard Stats (`/api/dashboard`)
- Beam Design CRUD with comprehensive structural inputs (`/api/projects/:projectId/beams` and `/api/beams/:beamId`)
- Beam Design filtering & sorting (e.g. `?grade=M30&sort=created_at`)
- Beam Design duplication (`/api/beams/:beamId/duplicate`)
- Beam Design structured summary (`/api/beams/:beamId/summary`)
- Strict server-side validation for engineering parameters.

## Testing
Import `postman_collection.json` into Postman to test all endpoints. Be sure to add an environment variable `token` and set it after logging in to access protected routes.
