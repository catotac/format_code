import { useState, useRef, FormEvent } from "react";
import { AiOutlineSend } from "react-icons/ai";
import ChatItem from "./components/ChatItem";
import ChatHelpers from "./components/ChatHelpers";

export default function GeneticChat() {
  const [messages, setMessages] = useState<string[]>([]);
  const [formattedCode, setFormattedCode] = useState<string>("");
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const input = inputRef.current?.value || "";

    if (input.trim() === "") return;

    // Add user's input to the messages
    setMessages((prev) => [...prev, input]);

    // Send a request to the Flask backend to format the Python code
    const response = await fetch('http://127.0.0.1:5000/format', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code: input }),
    });

    const data = await response.json();
    const formatted = data.formatted_code;

    // Add the formatted code to the messages
    setFormattedCode(formatted);
    setMessages((prev) => [...prev, formatted]);

    // Clear the input field
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg w-1/2 p-6">
        <h1 className="text-2xl font-bold text-center mb-6">Python Code Formatter</h1>

        {/* Chat content */}
        <div className="h-64 overflow-y-scroll p-4 bg-gray-50 rounded-lg">
          {messages.map((message, index) => (
            <ChatItem key={index} message={message} isUser={index % 2 === 0} />
          ))}
        </div>

        {/* Form for entering code */}
        <form onSubmit={handleSubmit} className="mt-4">
          <textarea
            ref={inputRef}
            rows={4}
            placeholder="Enter Python code..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          />
          <div className="flex justify-between items-center mt-2">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              <AiOutlineSend className="inline mr-1" /> Format Code
            </button>
          </div>
        </form>

        {formattedCode && (
          <ChatHelpers formattedCode={formattedCode} setFormattedCode={setFormattedCode} />
        )}
      </div>
    </div>
  );
}
