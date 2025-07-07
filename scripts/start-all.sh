#!/bin/bash
# Script to start both backend and frontend concurrently

cd backend && npm install &
cd ../frontend && npm install &
wait

# Start backend
cd ../backend && npm run dev &
# Start frontend
cd ../frontend && npm start &

wait
