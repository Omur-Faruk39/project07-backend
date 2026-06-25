# Project07 Backend API Documentation

**Base URL**: `http://localhost:3522/api/user`

---

## Authentication

### JWT Token
Most endpoints require a JWT Bearer token. Include it in the `Authorization` header:

```
Authorization: Bearer <token>
```

### Token Payload
```json
{
  "phone": "17xxxxxxxx",
  "username": "johndoe",
  "role": ["Sniper", "Supporter"]
}
```

### How to Get a Token
- **Register** → verify OTP → receive token
- **Login** → receive token

---

## Standard Response Format

### Success
```json
{
  "status": true,
  "message": "Success message",
  "data": { ... }
}
```

### Error
```json
{
  "status": false,
  "message": "Human-readable message",
  "error": "Error details"
}
```

---

# API Endpoints

---

## 1. Register

Creates a new user account and sends an OTP to the phone number.

- **URL**: `POST /register`
- **Auth**: None

### Request Body
```json
{
  "phone": "01712345678",
  "email": "user@example.com",
  "full_name": "John Doe",
  "user_name": "johndoe",
  "password": "Secret@123",
  "uid": 12345,
  "game_id_name": "GamerTag",
  "role": ["Sniper", "Supporter"],
  "gender": "Male",
  "dob": "2000-01-15",
  "refer": "REFCODE123",
  "bio": "Pro gamer",
  "pic": "https://example.com/pic.jpg",
  "banner": "https://example.com/banner.jpg"
}
```

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `phone` | string | Yes | Bangladesh mobile number (01xxxxxxxxx or +8801xxxxxxxxx) |
| `email` | string | Yes | Valid email, max 100 chars |
| `full_name` | string | Yes | Max 150 chars |
| `user_name` | string | Yes | Max 100 chars, must be unique |
| `password` | string | Yes | Min 8 chars, must include uppercase, lowercase, number, and special character |
| `uid` | number | Yes | Integer |
| `game_id_name` | string | Yes | Max 50 chars |
| `role` | array | Yes | Array of strings from: `"First Rusher"`, `"Second Rusher"`, `"Sniper"`, `"Supporter"`, `"Bomber"`, `"All-Rounder"` (min 1) |
| `gender` | string | No | `"Male"`, `"Female"`, or `"Other"` |
| `dob` | string (date) | No | ISO date format, must be in the past |
| `refer` | string | No | Alphanumeric referral code, max 20 chars |
| `bio` | string | No | Max 500 chars |
| `pic` | string | No | Profile picture URL |
| `banner` | string | No | Banner image URL |

### Response `201 Created`
```json
{
  "status": true,
  "message": "User registered successfully",
  "data": "User registered successfully"
}
```

### Possible Errors
| Status | Message |
|--------|---------|
| 400 | Phone number already registered |
| 400 | Email already exists |
| 400 | Username already taken |
| 400 | Validation failed (invalid field) |

---

## 2. Verify OTP

Verifies the OTP sent during registration and returns a JWT token.

- **URL**: `POST /varify-otp`
- **Auth**: None

### Request Body
```json
{
  "phone": "01712345678",
  "otp": "123456"
}
```

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `phone` | string | Yes | Bangladesh mobile number |
| `otp` | string | Yes | 6-digit code |

### Response `200 OK`
```json
{
  "status": true,
  "message": "OTP verified",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

### Possible Errors
| Status | Message |
|--------|---------|
| 400 | Invalid or expired OTP |
| 400 | Validation failed |

---

## 3. Login

Authenticates with email or phone + password and returns a JWT token.

- **URL**: `POST /login`
- **Auth**: None

### Request Body
Provide **either** `email` **or** `phone`, not both.

```json
{ "email": "user@example.com", "password": "Secret@123" }
```
or
```json
{ "phone": "01712345678", "password": "Secret@123" }
```

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `email` | string | One of | Must provide email OR phone |
| `phone` | string | One of | Must provide email OR phone |
| `password` | string | Yes | Min 6 chars |

### Response `200 OK`
```json
{
  "status": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

### Possible Errors
| Status | Message |
|--------|---------|
| 400 | Invalid credentials |
| 400 | Validation failed |

---

## 4. Check Phone

Checks if a phone number is already registered.

- **URL**: `POST /check-phone`
- **Auth**: None

### Request Body
```json
{ "phone": "01712345678" }
```

### Response
```json
{
  "success": true,
  "exists": true
}
```
`exists`: `true` if already registered, `false` if available.

---

## 5. Get Own Profile

Returns the authenticated user's profile.

- **URL**: `GET /profile`
- **Auth**: JWT Bearer token

### Headers
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

### Response `200 OK`
```json
{
  "status": true,
  "message": "Profile data fetched successfully.",
  "data": {
    "full_name": "John Doe",
    "dob": "2000-01-15T00:00:00.000Z",
    "gender": "Male",
    "phone": "17xxxxxxxx",
    "email": "user@example.com",
    "pic": "https://example.com/pic.jpg",
    "banner_pic": "https://example.com/banner.jpg",
    "role": ["Sniper", "Supporter"],
    "position": "Gold",
    "played_match": 150,
    "wonned_match": 98,
    "life_time_value": 5000,
    "monthly_value": 250,
    "lastmonth_value": 300,
    "uid": 12345,
    "game_id_name": "GamerTag",
    "username": "johndoe",
    "created_time": "2024-01-15T10:30:00.000Z"
  }
}
```

### Possible Errors
| Status | Message |
|--------|---------|
| 404 | User Not Found |

---

## 6. Get User Profile

Returns another user's public profile by phone or username.

- **URL**: `GET /user-profile`
- **Auth**: JWT Bearer token

### Query Parameters
Provide **one** of:
- `?phone=01712345678`
- `?username=johndoe`

### Response `200 OK`
```json
{
  "status": true,
  "message": "User profile data fetched successfully.",
  "data": {
    "full_name": "Jane Doe",
    "dob": "1999-05-20T00:00:00.000Z",
    "gender": "Female",
    "phone": "17xxxxxxxx",
    "email": "jane@example.com",
    "pic": "https://example.com/pic.jpg",
    "banner_pic": "https://example.com/banner.jpg",
    "role": ["Sniper"],
    "played_match": 200,
    "wonned_match": 120,
    "life_time_value": 8000,
    "monthly_value": 400,
    "lastmonth_value": 350,
    "uid": 67890,
    "game_id_name": "JaneTag",
    "username": "janedoe",
    "created_time": "2024-02-10T08:00:00.000Z"
  }
}
```

### Possible Errors
| Status | Message |
|--------|---------|
| 400 | Phone number or username is required |
| 404 | User Not Found |

---

## 7. Send Friend Request

Sends a friend request to another user. The recipient receives a real-time notification via WebSocket if online.

- **URL**: `POST /send-friend-request`
- **Auth**: JWT Bearer token

### Request Body
```json
{ "userName": "janedoe" }
```

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `userName` | string | Yes | Max 100 chars |

### Response `200 OK`
```json
{
  "success": true,
  "message": "Friend request sent"
}
```

### Possible Errors
| Status | Message |
|--------|---------|
| 400 | request body invalid (user not found or self-request) |
| 400 | Validation failed |

---

## 8. Accept Friend Request

Accepts an incoming friend request. The sender receives a real-time notification via WebSocket if online.

- **URL**: `POST /accept-friend-request`
- **Auth**: JWT Bearer token

### Request Body
```json
{ "userName": "janedoe" }
```
(`userName` is the person who sent the request)

### Response `200 OK`
```json
{
  "status": true,
  "message": "Friend request accepted",
  "data": null
}
```

### Possible Errors
| Status | Message |
|--------|---------|
| 400 | Validation failed |

---

## 9. Delete Friend

Removes a friend from the friends list.

- **URL**: `POST /delete-friend`
- **Auth**: JWT Bearer token

### Request Body
```json
{ "userName": "janedoe" }
```

### Response `200 OK`
```json
{
  "status": true,
  "message": "Friend deleted successfully",
  "data": null
}
```

### Possible Errors
| Status | Message |
|--------|---------|
| 400 | Friend not found or not accepted |
| 400 | Validation failed |

---

## 10. Get Friends List

Returns the authenticated user's friends with pagination (30 per page).

- **URL**: `GET /friends`
- **Auth**: JWT Bearer token

### Query Parameters
| Param | Type | Required | Default | Notes |
|-------|------|----------|---------|-------|
| `offset` | number | No | `0` | Skip this many friends (0 = first 30, 30 = next 30, etc.) |

### Examples
```
GET /friends           → first 30 friends
GET /friends?offset=30 → friends 31-60
GET /friends?offset=60 → friends 61-90
```

### Response `200 OK`
```json
{
  "status": true,
  "message": "Friends retrieved successfully",
  "data": [
    { "friend": "janedoe" },
    { "friend": "alex123" },
    ...
  ]
}
```

---

## 11. Get Notifications

⚠️ **Not yet implemented** — currently returns empty.

- **URL**: `GET /notifications`
- **Auth**: JWT Bearer token

---

# WebSocket (Socket.IO)

**Server**: `http://localhost:3522`

Used for real-time notifications. When a user is online, notifications are pushed instantly without polling.

## Client Connection

```js
const socket = io("http://localhost:3522", {
  transports: ["websocket", "polling"]
});
```

## Events

### Client → Server: `authenticate`

Sent immediately after connecting to register the user's socket.

```js
socket.emit("authenticate", "johndoe");
```

### Server → Client: `notification`

Received when a friend request is sent or accepted.

```js
socket.on("notification", (data) => {
  console.log(data);
  // {
  //   type: "friend_request" | "friend_request_accepted",
  //   from: "janedoe",
  //   title: "janedoe sent you a friend request",
  //   timestamp: "2024-01-15T10:30:00.000Z"
  // }
});
```

## Connection Flow
1. User logs in → receives JWT token
2. Connect to Socket.IO server
3. Emit `authenticate` with the username
4. Listen for `notification` events
5. On disconnect, the server automatically cleans up
