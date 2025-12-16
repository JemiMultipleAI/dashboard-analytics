import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL || 'https://n8n.srv1068103.hstgr.cloud/webhook/3a031479-6aa7-4f8f-b1a2-8e60b0863b2d';
    
    // Trigger the n8n webhook
    const response = await fetch(n8nWebhookUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json().catch(() => ({ success: true }));

    return NextResponse.json(
      { success: true, data },
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

