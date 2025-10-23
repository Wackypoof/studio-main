"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LegacyNewListingRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/my-dashboard/listings/create");
  }, [router]);
  return null;
}

