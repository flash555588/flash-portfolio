import type { Metadata } from "next";
import { VuePortfolio } from "./vue-portfolio";

export const metadata: Metadata = {
  title: "Flash — AI × 3D Developer | Lolihost",
  description: "Flash 的个人作品集，专注 AI、3D 与开发工具。",
};

export default function Home() {
  return <VuePortfolio />;
}
