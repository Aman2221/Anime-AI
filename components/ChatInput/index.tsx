import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import useUserStore from "@/store/userStore";

const ChatInput = ({
  prompt,
  isLoading,
  setPrompt,
  handleSubmit,
}: {
  prompt: string | null;
  isLoading: boolean;
  setPrompt: (a: string) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}) => {
  const user = useUserStore((state) => state.user);

  const handleInputChange = (e: React.ChangeEvent) => {
    let target: any = e.target;
    console.log(target.value);
    setPrompt(target?.value);
  };
  return (
    <form
      onSubmit={handleSubmit}
      className="w-full absolute bottom-0 border-red-100   "
    >
      <div className="mx-auto max-w-screen-xl bg-gray-800 p-4 rounded-lg">
        <div className="flex gap-2 ">
          <Input
            type="text"
            placeholder="Enter message here"
            onChange={handleInputChange}
            value={prompt!}
          />
          <Button type="submit" disabled={isLoading}>
            Send
          </Button>
        </div>

        <div className="w-full text-center pt-2">
          <span className="text-gray-500 font-medium text-center">
            Chatbot can make mistaks
          </span>
        </div>
      </div>
    </form>
  );
};

export default ChatInput;
