"use server";
import Groq from "groq-sdk";
import { createClient } from "@/lib/supabase/server";
// This is the synchronous "AI as Product Manager" flow — kept in Next.js
// (not an Edge Function) because it's a request/response round trip the
// user is actively waiting on, and the AI key stays server-side either way.

export interface StarterAnswers {
  vagueDescription: string;
  answers: Record<string, string>;
}

export interface GeneratedIdea {
  title: string;
  description: string;
  category: string;
  tags: string[];
}


const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// --- Type Definitions (Adjust these to match your existing types) ---
export interface StarterAnswers {
  vagueDescription: string;
  answers: Record<string, string>; // Maps your clarifying questions to user responses
}

export interface GeneratedIdea {
  title: string;
  description: string;
  category: string;
  tags: string[];
}

// --- Implementation ---

/**
 * Generates 3-4 sharp, critical clarifying questions based on a vague idea.
 */
export async function getClarifyingQuestions(_vagueDescription: string): Promise<string[]> {
  try {
    const response = await groq.chat.completions.create({
      model: "qwen/qwen3.8-27b",
      response_format: { type: "json_object" },
      temperature: 0.7,
      messages: [
        {
          role: "system",
          content: `You are a startup incubator advisor. Analyze the user's vague business idea and generate 3 to 4 sharp, critical clarifying questions to help them refine it. Keep in mind that the user in non technical, so avoid jargon. Your output must be in JSON format with the following structure:
          
          You MUST respond strictly in this JSON format:
          {
            "questions": ["question 1", "question 2", "question 3"]
          }`
        },
        {
          role: "user",
          content: `My business idea: ${_vagueDescription}`
        }
      ],
    });

    const rawJson = response.choices[0]?.message?.content;
    if (!rawJson) return [];

    const data = JSON.parse(rawJson) as { questions: string[] };
    return data.questions || [];
  } catch (error) {
    console.error("Error in getClarifyingQuestions:", error);
    return [
      "Who is your primary target audience?",
      "What is the main problem this idea solves?",
      "How do you plan to monetize this project?"
    ]; // Fallback questions so the UI doesn't break
  }
}

/**
 * Acts as a PM to produce a structured product blueprint from the initial idea and answers.
 */
export async function generateStarterIdea(input: StarterAnswers): Promise<GeneratedIdea> {
  try {
    // Format the clarifying Q&A context beautifully for the AI
    const formattedAnswers = Object.entries(input.answers)
      .map(([question, answer]) => `Q: ${question}\nA: ${answer}`)
      .join("\n\n");

    const response = await groq.chat.completions.create({
      model: "qwen/qwen3.8-27b",
      response_format: { type: "json_object" },
      temperature: 0.6, // Lower temperature for more structured, focused PM alignment
      messages: [
        {
          role: "system",
          content: `You are an expert Product Manager (PM). Take the initial vague business idea and the follow-up answers provided by the user, and synthesize them into a clear startup blueprint. The description should be clear and action plan for any developer or designer to understand the product vision. Your output must be in JSON format with the following structure:
          
          You MUST respond strictly in this JSON format:
          {
            "title": "A catchy, concise product name or title (max 80 chars)",
            "description": "A compelling 2-3 paragraph breakdown of the product, value proposition, and execution strategy.",
            "category": "A single word industry sector(It could only one of these - "Productivity", "Developer-tools", "Health", "Finance", "Education", "Social", "Creative", "Commerce", "Other")",
          }`
        },
        {
          role: "user",
          content: `Original Idea: ${input.vagueDescription}\n\nAdditional Details:\n${formattedAnswers}`
        }
      ]
    });

    const rawJson = response.choices[0]?.message?.content;
    if (!rawJson) throw new Error("No content received from Groq");

    return JSON.parse(rawJson) as GeneratedIdea;
  } catch (error) {
    console.error("Error in generateStarterIdea:", error);
    
    // Graceful fallback to your original manual implementation so your app stays up
    return {
      title: input.vagueDescription.slice(0, 80),
      description: `${input.vagueDescription}\n\n${Object.values(input.answers).join(" ")}`,
      category: "other",
      tags: ["fallback"],
    };
  }
}

// export async function publishIdea(idea: GeneratedIdea) {
//   // const supabase = await createClient();
//   // await supabase.from("ideas").insert({ ...idea, version: 1, user_id: user.id });
//   return { ok: true, id: "idea-new" };
// }
export async function publishIdea(idea: GeneratedIdea) {
  try {
    const supabase = await createClient();

    // 1. Get the current logged-in user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      console.error("Authentication error:", userError);
      return { ok: false, error: "Unauthorized: User must be logged in to publish." };
    }

    // 2. Insert the idea row into your database
    const { data, error: insertError } = await supabase
      .from("ideas")
      .insert({
        title: idea.title,
        description: idea.description,
        category: idea.category,
        version: 1,
        profile: user.id
      })
      .select("id") // Returns the newly generated database ID
      .single();

    if (insertError) {
      throw insertError;
    }

    // 3. Return the exact ID generated by your DB
    return { ok: true, id: data.id };

  } catch (error) {
    console.error("Failed to publish idea:", error);
    return { ok: false, error: "Database transaction failed. Please try again." };
  }
}