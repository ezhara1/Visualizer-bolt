import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

function cleanJsonResponse(response: string): string {
  // Remove markdown code block formatting if present
  return response.replace(/^```json\s*|\s*```$/g, '').trim();
}

export async function analyzeWithOpenAI(text: string): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that analyzes text and extracts events in chronological order. Return the response in this exact JSON format: [{\"title\": \"Event Title\", \"description\": \"Detailed description\", \"timestamp\": \"Time reference\"}]"
        },
        {
          role: "user",
          content: text
        }
      ],
    });

    return cleanJsonResponse(response.choices[0].message.content || '[]');
  } catch (error) {
    console.error('OpenAI API Error:', error);
    throw new Error('Failed to analyze text with OpenAI');
  }
}