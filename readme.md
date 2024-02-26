# 💰 Spending Tracker API

## 🌟 Overview

This is a backend API for a spending tracker application. It's built with Node.js, TypeScript, Apollo Server for GraphQL, and uses a containerized PostgreSQL database.

The API provides various features including user authentication with JWT (JSON Web Tokens) for secure access, password hashing with bcrypt for enhanced security, and a GraphQL API with a schema defined in `src/graphql/schema/schema.graphql` for efficient data retrieval and manipulation.

## ✨ Features

- User authentication with JWT (JSON Web Tokens)
- Password hashing with bcrypt
- GraphQL API with schema defined in src/graphql/schema/schema.graphql
- Database operations with knex.js
- Docker support for easy setup and deployment

## 🚀 Getting Started

### Prerequisites

- Node.js
- npm
- Docker and Docker Compose

## 🔧 Installation

1. Clone the repository:

```shell
git clone https://github.com/yourusername/spending-tracker-api.git
cd spending-tracker-api
```

2. Install the dependencies:

```shell
npm install
```

3. Copy the .env.example file to a new file named .env and fill in your
   settings:

```shell
cp .env.example .env
```

4. Build the Docker image and start the containers:

```shell
docker-compose up --build
```

5. Compile the TypeScript code and start the server:

```shell
npm run start
```

The server will start on localhost:4000 by default.

## 🔍 Testing

This project uses Jest for testing. To run the tests, use the following command:

```shell
npm run test
```
