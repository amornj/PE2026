import { NextRequest, NextResponse } from 'next/server';

const NLM_PROXY_URL = process.env.NLM_PROXY_URL || 'http://localhost:3847';
const NLM_PROXY_KEY = process.env.NLM_PROXY_KEY || '';
const NOTEBOOK_ID = '899a7512-2fab-4643-a85d-9f1ae0b73ea7';

const MODE_PREFIXES: Record<string, string> = {
  brief: 'Answer as a numbered list. Each item starts with a bold key phrase. Maximum 4-5 items. Example format:\n1. **Key phrase** rest of the point.\n2. **Key phrase** rest of the point.\n\n',
  explanatory: 'Answer as a numbered list. Each item must start with a bold key phrase summarizing that point. Example format:\n1. **Key phrase** rest of the explanation.\n2. **Key phrase** rest of the explanation.\nUse this numbered+bold format for all points.\n\n',
};

// Post-process NotebookLM response into numbered list with bold lead-ins.
// Handles three cases:
//   1. Already numbered+bold (e.g. "1. **Key** text") → return as-is
//   2. Bold lead-ins without numbers (e.g. "**Key.** text\n**Key.** text") → add numbers + spacing
//   3. Plain text → split on sentences, number them, bold first phrase
function formatAnswer(raw: string): string {
  const trimmed = raw.trim();

  // Case 1: already numbered + bold — just ensure spacing
  if (/^\d+\.\s+\*\*/.test(trimmed)) {
    return trimmed.replace(/\n(?=\d+\.\s)/g, '\n\n');
  }

  // Case 2: has bold lead-ins (**phrase**) but no numbers — split on bold markers
  if (/\*\*[^*]+\*\*/.test(trimmed)) {
    // Split on bold patterns that start a new point (newline or start-of-string before **)
    const parts = trimmed.split(/(?:^|\n)\s*(?=\*\*)/).filter(Boolean);
    if (parts.length > 1) {
      return parts
        .map((part, i) => `${i + 1}. ${part.trim()}`)
        .join('\n\n');
    }
  }

  // Case 3: plain text — split into separate points and format
  // First try splitting on newlines
  let points = trimmed.split('\n').map((l) => l.trim()).filter(Boolean);

  // If only one "line" (no newlines), split on sentence boundaries
  if (points.length <= 1) {
    points = trimmed
      .split(/(?<=[.!?])\s+(?=[A-Z])/)
      .map((s) => s.trim())
      .filter(Boolean);
  }

  if (points.length <= 1) return trimmed; // truly single sentence

  return points
    .map((point, i) => {
      // Strip existing bullet/number prefix
      const stripped = point.replace(/^[-*•]\s+|^\d+[.)]\s+/, '');
      // If already has bold, just add number
      if (/\*\*/.test(stripped)) return `${i + 1}. ${stripped}`;
      // Bold text before first period+space, colon, or dash separator
      const leadMatch = stripped.match(/^([^.:\-—]+?[.:\-—])\s*(.*)/);
      if (leadMatch) {
        return `${i + 1}. **${leadMatch[1]}** ${leadMatch[2]}`;
      }
      // Fallback: bold first 3-4 words
      const words = stripped.split(/\s+/);
      const boldCount = Math.min(4, Math.ceil(words.length / 3));
      const boldPart = words.slice(0, boldCount).join(' ');
      const rest = words.slice(boldCount).join(' ');
      return rest ? `${i + 1}. **${boldPart}** ${rest}` : `${i + 1}. ${stripped}`;
    })
    .join('\n\n');
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
