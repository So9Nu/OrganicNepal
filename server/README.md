# Backend Setup Guide

## Prerequisites
- Node.js (v14+)
- MySQL (v8.0+)
- npm or yarn

## Installation

### 1. Install Dependencies
```bash
cd server
npm install
```

### 2. Create MySQL Database

#### Option A: Using MySQL CLI
```bash
mysql -u root -p
```
Then copy and paste the contents of `database.sql` into the MySQL client, or run:
```bash
mysql -u root -p < database.sql
```

#### Option B: Using MySQL Workbench
1. Open MySQL Workbench
2. Create new connection to your MySQL server
3. Open `database.sql` in Workbench
4. Execute the script (Ctrl+Shift+Enter)

### 3. Configure Environment Variables

Update `.env` file with your MySQL credentials:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=organic_grocery
PORT=5000
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d
```

### 4. Run the Server

Development mode (with auto-reload):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

Server will run on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Products
- `GET /api/products` - Get all products (supports filtering)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)

### Orders
- `GET /api/orders` - Get all orders (Admin)
- `GET /api/orders/user/:userId` - Get user's orders
- `GET /api/orders/:orderId` - Get order details
- `POST /api/orders` - Create order
- `PUT /api/orders/:orderId` - Update order status

### Users
- `GET /api/users` - Get all users (Admin)
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user profile
- `DELETE /api/users/:id` - Delete user (Admin)

## Sample Requests

### Register
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "9800000000"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

### Get All Products
```bash
curl http://localhost:5000/api/products
```

### Get Products by Category
```bash
curl "http://localhost:5000/api/products?category=vegetables"
```

### Create Order
```bash
curl -X POST http://localhost:5000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 1,
    "items": [
      {
        "id": 1,
        "quantity": 2,
        "price": 80
      }
    ],
    "totalAmount": 160,
    "shippingAddress": "123 Main St",
    "paymentMethod": "card"
  }'
```

## Default Admin Account
- Email: `admin@organic.com`
- Password: `admin123`

## Database Schema

### Users Table
- id, email, password, firstName, lastName, phone, role, createdAt, updatedAt

### Products Table
- id, name, nepali, category, price, originalPrice, unit, description, farm, location, image, inStock, featured, rating, reviews, createdAt, updatedAt

### Orders Table
- id, userId, totalAmount, status, shippingAddress, paymentMethod, createdAt, updatedAt

### OrderItems Table
- id, orderId, productId, quantity, price, createdAt

## Troubleshooting

### Database Connection Error
- Verify MySQL is running: `mysql -u root -p -e "SELECT 1"`
- Check `.env` credentials match your MySQL setup
- Ensure database `organic_grocery` exists

### Port Already in Use
- Change PORT in `.env` file
- Or find and kill process: `lsof -ti:5000 | xargs kill -9`

### Dependencies Issue
- Delete `node_modules` and `package-lock.json`
- Run `npm install` again

## Next Steps
1. Connect frontend to backend APIs
2. Update API endpoints in React contexts
3. Implement JWT authentication in requests
4. Add error handling and validation
