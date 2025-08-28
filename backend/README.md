# Business Scraper Backend

This is the backend API for the Google Maps Business Data Scraper & Email Exporter application.

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Configuration
Copy `.env.example` to `.env` and configure your settings:
```bash
cp .env.example .env
```

Edit the `.env` file with your email credentials:
- **SMTP_USER**: Your email address
- **SMTP_PASS**: Your email password (use App Password for Gmail)
- **SMTP_HOST**: Your SMTP server (default: smtp.gmail.com)

### 3. Gmail Setup (Recommended)
If using Gmail:
1. Enable 2-Factor Authentication on your Google account
2. Generate an App Password: https://myaccount.google.com/apppasswords
3. Use the App Password as your `SMTP_PASS`

### 4. Start the Server
```bash
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:3001`

## API Endpoints

### GET `/api/search`
Search for businesses on Google Maps.

**Parameters:**
- `query` (string): Search query (e.g., "pizza restaurants in Los Angeles")

**Response:**
```json
{
  "success": true,
  "query": "pizza restaurants in Los Angeles",
  "count": 15,
  "businesses": [
    {
      "name": "Tony's Pizza",
      "rating": 4.5,
      "reviewCount": 120,
      "category": "Pizza restaurant",
      "address": "123 Main St, Los Angeles, CA",
      "phone": "+1 (555) 123-4567",
      "website": "https://example.com",
      "mapsLink": "https://www.google.com/maps/place/..."
    }
  ]
}
```

### POST `/api/export`
Export business data via email as CSV attachment.

**Body:**
```json
{
  "email": "user@example.com",
  "data": [
    {
      "name": "Business Name",
      "rating": 4.5,
      "reviewCount": 100,
      "category": "Restaurant",
      "address": "123 Main St",
      "phone": "+1 555-0123",
      "website": "https://example.com",
      "mapsLink": "https://maps.google.com/..."
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Data exported and emailed successfully",
  "email": "user@example.com",
  "count": 15
}
```

### GET `/health`
Health check endpoint.

## Features

- **Web Scraping**: Uses Puppeteer to scrape Google Maps business data
- **Email Export**: Converts data to CSV and sends as email attachment
- **Error Handling**: Comprehensive error handling and logging
- **CORS Support**: Enabled for frontend integration
- **Rate Limiting**: Built-in delays to avoid detection

## Deployment Options

### Heroku
1. Create a new Heroku app
2. Set environment variables in Heroku dashboard
3. Deploy using Git or GitHub integration

### DigitalOcean App Platform
1. Create a new app
2. Connect your GitHub repository
3. Set environment variables
4. Deploy

### Railway
1. Connect your GitHub repository
2. Set environment variables
3. Deploy automatically

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `3001` |
| `SMTP_HOST` | Email server host | `smtp.gmail.com` |
| `SMTP_PORT` | Email server port | `587` |
| `SMTP_USER` | Your email address | `your-email@gmail.com` |
| `SMTP_PASS` | Your email password/app password | `your-app-password` |
| `SMTP_FROM` | From email address | `your-email@gmail.com` |

## Troubleshooting

### Common Issues

1. **Email not sending**: Check SMTP credentials and enable "Less secure app access" or use App Password
2. **Scraping fails**: Google may have rate limiting; try with different queries or add delays
3. **Server crashes**: Check logs for specific error messages

### Logs
The server logs all requests and errors to the console. Check the terminal output for debugging information.

## Legal Notice

This tool is for educational and legitimate business research purposes only. Please respect Google's Terms of Service and robots.txt file. Do not use this tool for:
- Excessive automated requests
- Commercial scraping without permission
- Violating privacy or terms of service

Use responsibly and in compliance with applicable laws and regulations.