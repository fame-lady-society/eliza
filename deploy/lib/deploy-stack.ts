import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { ElizaEc2 } from "./eliza-ec2.js";

export class DeployStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        // validate env variables
        if (!process.env.GITHUB_SHA) {
            throw new Error("GITHUB_SHA is not set");
        }
        if (!process.env.DISCORD_APPLICATION_ID) {
            throw new Error("DISCORD_APPLICATION_ID is not set");
        }
        if (!process.env.DISCORD_API_TOKEN) {
            throw new Error("DISCORD_API_TOKEN is not set");
        }
        if (!process.env.OPENAI_API_KEY) {
            throw new Error("OPENAI_API_KEY is not set");
        }
        if (!process.env.REDPILL_API_KEY) {
            throw new Error("REDPILL_API_KEY is not set");
        }
        if (!process.env.GROK_API_KEY) {
            throw new Error("GROK_API_KEY is not set");
        }
        if (!process.env.GROQ_API_KEY) {
            throw new Error("GROQ_API_KEY is not set");
        }
        if (!process.env.OPENROUTER_API_KEY) {
            throw new Error("OPENROUTER_API_KEY is not set");
        }
        if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
            throw new Error("GOOGLE_GENERATIVE_AI_API_KEY is not set");
        }
        if (!process.env.LUMA_API_KEY) {
            throw new Error("LUMA_API_KEY is not set");
        }
        if (!process.env.ELEVENLABS_XI_API_KEY) {
            throw new Error("ELEVENLABS_XI_API_KEY is not set");
        }

        new ElizaEc2(this, "ElizaEc2", {
            buildSha: process.env.GITHUB_SHA!,
            discordApplicationId: process.env.DISCORD_APPLICATION_ID!,
            discordApiToken: process.env.DISCORD_API_TOKEN!,
            openaiApiKey: process.env.OPENAI_API_KEY!,
            redpillApiKey: process.env.REDPILL_API_KEY!,
            grokApiKey: process.env.GROK_API_KEY!,
            groqApiKey: process.env.GROQ_API_KEY!,
            openrouterApiKey: process.env.OPENROUTER_API_KEY!,
            googleGenerativeAiApiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY!,
            lumaApiKey: process.env.LUMA_API_KEY!,
            elevenlabsXiApiKey: process.env.ELEVENLABS_XI_API_KEY!,
        });
    }
}
