// api/Chat
import { ChatOpenAI } from "@langchain/openai";
import {
  START,
  END,
  MessagesAnnotation,
  StateGraph,
  MemorySaver,
} from "@langchain/langgraph";
import { v4 as uuidv4 } from "uuid";




const config = { configurable: { thread_id: uuidv4() } };

const llm = new ChatOpenAI({
  model: "gpt-3.5-turbo",
  temperature: 0,
});

// Define the function that calls the model
const callModel = async (state: typeof MessagesAnnotation.State) => {
  const response = await llm.invoke(state.messages);
  return { messages: response };
};

// Define a new graph
const workflow = new StateGraph(MessagesAnnotation)
  .addNode("model", callModel)
  .addEdge(START, "model")
  .addEdge("model", END);

const memory = new MemorySaver();
const app = workflow.compile({ checkpointer: memory });

export async function POST(req: Request) {
  const { input } = await req.json();
  const response = await app.invoke({ messages: input }, config);


 return Response.json({ messages: response.messages });
}
