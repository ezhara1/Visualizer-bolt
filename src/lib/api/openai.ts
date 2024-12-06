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

export async function extractBusinessInsights(text: string): Promise<string> {
  try {
    console.log('Calling OpenAI API for business insights:', text);
    
    const response = await openai.chat.completions.create({
      model: "gpt-4",
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

    console.log('OpenAI API raw response:', response);
    
    if (!response.choices || !response.choices[0] || !response.choices[0].message) {
      throw new Error('Invalid response structure from OpenAI');
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
    console.error('OpenAI API Error:', error);
    throw new Error('Failed to extract business insights with OpenAI');
  }
}

export async function extractFinancialInfo(text: string): Promise<string> {
  try {
    console.log('Calling OpenAI API for financial information:', text);
    
    const response = await openai.chat.completions.create({
      model: "gpt-4",
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

    console.log('OpenAI API raw response:', response);
    
    if (!response.choices || !response.choices[0] || !response.choices[0].message) {
      throw new Error('Invalid response structure from OpenAI');
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
    console.error('OpenAI API Error:', error);
    throw new Error('Failed to extract financial information with OpenAI');
  }
}

export async function extractPartyAnalysis(text: string): Promise<string> {
  try {
    console.log('Calling OpenAI API for party analysis:', text);
    
    const response = await openai.chat.completions.create({
      model: "gpt-4",
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

    console.log('OpenAI API raw response:', response);
    
    if (!response.choices || !response.choices[0] || !response.choices[0].message) {
      throw new Error('Invalid response structure from OpenAI');
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
    console.error('OpenAI API Error:', error);
    throw new Error('Failed to extract party analysis with OpenAI');
  }
}