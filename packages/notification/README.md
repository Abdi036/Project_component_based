# Notification Module

A component-based notification system for managing user notifications across the application.

## Features

- Create notifications for users
- Retrieve user notifications with pagination
- Mark individual notifications as read
- Mark all notifications as read
- Delete individual notifications
- Clear all notifications for a user

## Installation

The notification module is part of the monorepo. It's automatically available in the API server.

## API Endpoints

All endpoints require authentication (Bearer token).

### Get User Notifications

```
GET /api/notifications
Query Parameters:
  - limit: number (1-100, default: 30)
```

### Mark Notification as Read

```
PATCH /api/notifications/:id/read
```

### Mark All Notifications as Read

```
PATCH /api/notifications/read-all
```

### Delete Notification

```
DELETE /api/notifications/:id
```

### Clear All Notifications

```
DELETE /api/notifications
```

## Response Format

### Success Response

```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "_id": "notification_id",
      "user": "user_id",
      "type": "payment_success",
      "title": "Payment Successful",
      "message": "Your payment has been processed",
      "metadata": null,
      "read": false,
      "createdAt": "2024-04-16T10:30:00Z",
      "updatedAt": "2024-04-16T10:30:00Z"
    }
  ]
}
```

### Error Response

```json
{
  "success": false,
  "message": "Error message"
}
```

## Notification Types

- `low_token_balance` - User's token balance is low
- `payment_success` - Payment transaction successful
- `payment_failed` - Payment transaction failed

## Usage in Other Services

```javascript
import { createNotification } from "notification";

// Create a notification
await createNotification({
  user: userId,
  type: "payment_success",
  title: "Payment Successful",
  message: "Your payment of $100 has been processed",
  metadata: { orderId: "12345" },
});
```

## Schema

```
{
  user: ObjectId (required, indexed),
  type: String (enum: ['low_token_balance', 'payment_success', 'payment_failed']),
  title: String (required),
  message: String (required),
  metadata: Mixed (optional),
  read: Boolean (default: false, indexed),
  createdAt: Date (timestamps),
  updatedAt: Date (timestamps)
}
```
