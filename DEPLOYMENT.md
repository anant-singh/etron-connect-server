# EtronConnect Server - Heroku Deployment Guide

## 🚀 Quick Deployment Steps

### 1. Prerequisites
- [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli) installed
- Git repository initialized
- Smartcar Client Secret (keep this secure!)

### 2. Create Heroku App
```bash
heroku create your-etronconnect-server
```

### 3. Set Environment Variables
```bash
# Required Smartcar Configuration
heroku config:set SMARTCAR_CLIENT_ID=b2df14ec-27e7-4234-9040-22d43f86f875
heroku config:set SMARTCAR_CLIENT_SECRET=your_actual_client_secret_here
heroku config:set SMARTCAR_REDIRECT_URI=etronconnect://auth

# Production Configuration
heroku config:set NODE_ENV=production

# CORS - Update with your production domains
heroku config:set ALLOWED_ORIGINS=https://yourdomain.com,https://api.yourdomain.com

# Optional: Rate Limiting (defaults are usually fine)
heroku config:set RATE_LIMIT_WINDOW_MS=900000
heroku config:set RATE_LIMIT_MAX_REQUESTS=100
```

### 4. Deploy
```bash
git add .
git commit -m "Initial server deployment"
heroku git:remote -a your-etronconnect-server
git push heroku main
```

### 5. Verify Deployment
```bash
heroku logs --tail
heroku open
```

You should see:
```json
{
  "success": true,
  "message": "EtronConnect Server API",
  "version": "1.0.0",
  "environment": "production"
}
```

## 🔧 Configuration Details

### Environment Variables Explained

| Variable | Description | Example |
|----------|-------------|---------|
| `SMARTCAR_CLIENT_ID` | From Smartcar Dashboard | `b2df14ec-27e7-4234-9040-22d43f86f875` |
| `SMARTCAR_CLIENT_SECRET` | **Keep Secret!** From Smartcar Dashboard | `your_secret_here` |
| `SMARTCAR_REDIRECT_URI` | Must match mobile app | `etronconnect://auth` |
| `NODE_ENV` | Environment mode | `production` |
| `ALLOWED_ORIGINS` | CORS allowed origins | Comma-separated URLs |

### Security Best Practices

1. **Never commit `.env` files** - they're in `.gitignore`
2. **Limit CORS origins** - only allow your production domains
3. **Monitor logs** - use `heroku logs --tail`
4. **Use HTTPS** - Heroku provides this automatically

## 📱 Mobile App Integration

After deployment, update your mobile app configuration:

```typescript
// In your mobile app config
const SERVER_CONFIG = {
  API_BASE_URL: 'https://your-etronconnect-server.herokuapp.com',
};

// Update token exchange function
const exchangeToken = async (code: string) => {
  const response = await fetch(`${SERVER_CONFIG.API_BASE_URL}/api/auth/exchange`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ code }),
  });
  
  if (!response.ok) {
    throw new Error('Token exchange failed');
  }
  
  return response.json();
};
```

## 🧪 Testing Your Deployment

### 1. Health Check
```bash
curl https://your-etronconnect-server.herokuapp.com/
```

### 2. Token Exchange (with valid code)
```bash
curl -X POST https://your-etronconnect-server.herokuapp.com/api/auth/exchange \
  -H "Content-Type: application/json" \
  -d '{"code": "test_code"}'
```

### 3. Check Logs
```bash
heroku logs --tail -a your-etronconnect-server
```

## 🔄 Updates and Maintenance

### Deploy Updates
```bash
git add .
git commit -m "Update description"
git push heroku main
```

### View Environment Variables
```bash
heroku config -a your-etronconnect-server
```

### Scale Dynos (if needed)
```bash
heroku ps:scale web=1 -a your-etronconnect-server
```

### Monitor Performance
```bash
heroku logs --tail -a your-etronconnect-server
heroku ps -a your-etronconnect-server
```

## 🐛 Troubleshooting

### Common Issues

1. **App crashes on startup**
   - Check logs: `heroku logs --tail`
   - Verify all required env vars are set
   - Ensure `SMARTCAR_CLIENT_SECRET` is correct

2. **CORS errors from mobile app**
   - Add your app's origin to `ALLOWED_ORIGINS`
   - For Expo development: include `exp://` URLs

3. **Token exchange fails**
   - Verify Smartcar credentials
   - Check redirect URI matches exactly
   - Ensure API key is correct

4. **Rate limiting issues**
   - Increase `RATE_LIMIT_MAX_REQUESTS`
   - Or increase `RATE_LIMIT_WINDOW_MS`

### Debug Commands
```bash
# View all config
heroku config -a your-app-name

# Restart app
heroku restart -a your-app-name

# View recent logs
heroku logs --tail -a your-app-name

# Open app in browser
heroku open -a your-app-name
```

## 📊 Monitoring

### Heroku Metrics
- View in Heroku Dashboard
- Monitor response times
- Track error rates

### Custom Logging
The server logs all important events:
- Token exchanges
- API key authentication attempts
- Rate limiting events
- Errors and warnings

## 🔒 Security Checklist

- [ ] Strong API key generated and set
- [ ] Client secret properly configured
- [ ] CORS origins restricted to production domains
- [ ] Rate limiting enabled
- [ ] HTTPS enforced (automatic with Heroku)
- [ ] No sensitive data in logs
- [ ] Environment variables not committed to git

## 🎯 Next Steps

1. **Deploy to Heroku** following the steps above
2. **Update mobile app** with production server URL
3. **Test end-to-end** OAuth flow
4. **Monitor logs** for any issues
5. **Set up monitoring** (optional: New Relic, DataDog)

Your EtronConnect server is now ready for production! 🚀
