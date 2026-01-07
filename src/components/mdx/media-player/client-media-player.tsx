"use client";

import dynamic from "next/dynamic";

export const ClientMediaPlayer = dynamic(
  () => import(".").then((module) => module.MdxMediaPlayer),
  { ssr: false }
);


