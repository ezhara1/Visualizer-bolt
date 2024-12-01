import MistralClient from '@mistralai/mistralai';

const mistral = new MistralClient(import.meta.env.VITE_MISTRAL_API_KEY);

function cleanJsonResponse(response: string): string {
  try {
    // Remove markdown code block formatting if present
    let cleaned = response.replace(/^```json\s*|\s*```$/g, '').trim();
    
    // Try to extract just the JSON array part using regex
    const jsonMatch = cleaned.match(/\[.*\]/s);
    if (jsonMatch) {
      cleaned = jsonMatch[0];
    }

    // For debugging
    console.log('Original response:', response);
    console.log('Cleaned response:', cleaned);
    
    // Validate that it's parseable
    JSON.parse(cleaned);
    return cleaned;
  } catch (error) {
    console.error('Error cleaning JSON response:', error);
    console.error('Original response:', response);
    return '[]';
  }
}

export async function analyzeWithMistral(text: string): Promise<string> {
  try {
    console.log('Calling Mistral API with text:', text);
    
    const response = await mistral.chat({
      model: "mistral-large-latest",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that analyzes text and extracts events in chronological order. Return ONLY a JSON array in this format, with no additional text: [{\"title\": \"Event Title\", \"description\": \"Detailed description\", \"timestamp\": \"Time reference\"}]"
        },
        {
          role: "user",
          content: text
        }
      ],
    });

    console.log('Mistral API raw response:', response);
    
    if (!response.choices || !response.choices[0] || !response.choices[0].message) {
      console.error('Invalid response structure from Mistral:', response);
      throw new Error('Invalid response structure from Mistral API');
    }

    const content = response.choices[0].message.content;
    console.log('Mistral API content:', content);

    if (!content) {
      throw new Error('Empty response from Mistral API');
    }

    const cleanedResponse = cleanJsonResponse(content);
    console.log('Cleaned response:', cleanedResponse);
    
    return cleanedResponse;
  } catch (error) {
    console.error('Mistral API Error:', error);
    if (error instanceof Error) {
      throw new Error(`Failed to analyze text with Mistral: ${error.message}`);
    } else {
      throw new Error('Failed to analyze text with Mistral: Unknown error');
    }
  }
}