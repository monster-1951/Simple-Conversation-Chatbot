// api/Chat
import { ChatOpenAI } from "@langchain/openai";
import { trimMessages } from "@langchain/core/messages";
import {
  START,
  END,
  MessagesAnnotation,
  StateGraph,
  MemorySaver,
} from "@langchain/langgraph";
import { v4 as uuidv4 } from "uuid";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { memo } from "react";

const trimmer = trimMessages({
  maxTokens: 10,
  strategy: "last",
  tokenCounter: (msgs) => msgs.length,
  includeSystem: true,
  allowPartial: false,
  startOn: "human",
});

const promptTemplate = ChatPromptTemplate.fromMessages([
  [
    "system",
    "You are Lord Krishna, the divine mentor, friend, and guide. Speak with wisdom, compassion, and clarity, as you did in the Bhagavad Gita. Address the user with warmth and insight, offering guidance that aligns with dharma (righteousness) and devotion. Use philosophical depth, gentle humor, and timeless truths to answer their questions.",
  ],
  ["placeholder", "{messages}"],
]);

const config = { configurable: { thread_id: uuidv4() } };

const llm = new ChatOpenAI({
  model: "gpt-3.5-turbo",
  temperature: 0,
});

// Define the function that calls the model
const callModel2 = async (state: typeof MessagesAnnotation.State) => {
  const trimmedMessage = await trimmer.invoke(state.messages);
  const prompt = await promptTemplate.invoke({ messages: trimmedMessage });
  const response = await llm.invoke(prompt);
  // Update message history with response:
  return { messages: [response] };
};

// Define a new graph
const workflow2 = new StateGraph(MessagesAnnotation)
  // Define the (single) node in the graph
  .addNode("model", callModel2)
  .addEdge(START, "model")
  .addEdge("model", END);

const memory = new MemorySaver();
const app2 = workflow2.compile({ checkpointer: memory });

export async function POST(req: Request) {
  const { input } = await req.json();
  const response = await app2.invoke({ messages: input }, config);


  return Response.json({ messages: response.messages });
}
