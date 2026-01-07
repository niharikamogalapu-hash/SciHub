# Local Storage Implementation - Backend Disabled

## Overview
The login and signup features have been temporarily modified to use **localStorage only**, with the backend database calls disabled.

## Changes Made

### 1. **Login.js** (`src/pages/Login.js`)
- **Removed**: `axios` import and backend API call to `http://localhost:8080/login`
- **Added**: Local storage logic to:
  - Retrieve all registered users from localStorage (`registeredUsers`)
  - Search for a user with matching email and password
  - Store the logged-in user in localStorage (`user`)
  - Redirect to dashboard on successful login

### 2. **Signup.js** (`src/pages/Signup.js`)
- **Removed**: `axios` import and backend API call to `http://localhost:8080/signup`
- **Added**: Local storage logic to:
  - Retrieve existing registered users from localStorage
  - Check if email is already registered (prevent duplicates)
  - Create a new user object with ID (based on timestamp)
  - Add new user to the `registeredUsers` array
  - Store the signed-up user in localStorage
  - Display error messages in the form

## Data Structure

### Registered Users (localStorage key: `registeredUsers`)
```json
[
  {
    "id": "1704534000000",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "password": "password123",
    "createdAt": "2024-01-06T12:00:00.000Z"
  },
  {
    "id": "1704534010000",
    "firstName": "Jane",
    "lastName": "Smith",
    "email": "jane@example.com",
    "password": "password456",
    "createdAt": "2024-01-06T12:01:00.000Z"
  }
]
```

### Current Logged-In User (localStorage key: `user`)
```json
{
  "id": "1704534000000",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "password123",
  "createdAt": "2024-01-06T12:00:00.000Z"
}
```

## How It Works

### Login Flow
1. User enters email and password
2. System searches `registeredUsers` array in localStorage
3. If match found → stores user in localStorage and redirects to dashboard
4. If no match → displays error message

### Signup Flow
1. User enters first name, last name, email, and password
2. System checks if email already exists in `registeredUsers`
3. If duplicate email → displays error message
4. If email is new → creates new user and stores in `registeredUsers` array
5. Also stores new user as current logged-in user
6. Redirects to dashboard

## Storage Usage
- **registeredUsers**: Array of all registered user accounts
- **user**: Currently logged-in user

## Data Persistence
All user data persists in browser localStorage until:
- Browser storage is manually cleared
- User clears browser history/cache with localStorage option enabled

## Important Security Note
⚠️ **Passwords are stored in plain text in localStorage.** This is for development/testing only.

**For production**, you must:
1. Use a proper backend authentication system
2. Hash/encrypt passwords before storage
3. Never store plain text passwords
4. Implement proper session management
5. Use HTTPS for all communications

## Testing
To test the implementation:

1. **First user signup**:
   - Navigate to `/signup`
   - Fill in form with test data
   - User will be added to `registeredUsers` in localStorage

2. **Login with registered user**:
   - Navigate to `/login`
   - Use the email and password from signup
   - Should successfully login

3. **View stored data**:
   - Open browser DevTools → Application → LocalStorage
   - Look for keys: `registeredUsers` and `user`

## Re-enabling Backend
To switch back to backend authentication:
1. Uncomment `import axios from "axios"` in Login.js and Signup.js
2. Restore the original axios API calls
3. Ensure backend server is running on `http://localhost:8080`
