import type { Metadata } from "next";
import { VuePortfolio } from "./vue-portfolio";

export const metadata: Metadata = {
  title: "Flash — Full-Stack Developer & Open Source Enthusiast",
  description: "来自合肥的全栈开发者与开源爱好者，用代码连接 AI、3D 与现实工程。",
};

export default function Home() {
  return <VuePortfolio />;
}
