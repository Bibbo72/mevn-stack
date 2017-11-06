# User

## Create a new user
it should respond with the user
```
curl -H "Content-Type: application/json" --data '{"username": "test-user", "email": "test@k.com","hash": "clear"}' http://localhost:3000/api/users
```

## Get the user
it should respond with the user
```
curl http://localhost:3000/api/users/test-user
```

## Update the user
it should respond with the user
```
curl -X PUT -H "Content-Type: application/json" --data '{"hash": "clearertext"}' http://localhost:3000/api/users/test-user
```

## Delete the user
it should respond with a 200
```
curl -X DELETE http://localhost:3000/api/users/test-user
```


---

# Auth

## Check registration
### valid credentials
it should respond with a token
```
curl -H "Content-Type: application/json" --data '{"username": "testuser", "email": "test@k.com", "hash": "clear"}' http://localhost:3000/api/auth/register
```

### invalid credentials
it should respond with an error
```
curl -H "Content-Type: application/json" --data '{"email": "test@k.com", "hash": "clear"}' http://localhost:3000/api/auth/register
```

### duplicate usernames
should respond with duplicate username error
```
curl -H "Content-Type: application/json" --data '{"username": "testuser", "email": "test@k.com", "hash": "clear"}' http://localhost:3000/api/auth/register
curl -H "Content-Type: application/json" --data '{"username": "testuser", "email": "test2@k.com", "hash": "clear"}' http://localhost:3000/api/auth/register
curl -X DELETE http://localhost:3000/api/users/testuser
```

### duplicate emails
```
curl -H "Content-Type: application/json" --data '{"username": "testuser", "email": "test@k.com", "hash": "clear"}' http://localhost:3000/api/auth/register
curl -H "Content-Type: application/json" --data '{"username": "testuser2", "email": "test@k.com", "hash": "clear"}' http://localhost:3000/api/auth/register
curl -X DELETE http://localhost:3000/api/users/testuser
```

## Check login