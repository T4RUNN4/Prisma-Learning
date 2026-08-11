# Register User API

## Endpoint

**POST** `/api/register`

---

## Request Body

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "secret123"
}
```
---

### Parameters

| Field      | Type   | Required |
| ---------- | ------ | -------- |
| `name`     | String | Yes      |
| `email`    | String | Yes      |
| `password` | String | Yes      |

---

## Successful Response

### Status Code

`201 Created`

### Response

```json
{
  "status": "success",
  "message": "User created successfully",
  "data": {
    "id": "a8f5c2e1-1234-4567-8901-abcdef123456",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

---

## Error Responses

### 400 — Invalid Name

```json
{
  "status": "error",
  "message": "Invalid name"
}
```

Returned when the name is missing or empty.

### 400 — Invalid Email

```json
{
  "status": "error",
  "message": "Invalid email"
}
```

Returned when the email format is invalid.

### 400 — Invalid Password

```json
{
  "status": "error",
  "message": "Invalid password. Password must be atleast 6 characters long"
}
```

Returned when the password is missing or contains fewer than 6 characters.

### 409 — Email Already Registered

```json
{
  "status": "error",
  "message": "Email already registered"
}
```

Returned when an account with the provided email already exists.

---
