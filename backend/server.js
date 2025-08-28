const express = require('express');
const cors = require('cors');
const puppeteer = require('puppeteer');
const nodemailer = require('nodemailer');
const { Parser } = require('json2csv');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Email transporter configuration
const transporter = nodemailer.createTransporter({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER, // Your email
    pass: process.env.SMTP_PASS, // Your email password or app password
  },
});

// Scraping function
async function scrapeGoogleMaps(query) {
  console.log(`Starting scrape for query: ${query}`);
  
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--no-first-run',
      '--no-zygote',
      '--single-process',
      '--disable-gpu'
    ]
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1366, height: 768 });
    
    // Set user agent to avoid detection
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
    
    // Navigate to Google Maps
    const searchUrl = `https://www.google.com/maps/search/${encodeURIComponent(query)}`;
    console.log(`Navigating to: ${searchUrl}`);
    
    await page.goto(searchUrl, { waitUntil: 'networkidle2', timeout: 30000 });
    
    // Wait for search results to load
    await page.waitForSelector('[data-value="Search results"]', { timeout: 15000 });
    
    // Wait a bit more for all results to load
    await page.waitForTimeout(3000);
    
    // Extract business data
    const businesses = await page.evaluate(() => {
      const results = [];
      
      // Find all business listing containers
      const businessElements = document.querySelectorAll('[data-value="Search results"] > div > div[jsaction]');
      
      businessElements.forEach((element, index) => {
        if (index >= 20) return; // Limit to first 20 results
        
        try {
          const business = {};
          
          // Business name
          const nameElement = element.querySelector('[data-value="Business name"]');
          business.name = nameElement ? nameElement.textContent.trim() : 'Unknown Business';
          
          // Rating
          const ratingElement = element.querySelector('[data-value="Rating"]');
          if (ratingElement) {
            const ratingText = ratingElement.textContent.trim();
            const ratingMatch = ratingText.match(/(\d+\.?\d*)/);
            business.rating = ratingMatch ? parseFloat(ratingMatch[1]) : null;
          }
          
          // Review count
          const reviewElement = element.querySelector('[data-value="Reviews"]');
          if (reviewElement) {
            const reviewText = reviewElement.textContent.trim();
            const reviewMatch = reviewText.match(/\((\d+[\d,]*)\)/);
            business.reviewCount = reviewMatch ? parseInt(reviewMatch[1].replace(/,/g, '')) : null;
          }
          
          // Category
          const categoryElement = element.querySelector('[data-value="Category"]');
          business.category = categoryElement ? categoryElement.textContent.trim() : null;
          
          // Address
          const addressElement = element.querySelector('[data-value="Address"]');
          business.address = addressElement ? addressElement.textContent.trim() : null;
          
          // Phone
          const phoneElement = element.querySelector('[data-value="Phone"]');
          business.phone = phoneElement ? phoneElement.textContent.trim() : null;
          
          // Website
          const websiteElement = element.querySelector('[data-value="Website"]');
          business.website = websiteElement ? websiteElement.href : null;
          
          // Google Maps link
          const linkElement = element.querySelector('a[href*="/maps/place/"]');
          business.mapsLink = linkElement ? `https://www.google.com${linkElement.getAttribute('href')}` : null;
          
          // Only add businesses with at least a name
          if (business.name && business.name !== 'Unknown Business') {
            results.push(business);
          }
        } catch (error) {
          console.error('Error extracting business data:', error);
        }
      });
      
      return results;
    });
    
    console.log(`Found ${businesses.length} businesses`);
    return businesses;
    
  } catch (error) {
    console.error('Scraping error:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

// Routes
app.get('/api/search', async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query) {
      return res.status(400).json({ error: 'Query parameter is required' });
    }
    
    console.log(`Received search request for: ${query}`);
    
    const businesses = await scrapeGoogleMaps(query);
    
    res.json({
      success: true,
      query,
      count: businesses.length,
      businesses
    });
    
  } catch (error) {
    console.error('Search endpoint error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to scrape Google Maps',
      details: error.message
    });
  }
});

app.post('/api/export', async (req, res) => {
  try {
    const { email, data } = req.body;
    
    if (!email || !data || !Array.isArray(data)) {
      return res.status(400).json({ error: 'Email and data array are required' });
    }
    
    console.log(`Exporting ${data.length} businesses to ${email}`);
    
    // Convert data to CSV
    const fields = [
      'name',
      'rating',
      'reviewCount',
      'category',
      'address',
      'phone',
      'website',
      'mapsLink'
    ];
    
    const opts = { fields };
    const parser = new Parser(opts);
    const csv = parser.parse(data);
    
    // Create temporary file
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `business-data-${timestamp}.csv`;
    const filepath = path.join(__dirname, 'temp', filename);
    
    // Ensure temp directory exists
    const tempDir = path.join(__dirname, 'temp');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }
    
    // Write CSV file
    fs.writeFileSync(filepath, csv);
    
    // Send email
    const mailOptions = {
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: email,
      subject: 'Your Business Data Export',
      html: `
        <h2>Your Business Data Export</h2>
        <p>Hello!</p>
        <p>Please find your requested business data attached as a CSV file.</p>
        <p><strong>Export Details:</strong></p>
        <ul>
          <li>Number of businesses: ${data.length}</li>
          <li>Export date: ${new Date().toLocaleString()}</li>
          <li>File format: CSV (Excel compatible)</li>
        </ul>
        <p>You can open this file in Excel, Google Sheets, or any spreadsheet application.</p>
        <p>Best regards,<br>Business Data Scraper</p>
      `,
      attachments: [
        {
          filename: filename,
          path: filepath,
          contentType: 'text/csv'
        }
      ]
    };
    
    await transporter.sendMail(mailOptions);
    
    // Clean up temporary file
    fs.unlinkSync(filepath);
    
    console.log(`Email sent successfully to ${email}`);
    
    res.json({
      success: true,
      message: 'Data exported and emailed successfully',
      email,
      count: data.length
    });
    
  } catch (error) {
    console.error('Export endpoint error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to export data',
      details: error.message
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`Search endpoint: http://localhost:${PORT}/api/search?query=pizza+restaurants`);
});

module.exports = app;