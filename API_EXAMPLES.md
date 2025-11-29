# API Examples - cURL Commands

This document provides cURL examples for all SkillSync Hub API endpoints. Replace `http://localhost:5000` with your actual server URL and `YOUR_JWT_TOKEN` with your authentication token.

## Authentication

### Admin Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@skillsynchub.com",
    "password": "admin123"
  }'
```

## Members API

### Get All Members
```bash
curl -X GET http://localhost:5000/api/members \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Get Member by ID
```bash
curl -X GET http://localhost:5000/api/members/64f8a3b2c8d4e5f6a7b8c9d0 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Project Proposal API

### Get Project Proposal
```bash
curl -X GET http://localhost:5000/api/proposal \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Update Project Proposal (Admin Only)
```bash
curl -X PUT http://localhost:5000/api/proposal \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated SkillSync Hub",
    "description": "Updated description for the platform",
    "objectives": [
      {
        "title": "Connect students via skill sharing",
        "description": "Create a platform where students can share their skills and collaborate on projects"
      },
      {
        "title": "Mini portfolio for each user",
        "description": "Provide users with a personal space to showcase their skills and achievements"
      }
    ]
  }'
```

## Collaboration Request API

### Submit Collaboration Request
```bash
curl -X POST http://localhost:5000/api/collab \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "skill": "Web Development",
    "projectIdea": "E-commerce platform",
    "message": "Looking for a frontend developer to help build an e-commerce platform with React and Node.js. I have experience with backend development and need help with the frontend."
  }'
```

### Get All Collaboration Requests (Admin Only)
```bash
curl -X GET http://localhost:5000/api/collab \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Update Collaboration Request Status (Admin Only)
```bash
curl -X PUT http://localhost:5000/api/collab/64f8a3b2c8d4e5f6a7b8c9d1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "approved"
  }'
```

### Delete Collaboration Request (Admin Only)
```bash
curl -X DELETE http://localhost:5000/api/collab/64f8a3b2c8d4e5f6a7b8c9d1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Contact API

### Submit Contact Form
```bash
curl -X POST http://localhost:5000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Smith",
    "email": "jane@example.com",
    "subject": "General Inquiry",
    "message": "I'd like to learn more about the SkillSync Hub platform and how it works. Can you provide more information about the features?"
  }'
```

### Get All Contact Messages (Admin Only)
```bash
curl -X GET http://localhost:5000/api/contact \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Error Handling Examples

### 400 Bad Request
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "invalid-email",
    "password": ""
  }'
```

### 401 Unauthorized
```bash
curl -X GET http://localhost:5000/api/members \
  -H "Authorization: Bearer invalid_token"
```

### 404 Not Found
```bash
curl -X GET http://localhost:5000/api/members/invalid_id \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 500 Internal Server Error
```bash
# This would occur when there's a server-side error
curl -X GET http://localhost:5000/api/members \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Response Formats

### Success Response
```json
{
  "success": true,
  "data": {
    "id": "64f8a3b2c8d4e5f6a7b8c9d0",
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### Error Response
```json
{
  "success": false,
  "error": "Resource not found"
}
```

## Authentication Flow

1. **Login to get JWT token**:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@skillsynchub.com",
    "password": "admin123"
  }'
```

2. **Extract token from response**:
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

3. **Use token in subsequent requests**:
```bash
curl -X GET http://localhost:5000/api/members \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

## Testing with Sample Data

After running the seed script, you can test with the following sample data:

### Sample Collaboration Request
```bash
curl -X POST http://localhost:5000/api/collab \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Alice Johnson",
    "email": "alice@example.com",
    "skill": "UI/UX Design",
    "projectIdea": "Mobile app design",
    "message": "Need a designer for a fitness tracking mobile app. Looking for someone with experience in Figma and mobile design principles."
  }'
```

### Sample Contact Message
```bash
curl -X POST http://localhost:5000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Bob Smith",
    "email": "bob@example.com",
    "subject": "Feature Request",
    "message": "I have a suggestion for a new feature that would enhance the collaboration experience. It would be great to have real-time chat functionality between collaborators."
  }'
```

## File Upload (Future Enhancement)

When file upload functionality is implemented, you can use:

```bash
curl -X POST http://localhost:5000/api/upload \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "file=@/path/to/your/file.jpg"
```

## Batch Operations

### Create Multiple Members
```bash
curl -X POST http://localhost:5000/api/members/batch \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '[
    {
      "name": "Member 1",
      "role": "Developer",
      "bio": "Full-stack developer",
      "skills": ["JavaScript", "React"]
    },
    {
      "name": "Member 2",
      "role": "Designer",
      "bio": "UI/UX designer",
      "skills": ["Figma", "Photoshop"]
    }
  ]'
```

## Advanced Usage

### Using Environment Variables
```bash
# Set environment variables
export BASE_URL="http://localhost:5000"
export JWT_TOKEN="your_jwt_token_here"

# Use in commands
curl -X GET $BASE_URL/api/members \
  -H "Authorization: Bearer $JWT_TOKEN"
```

### Using jq for JSON Processing
```bash
# Login and extract token
TOKEN=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@skillsynchub.com","password":"admin123"}' | \
  jq -r '.token')

# Use token in subsequent requests
curl -X GET http://localhost:5000/api/members \
  -H "Authorization: Bearer $TOKEN"
```

### Using xargs for Batch Processing
```bash
# Process multiple requests from a file
cat requests.txt | xargs -I {} curl -X POST http://localhost:5000/api/collab \
  -H "Content-Type: application/json" \
  -d "{}"
```

## Performance Testing

### Load Testing with Apache Bench
```bash
# Test endpoint with 100 requests, 10 concurrent
ab -n 100 -c 10 -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  http://localhost:5000/api/members
```

### Stress Testing with Siege
```bash
# 100 requests with 10 concurrent users
siege -c 10 -r 10 -b -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  "http://localhost:5000/api/members GET"
```

## Monitoring and Debugging

### Enable Verbose Output
```bash
curl -v -X GET http://localhost:5000/api/members \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Save Response to File
```bash
curl -X GET http://localhost:5000/api/members \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -o response.json
```

### Follow Redirects
```bash
curl -L -X GET http://localhost:5000/api/members \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Security Headers

### Check Security Headers
```bash
curl -I http://localhost:5000/api/members
```

### Test CORS
```bash
curl -H "Origin: http://localhost:3000" \
  -H "Access-Control-Request-Method: GET" \
  -H "Access-Control-Request-Headers: authorization" \
  -X OPTIONS http://localhost:5000/api/members
```

## Rate Limiting Testing

### Test Rate Limiting
```bash
# Make multiple requests to test rate limiting
for i in {1..10}; do
  curl -X GET http://localhost:5000/api/members \
    -H "Authorization: Bearer YOUR_JWT_TOKEN"
  echo "Request $i"
done
```

---

These examples should help you test and integrate with the SkillSync Hub API. For more detailed information, please refer to the main README.md file.