import { NextRequest, NextResponse } from 'next/server';

const NLM_PROXY_URL = process.env.NLM_PROXY_URL || 'http://localhost:3847';
const NLM_PROXY_KEY = process.env.NLM_PROXY_KEY || '';
const NOTEBOOK_ID = '899a7512-2fab-4643-a85d-9f1ae0b73ea7';

const MODE_PREFIXES: Record<string, string> = {
  brief: 'Answer as a numbered list. Each item starts with a bold key phrase. Maximum 4-5 items. Example format:\n1. **Key phrase** rest of the point.\n2. **Key phrase** rest of the point.\n\n',
  explanatory: 'Answer as a numbered list. Each item must start with a bold key phrase summarizing that point. Example format:\n1. **Key phrase** rest of the explanation.\n2. **Key phrase** rest of the explanation.\nUse this numbered+bold format for all points.\n\n',
};

// NotebookLM often ignores formatting instructions and returns plain text.
// This post-processes the response into numbered items with bold lead-ins.
function formatAnswer(raw: string): string {
  // If already well-formatted with numbered list + bold, return as-is
  if (/^\d+\.\s+\*\*/.test(raw.trim())) return raw;

  // Split into lines, filter empties
  const lines = raw.split('\n').map((l) => l.trim()).filter(Boolean);

  // Check if it's already a numbered or bulleted list
  const isAlreadyList = lines.length > 1 && lines.every(
    (l) => /^[-*•]\s|^\d+[.)]\s|^#+\s/.test(l)
  );

  if (isAlreadyList) {
    // Already a list — just ensure bold on first few words and double-newline spacing
    return lines
      .map((line) => {
        if (/\*\*/.test(line)) return line; // already has bold
        return addBoldLeadIn(line);
      })
      .join('\n\n');
  }

  // Plain text — split on sentence boundaries and convert to numbered list
  const sentences = splitSentences(raw);
  if (sentences.length <= 1) return raw; // single sentence, leave alone

  return sentences
    .map((s, i) => {
      const trimmed = s.trim();
      if (!trimmed) return '';
      // Bold the first few words (up to first comma, colon, or 4th word)
      const boldMatch = trimmed.match(/^(.+?(?:[:,]|\s\S+){0,3}?\S+)\s+(.*)/);
      if (boldMatch) {
        return `${i + 1}. **${boldMatch[1]}** ${boldMatch[2]}`;
      }
      return `${i + 1}. ${trimmed}`;
    })
    .filter(Boolean)
    .join('\n\n');
}

function addBoldLeadIn(line: string): string {
  // Strip existing prefix (bullet or number)
  const prefixMatch = line.match(/^([-*•]\s+|\d+[.)]\s+)/);
  const prefix = prefixMatch ? prefixMatch[0] : '';
  const content = prefixMatch ? line.slice(prefix.length) : line;
  // Bold up to first colon/comma or first 3-5 words
  const boldMatch = content.match(/^(.+?(?:[:,]|(?:\s+\S+){2,4}))\s+(.*)/);
  if (boldMatch) {
    return `${prefix}**${boldMatch[1].replace(/[:,]\s*$/, '')}** ${boldMatch[2]}`;
  }
  return line;
}

function splitSentences(text: string): string[] {
  // Split on period/question mark/exclamation followed by space+capital or newline
  // Avoid splitting on abbreviations like "e.g." or "Dr." or numbers like "1."
  return text
    .split(/(?<=[.!?])\s+(?=[A-Z])/)
    .map((s) => s.trim())
    .filter(Boolean);
}

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
      answer: formatAnswer(data.answer ?? ''),
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
