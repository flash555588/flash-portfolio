import type { Metadata } from "next";
import { VuePortfolio } from "./vue-portfolio";

export const metadata: Metadata = {
  title: "Flash — AI × 3D Developer | Lolihost",
  description: "Flash 的个人作品集：探索 AI、3D、工程自动化与开源实验，记录从创意原型到可用工具的实践。",
};

export default function Home() {
  return <VuePortfolio />;
}
