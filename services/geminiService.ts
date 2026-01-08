
import { GoogleGenAI } from "@google/genai";
import { IndustryInsight, NewsItem } from "../types";

export const getIndustryInsights = async (company: string, industry: string): Promise<IndustryInsight> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const prompt = `Provide the latest business news and market developments for ${company} in the ${industry} industry. 
  Focus on information relevant to a Venture Capital firm evaluating or managing a deal. 
  
  Return your response in the following format:
  SUMMARY: [A concise 3-4 sentence overview of current trends/news]

  NEWS_ITEMS:
  - TITLE: [Title of the news]
    SOURCE: [Source Name, e.g., TechCrunch, Reuters]
    SNIPPET: [A 1-2 sentence description of the news]
    URL: [The full URL if available, otherwise leave as #]
  
  List up to 5 news items. Use the google_search tool to ensure data is current.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text || "";
    if (!text) throw new Error("Empty response from model");

    // Simple parsing logic for the structured text format
    const summaryMatch = text.match(/SUMMARY:([\s\S]*?)(?=NEWS_ITEMS:|$)/i);
    const summary = summaryMatch ? summaryMatch[1].trim() : "Summary unavailable.";

    const newsItems: NewsItem[] = [];
    const newsSection = text.split(/NEWS_ITEMS:/i)[1];
    
    if (newsSection) {
      const items = newsSection.split(/^- TITLE:/gm).filter(item => item.trim());
      items.forEach(item => {
        const titleMatch = item.match(/^([\s\S]*?)(?=SOURCE:|$)/m);
        const sourceMatch = item.match(/SOURCE:([\s\S]*?)(?=SNIPPET:|$)/m);
        const snippetMatch = item.match(/SNIPPET:([\s\S]*?)(?=URL:|$)/m);
        const urlMatch = item.match(/URL:([\s\S]*?)$/m);

        if (titleMatch) {
          newsItems.push({
            title: titleMatch[1].trim(),
            source: sourceMatch ? sourceMatch[1].trim() : "Unknown Source",
            snippet: snippetMatch ? snippetMatch[1].trim() : "No description available.",
            uri: urlMatch ? urlMatch[1].trim() : "#"
          });
        }
      });
    }

    // Fallback to grounding chunks if no items were parsed correctly
    if (newsItems.length === 0) {
      const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      chunks.filter(chunk => chunk.web).forEach(chunk => {
        newsItems.push({
          title: chunk.web?.title || "Latest Update",
          uri: chunk.web?.uri || "#",
          source: new URL(chunk.web?.uri || "http://unknown").hostname.replace('www.', ''),
          snippet: "Referenced search result."
        });
      });
    }

    return {
      summary,
      news: newsItems.slice(0, 5)
    };
  } catch (error) {
    console.error("Error fetching industry insights:", error);
    return {
      summary: "We encountered an issue retrieving real-time market data. Please check your connectivity or try again later.",
      news: []
    };
  }
};
