"use client";

import { useEffect, useRef } from "react";
import { createApp, defineComponent, h, onBeforeUnmount, onMounted, ref } from "vue";
import * as THREE from "three";

const projects = [
  {
    index: "01",
    title: "AI Model Workbench",
    description: "为 Obsidian 打造的桌面级 3D 模型工作台，支持 GLB、GLTF、STL、OBJ 与 SPLAT 等多种格式。",
    tags: ["TypeScript", "Babylon.js", "Obsidian"],
    href: "https://github.com/flash555588/ai-model-workbench",
    metric: "11 STARS",
    featured: true,
  },
  {
    index: "02",
    title: "AI Probe Router",
    description: "将 AI 引入 KiCad 探针与测试接口设计，让电子工程流程更自动、更清晰。",
    tags: ["Python", "AI Tools", "KiCad"],
    href: "https://github.com/flash555588/ai-probe-router",
    metric: "ENGINEERING",
  },
  {
    index: "03",
    title: "CSP Coach",
    description: "以 Vue 构建的绘画教练层原型，探索创作辅助工具与自然交互。",
    tags: ["Vue", "Creative Tool", "Prototype"],
    href: "https://github.com/flash555588/csp-coach",
    metric: "EXPERIMENT",
  },
  {
    index: "04",
    title: "Office Suite",
    description: "面向日常生产力场景的 Python 工具集合，让重复工作交给代码。",
    tags: ["Python", "Automation", "Productivity"],
    href: "https://github.com/flash555588/Office-Suite",
    metric: "5 STARS · 2 FORKS",
  },
];

const stack = ["Vue", "TypeScript", "Three.js", "Babylon.js", "Python", "Node.js", "C#", "Git", "AI Tools"];

function externalLink(label: string, href: string, className?: string) {
  return h("a", { href, class: className, target: "_blank", rel: "noreferrer" }, [label, h("span", { "aria-hidden": "true" }, " ↗")]);
}

const PortfolioApp = defineComponent({
  name: "FlashPortfolio",
  setup() {
    const canvas = ref<HTMLCanvasElement | null>(null);
    const scrollProgress = ref(0);
    let renderer: THREE.WebGLRenderer | undefined;
    let frame = 0;
    let cleanupScene = () => {};

    onMounted(() => {
      const onScroll = () => {
        const total = document.documentElement.scrollHeight - window.innerHeight;
        scrollProgress.value = total > 0 ? window.scrollY / total : 0;
      };
      window.addEventListener("scroll", onScroll, { passive: true });
      onScroll();

      const target = canvas.value;
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (!target) return;

      try {
        renderer = new THREE.WebGLRenderer({ canvas: target, alpha: true, antialias: true, powerPreference: "high-performance" });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
        renderer.setSize(window.innerWidth, window.innerHeight, false);
        renderer.outputColorSpace = THREE.SRGBColorSpace;

        const scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2(0x050814, 0.055);
        const camera = new THREE.PerspectiveCamera(38, window.innerWidth / window.innerHeight, 0.1, 100);
        camera.position.set(0, 0, 10);

        const group = new THREE.Group();
        group.position.set(window.innerWidth > 880 ? 2.8 : 0.9, -0.3, 0);
        scene.add(group);

        const coreGeometry = new THREE.IcosahedronGeometry(2.15, 3);
        const coreMaterial = new THREE.MeshStandardMaterial({ color: 0x795cff, emissive: 0x211049, roughness: 0.34, metalness: 0.5, flatShading: true, transparent: true, opacity: 0.7 });
        const core = new THREE.Mesh(coreGeometry, coreMaterial);
        group.add(core);

        const wireGeometry = new THREE.IcosahedronGeometry(2.28, 2);
        const wireMaterial = new THREE.MeshBasicMaterial({ color: 0xb8ff57, wireframe: true, transparent: true, opacity: 0.18 });
        const wire = new THREE.Mesh(wireGeometry, wireMaterial);
        group.add(wire);

        const particleCount = window.innerWidth < 700 ? 420 : 900;
        const positions = new Float32Array(particleCount * 3);
        for (let i = 0; i < particleCount; i += 1) {
          const radius = 5 + Math.random() * 10;
          const theta = Math.random() * Math.PI * 2;
          const phi = Math.acos(2 * Math.random() - 1);
          positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
          positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
          positions[i * 3 + 2] = radius * Math.cos(phi);
        }
        const particleGeometry = new THREE.BufferGeometry();
        particleGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
        const particleMaterial = new THREE.PointsMaterial({ color: 0x77d8ff, size: 0.025, transparent: true, opacity: 0.62, sizeAttenuation: true });
        const particles = new THREE.Points(particleGeometry, particleMaterial);
        scene.add(particles);

        scene.add(new THREE.AmbientLight(0x8aa4ff, 1.8));
        const keyLight = new THREE.PointLight(0xb8ff57, 32, 18);
        keyLight.position.set(4, 4, 6);
        scene.add(keyLight);
        const violetLight = new THREE.PointLight(0x6a4cff, 40, 20);
        violetLight.position.set(-4, -2, 4);
        scene.add(violetLight);

        const pointer = new THREE.Vector2();
        const onPointer = (event: PointerEvent) => {
          pointer.x = event.clientX / window.innerWidth - 0.5;
          pointer.y = event.clientY / window.innerHeight - 0.5;
        };
        const onResize = () => {
          camera.aspect = window.innerWidth / window.innerHeight;
          camera.updateProjectionMatrix();
          renderer?.setSize(window.innerWidth, window.innerHeight, false);
          group.position.x = window.innerWidth > 880 ? 2.8 : 0.9;
        };
        window.addEventListener("pointermove", onPointer, { passive: true });
        window.addEventListener("resize", onResize, { passive: true });

        const clock = new THREE.Clock();
        const draw = () => {
          const time = clock.getElapsedTime();
          core.rotation.x = time * 0.11 + pointer.y * 0.22;
          core.rotation.y = time * 0.16 + pointer.x * 0.32;
          wire.rotation.x = -time * 0.07;
          wire.rotation.y = time * 0.09;
          particles.rotation.y = time * 0.008;
          group.position.y = -0.3 - scrollProgress.value * 1.4;
          camera.position.x += (pointer.x * 0.5 - camera.position.x) * 0.025;
          camera.position.y += (-pointer.y * 0.35 - camera.position.y) * 0.025;
          renderer?.render(scene, camera);
          if (!reducedMotion) frame = window.requestAnimationFrame(draw);
        };
        draw();

        cleanupScene = () => {
          window.removeEventListener("pointermove", onPointer);
          window.removeEventListener("resize", onResize);
          window.cancelAnimationFrame(frame);
          coreGeometry.dispose();
          coreMaterial.dispose();
          wireGeometry.dispose();
          wireMaterial.dispose();
          particleGeometry.dispose();
          particleMaterial.dispose();
          renderer?.dispose();
        };
      } catch {
        target.classList.add("three-fallback");
      }

      cleanupScene = ((sceneCleanup) => () => {
        window.removeEventListener("scroll", onScroll);
        sceneCleanup();
      })(cleanupScene);
    });

    onBeforeUnmount(() => cleanupScene());

    return () => h("div", { class: "portfolio-shell" }, [
      h("canvas", { ref: canvas, class: "three-canvas", "aria-hidden": "true" }),
      h("div", { class: "ambient-grid", "aria-hidden": "true" }),
      h("div", { class: "page-progress", style: { transform: `scaleX(${scrollProgress.value})` }, "aria-hidden": "true" }),
      h("header", { class: "site-nav" }, [
        h("a", { class: "brand", href: "#top", "aria-label": "返回首页" }, [h("span", "F"), h("b", "FLASH / 0555")]),
        h("nav", { "aria-label": "主导航" }, [h("a", { href: "#work" }, "项目"), h("a", { href: "#stack" }, "技术栈"), h("a", { href: "#about" }, "关于")]),
        externalLink("GITHUB", "https://github.com/flash555588", "nav-cta"),
      ]),
      h("main", { id: "top" }, [
        h("section", { class: "hero section-pad" }, [
          h("div", { class: "hero-copy" }, [
            h("p", { class: "eyebrow" }, [h("span", { class: "status-dot" }), "FULL-STACK DEVELOPER · HEFEI"]),
            h("h1", ["用代码连接", h("br"), h("span", "AI、3D"), h("br"), "与现实工程。"]),
            h("p", { class: "hero-lead" }, "我是 Flash，一名来自合肥的全栈开发者与开源爱好者。喜欢把复杂技术打磨成真正可用的产品、插件与工程工具。"),
            h("div", { class: "hero-actions" }, [h("a", { href: "#work", class: "button button-primary" }, "探索项目 ↓"), externalLink("查看 GitHub", "https://github.com/flash555588", "button button-ghost")]),
          ]),
          h("aside", { class: "signal-card", "aria-label": "开发者概览" }, [
            h("div", { class: "signal-head" }, [h("span", "OPEN SOURCE SIGNAL"), h("span", "ONLINE")]),
            h("div", { class: "signal-orbit", "aria-hidden": "true" }, [h("span"), h("i")]),
            h("dl", [
              h("div", [h("dt", "PUBLIC REPOS"), h("dd", "42")]),
              h("div", [h("dt", "BUILDING SINCE"), h("dd", "2020")]),
              h("div", [h("dt", "FOCUS"), h("dd", "AI × 3D")]),
            ]),
          ]),
          h("div", { class: "scroll-mark", "aria-hidden": "true" }, [h("span", "SCROLL TO EXPLORE"), h("i")]),
        ]),
        h("section", { id: "about", class: "about section-pad" }, [
          h("p", { class: "section-index" }, "01 / ABOUT"),
          h("div", { class: "about-grid" }, [
            h("h2", ["不只写代码，", h("span", "也在设计人与技术相遇的方式。")]),
            h("div", { class: "about-copy" }, [
              h("p", "我的工作横跨 Web、桌面插件、AI 工具与工程自动化。技术只是媒介，真正重要的是把模糊需求变成清晰、稳定、让人愿意使用的体验。"),
              h("p", "目前持续探索 AI 辅助创作、3D 可视化、CAD/电子工程工具，以及开源协作带来的可能性。"),
              externalLink("访问个人网站", "https://lolihost.cn/", "text-link"),
            ]),
          ]),
        ]),
        h("section", { id: "work", class: "work section-pad" }, [
          h("div", { class: "section-heading" }, [h("div", [h("p", { class: "section-index" }, "02 / SELECTED WORK"), h("h2", "把想法做成可运行的东西。")]), externalLink("全部 42 个公开仓库", "https://github.com/flash555588?tab=repositories", "text-link")]),
          h("div", { class: "project-grid" }, projects.map((project) => h("article", { class: ["project-card", project.featured && "featured"] }, [
            h("div", { class: "project-meta" }, [h("span", project.index), h("span", project.metric)]),
            h("div", { class: "project-body" }, [h("h3", project.title), h("p", project.description)]),
            h("ul", { class: "tag-list", "aria-label": `${project.title} 技术标签` }, project.tags.map((tag) => h("li", tag))),
            externalLink("OPEN REPOSITORY", project.href, "project-link"),
          ]))),
        ]),
        h("section", { id: "stack", class: "stack section-pad" }, [
          h("p", { class: "section-index" }, "03 / TOOLKIT"),
          h("div", { class: "stack-grid" }, [
            h("h2", "在合适的问题里，选择合适的技术。"),
            h("p", "从界面到服务，从脚本到 3D 场景，我更在意技术如何协同，而不是单一框架的边界。"),
          ]),
          h("div", { class: "stack-cloud" }, stack.map((item, index) => h("span", { style: { "--delay": `${index * 60}ms` } }, item))),
          h("div", { class: "principles" }, [
            h("article", [h("span", "A"), h("h3", "BUILD WITH INTENT"), h("p", "每个交互、每行代码，都应该服务于一个明确目标。")]),
            h("article", [h("span", "B"), h("h3", "OPEN BY DEFAULT"), h("p", "相信开放协作，也持续把实践沉淀成可复用的工具。")]),
            h("article", [h("span", "C"), h("h3", "SHIP THE FUTURE"), h("p", "快速验证大胆想法，再把原型打磨成可靠产品。")]),
          ]),
        ]),
        h("section", { class: "contact section-pad" }, [
          h("p", { class: "section-index" }, "04 / NEXT SIGNAL"),
          h("h2", ["有一个值得实现的想法？", h("br"), h("span", "让我们从第一行代码开始。")]),
          h("div", { class: "contact-actions" }, [externalLink("GITHUB / FLASH555588", "https://github.com/flash555588", "button button-primary"), externalLink("LOLIHOST.CN", "https://lolihost.cn/", "button button-ghost")]),
        ]),
      ]),
      h("footer", [h("span", "© 2026 FLASH"), h("span", "BUILT WITH VUE × THREE.JS"), h("span", "HEFEI · CHINA")]),
    ]);
  },
});

export function VuePortfolio() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!root.current) return;
    const app = createApp(PortfolioApp);
    app.mount(root.current);
    return () => app.unmount();
  }, []);

  return <div ref={root} className="vue-root" />;
}
