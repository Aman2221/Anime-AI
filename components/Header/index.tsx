"use client";
import Link from "next/link";
import React, { useState } from "react";
import AuthButton from "../Auth";
import Sidebar from "../Sidebar";
import useUserStore, { activeSession } from "@/store/userStore";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { signOut } from "next-auth/react";

const Header = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const user = useUserStore((state) => state.user);
  const clearUserFromStore = useUserStore((state) => state.clearUser);
  const clearChatStore = activeSession((state) => state.clearChatStore);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  };

  const handleLogOut = () => {
    clearUserFromStore();
    clearChatStore();
    signOut();
  };

  return (
    <header>
      <nav className="bg-white border-gray-200 px-4 lg:px-6 py-2.5 dark:bg-gray-800">
        <div className="flex flex-wrap justify-between items-center">
          <div className="flex gap-4 items-center relative">
            <Sidebar showSidebar={showSidebar} />

            <button
              onClick={() => setShowSidebar(!showSidebar)}
              data-drawer-target="default-sidebar"
              data-drawer-toggle="default-sidebar"
              aria-controls="default-sidebar"
              type="button"
              className="inline-flex items-center p-2 mt-2 ms-3 text-sm text-white rounded-lg cursor-pointer"
            >
              <span className="sr-only text-white">Open sidebar</span>
              {!showSidebar ? (
                <svg
                  className="w-6 h-6"
                  aria-hidden="true"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    clipRule="evenodd"
                    fillRule="evenodd"
                    d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
                  ></path>
                </svg>
              ) : (
                <svg
                  className="w-6 h-6"
                  aria-hidden="true"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z" />
                </svg>
              )}
            </button>
            <Link href="/" className="flex items-center">
              <img
                src="https://flowbite.com/docs/images/logo.svg"
                className="mr-3 h-6 sm:h-9"
                alt="Flowbite Logo"
              />
              <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">
                Anime Ai
              </span>
            </Link>
          </div>

          <div className="flex items-center lg:order-2">
            {user ? (
              <div className="flex gap-10  items-center">
                <div className="flex gap-3 items-center">
                  <Avatar className="border border-gray-500 cursor-pointer text-xs">
                    <AvatarImage src={user?.imgURL as string} />
                    <AvatarFallback>
                      {getInitials(user?.name as string)}
                    </AvatarFallback>
                  </Avatar>

                  <span className="font-bold text-base">{user?.name}</span>
                </div>
                <Button
                  className="cursor-pointer bg-white"
                  onClick={handleLogOut}
                >
                  Sign out
                </Button>
              </div>
            ) : (
              <>
                <AuthButton />

                <Link
                  href="/sign-up"
                  className="text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
