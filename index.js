const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

// Load environment variables from .env file
function loadEnv() {
    const envPath = path.join(__dirname, '.env');
    if (fs.existsSync(envPath)) {
        const envFile = fs.readFileSync(envPath, 'utf8');
        const lines = envFile.split('\n');
        lines.forEach(line => {
            const [key, value] = line.split('=');
            if (key && value) {
                process.env[key.trim()] = value.trim();
            }
        });
    }
}

loadEnv();

app.use(express.static('public'));

// CSV export endpoint
app.get('/export-csv', async (req, res) => {
    try {
        // Make HTTP request to Supabase REST API
        const response = await fetch(`${process.env.SUPABASE_URL}/rest/v1/demo_requests?select=*&order=created_at.desc`, {
            headers: {
                'apikey': process.env.SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${process.env.SUPABASE_ANON_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            console.error('Error fetching data:', response.statusText);
            return res.status(500).json({ error: 'Failed to fetch data' });
        }

        const data = await response.json();

        // Generate CSV content
        let csvContent = 'Date,Organization,Full Name,Cell Number,Email,Submitted At\n';
        
        data.forEach(row => {
            const csvRow = [
                row.demo_date,
                `"${row.organization}"`,
                `"${row.full_name}"`,
                row.cell_number,
                row.email,
                new Date(row.created_at).toLocaleString()
            ].join(',');
            csvContent += csvRow + '\n';
        });

        // Set headers for CSV download
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename="demo_requests.csv"');
        
        res.send(csvContent);
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ error: 'Server error occurred' });
    }
});

app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));
