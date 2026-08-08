# MONTU Frontend - Nuclear Safety & Radiation Management System

## Overview

MONTU is the Nuclear Safety & Radiation Management system. This frontend provides real-time monitoring of nuclear reactors, radiation levels, safety compliance, and emergency response coordination.

## Features

- **Reactor Management**: Monitor active nuclear reactors in real-time
- **Radiation Monitoring**: Track radiation levels across all facilities
- **Safety Systems**: Manage safety protocols and compliance
- **Alert Management**: System alerts and anomaly detection
- **Performance Analytics**: Detailed operational metrics and trends
- **Real-time Health Checks**: Monitor backend API availability

## Local Development

### Prerequisites

- Node.js 20+ with npm
- MONTU backend running on `http://localhost:8000` (or set `REACT_APP_API_BASE_URL`)

### Setup

```bash
cd montu/frontend
npm install
npm start
```

The frontend will start on `http://localhost:3000`

### Environment Variables

Create a `.env.local` file:

```
REACT_APP_API_BASE_URL=http://localhost:8000
```

## Docker Deployment

### Build

```bash
docker build -t montu-frontend:latest .
```

### Run

```bash
docker run -p 3009:3000 \
  -e REACT_APP_API_BASE_URL=http://montu-backend:8000 \
  montu-frontend:latest
```

### Docker Compose

From repository root:

```bash
docker compose -f docker-compose.frontends.yml up montu
```

MONTU frontend will be available at `http://localhost:3009`

## Technology Stack

- **React** 18.3 - UI framework
- **Tailwind CSS** - Styling
- **Lucide Icons** - Icon library
- **Axios** - HTTP client
- **React Router** - Navigation

## Project Structure

```
montu/frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   └── safety/
│   ├── pages/
│   │   └── Dashboard.js
│   ├── App.js
│   ├── App.css
│   ├── index.js
│   ├── index.css
│   ├── reportWebVitals.js
│   └── integration.test.js
├── Dockerfile
├── package.json
├── postcss.config.js
├── tailwind.config.js
└── .gitignore
```

## Testing

```bash
npm test
```

## Build for Production

```bash
npm run build
```

## Support

For issues or questions about the MONTU system, refer to the main constellation documentation.
# MONTU Frontend

MONTU is the nuclear safety and defense frontend for the Sans Mercantile Constellation.

## Purpose
- Monitor reactor health, radiation levels, safety protocols, and emergency response workflows.
- Designed for API integration and containerized deployment.

## Local Run
```bash
npm install
npm start
```

## API Integration
- Set the backend base URL with: `REACT_APP_API_BASE_URL=http://localhost:<backend-port>`
- Health endpoint: `${API_BASE_URL}/api/health`
- Reactor endpoint: `${API_BASE_URL}/api/reactor`

## Containerization
```bash
docker build -t montu-frontend .
docker run -p 3009:3000 -e REACT_APP_API_BASE_URL=http://localhost:8000 montu-frontend
```

## Notes
- Use environment variables to point the frontend to the active backend service.
- The frontend is ready for container deployment.
