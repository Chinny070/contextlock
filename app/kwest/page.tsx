"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function KwestRedirect() {
  const router = useRouter();
  useEffect(() => { router.replace("/kwest/browse"); }, [router]);
  return null;
}
