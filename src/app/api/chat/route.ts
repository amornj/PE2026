import { NextRequest, NextResponse } from 'next/server';

const NLM_PROXY_URL = process.env.NLM_PROXY_URL || 'http://localhost:3847';
const NLM_PROXY_KEY = process.env.NLM_PROXY_KEY || '';
const NOTEBOOK_ID = '899a7512-2fab-4643-a85d-9f1ae0b73ea7';

const MODE_PREFIXES: Record<string, string> = {
  brief: 'Answer with short bullet points only. Maximum 4-5 bullets, one line each. No paragraphs, no preamble.\n\n',
  explanatory: 'Format your answer using bullet points and short paragraphs for easy scanning. Use headers for distinct sections. Avoid long unbroken paragraphs.\n\n',
};

export async function POST(req: NextRequest) {
  try {
    const { question, mode } = await req.json();

    if (!question || typeof question !== 'string') {
      return NextResponse.json(
        { error: 'Missing or invalid question' },
        { status: 400 },
      );
    }

    const prefix = MODE_PREFIXES[mode as string] ?? '';
    const fullQuestion = prefix + question;

    const response = await fetch(`${NLM_PROXY_URL}/query`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(NLM_PROXY_KEY && { 'x-api-key': NLM_PROXY_KEY }),
      },
      body: JSON.stringify({ question: fullQuestion, notebook_id: NOTEBOOK_ID }),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error('nlm-proxy error:', response.status, text);
      return NextResponse.json(
        { error: 'Failed to query NotebookLM' },
        { status: 502 },
      );
    }

    const data = await response.json();

    return NextResponse.json({
      answer: data.answer ?? '',
      sources: data.sources ?? [],
    });
  } catch (err) {
    console.error('Chat API error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
