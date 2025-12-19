// API utility functions for fetching data from Google APIs
import { getCachedData, setCachedData, clearCache } from './cache';

// Cache TTLs (in milliseconds)
const CACHE_TTL = {
  GA4: 10 * 60 * 1000,      // 10 minutes
  GSC: 15 * 60 * 1000,      // 15 minutes
  ADS: 10 * 60 * 1000,      // 10 minutes
};

export async function initiateGoogleAuth(service: 'ga4' | 'gsc' | 'ads'): Promise<string> {
  const response = await fetch(`/api/auth/google?service=${service}`);
  if (!response.ok) {
    throw new Error('Failed to initiate authentication');
  }
  const data = await response.json();
  return data.authUrl;
}

export async function fetchGA4Data(forceRefresh: boolean = false) {
  const cacheKey = 'ga4_data';
  
  // Check cache first (unless forcing refresh)
  if (!forceRefresh) {
    const cached = getCachedData(cacheKey);
    if (cached) {
      console.log('📦 Using cached GA4 data');
      return cached;
    }
  }
  
  try {
    console.log('🔄 Fetching fresh GA4 data from API...');
    const response = await fetch('/api/ga4/data');
    
    if (!response.ok) {
      if (response.status === 401) {
        // Clear cache on auth error
        clearCache(cacheKey);
        throw new Error('Not authenticated. Please connect your Google Analytics account.');
      }
      
      // Try to parse JSON error response
      let errorData: any = {};
      let errorText = '';
      
      try {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          errorData = await response.json();
        } else {
          // If not JSON, try to get text
          errorText = await response.text();
        }
      } catch (parseError) {
        console.error('Failed to parse error response:', parseError);
      }
      
      // Build comprehensive error message
      let errorMessage = errorData.details || errorData.error || errorText;
      
      // If we still don't have a message, create one from status
      if (!errorMessage || errorMessage === '{}' || (typeof errorMessage === 'object' && Object.keys(errorMessage).length === 0)) {
        if (response.status === 403) {
          errorMessage = 'Access denied. Please ensure the Google Analytics API is enabled in Google Cloud Console and you have proper permissions.';
        } else if (response.status === 404) {
          errorMessage = 'Property not found. Please verify you have a GA4 property set up in Google Analytics.';
        } else if (response.status === 429) {
          errorMessage = 'API quota exceeded. Please wait a few minutes and try again.';
        } else {
          errorMessage = `Failed to fetch GA4 data: HTTP ${response.status} ${response.statusText || 'Unknown error'}`;
        }
      }
      
      console.error('GA4 API Error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorData,
        errorText: errorText || 'No error text',
        message: errorMessage,
        url: response.url,
      });
      
      throw new Error(errorMessage);
    }
    
    const data = await response.json();
    
    // Cache the successful response
    setCachedData(cacheKey, data, CACHE_TTL.GA4);
    console.log('✅ GA4 data cached for', CACHE_TTL.GA4 / 1000 / 60, 'minutes');
    
    return data;
  } catch (error: any) {
    // Handle network errors or other fetch failures
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      console.error('Network error fetching GA4 data:', error);
      throw new Error('Network error: Unable to connect to the server. Please check your internet connection.');
    }
    
    // Re-throw if it's already our formatted error
    if (error.message && !error.message.includes('Failed to fetch')) {
      throw error;
    }
    
    // Otherwise, provide a more helpful error message
    console.error('Unexpected error fetching GA4 data:', error);
    throw new Error(error.message || 'Failed to fetch GA4 data. Please try again or check your connection.');
  }
}

export async function fetchGSCData(forceRefresh: boolean = false, retryCount: number = 0) {
  const cacheKey = 'gsc_data';
  const MAX_RETRIES = 2;
  const RETRY_DELAY = 2000; // 2 seconds
  
  // Check cache first (unless forcing refresh)
  if (!forceRefresh) {
    const cached = getCachedData(cacheKey);
    if (cached) {
      console.log('📦 Using cached GSC data');
      return cached;
    }
  }
  
  try {
    console.log('🔄 Fetching fresh GSC data from API...', retryCount > 0 ? `(Retry ${retryCount}/${MAX_RETRIES})` : '');
    const response = await fetch('/api/gsc/data');
    
    if (!response.ok) {
      if (response.status === 401) {
        // Clear cache on auth error
        clearCache(cacheKey);
        throw new Error('Not authenticated. Please connect your Google Search Console account.');
      }
      
      // Try to parse JSON error response
      let errorData: any = {};
      let errorText = '';
      
      try {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          errorData = await response.json();
        } else {
          // If not JSON, try to get text
          errorText = await response.text();
        }
      } catch (parseError) {
        console.error('Failed to parse error response:', parseError);
        // If we can't parse, at least try to get the status text
        errorText = `HTTP ${response.status}: ${response.statusText || 'Unknown error'}`;
      }
      
      // Build comprehensive error message
      let errorMessage = errorData.details || errorData.error || errorText;
      
      // If we still don't have a message, create one from status
      if (!errorMessage || errorMessage === '{}' || (typeof errorMessage === 'object' && Object.keys(errorMessage).length === 0)) {
        if (response.status === 403) {
          errorMessage = 'Access denied. Please ensure the Search Console API is enabled in Google Cloud Console and you have proper permissions.';
        } else if (response.status === 404) {
          errorMessage = 'Site not found. Please verify the site is added to Google Search Console.';
        } else if (response.status === 429) {
          errorMessage = 'API quota exceeded. Please wait a few minutes and try again.';
        } else {
          errorMessage = `Failed to fetch GSC data: HTTP ${response.status} ${response.statusText || 'Unknown error'}`;
        }
      }
      
      // Retry logic for transient errors (5xx, 429)
      if (retryCount < MAX_RETRIES && (response.status >= 500 || response.status === 429)) {
        console.warn(`⚠️ Retrying GSC API call after ${RETRY_DELAY}ms...`);
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
        return fetchGSCData(forceRefresh, retryCount + 1);
      }
      
      console.error('GSC API Error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorData,
        errorText: errorText || 'No error text',
        message: errorMessage,
        url: response.url,
        retryAttempt: retryCount,
      });
      
      throw new Error(errorMessage);
    }
    
    const data = await response.json();
    
    // Cache the successful response
    setCachedData(cacheKey, data, CACHE_TTL.GSC);
    console.log('✅ GSC data cached for', CACHE_TTL.GSC / 1000 / 60, 'minutes');
    
    return data;
  } catch (error: any) {
    // Don't retry if it's an authentication error or client error (4xx except 429)
    if (error.message?.includes('Not authenticated') || (error.message?.includes('HTTP 4') && !error.message?.includes('429'))) {
      throw error;
    }
    
    // Retry on network errors or unknown errors
    if (retryCount < MAX_RETRIES && (error.name === 'TypeError' || !error.message)) {
      console.warn(`⚠️ Retrying GSC API call after ${RETRY_DELAY}ms due to network error...`);
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      return fetchGSCData(forceRefresh, retryCount + 1);
    }
    
    throw error;
  }
}

export async function fetchAdsData(startDate?: Date, endDate?: Date, forceRefresh: boolean = false) {
  const params = new URLSearchParams();
  if (startDate) {
    params.append('startDate', startDate.toISOString().split('T')[0]);
  }
  if (endDate) {
    params.append('endDate', endDate.toISOString().split('T')[0]);
  }
  
  // Create cache key based on date range
  const dateRangeKey = startDate && endDate 
    ? `${startDate.toISOString().split('T')[0]}_${endDate.toISOString().split('T')[0]}`
    : 'default';
  const cacheKey = `ads_data_${dateRangeKey}`;
  
  // Check cache first (unless forcing refresh)
  if (!forceRefresh) {
    const cached = getCachedData(cacheKey);
    if (cached) {
      console.log('📦 Using cached Google Ads data');
      return cached;
    }
  }
  
  console.log('🔄 Fetching fresh Google Ads data from API...');
  const url = `/api/ads/data${params.toString() ? `?${params.toString()}` : ''}`;
  const response = await fetch(url);
  
  if (!response.ok) {
    if (response.status === 401) {
      // Clear cache on auth error
      clearCache(cacheKey);
      throw new Error('Not authenticated. Please connect your Google Ads account.');
    }
    
    // Try to parse JSON error response
    let errorData: any = {};
    let errorText = '';
    
    try {
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        errorData = await response.json();
      } else {
        errorText = await response.text();
      }
    } catch (parseError) {
      console.error('Failed to parse error response:', parseError);
      errorText = `HTTP ${response.status}: ${response.statusText || 'Unknown error'}`;
    }
    
    // Build comprehensive error message
    let errorMessage = errorData.details || errorData.error || errorText;
    
    // If we still don't have a message, create one from status
    if (!errorMessage || errorMessage === '{}' || (typeof errorMessage === 'object' && Object.keys(errorMessage).length === 0)) {
      if (response.status === 403) {
        errorMessage = 'Access denied. Please ensure the Google Ads API is enabled and you have proper permissions.';
      } else if (response.status === 404) {
        errorMessage = 'Customer ID not found. Please verify your Google Ads Customer ID.';
      } else if (response.status === 429) {
        errorMessage = 'API quota exceeded. Please wait a few minutes and try again.';
      } else {
        errorMessage = `Failed to fetch Google Ads data: HTTP ${response.status} ${response.statusText || 'Unknown error'}`;
      }
    }
    
    console.error('Google Ads API Error:', {
      status: response.status,
      statusText: response.statusText,
      error: errorData,
      errorText: errorText || 'No error text',
      message: errorMessage,
      url: response.url,
    });
    
    throw new Error(errorMessage);
  }
  
  const data = await response.json();
  
  // Cache the successful response
  setCachedData(cacheKey, data, CACHE_TTL.ADS);
  console.log('✅ Google Ads data cached for', CACHE_TTL.ADS / 1000 / 60, 'minutes');
  
  return data;
}

export async function fetchSheetsData(sheetId: string, range?: string) {
  const params = new URLSearchParams();
  params.append('sheetId', sheetId);
  if (range) {
    params.append('range', range);
  }
  
  const response = await fetch(`/api/sheets/data?${params.toString()}`);
  console.log("response", response);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Failed to fetch Google Sheets data: ${response.status}`);
  }
  return response.json();
}

export async function checkConnectionStatus(service: 'ga4' | 'gsc' | 'ads'): Promise<boolean> {
  try {
    if (service === 'ga4') {
      await fetchGA4Data();
      return true;
    } else if (service === 'gsc') {
      await fetchGSCData();
      return true;
    } else if (service === 'ads') {
      await fetchAdsData();
      return true;
    }
    return false;
  } catch (error) {
    return false;
  }
}

