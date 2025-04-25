# Engineering Blog Backend

Backend API for the Hack4Impact Engineering Blog.

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Create a `.env` file in the root of the backend directory with the following variables:
   ```
   PORT=5000
   MONGO_URI=mongodb+srv://yeonlee:<db_password>@cluster0.tlqrppp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
   JWT_SECRET=your_jwt_secret_here
   NODE_ENV=development
   ```
   Replace `<db_password>` with your actual MongoDB password.

3. Run the development server:
   ```
   npm run dev
   ```

## API Endpoints

(To be updated as they are implemented)

### Users
- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - Login a user
- `GET /api/users/profile` - Get user profile (protected)
- `PUT /api/users/profile` - Update user profile (protected)

### Articles
- `GET /api/articles` - Get all articles
- `GET /api/articles/:id` - Get single article
- `POST /api/articles` - Create a new article (protected)
- `PUT /api/articles/:id` - Update article (protected)
- `DELETE /api/articles/:id` - Delete article (protected)
- `PATCH /api/articles/:id/pin` - Pin/unpin article (admin only) 