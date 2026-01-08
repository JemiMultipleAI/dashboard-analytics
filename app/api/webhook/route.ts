import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL;
    
    if (!n8nWebhookUrl) {
      return NextResponse.json(
        { success: false, error: 'Webhook URL is not configured. Please set WEBHOOK_URL in your environment variables.' },
        { status: 500 }
      );
    }
    
    // Trigger the n8n webhook
    const response = await fetch(n8nWebhookUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const isSuccess = response.ok; // response.ok is true for 200-299 status codes
    const data = await response.json().catch(() => ({}));

    return NextResponse.json(
      { success: isSuccess, data },
      { status: response.status }
    );
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { success: false, error: 'Webhook trigger failed' },
      { status: 500 }
    );
  }
}

