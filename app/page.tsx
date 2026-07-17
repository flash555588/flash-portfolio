import type { Metadata } from "next";
import { VuePortfolio } from "./vue-portfolio";

export const metadata: Metadata = {
  title: "Flash 的小站 | Lolihost",
  description: "记录项目、灵感和折腾过程。这里有代码、AI、3D，也有一些正在慢慢成形的想法。",
};

export default function Home() {
  return <VuePortfolio />;
}
