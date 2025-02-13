"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the desired route when the root is accessed
    router.replace("/status"); // Change "/dashboard" to your desired route
  }, [router]);

  // Optional: Display a loading message while redirecting
  return <div>Redirecting...</div>;
}
