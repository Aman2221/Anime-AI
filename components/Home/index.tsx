"use client";
import React, { useState, useEffect } from "react";
import ChatInput from "../ChatInput";
import Header from "../Header";
import ChatInterface from "../ChatInterface";
import { promptRes } from "@/interfaces";
import { toast } from "sonner";
import jsonData from "@/data/index.json";
import { v4 as uuidv4 } from "uuid";
import useUserStore, { activeSession } from "@/store/userStore";

const HomePage = () => {
  const user = useUserStore((state) => state.user);
  const chatSession = activeSession((state) => state.chatSession);
  const setChatSessionStore = activeSession(
    (state) => state.setChatSessionStore
  );
  // state for user input prompt
  const [prompt, setPrompt] = useState<string | null>("");

  // if it's old chat or new chat started
  const [isChat, setIsChat] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  // data with the user prompt and chat bot response
  const [data, setData] = useState<promptRes[]>([]);

  //creates new db with name user uid and create new collection in the db with random uuid
  const createNewChat = async (latestPromtResult: promptRes) => {
    try {
      const chatId = chatSession?.chatSessionId
        ? chatSession?.chatSessionId
        : uuidv4(); //this can come from the global state when existing session is selected
      if (!chatSession?.chatSessionId) {
        setChatSessionStore({
          chatSessionName: "New Chat",
          chatSessionId: chatId,
          chatSessionCreatedAt: new Date().toISOString(),
        });
      }

      const res = await fetch("/api/chat/new-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chatName: "New Chat",
          userUid: user?.uuid, // this will be user uid
          chatId: chatId,
        }),
      });

      if (res.ok) {
        toast("New chat session created!");
        addPromptToActiveCollection({ chatId: chatId, ...latestPromtResult });
      }
    } catch (e: unknown) {
      if (e instanceof Error) {
        toast(e.message);
      } else if (typeof e === "string") {
        toast(e);
      } else {
        toast("An unexpected error occurred");
      }
    }
  };

  //store the prompt into the collection as second document after the first doc with collection details

  const addPromptToActiveCollection = async (chatData: promptRes) => {
    try {
      const res = await fetch("/api/chat/add-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user?.uuid,
          chatId: chatData.chatId,
          provider: chatData.provider,
          prompt: chatData.prompt,
          response: chatData.response,
        }),
      });
      if (res.ok) {
        toast("Prompt data added to active session!");
      }
    } catch (e: unknown) {
      if (e instanceof Error) {
        toast(e.message);
      } else if (typeof e === "string") {
        toast(e);
      } else {
        toast("An unexpected error occurred");
      }
    }
  };

  const handleAPICall = async () => {
    setIsLoading(true);
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPEN_ROUTER_KEY}`, // Replace with your actual key
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "mistralai/mistral-7b-instruct", // Or another available model
          messages: [
            {
              role: "system",
              content: jsonData.llmContext,
            },
            { role: "user", content: prompt },
          ],
        }),
      }
    );

    const result = await response.json();
    if (result) {
      const latestPromtResult = {
        id: result.id,
        provider: result.provider,
        prompt: prompt,
        response: result.choices[0].message.content,
      };
      createNewChat(latestPromtResult);
      setPrompt("");
      setData([...data, latestPromtResult]);
      setIsChat(true);
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (prompt) {
      handleAPICall();
    } else {
      toast("Please enter a message");
    }
  };

  const getChatMessages = async () => {
    try {
      const res = await fetch("/api/chat/get-session-messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user?.uuid,
          chatId: chatSession?.chatSessionId,
        }),
      });
      const data = await res.json();
      setData(data);
      setIsChat(true);
    } catch (e) {
      console.log("Error :", e);
    }
  };

  useEffect(() => {
    if (chatSession) getChatMessages();
  }, [chatSession]);

  return (
    <div>
      <Header />
      <ChatInterface isLoading={isLoading} data={data} isChat={isChat} />
      <ChatInput
        isLoading={isLoading}
        prompt={prompt}
        setPrompt={setPrompt}
        handleSubmit={handleSubmit}
      />
    </div>
  );
};

export default HomePage;
