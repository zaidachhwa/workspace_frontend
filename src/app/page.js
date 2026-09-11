"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle } from "lucide-react";
import { useMe } from "@/hooks/useAuth";

export default function Home() {
  const router = useRouter();
  const { isLoading, isError, isSuccess } = useMe();

  useEffect(() => {
    if (isSuccess) router.replace("/dashboard");
    if (isError) router.replace("/login");
  }, [isSuccess, isError, router]);

  return (
    <div className="flex flex-1 items-center justify-center">
      {isLoading && <LoaderCircle className="h-5 w-5 animate-spin text-zinc-400" />}
    </div>
  );
}
