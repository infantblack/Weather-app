# Weather App - Micro-bundled Project

A full-stack weather application with React frontend and Node.js backend.

## Features

- Current weather data
- 5-day weather forecast
- Responsive design with TailwindCSS
- Express.js API backend
- OpenWeatherMap API integration

## Setup Instructions

1. **Get OpenWeatherMap API Key**
   - Sign up at [OpenWeatherMap](https://openweathermap.org/api)
   - Get your free API key

2. **Install Dependencies**
   ```bash
   npm run install-all
   ```

3. **Configure Environment**
   - Edit `server/.env`
   - Replace `your_openweather_api_key_here` with your actual API key

4. **Run Development Server**
   ```bash
   npm run dev
   ```
   - Frontend: http://localhost:5173
   - Backend: http://localhost:5000

## Project Structure

```
weather-app/
├── client/          # React frontend (Vite)
├── server/          # Node.js backend (Express)
└── package.json     # Root package with scripts
```

## Available Scripts

- `npm run dev` - Run both frontend and backend
- `npm run client` - Run only frontend
- `npm run server` - Run only backend
- `npm run build` - Build frontend for production
- `npm start` - Start production server

## Tech Stack

**Frontend:**
- React.js with Vite
- TailwindCSS
- Axios

**Backend:**
- Node.js
- Express.js
- Axios
- CORS
- dotenv