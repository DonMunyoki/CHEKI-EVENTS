# Event Ticketing Backend

A Node.js/Express backend for the Event Ticketing Web App with SQLite database.

## Features

- **User Authentication**: Registration and login with JWT tokens
- **Event Management**: CRUD operations for events
- **Ticket Booking**: Purchase and manage tickets
- **Database**: SQLite with proper schema and relationships
- **Security**: CORS, rate limiting, helmet, password hashing

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user info

### Events
- `GET /api/events` - Get all events (with filtering)
- `GET /api/events/:id` - Get single event
- `GET /api/events/categories/list` - Get all categories
- `POST /api/events` - Create new event (admin)
- `PUT /api/events/:id` - Update event (admin)
- `DELETE /api/events/:id` - Delete event (admin)

### Tickets
- `GET /api/tickets/my-tickets` - Get user's tickets
- `POST /api/tickets/purchase` - Purchase tickets
- `GET /api/tickets/:id` - Get ticket details
- `DELETE /api/tickets/:id` - Cancel ticket

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/stats` - Get user statistics

## Setup

1. Install dependencies:
```bash
cd backend
npm install
```

2. Initialize database:
```bash
npm run init-db
```

3. Start development server:
```bash
npm run dev
```

4. Start production server:
```bash
npm start
```

## Environment Variables

Create a `.env` file in the backend directory:

```
PORT=3001
FRONTEND_URL=http://localhost:5173
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
DB_PATH=./database/events.db
```

## Database Schema

### Users
- id (PRIMARY KEY)
- admission_number (UNIQUE)
- name
- email (UNIQUE)
- password_hash
- created_at
- updated_at

### Events
- id (PRIMARY KEY)
- title
- description
- date
- time
- location
- category
- price
- image
- ticket_link
- available_tickets
- created_at
- updated_at

### Tickets
- id (PRIMARY KEY)
- user_id (FOREIGN KEY)
- event_id (FOREIGN KEY)
- ticket_number (UNIQUE)
- quantity
- total_price
- status
- purchase_date

## Security Features

- JWT authentication
- Password hashing with bcrypt
- CORS configuration
- Rate limiting
- Helmet for security headers
- Input validation

## Sample Data

The database initialization includes sample events for Nairobi covering:
- Music events
- Art exhibitions
- Food festivals
- Comedy shows
- Sports events
- Theater performances
- Nightlife events
