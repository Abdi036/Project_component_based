# Postman Testing Guide - Complete Flow

## 📋 Setup Required

### Environment Variables in Postman

Create a new **Postman Environment** with these variables:

```json
{
  "base_url": "http://localhost:5000",
  "user_token": "",
  "user_id": "",
  "study_plan_id": "",
  "interview_id": ""
}
```

Use `{{base_url}}` in requests and `{{user_token}}` for auth header.

---

## 🔄 COMPLETE TEST SEQUENCE

### TEST 1: Register New User
**Purpose:** Create a user account with 3 initial tokens

**Request:**
```
POST {{base_url}}/api/auth/register
Content-Type: application/json

{
  "name": "Test User",
  "email": "testuser@example.com",
  "password": "password123",
  "role": "user"
}
```

**Expected Response (201):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "Test User",
  "email": "testuser@example.com",
  "role": "user",
  "tokenBalance": 3,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**In Postman:** Click **Tests** tab and add:
```javascript
if (pm.response.code === 201) {
  pm.environment.set("user_token", pm.response.json().token);
  pm.environment.set("user_id", pm.response.json()._id);
  pm.test("User registered successfully", function () {
    pm.expect(pm.response.json().tokenBalance).to.equal(3);
  });
}
```

✅ **Verify:** You have 3 tokens on registration

---

### TEST 2: Login User (Alternative)
**Purpose:** If you want to test login separately

**Request:**
```
POST {{base_url}}/api/auth/login
Content-Type: application/json

{
  "email": "testuser@example.com",
  "password": "password123"
}
```

**Expected Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "Test User",
  "email": "testuser@example.com",
  "role": "user",
  "tokenBalance": 3,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**In Postman Tests:**
```javascript
if (pm.response.code === 200) {
  pm.environment.set("user_token", pm.response.json().token);
  pm.test("User logged in successfully", function () {
    pm.expect(pm.response.json().tokenBalance).to.equal(3);
  });
}
```

---

### TEST 3: Get User Profile
**Purpose:** Verify token and current balance

**Request:**
```
GET {{base_url}}/api/profile
Authorization: Bearer {{user_token}}
```

**Expected Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Test User",
    "email": "testuser@example.com",
    "role": "user",
    "token": 3,
    "avatar": { ... },
    "profileData": {}
  }
}
```

✅ **Verify:** Token balance is still 3

---

### TEST 4: Generate Study Plan
**Purpose:** Signed-in user generates study plan

**Request:**
```
POST {{base_url}}/api/studyplan/generate
Authorization: Bearer {{user_token}}
Content-Type: application/json

{
  "jobRole": "Backend Developer",
  "interviewType": "behavioral",
  "yearsOfExperience": 2,
  "tools": ["Node.js", "MongoDB", "Express"],
  "duration": {
    "value": 2,
    "unit": "week"
  }
}
```

**Expected Response (201):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "user": "507f1f77bcf86cd799439011",
    "inputs": {
      "jobRole": "Backend Developer",
      "interviewType": "behavioral",
      "yearsOfExperience": 2,
      "experienceLevel": "Intermediate",
      "tools": ["Node.js", "MongoDB", "Express"],
      "duration": {
        "value": 2,
        "unit": "week"
      }
    },
    "generatedPlan": "### Week 1: Answering Frameworks...",
    "createdAt": "2024-04-15T10:30:00Z",
    "updatedAt": "2024-04-15T10:30:00Z"
  }
}
```

**In Postman Tests:**
```javascript
if (pm.response.code === 201) {
  pm.environment.set("study_plan_id", pm.response.json().data._id);
  pm.test("Study plan generated successfully", function () {
    pm.expect(pm.response.json().data.generatedPlan).to.be.a('string');
    pm.expect(pm.response.json().data.user).to.equal(pm.environment.get("user_id"));
  });
}
```

✅ **Verify:** Study plan generated and assigned to logged-in user

---

### TEST 5: Generate Interview Questions
**Purpose:** Signed-in user generates interview questions

**Request:**
```
POST {{base_url}}/api/interview/generate
Authorization: Bearer {{user_token}}
Content-Type: application/json

{
  "role": "Backend Engineer",
  "experienceLevel": "intermediate",
  "amountOfQuestions": 5
}
```

**Expected Response (201):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439013",
    "user": "507f1f77bcf86cd799439011",
    "role": "Backend Engineer",
    "experienceLevel": "intermediate",
    "amountOfQuestions": 5,
    "questions": [
      {
        "questionText": "Describe your experience with microservices...",
        "topic": "Architecture",
        "difficulty": "intermediate",
        "suggestedAnswer": "..."
      },
      // ... 4 more questions
    ],
    "createdAt": "2024-04-15T10:35:00Z",
    "updatedAt": "2024-04-15T10:35:00Z"
  }
}
```

**In Postman Tests:**
```javascript
if (pm.response.code === 201) {
  pm.environment.set("interview_id", pm.response.json().data._id);
  pm.test("Interview generated successfully", function () {
    pm.expect(pm.response.json().data.questions).to.be.an('array');
    pm.expect(pm.response.json().data.questions.length).to.equal(5);
    pm.expect(pm.response.json().data.user).to.equal(pm.environment.get("user_id"));
  });
}
```

✅ **Verify:** Interview questions generated for logged-in user

---

### TEST 6: Get My Study Plans
**Purpose:** Verify study plans are saved

**Request:**
```
GET {{base_url}}/api/studyplan/mine
Authorization: Bearer {{user_token}}
```

**Expected Response (200):**
```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "user": "507f1f77bcf86cd799439011",
      "inputs": { ... },
      "generatedPlan": "...",
      "createdAt": "2024-04-15T10:30:00Z"
    }
  ]
}
```

✅ **Verify:** Study plan is saved and retrievable

---

### TEST 7: Get My Interview Questions
**Purpose:** Verify interview questions are saved

**Request:**
```
GET {{base_url}}/api/interview/mine
Authorization: Bearer {{user_token}}
```

**Expected Response (200):**
```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439013",
      "user": "507f1f77bcf86cd799439011",
      "role": "Backend Engineer",
      "experienceLevel": "intermediate",
      "amountOfQuestions": 5,
      "questions": [ ... ],
      "createdAt": "2024-04-15T10:35:00Z"
    }
  ]
}
```

✅ **Verify:** Interview questions are saved and retrievable

---

### TEST 8: Get Specific Study Plan
**Purpose:** Retrieve individual study plan details

**Request:**
```
GET {{base_url}}/api/studyplan/{{study_plan_id}}
Authorization: Bearer {{user_token}}
```

**Expected Response (200):**
```json
{
  "success": true,
  "data": { ... full study plan details ... }
}
```

---

### TEST 9: Get Specific Interview
**Purpose:** Retrieve individual interview details

**Request:**
```
GET {{base_url}}/api/interview/{{interview_id}}
Authorization: Bearer {{user_token}}
```

**Expected Response (200):**
```json
{
  "success": true,
  "data": { ... full interview details ... }
}
```

---

### TEST 10: Deduct Token (Optional)
**Purpose:** Test token consumption

**Request:**
```
POST {{base_url}}/api/profile/deduct-token
Authorization: Bearer {{user_token}}
```

**Expected Response (200):**
```json
{
  "success": true,
  "token": 2
}
```

**In Postman Tests:**
```javascript
pm.test("Token deducted successfully", function () {
  pm.expect(pm.response.json().token).to.equal(2);
});
```

---

## ❌ COMMON ERRORS & FIXES

### Error 1: "Not authorized, no token"
**Cause:** Missing Authorization header
**Fix:** Make sure header is set:
```
Authorization: Bearer {{user_token}}
```

### Error 2: "Not authorized, token failed"
**Cause:** Invalid or expired token
**Fix:** 
- Copy token directly from login/register response
- Make sure it's set in environment variable

### Error 3: "Postman variable {{token}} was not resolved"
**Cause:** Environment variable not set
**Fix:**
- Create environment in Postman
- Set `user_token` to actual JWT value
- Switch to that environment before running

### Error 4: "Cannot find module 'auth'"
**Cause:** Dependencies not installed
**Fix:** Run in project root:
```bash
npm install
```

---

## 🎯 QUICK TEST SUMMARY

| Step | Endpoint | Method | Auth | Should Work |
|------|----------|--------|------|------------|
| 1 | `/api/auth/register` | POST | ❌ | ✅ YES |
| 2 | `/api/auth/login` | POST | ❌ | ✅ YES |
| 3 | `/api/profile` | GET | ✅ | ✅ YES |
| 4 | `/api/studyplan/generate` | POST | ✅ | ✅ YES (FIXED) |
| 5 | `/api/interview/generate` | POST | ✅ | ✅ YES (FIXED) |
| 6 | `/api/studyplan/mine` | GET | ✅ | ✅ YES |
| 7 | `/api/interview/mine` | GET | ✅ | ✅ YES |
| 8 | `/api/profile/deduct-token` | POST | ✅ | ✅ YES |

---

## 🚀 COMPLETE WORKING FLOW

```
1. Register or Login
   ↓ (get JWT token)
2. Generate Study Plan
   ↓ (plan stored with user ID)
3. Generate Interview Questions
   ↓ (questions stored with user ID)
4. Check User Balance
   ↓ (tokens still available)
5. Optional: Deduct Token
   ↓ (simulate usage)
6. Purchase More Tokens (via Payment API)
```

**All connections are now working! ✅**

---

## 📝 Notes

- All protected endpoints require `Authorization: Bearer {JWT_TOKEN}` header
- User ID and token are returned on register/login
- Data is user-scoped (you can only see your own plans/interviews)
- Tokens are initialized at 3 on registration
- Each deduction reduces token count by 1
