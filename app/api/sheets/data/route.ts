import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sheetId = searchParams.get('sheetId');
    const range = searchParams.get('range') || 'Sheet1'; // Default to Sheet1

    if (!sheetId) {
      return NextResponse.json(
        { error: 'Sheet ID is required' },
        { status: 400 }
      );
    }

    const apiKey = process.env.GOOGLE_SHEETS_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Google Sheets API key not configured. Please add GOOGLE_SHEETS_API_KEY to your environment variables.' },
        { status: 500 }
      );
    }

    // Use API key authentication for Google Sheets API (works with public sheets)
    const sheets = google.sheets({ version: 'v4', auth: apiKey });

    // Fetch only first 2 rows from the sheet (row 1 = titles, row 2 = content)
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: `${range}!A1:F2`, // First 2 rows, columns A-F (6 columns)
    });

    const rows = response.data.values || [];

    if (rows.length === 0) {
      return NextResponse.json({
        tabs: [],
        content: {},
      });
    }

    // Row 1 (index 0) = Tab titles
    // Row 2 (index 1) = Content for each tab
    const titleRow = rows[0] || [];
    const contentRow = rows[1] || [];

    // Extract 6 columns: titles from row 1, content from row 2
    const tabs: string[] = [];
    const content: Record<string, string> = {};

    for (let i = 0; i < 6; i++) {
      const title = titleRow[i]?.toString().trim() || `Column ${i + 1}`;
      const contentValue = contentRow[i]?.toString().trim() || '';
      
      tabs.push(title);
      content[`column${i + 1}`] = contentValue;
    }

    return NextResponse.json({
      tabs,
      content,
    });
  } catch (error: any) {
    console.error('Error fetching Google Sheets data:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch sheet data',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

