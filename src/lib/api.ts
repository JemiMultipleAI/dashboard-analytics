// API utility functions for fetching data from Google APIs

export async function initiateGoogleAuth(service: 'ga4' | 'gsc' | 'ads'): Promise<string> {
  const response = await fetch(`/api/auth/google?service=${service}`);
  if (!response.ok) {
    throw new Error('Failed to initiate authentication');
  }
  const data = await response.json();
  return data.authUrl;
}

export async function fetchGA4Data() {
  const response = await fetch('/api/ga4/data');
  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Not authenticated');
    }
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Failed to fetch GA4 data: ${response.status}`);
  }
  return response.json();
}

export async function fetchGSCData() {
  const response = await fetch('/api/gsc/data');
  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Not authenticated');
    }
    const errorData = await response.json().catch(() => ({}));
    const errorMessage = errorData.error || errorData.details || `Failed to fetch GSC data: ${response.status}`;
    console.error('GSC API Error:', {
      status: response.status,
      error: errorData,
      message: errorMessage,
    });
    throw new Error(errorMessage);
  }
  return response.json();
}

export async function fetchAdsData(startDate?: Date, endDate?: Date) {
  const params = new URLSearchParams();
  if (startDate) {
    params.append('startDate', startDate.toISOString().split('T')[0]);
  }
  if (endDate) {
    params.append('endDate', endDate.toISOString().split('T')[0]);
  }
  
  const url = `/api/ads/data${params.toString() ? `?${params.toString()}` : ''}`;
  const response = await fetch(url);
  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Not authenticated');
    }
    const errorData = await response.json().catch(() => ({}));
    const errorMessage = errorData.error || errorData.details || `Failed to fetch Google Ads data: ${response.status}`;
    console.error('Google Ads API Error:', {
      status: response.status,
      error: errorData,
      message: errorMessage,
    });
    throw new Error(errorMessage);
  }
  return response.json();
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

