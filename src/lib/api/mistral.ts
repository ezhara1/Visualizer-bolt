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
          content: "You are a helpful assistant that analyzes text and extracts events in chronological order. Provide a detailed description of each event in no less than 100 words. Return ONLY a JSON array in this format, with no additional text: [{\"title\": \"Event Title\", \"description\": \"Detailed description\", \"timestamp\": \"Time reference\"}]"
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

export async function extractBusinessInsights(text: string): Promise<string> {
  try {
    console.log('Calling Mistral API for business insights:', text);
    
    const response = await mistral.chat({
      model: "mistral-large-latest",
      messages: [
        {
          role: "system",
          content: `You are an analyst that extracts key insights from text. Analyze the text and present insights in chronological order (earliest to latest). For each main category, provide subcategories with specific insights, opportunities, and challenges. Return the response in this EXACT format with no additional text or markdown: {"insights":[{"category":"Category Name","timestamp":"YYYY-MM-DD","subcategories":[{"title":"Subcategory Name","insights":["Insight 1","Insight 2"],"opportunities":["Opportunity 1","Opportunity 2"],"challenges":["Challenge 1","Challenge 2"]}]}]}`
        },
        {
          role: "user",
          content: text
        }
      ],
    });

    console.log('Mistral API raw response:', response);
    
    if (!response.choices || !response.choices[0] || !response.choices[0].message) {
      throw new Error('Invalid response structure from Mistral');
    }

    const rawContent = response.choices[0].message.content || '{"insights": []}';
    console.log('Raw content:', rawContent);
    
    const cleanedResponse = cleanJsonResponse(rawContent);
    console.log('Cleaned response:', cleanedResponse);
    
    // Try to parse and validate the response
    const parsed = JSON.parse(cleanedResponse);
    
    // If we got an array instead of an object with insights, wrap it
    if (Array.isArray(parsed)) {
      console.log('Converting array response to proper format');
      const sortedArray = parsed.sort((a, b) => {
        const dateA = a.timestamp ? new Date(a.timestamp) : new Date(0);
        const dateB = b.timestamp ? new Date(b.timestamp) : new Date(0);
        return dateA.getTime() - dateB.getTime();
      });
      return JSON.stringify({ insights: sortedArray });
    }
    
    // If we already have the correct structure, sort the insights
    if (parsed.insights && Array.isArray(parsed.insights)) {
      parsed.insights.sort((a, b) => {
        const dateA = a.timestamp ? new Date(a.timestamp) : new Date(0);
        const dateB = b.timestamp ? new Date(b.timestamp) : new Date(0);
        return dateA.getTime() - dateB.getTime();
      });
    }
    
    return JSON.stringify(parsed);
  } catch (error) {
    console.error('Mistral API Error:', error);
    throw new Error('Failed to extract business insights with Mistral');
  }
}

export async function extractFinancialInfo(text: string): Promise<string> {
  try {
    console.log('Calling Mistral API for financial information:', text);
    
    const response = await mistral.chat({
      model: "mistral-large-latest",
      messages: [
        {
          role: "system",
          content: `You are a financial analyst that extracts key financial information from text, with special focus on transaction values and monetary amounts. Present all information in chronological order (earliest to latest). Analyze the text and return information in these categories:
1. Transactions: All monetary transactions with their values, dates, and parties involved
2. Financial Metrics: Key financial indicators, ratios, or performance metrics
3. Assets & Liabilities: Any mentioned assets, debts, or financial obligations
4. Financial Context: Important financial context or market conditions

Return ONLY a JSON array in this format with no additional text or markdown:
[{
  "category": "Category Name",
  "items": [{
    "metric": "Transaction/Metric Name",
    "value": "Monetary Amount/Value",
    "timestamp": "YYYY-MM-DD",
    "period": "Time Period",
    "parties": ["Party 1", "Party 2"],
    "type": "transaction/metric/asset/liability",
    "notes": "Additional Context"
  }]
}]`
        },
        {
          role: "user",
          content: text
        }
      ],
    });

    console.log('Mistral API raw response:', response);
    
    if (!response.choices || !response.choices[0] || !response.choices[0].message) {
      throw new Error('Invalid response structure from Mistral');
    }

    const cleanedResponse = cleanJsonResponse(response.choices[0].message.content || '[]');
    console.log('Cleaned financial response:', cleanedResponse);
    
    // Parse and sort the response
    const parsed = JSON.parse(cleanedResponse);
    if (Array.isArray(parsed)) {
      parsed.forEach(category => {
        if (category.items && Array.isArray(category.items)) {
          category.items.sort((a, b) => {
            const dateA = a.timestamp ? new Date(a.timestamp) : new Date(0);
            const dateB = b.timestamp ? new Date(b.timestamp) : new Date(0);
            return dateA.getTime() - dateB.getTime();
          });
        }
      });
    }
    
    return JSON.stringify(parsed);
  } catch (error) {
    console.error('Mistral API Error:', error);
    throw new Error('Failed to extract financial information with Mistral');
  }
}

export async function extractPartyAnalysis(text: string): Promise<string> {
  try {
    console.log('Calling Mistral API for party analysis:', text);
    
    const response = await mistral.chat({
      model: "mistral-large-latest",
      messages: [
        {
          role: "system",
          content: `You are an analyst that extracts information about different parties (people, organizations, groups) mentioned in the text. For each party, analyze their objectives, any mishaps/setbacks they encountered, and their results/outcomes. Present the analysis in chronological order. Return the response in this EXACT format with no additional text or markdown: 
{
  "parties": [{
    "name": "Party Name",
    "type": "person/organization/group",
    "timestamp": "YYYY-MM-DD",
    "objectives": ["Objective 1", "Objective 2"],
    "mishaps": ["Mishap/Setback 1", "Mishap/Setback 2"],
    "results": ["Result/Outcome 1", "Result/Outcome 2"]
  }]
}`
        },
        {
          role: "user",
          content: text
        }
      ],
    });

    console.log('Mistral API raw response:', response);
    
    if (!response.choices || !response.choices[0] || !response.choices[0].message) {
      throw new Error('Invalid response structure from Mistral');
    }

    const cleanedResponse = cleanJsonResponse(response.choices[0].message.content || '{"parties": []}');
    console.log('Cleaned party analysis response:', cleanedResponse);
    
    // Parse and sort the response
    const parsed = JSON.parse(cleanedResponse);
    if (parsed.parties && Array.isArray(parsed.parties)) {
      parsed.parties.sort((a, b) => {
        const dateA = a.timestamp ? new Date(a.timestamp) : new Date(0);
        const dateB = b.timestamp ? new Date(b.timestamp) : new Date(0);
        return dateA.getTime() - dateB.getTime();
      });
    }
    
    return JSON.stringify(parsed);
  } catch (error) {
    console.error('Mistral API Error:', error);
    throw new Error('Failed to extract party analysis with Mistral');
  }
}