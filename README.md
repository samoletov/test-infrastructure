# Documentation

Separate authentication to auth service (JWT). Service uses own db.sqlite with root/password123 entity in it
Other services should use JWT token (Bearer token) validation. Example made in microservise service

GET http://0.0.0.0:5000/auth/login to see login form

POST to http://0.0.0.0:5000/auth/login to get JWT token
{
"username": "root",
"password": "password123"
}

http://0.0.0.0:5000/microservice without correct token returns 401 Unauthorized

## Installation

docker-compose up

## TODO

- pass JWT_SECRET through docker env
