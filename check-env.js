// Quick script to check if .env.local is being read by Next.js
// Run this with: node check-env.js

const fs = require('fs');
const path = require('path');

console.log('=== Environment File Check ===\n');

const envPath = path.join(__dirname, '.env.local');

if (fs.existsSync(envPath)) {
  console.log('✓ .env.local file exists');
  const content = fs.readFileSync(envPath, 'utf8');
  const lines = content.split('\n').filter(line => line.trim() && !line.trim().startsWith('#'));
  
  console.log(`\nFound ${lines.length} non-empty, non-comment lines:\n`);
  
  lines.forEach((line, index) => {
    const [key, ...valueParts] = line.split('=');
    const value = valueParts.join('=');
    if (key && value) {
      const displayValue = value.length > 50 ? value.substring(0, 50) + '...' : value;
      console.log(`${index + 1}. ${key.trim()}: ${displayValue}`);
    }
  });
  
  // Check for required variables
  console.log('\n=== Required Variables Check ===');
  const required = [
    'GOOGLE_CLIENT_ID',
    'GOOGLE_CLIENT_SECRET',
    'NEXT_PUBLIC_GOOGLE_REDIRECT_URI'
  ];
  
  required.forEach(varName => {
    if (content.includes(varName)) {
      console.log(`✓ ${varName} found`);
    } else {
      console.log(`✗ ${varName} MISSING`);
    }
  });
  
} else {
  console.log('✗ .env.local file does NOT exist');
  console.log('\nPlease create .env.local with:');
  console.log('GOOGLE_CLIENT_ID=your-client-id');
  console.log('GOOGLE_CLIENT_SECRET=your-client-secret');
  console.log('NEXT_PUBLIC_GOOGLE_REDIRECT_URI=your-ngrok-url/api/auth/google/callback');
  console.log('NEXT_PUBLIC_BASE_URL=your-ngrok-url');
}




