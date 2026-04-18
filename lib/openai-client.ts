import OpenAI from 'openai';

// Initialize the OpenAI API client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Helper function to generate business ideas
export async function generateBusinessIdeas(industry) {
  const response = await openai.chat.completions.create({
    messages: [{
      role: 'user',
      content: `Generate innovative business ideas for the ${industry} industry.`,
    }],
    model: 'gpt-4',
  });
  return response.choices[0].message.content;
}

// Helper function to provide feedback on ideas
export async function getFeedbackOnIdea(idea) {
  const response = await openai.chat.completions.create({
    messages: [{
      role: 'user',
      content: `Provide feedback on the following business idea: ${idea}`,
    }],
    model: 'gpt-4',
  });
  return response.choices[0].message.content;
}

// Helper function to generate content
export async function generateContent(topic) {
  const response = await openai.chat.completions.create({
    messages: [{
      role: 'user',
      content: `Write a detailed article about ${topic}.`,
    }],
    model: 'gpt-4',
  });
  return response.choices[0].message.content;
}