# Team Task Manager

A full-stack task management web application that enables teams to create, assign, and track tasks efficiently.  
The system supports role-based access control and provides a structured interface for managing projects and task workflows.

## Description

Team Task Manager is designed to streamline collaboration within teams by providing a centralized platform for task organization and tracking.  
Users can manage projects, assign responsibilities, and monitor progress through a clean and responsive interface.

## Overview

The application consists of a React-based frontend and a Node.js/Express backend.  
It allows authenticated users to perform task operations while maintaining proper access control between different roles such as Admin and Member.

### Key capabilities include:

- Secure user authentication  
- Task and project lifecycle management  
- Role-based permissions  
- API-driven architecture  

## Features

- User authentication (signup and login)  
- Role-based access control (Admin and Member)  
- Create, update, and delete tasks  
- Assign tasks to users  
- Track task status (pending and completed)  
- Project organization  
- Responsive user interface  
- RESTful API integration  

## Tech Stack

### Frontend

- React (Vite)  
- JavaScript  
- CSS  

### Backend

- Node.js  
- Express.js  

### Database

- MongoDB  

## Live Application

Frontend (Vercel):  
https://team-task-manager-dusky-eight.vercel.app/

Backend API (Railway):  
https://team-task-manager-production-7067.up.railway.app/

## Project Structure

team-task-manager/

backend/
- controllers/
- middleware/
- models/
- routes/
- server.js
- package.json
- package-lock.json
- .gitignore

frontend/
- public/
- src/
- index.html
- vite.config.js
- vercel.json
- eslint.config.js
- package.json
- package-lock.json
- .gitignore

README.md

## Installation and Setup

### Clone the repository

https://github.com/Tusharparmaarrajput/team-task-manager

cd team-task-manager

### Backend setup

cd backend  
npm install  

Create a .env file inside the backend directory:

PORT=8000  
MONGO_URI=your_mongodb_connection_string  
JWT_SECRET=your_secret_key  

Start backend server:

npm run dev  

### Frontend setup

cd frontend  
npm install  
npm run dev  

## API Endpoints

### Authentication

- POST /api/auth/signup  
- POST /api/auth/login  

### Projects

- GET /api/projects  
- POST /api/projects  

### Tasks

- GET /api/tasks  
- POST /api/tasks  
- PUT /api/tasks/:id  

## How It Works

- Users register and log in to receive a JWT token  
- Authenticated users can access protected routes  
- Admins can create projects and assign tasks  
- Members can view and update their assigned tasks  
- The frontend communicates with the backend using REST APIs  

## Deployment

- The frontend is deployed on Vercel and serves the user interface  
- The backend is deployed on Railway and handles API requests and database communication  

## Challenges Faced

- Handling client-side routing in production with React and Vercel  
- Resolving CORS issues between frontend and backend deployments  
- Managing authentication using JWT tokens  
- Structuring backend using controllers, routes, and middleware  

## Author

Tushar Parmar
