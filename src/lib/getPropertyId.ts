import fs from 'fs';
import path from 'path';

/**
 * Get Property ID from multiple sources in priority order:
 * 1. key.json file (highest priority)
 * 2. Environment variables (GA4_PROPERTY_ID or NEXT_PUBLIC_GA4_PROPERTY_ID)
 * 3. .env.local file
 */
export function getPropertyId(): string {
  // Priority 1: Read from key.json file (highest priority)
  const keyPath = path.join(process.cwd(), 'key.json');
  if (fs.existsSync(keyPath)) {
    try {
      const keyData = JSON.parse(fs.readFileSync(keyPath, 'utf8'));
      if (keyData.propertyId && /^\d+$/.test(String(keyData.propertyId).trim())) {
        const propertyId = String(keyData.propertyId).trim();
        return propertyId;
      }
    } catch (error: any) {
      console.error('[getPropertyId] Error reading key.json:', error.message);
    }
  }
  
  // Priority 2: Read from environment variables (supports two naming conventions)
  // 1. NEXT_PUBLIC_GA4_PROPERTY_ID (available on both client and server)
  // 2. GA4_PROPERTY_ID (server-only, more secure)
  const envPropertyId = process.env.GA4_PROPERTY_ID || process.env.NEXT_PUBLIC_GA4_PROPERTY_ID;
  
  if (envPropertyId) {
    const propertyId = envPropertyId.trim();
    if (/^\d+$/.test(propertyId)) {
      return propertyId;
    }
    console.warn('[getPropertyId] Property ID environment variable is set but format is invalid');
  }
  
  // Priority 3: Read directly from .env.local file
  const envPath = path.join(process.cwd(), '.env.local');
  if (fs.existsSync(envPath)) {
    try {
      let content = fs.readFileSync(envPath, 'utf8');
      // Remove UTF-8 BOM
      if (content.charCodeAt(0) === 0xFEFF) {
        content = content.slice(1);
      }
      
      // Support two formats:
      // 1. GA4_PROPERTY_ID=xxx
      // 2. NEXT_PUBLIC_GA4_PROPERTY_ID=xxx
      let match = content.match(/GA4_PROPERTY_ID\s*=\s*(\d+)/);
      if (!match) {
        match = content.match(/NEXT_PUBLIC_GA4_PROPERTY_ID\s*=\s*(\d+)/);
      }
      
      if (match && match[1]) {
        return match[1].trim();
      }
    } catch (error: any) {
      console.error('[getPropertyId] Error reading .env.local:', error.message);
    }
  }
  
  // If none found, return empty string
  console.warn('[getPropertyId] Property ID not found. Please set propertyId in key.json, or GA4_PROPERTY_ID/NEXT_PUBLIC_GA4_PROPERTY_ID in environment variables or .env.local');
  return '';
}

