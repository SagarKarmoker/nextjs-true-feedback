import { google } from '@ai-sdk/google';
import { generateText, streamText } from 'ai';
import { NextResponse } from 'next/server';

// Function to generate questions using Google's Generative AI model
export async function GET(req) {
    try {
        // Use generateText for one-time text generation
        const { text } = await generateText({
            model: google('gemini-1.5-pro-latest'),
            prompt: "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by ' || '. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What's a hobby you've recently started? || If you could have dinner with any historical figure, who would it be? || What's a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment."
        });

        // Check if no text was generated
        if (!text) {
            return NextResponse.json({ error: "No text generated" }, { status: 500 });
        }

        return NextResponse.json({ text }, { status: 200 });

    } catch (error) {
        console.error("Error in generating questions", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// Function to stream responses using streamText
export async function streamQuestions(req) {
    try {
        const response = await streamText({
            model: google('gemini-1.5-pro-latest'),
            prompt: "Generate questions to engage users on a social platform. Make sure they are friendly, open-ended, and engaging.",
            // You can customize settings such as temperature, maxTokens if needed
            streamOptions: {
                onUpdate: (data) => {
                    console.log("New chunk of data:", data);
                    // You can send these streamed chunks progressively to the client if needed
                },
                onComplete: () => {
                    console.log("Streaming complete");
                }
            }
        });

        // Return a response once the streaming is done
        return NextResponse.json({ response }, { status: 200 });

    } catch (error) {
        console.error("Error in streaming questions", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

