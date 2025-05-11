"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import React from "react";

export default function MemoRedirectPage() {
  const router = useRouter();
  
  useEffect(() => {
    router.push("/notes");
  }, [router]);
  
  return (
    <div className="flex justify-center items-center h-screen">
      <p className="text-lg">リダイレクト中...</p>
    </div>
  );
}
