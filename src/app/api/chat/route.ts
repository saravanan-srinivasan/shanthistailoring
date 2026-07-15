import { NextResponse } from 'next/server';
import { Groq } from 'groq-sdk';
import { createClient } from '@supabase/supabase-js';
import { sendConfirmationEmail } from '@/lib/email';

// Groq is instantiated inside the POST function now so missing keys don't crash the route

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

const SYSTEM_PROMPT = `
You are Shanthi, an elite AI fashion assistant for "Shanthi's Tailoring", a premier bespoke luxury tailoring studio based in Chennai, India. 
Your expertise is in Indian ethnic wear (sarees, lehengas, salwar kameez), bridal wear, high-end designer blouses, and modern Indo-Western fusion wear.

Guidelines:
- Tone: Elegant, professional, warm, and highly knowledgeable about fashion, fabrics, and Indian tailoring.
- You offer styling advice, fabric recommendations, and can answer questions about the bespoke tailoring process.
- Keep responses relatively concise and easy to read. 
- You have access to a \`book_appointment\` tool. Use it strictly when you have collected the user's Name, Phone, Email, Date (YYYY-MM-DD), and Time (HH:MM).
- CRITICAL: Do NOT confirm an appointment or say 'Your appointment is confirmed' UNTIL you have successfully called the \`book_appointment\` tool and received a success response from the system. Do NOT pretend to book an appointment.
- You also have access to a \`generate_design_sketch\` tool! If a user asks you to design, sketch, or draw an outfit, use this tool to generate a visual sketch for them and include the image link in your response.
`;

const tools = [
  {
    type: "function" as const,
    function: {
      name: "book_appointment",
      description: "Book a tailoring appointment in the database.",
      parameters: {
        type: "object",
        properties: {
          name: { type: "string", description: "The customer's full name" },
          phone: { type: "string", description: "The customer's phone number" },
          email: { type: "string", description: "The customer's email address" },
          date: { type: "string", description: "The appointment date in YYYY-MM-DD format" },
          time: { type: "string", description: "The appointment time in HH:MM format" },
          notes: { type: "string", description: "Any additional notes or requirements from the customer" }
        },
        required: ["name", "phone", "email", "date", "time"],
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "generate_design_sketch",
      description: "Generate a visual sketch or design of an outfit based on a description.",
      parameters: {
        type: "object",
        properties: {
          description: {
            type: "string",
            description: "A highly detailed visual description of the outfit to sketch. Include colors, fabrics, embroidery, style, and lighting (e.g. 'A stunning deep red silk bridal lehenga with intricate gold zari embroidery, high fashion photography, luxury studio lighting, highly detailed')",
          }
        },
        required: ["description"],
      },
    },
  }
];

export async function POST(request: Request) {
  try {
    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json({ 
        reply: "My AI brain is currently offline because the GROQ_API_KEY is missing from the environment variables! Please add it to Vercel and redeploy." 
      });
    }

    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });

    const { messages } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Invalid messages format" }, { status: 400 });
    }

    // Ensure system prompt is the first message
    const groqMessages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...messages
    ];

    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: groqMessages,
      tools: tools,
      tool_choice: "auto",
    });

    const responseMessage = response.choices[0].message;
    const toolCalls = responseMessage.tool_calls;

    if (toolCalls && toolCalls.length > 0) {
      // Add the assistant's initial response to the message list
      groqMessages.push(responseMessage);

      // Process each tool call
      for (const toolCall of toolCalls) {
        const functionName = toolCall.function.name;
        const functionArgs = JSON.parse(toolCall.function.arguments);
        let functionResponse = "";

        if (functionName === "book_appointment") {
          const { name, phone, email, date, time, notes = "" } = functionArgs;
          
          const nameParts = name.split(" ", 2);
          const firstName = nameParts[0];
          const lastName = nameParts.length > 1 ? nameParts[1] : "";

          const apptData = {
            first_name: firstName,
            last_name: lastName,
            phone,
            email,
            date,
            time,
            notes,
            service_type: "consultation",
            status: "pending"
          };

          const { error } = await supabase.from("appointments").insert(apptData);

          if (error) {
            functionResponse = `Error booking appointment: ${error.message}`;
          } else {
            if (email) {
              await sendConfirmationEmail(email, name, date, time);
            }
            functionResponse = `Successfully booked an appointment for ${name} on ${date} at ${time} and sent an email confirmation.`;
          }
        } else if (functionName === "generate_design_sketch") {
          const description = functionArgs.description || "a beautiful luxury indian dress";
          const encodedPrompt = encodeURIComponent(description);
          const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?nologo=true&width=512&height=512`;
          functionResponse = `Here is the sketch: \n\n![Custom Design](${imageUrl})`;
        }

        // Add the tool execution result to the message list
        groqMessages.push({
          tool_call_id: toolCall.id,
          role: "tool",
          name: functionName,
          content: functionResponse,
        });
      }

      // Generate the final response
      const secondResponse = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: groqMessages,
      });

      return NextResponse.json({
        reply: secondResponse.choices[0].message.content
      });
    }

    return NextResponse.json({
      reply: responseMessage.content
    });

  } catch (error) {
    console.error("Chat API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
