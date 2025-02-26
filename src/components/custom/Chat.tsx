"use client";

import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import {
  Carousel,
  CarouselItem,
  CarouselContent,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ChatComponentProps {
  Person: "Assistant" | "Pirate" | "Krishna";
  commonQuestions?: string[];
}

export default function Chat({ Person, commonQuestions }: ChatComponentProps) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatRef.current?.scrollTo({
      top: chatRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await axios.post(`/api/ChatWith${Person}`, {
        input: userMessage,
      });
      if (response.data?.messages) {
        const aiResponses = response.data.messages.map((msg: any) => ({
          role: msg.id[2] === "HumanMessage" ? "user" : "assistant",
          content: msg.kwargs.content,
        }));
        if (aiResponses.length > 0) {
          setMessages((prev) => [...prev, aiResponses[aiResponses.length - 1]]);
        }
      }
    } catch (error) {
      console.error("Error fetching response:", error);
    }

    setLoading(false);
  };

  return (
    <Card className="max-w-2xl mx-auto p-4 shadow-lg bg-gray-900 text-white h-screen flex flex-col justify-around border-none">
      {/* Chat Header */}
      <CardHeader className="text-center text-lg font-semibold text-gray-300">
        Chat with  {Person=="Pirate"?"Jack Sparrow":Person}
      </CardHeader>

      {/* Chat Messages */}
      <CardContent>
        <ScrollArea
          ref={chatRef}
          className="h-96 overflow-y-auto p-2 space-y-3 bg-gray-800 rounded-lg border border-gray-700 my-auto"
        >
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`p-3 rounded-xl max-w-[75%] ${
                  msg.role === "user"
                    ? "bg-blue-600 text-white self-end"
                    : "bg-gray-700 text-gray-300"
                }`}
              >
                <strong>{msg.role === "user" ? "You" : Person}:</strong>{" "}
                {msg.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <span className="text-gray-400 italic">
                {" "}
                {Person} is typing...
              </span>
            </div>
          )}
        </ScrollArea>
      </CardContent>

      {/* FAQ Section */}
      {commonQuestions && messages.length == 0 && (
        <div className="mb-4 w-[80%] mx-auto">
          <h3 className="text-sm font-medium text-gray-400 mb-2">
            Common Questions:
          </h3>
          <Carousel className="w-[60%] mx-auto">
            <CarouselContent className="w-fit mx-auto">
              {commonQuestions.map((question, index) => (
                <CarouselItem
                  key={index}
                  className="p-2"
                >
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-gray-600 bg-gray-700 text-gray-300 hover:bg-gray-700 w-fit mx-auto"
                    onClick={() => setInput(question)}
                  >
                    {question}
                  </Button>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="text-gray-900" />
            <CarouselNext className="text-gray-900" />
          </Carousel>
        </div>
      )}

      {/* Input Box */}
      <CardFooter className="flex gap-2">
        <Textarea
          className="flex-1 p-2 border rounded-lg bg-gray-800 text-white border-gray-600 focus:ring-2 focus:ring-blue-500"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Ask ${Person} something...`}
        />
        <Button
          onClick={sendMessage}
          disabled={loading}
          className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          {loading ? <Loader2 className="animate-spin" /> : "Send"}
        </Button>
      </CardFooter>
    </Card>
  );
}
