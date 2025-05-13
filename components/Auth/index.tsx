"use client";
import { useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import Image from "next/image";
import useUserStore from "@/store/userStore";

export default function AuthButton({ extClass = "" }: { extClass?: string }) {
  const { data: session, status } = useSession();
  const setUserToStore = useUserStore((state) => state.setUserToStore);

  const getUserFromDB = async () => {
    try {
      const result = await fetch("/api/get-user", {
        method: "POST",
        headers: {
          "Content-Type": "applicatoin/json",
        },
        body: JSON.stringify({
          email: session?.user?.email,
        }),
      });

      const data = await result.json();
      if (data) {
        setUserToStore({
          name: data.name,
          email: data.email,
          password: data.password,
          createdAt: data.createdAt,
          uuid: data.uuid,
          imgURL: data.imgURL,
        });
      }
      return data;
    } catch (e) {
      console.log("error", e);
    }
  };

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      // get user from mongo db using usre email
      getUserFromDB();
    }
  }, [session, status, setUserToStore]);

  return (
    <div
      className="flex items-center justify-center"
      onClick={() => signIn("google")}
    >
      <button
        className={`px-4 py-2 border flex gap-2 border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-200 hover:border-slate-400 dark:hover:border-slate-500 hover:text-slate-900 dark:hover:text-slate-300 hover:shadow transition duration-150 ${extClass}`}
      >
        <Image
          height={20}
          width={20}
          className="w-6 h-6"
          src="https://www.svgrepo.com/show/475656/google-color.svg"
          loading="lazy"
          alt="google logo"
        />
        <span>Login with Google</span>
      </button>
    </div>
  );
}
