# EtronConnect Server

Backend server for the EtronConnect mobile app. Handles secure Smartcar OAuth token exchange and API requests.

## 🚀 Features

- **Secure Token Exchange**: Handles Smartcar OAuth flow server-side
- **Token Refresh**: Automatic access token refresh using refresh tokens
- **Security**: Rate limiting, CORS, helmet security headers, API key authentication
- **Production Ready**: Configured for Heroku deployment with proper logging
- **TypeScript**: Full TypeScript support with strict type checking

## 📋 Prerequisites

- Node.js 18+ and npm 8+
- Smartcar Developer Account
- Heroku CLI (for deployment)

## 🛠 Setup

### 1. Environment Configuration

Copy the example environment file:
```bash
cp .env.example .env
```

Update `.env` with your Smartcar credentials:
```env
SMARTCAR_CLIENT_ID=your_smartcar_client_id_here
SMARTCAR_CLIENT_SECRET=your_smartcar_client_secret_here
SMARTCAR_REDIRECT_URI=etronconnect://auth
PORT=3000
NODE_ENV=development
ALLOWED_ORIGINS=exp://192.168.1.100:8081,http://localhost:8081,http://localhost:19006
API_KEY=your_secure_api_key_here
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Development

Start the development server:
```bash
npm run dev
```

The server will start on `http://localhost:3000`

### 4. Build for Production

```bash
npm run build
npm start
```

## 📡 API Endpoints

### Health Check
```
GET /
GET /api/auth/health
```

### Token Exchange
```
POST /api/auth/exchange
Body: { "code": "authorization_code", "state": "optional_state" }
```

### Token Refresh
```
POST /api/auth/refresh
Body: { "refresh_token": "refresh_token" }
```

## 🔐 Security Features

- **Rate Limiting**: 100 requests per 15 minutes per IP
- **CORS**: Configurable allowed origins
- **Helmet**: Security headers
- **Input Validation**: Request body validation
- **Error Handling**: Secure error responses (no sensitive data leakage)

## 🚀 Heroku Deployment

### 1. Create Heroku App

```bash
heroku create your-app-name
```

### 2. Set Environment Variables

```bash
heroku config:set SMARTCAR_CLIENT_ID=your_client_id
heroku config:set SMARTCAR_CLIENT_SECRET=your_client_secret
heroku config:set SMARTCAR_REDIRECT_URI=etronconnect://auth
heroku config:set NODE_ENV=production
heroku config:set ALLOWED_ORIGINS=your_production_origins
```

### 3. Deploy

```bash
git add .
git commit -m "Initial server setup"
heroku git:remote -a your-app-name
git push heroku main
```

### 4. Verify Deployment

```bash
heroku logs --tail
heroku open
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `SMARTCAR_CLIENT_ID` | Smartcar application client ID | Yes | - |
| `SMARTCAR_CLIENT_SECRET` | Smartcar application client secret | Yes | - |
| `SMARTCAR_REDIRECT_URI` | OAuth redirect URI | Yes | - |
| `PORT` | Server port | No | 3000 |
| `NODE_ENV` | Environment (development/production) | No | development |
| `ALLOWED_ORIGINS` | Comma-separated CORS origins | No | localhost:19006 |
| `RATE_LIMIT_WINDOW_MS` | Rate limit window in ms | No | 900000 |
| `RATE_LIMIT_MAX_REQUESTS` | Max requests per window | No | 100 |

### CORS Origins

For development with Expo:
```
ALLOWED_ORIGINS=exp://192.168.1.100:8081,http://localhost:8081,http://localhost:19006
```

For production:
```
ALLOWED_ORIGINS=https://yourdomain.com,https://api.yourdomain.com
```

## 📱 Mobile App Integration

Update your mobile app to use this server:

```typescript
// In your mobile app
const API_BASE_URL = 'https://your-heroku-app.herokuapp.com';

const exchangeToken = async (code: string) => {
  const response = await fetch(`${API_BASE_URL}/api/auth/exchange`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ code }),
  });
  
  return response.json();
};
```

## 🐛 Troubleshooting

### Common Issues

1. **CORS Errors**: Check `ALLOWED_ORIGINS` includes your app's origin
2. **Rate Limited**: Wait or increase rate limits
3. **Token Exchange Fails**: Check Smartcar credentials and redirect URI

### Logs

View Heroku logs:
```bash
heroku logs --tail
```

Local development logs are printed to console.

## 🔄 Development Workflow

1. Make changes to TypeScript files in `src/`
2. `npm run dev` automatically restarts server
3. Test endpoints with Postman or mobile app
4. Build and deploy to Heroku

## 📚 Project Structure

```
src/
├── controllers/     # Route handlers
├── middleware/      # Express middleware
├── routes/         # Route definitions
├── types/          # TypeScript type definitions
├── utils/          # Utility functions
├── app.ts          # Express app configuration
└── server.ts       # Server startup
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details
