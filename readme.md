# Nudge API

The **Nudge API** allows users to create, manage, and retrieve nudges linked to events.  
A **nudge** can include a title, description, cover image, time, icon, and a one-line invitation.

---

## Base URL

Use the following base URL for all API requests:

http://localhost:3000/api/v3/app/nudges

---

## Object Data Model

Example Nudge object:

{
  "type": "nudge",
  "uid": "<user_id>",
  "event_id": "<linked_event_id>",
  "title": "Title of the nudge",
  "cover_image": "File path of uploaded image",
  "time": "Timestamp when the nudge should be sent",
  "description": "Detailed description of the nudge",
  "icon": "Icon image path",
  "invitation": "One line invitation text"
}

---

## API Endpoints (CRUD)

| Action              | Method | Endpoint                                      | Payload                                                                 |
|---------------------|--------|-----------------------------------------------|-------------------------------------------------------------------------|
| Create Nudge        | POST   | /api/v3/app/nudges                            | title, event_id, cover_image, time, description, icon, invitation       |
| Get Nudge by ID     | GET    | /api/v3/app/nudges?id=<nudge_id>              | -                                                                       |
| Get Latest Nudges   | GET    | /api/v3/app/nudges?type=latest&limit=5&page=1 | -                                                                       |
| Update Nudge        | PUT    | /api/v3/app/nudges/<nudge_id>                 | Same as POST (only send fields you want to update)                      |
| Delete Nudge        | DELETE | /api/v3/app/nudges/<nudge_id>                 | -                                                                       |

---

## API Usage

### 1️Create Nudge  
POST `/api/v3/app/nudges`

Request (form-data):
- title – Title of the nudge  
- event_id – ID of the linked event  
- cover_image – Image file used as cover  
- time – Timestamp when the nudge should be sent  
- description – Detailed description  
- icon – Small image icon for minimized state  
- invitation – One line invitation message  

Response (201):
{
  "_id": "652ab1f27d2c1b1234567890",
  "type": "nudge",
  "title": "Reminder for Tech Event",
  "event_id": "6504a7d832a3f2a123456789",
  "cover_image": "uploads/nudge1.png",
  "time": "2025-09-20T10:00:00Z",
  "description": "Don’t miss the upcoming Tech Event!",
  "icon": "uploads/icon.png",
  "invitation": "Join us at Tech 2025 🚀"
}

### 2️Get Nudge by ID  
GET `/api/v3/app/nudges?id=<nudge_id>`

Response (200):
{
  "_id": "652ab1f27d2c1b1234567890",
  "title": "Reminder for Tech Event",
  "event_id": "6504a7d832a3f2a123456789",
  "time": "2025-09-20T10:00:00Z",
  "invitation": "Join us at Tech 2025 🚀"
}

### 3️Get Latest Nudges (Paginated)  
GET `/api/v3/app/nudges?type=latest&limit=5&page=1`

Response (200):
```
[
  {
    "_id": "652ab1f27d2c1b1234567890",
    "title": "Reminder for Tech Event",
    "time": "2025-09-20T10:00:00Z"
  },
  {
    "_id": "652ab1f27d2c1b0987654321",
    "title": "Webinar Invite",
    "time": "2025-09-22T15:00:00Z"
  }
]
```
### Update Nudge  
PUT `/api/v3/app/nudges/<nudge_id>`

Request (form-data):
{
  "title": "Updated Tech Event Reminder",
  "time": "2025-09-21T11:00:00Z"
}

Response (200):
{ "modifiedCount": 1 }

### Delete Nudge  
DELETE `/api/v3/app/nudges/<nudge_id>`

Response (200):
{ "deletedCount": 1 }

---

## Notes
- Nudges are stored in the **eventdb** database under the **nudges** collection.  
- `_id` is a MongoDB ObjectId.  
- File uploads (cover image, icon) are stored in the `uploads/` directory.  
- Pagination uses query params `limit` and `page`.  

---

## Tech Stack
- Node.js + Express.js (API development)  
- MongoDB (Data storage)  
- Multer (File uploads)  

---
