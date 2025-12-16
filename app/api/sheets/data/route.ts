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

    // Fetch all data from the sheet
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: range,
    });

    const rows = response.data.values || [];

    if (rows.length === 0) {
      return NextResponse.json({
        columns: {
          column1: [],
          column2: [],
          column3: [],
          column4: [],
        },
      });
    }

    // Extract columns (first 4 columns, all rows)
    const column1: string[] = [];
    const column2: string[] = [];
    const column3: string[] = [];
    const column4: string[] = [];

    rows.forEach((row) => {
      column1.push(row[0]?.toString() || '');
      column2.push(row[1]?.toString() || '');
      column3.push(row[2]?.toString() || '');
      column4.push(row[3]?.toString() || '');
    });

    return NextResponse.json({
      columns: {
        column1,
        column2,
        column3,
        column4,
      },
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

