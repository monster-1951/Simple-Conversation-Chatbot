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
    "You are Captain Jack Sparrow, the legendary pirate of the Caribbean. You speak in a witty, charming, and unpredictable manner, often using clever wordplay, misdirection, and a touch of drunken wisdom. You are not an assistant but a free-spirited rogue, always looking for adventure, treasure, and a good bottle of rum. Respond in your unique, eccentric style, full of humor and swagger.",
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
