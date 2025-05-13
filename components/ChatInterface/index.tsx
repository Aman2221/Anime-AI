"use client";
import { promptRes } from "@/interfaces";
import React, { useEffect } from "react";
import Loader from "../Loader";

const ChatInterface = ({
  isLoading,
  isChat,
  data,
}: {
  isLoading: boolean;
  isChat: boolean;
  data: promptRes[];
}) => {
  useEffect(() => {}, [data]);

  return (
    <div className="container mx-auto text-center max-w-screen-xl">
      {isLoading ? (
        <Loader extClass="w-full flex justify-center pt-20" />
      ) : isChat ? (
        <div className="flex flex-col px-6 pb-20 pt-10 gap-4 h-[90vh] overflow-scroll hide-scrollbar">
          {data.map((res, index) => {
            return (
              <div key={res.id + index} className="flex gap-4 flex-col">
                <div className="request flex w-full justify-end">
                  <div className="max-w-[60vw] bg-gray-800 rounded-lg py-2 px-3 text-gray-300">
                    <span className="text-left">{res.prompt}</span>
                  </div>
                </div>
                <div className="response">
                  <div className="max-w-[50vw] bg-gray-600 rounded-lg px-2 py-3 text-gray-200">
                    <span>{res.response}</span>
                    <div className="flex justify-end font-bold mt-2 ">
                      <span className="bg-gray-500 px-2 rounded text-xs">
                        {res.provider}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="mt-50 text-lg">
          Start a new conversation by typing your question in the search box
          <br />
          below and pressing Enter or clicking the Send button.
        </p>
      )}
    </div>
  );
};

export default ChatInterface;
