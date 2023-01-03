# Graphql Auth Permissions JWT

### Tech Stack
- graphql shield
- JWT Auth
- prisma js
- Aplollo Server
- Nexus

### Permissions:
No Permissions needed
- allMessages
- login

Logged in users only
- allUsers 
- createMessage



```bash
npm i && npx prisma db push && npx prisma db seed
npm run dev
```

Get JWT for auth
```GraphQL
mutation Mutation($name: String!, $password: String!) {
  login(name: $name, password: $password) {
    jwt
    user {
      id
      name
    }
  }
}

variables
{
  "name": "Moe",
  "password": "123456"
}
```
Expected Response
```json
{
  "data": {
    "login": {
      "jwt": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjYsIm5hbWUiOiJNb2UiLCJpYXQiOjE2NzI3Njg1MTl9.ozcRuuQOQDe4gz8PyxHdPjeWzOhCsbuefeevoEvJYP0",
      "user": {
        "id": 6,
        "name": "Moe"
      }
    }
  }
}
```



query for protected route with auth
```bash
curl --request POST \
    --header 'content-type: application/json' \
    --header 'Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjYsIm5hbWUiOiJNb2UiLCJpYXQiOjE2NzI3Njg4NzJ9.WU8VwH2QVlfo9FeNRL_MrVgeZA0qaFfrGjoI30TT1m4' \
    --url http://localhost:4000/ \
    --data '{"query":"query Query {\n\n  allUsers {\n    name\n  }\n}"}'
```