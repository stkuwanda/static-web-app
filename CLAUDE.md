# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a static web application for DPOhub, a data protection compliance platform. The project serves static files using Node.js and Express, showcasing a landing page with modal forms for demo bookings.

## Common Commands

### Development
- `npm install` - Install dependencies
- `npm run dev` - Start development server with hot reload (uses nodemon)
- `npm start` - Start production server

### Testing
- No test framework configured (shows "Error: no test specified")

## Architecture

### Backend (Node.js/Express)
- **Entry point**: `index.js` - Express server serving static files from `public/` directory on port 3000
- **Dependencies**: Express for server, nodemon for development
- **Database**: Supabase integration for storing form submissions
- **CSV Export**: `/export-csv` endpoint to download all demo requests as CSV

### Frontend Structure
- **Main HTML**: `public/index.html` - Single-page application with modal booking form and Supabase CDN
- **JavaScript**: `public/main.js` - DOM manipulation, form validation, modal functionality, and Supabase client
- **Styling**: 
  - `public/style.css` - Main styling with background images
  - `public/modal.css` - Modal-specific styles
- **Assets**: Background images, logo, dashboard screenshot in `public/` directory

### Database Schema (Supabase)
```sql
CREATE TABLE demo_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  demo_date DATE NOT NULL,
  organization VARCHAR(100) NOT NULL,
  full_name VARCHAR(100) NOT NULL,
  cell_number VARCHAR(20) NOT NULL,
  email VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Key Features
- Modal-based demo booking form with client-side validation
- Supabase integration for form data persistence
- CSV export functionality at `/export-csv` endpoint
- Responsive design with feature grid layouts  
- Pricing section with multiple tiers
- Form validation using regex patterns for organization, name, phone, and email

## Development Notes

- Server runs on port 3000
- All static assets served from `public/` directory
- Form submissions are saved to Supabase database
- Uses vanilla JavaScript with Supabase client via CDN
- Environment variables stored in `.env` file (update with your Supabase credentials)
- CSV export available at `http://localhost:3000/export-csv` when running

## Configuration Required

1. Update `.env` with your Supabase credentials
2. Update `public/index.html` script section with your Supabase credentials  
3. Create the `demo_requests` table in your Supabase project using the provided schema