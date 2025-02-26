import { Button } from "@/components/ui/button";

import Link from "next/link";

const Avatars = ["Assistant", "Krishna", "Pirate"];

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-2xl font-semibold mb-6">Who would you like to chat with ?</h1>
      <div className="flex flex-wrap gap-4">
        {Avatars.map((Avatar, i) => (
          <Link href={`/ChatWith${Avatar}`} key={i}>
            <Button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-lg transition-all">
              Chat with {Avatar=="Pirate"?"Jack Sparrow":Avatar}
            </Button>
          </Link>
        ))}
      </div>
    </div>
  );
}
0