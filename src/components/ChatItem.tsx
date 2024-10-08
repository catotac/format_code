import { BiUser, BiUserCircle } from "react-icons/bi";

// Props for ChatItem
interface ChatItemProps {
  message: string;
  isUser: boolean;
}

// ChatItem component
export default function ChatItem({ message, isUser }: ChatItemProps) {
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}>
      <div className="flex items-center max-w-md bg-gray-200 p-3 rounded-lg shadow-md">
        {isUser ? <BiUser className="text-xl mr-2" /> : <BiUserCircle className="text-xl mr-2" />}
        <pre className="whitespace-pre-wrap text-sm">{message}</pre>
      </div>
    </div>
  );
}
