"use client";

import { newChat } from "@/interfaces";
import useUserStore, { activeSession } from "@/store/userStore";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const Sidebar = ({ showSidebar }: { showSidebar: boolean }) => {
  const [chatSessions, setChatSessions] = useState<newChat[]>([]);
  const user = useUserStore((state) => state.user);
  const setChatSessionStore = activeSession(
    (state) => state.setChatSessionStore
  );

  const getChatSessions = async () => {
    try {
      const res = await fetch("/api/chat/get-chats-sessions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user?.uuid,
        }),
      });
      const data = await res.json();
      setChatSessions(data);
    } catch (e) {
      console.log("Error :", e);
    }
  };

  useEffect(() => {
    if (user) getChatSessions();
  }, [user]);

  return (
    <div>
      <aside
        id="default-sidebar"
        className={` top-20 bottom-4 transition-all ease-in fixed ${
          showSidebar ? "left-0 " : "-left-96 "
        }  z-40 w-64 h-full`}
        aria-label="Sidebar"
      >
        <div className="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
          {chatSessions.length ? (
            <ul className="space-y-3 font-medium">
              {chatSessions.map((chat: any) => {
                return (
                  <li
                    className="border rounded-lg bg-gray-700 "
                    key={chat.chatId}
                    onClick={() =>
                      setChatSessionStore({
                        chatSessionId: chat.chatId,
                        chatSessionName: chat.chatName,
                        chatSessionCreatedAt: chat.createdAt,
                      })
                    }
                  >
                    <Link
                      href="#"
                      className="flex items-center p-3 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                    >
                      <svg
                        className="w-5 h-5 text-white transition duration-75 "
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 22 21"
                      >
                        <path d="M16.975 11H10V4.025a1 1 0 0 0-1.066-.998 8.5 8.5 0 1 0 9.039 9.039.999.999 0 0 0-1-1.066h.002Z" />
                        <path d="M12.5 0c-.157 0-.311.01-.565.027A1 1 0 0 0 11 1.02V10h8.975a1 1 0 0 0 1-.935c.013-.188.028-.374.028-.565A8.51 8.51 0 0 0 12.5 0Z" />
                      </svg>
                      <span className="ms-3">{chat.chatName}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          ) : (
            <span className="text-base font-medium">
              No previous chats are there
            </span>
          )}
        </div>
      </aside>
    </div>
  );
};

export default Sidebar;
