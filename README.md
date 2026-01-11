# Fitness Tracker

A mobile-first fitness tracker for logging daily health metrics with GitHub-style activity heatmap visualization and trend charts.

## Features

- **Daily Entry Form**: Log weight, steps, clean eating score, protein intake, and exercise
- **Composite Score**: Track overall consistency across all metrics
- **GitHub-Style Heatmap**: Visualize your progress with a contribution graph
- **Trend Charts**: See your progress over time for each metric
- **Mobile-First Design**: Optimized for bedtime logging on your phone

## Tech Stack

- **Frontend**: Next.js 16 (LTS) + TypeScript + Tailwind CSS
- **Backend**: PHP API on Dreamhost
- **Storage**: JSON flat file (append-only)
- **Visualization**: Cal-Heatmap + Recharts

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- PHP 8.0+ (for backend API on Dreamhost)
- Access to Dreamhost or similar hosting for PHP API

### Local Development

1. **Start the Next.js development server:**

   ```bash
   cd fitness-tracker
   npm install
   npm run dev
   ```

   The app will be available at `http://localhost:3000`

2. **Configure API URL:**

   Create `.env.local` in the `fitness-tracker` directory:

   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```

   Or point to your deployed PHP API:

   ```env
   NEXT_PUBLIC_API_URL=https://your-domain.com/fitness-api
   ```

3. **Test the PHP API locally (optional):**

   ```bash
   cd fitness-api
   php -S localhost:8000
   ```

   Then test with curl:

   ```bash
   # Test GET
   curl http://localhost:8000/api/entries

   # Test POST
   curl -X POST http://localhost:8000/api/entries \
     -H "Content-Type: application/json" \
     -d '{"weight":185.5,"steps":7500,"clean_eating_score":0.75,"protein_grams":165,"protein_percentage":0.9167,"lifted_or_stretched":true,"composite_score":0.8542,"date":"2026-01-11"}'
   ```

## Deployment

### Deploy Backend to Dreamhost

1. **Upload files via SFTP:**

   Upload the `fitness-api` directory to your Dreamhost account:

   ```
   /home/username/your-domain.com/fitness-api/
   ├── api/
   │   └── index.php
   ├── lib/
   │   ├── file-handler.php
   │   └── validator.php
   ├── data/
   │   ├── entries.json
   │   └── .htaccess
   └── .htaccess
   ```

2. **Set file permissions:**

   ```bash
   chmod 775 fitness-api/data
   chmod 664 fitness-api/data/entries.json
   ```

3. **Update CORS in `api/index.php`:**

   Replace the wildcard CORS header with your Vercel domain:

   ```php
   header('Access-Control-Allow-Origin: https://your-app.vercel.app');
   ```

4. **Test the API:**

   ```bash
   curl https://your-domain.com/fitness-api/api/entries
   ```

### Deploy Frontend to Vercel

1. **Push to GitHub:**

   ```bash
   git add .
   git commit -m "Ready for deployment"
   git remote add origin https://github.com/yourusername/fitness-tracker.git
   git push -u origin main
   ```

2. **Import to Vercel:**

   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Set root directory to `fitness-tracker`

3. **Configure environment variable:**

   Add this environment variable in Vercel project settings:

   ```
   NEXT_PUBLIC_API_URL=https://your-domain.com/fitness-api
   ```

4. **Deploy!**

   Vercel will automatically build and deploy your app.

## Usage

### Daily Logging

1. Open the app on your mobile device before bed
2. Fill in today's metrics:
   - Weight (lbs)
   - Steps count
   - Clean eating score (0-100%)
   - Protein intake (grams)
   - Did you lift weights or stretch? (toggle)
3. Tap "Log Entry" to save

### Viewing Progress

- **Heatmap Tab**: See your activity over the last year with different metrics
- **Trends Tab**: View line charts showing your progress over time

## Composite Score Calculation

Your composite score is calculated as the average of:

- Steps normalized to 8,000 daily goal
- Clean eating score (0-1)
- Protein grams normalized to 180g goal
- Exercise (1 if you lifted/stretched, 0 otherwise)

The score is capped at 1.0 (100%).

## Data Model

Each entry contains:

```json
{
  "id": "2026-01-11T22:30:45.123Z",
  "timestamp": "2026-01-11T22:30:45.123Z",
  "date": "2026-01-11",
  "weight": 185.5,
  "steps": 7500,
  "clean_eating_score": 0.75,
  "protein_grams": 165,
  "protein_percentage": 0.9167,
  "lifted_or_stretched": true,
  "composite_score": 0.8542
}
```

## Project Structure

```
fitness-tracker/
├── app/                    # Next.js app directory
│   ├── heatmap/           # Heatmap page
│   ├── trends/            # Trends page
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home (entry form)
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── EntryForm.tsx
│   ├── Heatmap.tsx
│   ├── TrendChart.tsx
│   └── Navigation.tsx
├── lib/                   # Utility functions
│   ├── types.ts
│   ├── calculations.ts
│   └── api.ts
└── hooks/                 # Custom React hooks
    └── useEntries.ts

fitness-api/
├── api/
│   └── index.php         # API router
├── lib/
│   ├── file-handler.php  # Data persistence
│   └── validator.php     # Input validation
└── data/
    ├── entries.json      # Data storage
    └── .htaccess        # Access control
```

## Troubleshooting

### CORS Issues

If you get CORS errors, make sure:

1. The `Access-Control-Allow-Origin` header in `api/index.php` matches your Vercel domain
2. The PHP API is accessible from your browser
3. Both frontend and backend use HTTPS in production

### Data Not Persisting

Check:

1. File permissions on `fitness-api/data/entries.json` (should be 664)
2. Directory permissions on `fitness-api/data` (should be 775)
3. PHP error logs on Dreamhost

### Mobile Zoom Issues

If iOS zooms in on input focus:

- Check that all inputs have at least 16px font size
- Verify the viewport meta tag in `layout.tsx`

## Backup Strategy

Set up a cron job on Dreamhost to backup `entries.json` daily:

```bash
#!/bin/bash
DATE=$(date +%Y%m%d)
cp ~/your-domain.com/fitness-api/data/entries.json ~/backups/entries-$DATE.json
find ~/backups -name "entries-*.json" -mtime +30 -delete
```

Add to crontab:

```
0 3 * * * /home/username/backup.sh
```

## License

Personal use only.
