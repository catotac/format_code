import { AiOutlineClear, AiOutlineCopy, AiOutlineDown } from "react-icons/ai";
import { Dispatch, SetStateAction } from "react";

// Props for ChatHelpers
interface ChatHelpersProps {
  formattedCode: string;
  setFormattedCode: Dispatch<SetStateAction<string>>;
}

// ChatHelpers component
export default function ChatHelpers({ formattedCode, setFormattedCode }: ChatHelpersProps) {
  const handleCopy = () => {
    navigator.clipboard.writeText(formattedCode);
    alert("Code copied to clipboard!");
  };

  const handleClear = () => {
    setFormattedCode("");
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([formattedCode], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "formatted_code.py";
    document.body.appendChild(element);
    element.click();
  };

  return (
    <div className="flex space-x-4 mt-4">
      <button
        onClick={handleCopy}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        <AiOutlineCopy className="inline mr-1" /> Copy
      </button>
      <button
        onClick={handleClear}
        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
      >
        <AiOutlineClear className="inline mr-1" /> Clear
      </button>
      <button
        onClick={handleDownload}
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2
        rounded"
        >
          <AiOutlineDown className="inline mr-1" /> Download
        </button>
      </div>
    );
  }
  
