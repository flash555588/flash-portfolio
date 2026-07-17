"use client";

import { useEffect, useRef } from "react";
import { createApp, defineComponent, h, onBeforeUnmount, onMounted, ref } from "vue";
import * as THREE from "three";

const projects = [
  {
    index: "01",
    title: "AI Model Workbench",
    description: "Obsidian 中的 3D 模型工作台。",
    tags: ["TypeScript", "Babylon.js", "Obsidian"],
    href: "https://github.com/flash555588/ai-model-workbench",
    metric: "11 STARS",
    featured: true,
  },
  {
    index: "02",
    title: "AI Probe Router",
    description: "AI 辅助的 KiCad 探针布线工具。",
    tags: ["Python", "AI Tools", "KiCad"],
    href: "https://github.com/flash555588/ai-probe-router",
    metric: "ENGINEERING",
  },
  {
    index: "03",
    title: "CSP Coach",
    description: "面向绘画创作的辅助工具原型。",
    tags: ["Vue", "Creative Tool", "Prototype"],
    href: "https://github.com/flash555588/csp-coach",
    metric: "EXPERIMENT",
  },
  {
    index: "04",
    title: "Office Suite",
    description: "用 Python 自动化日常工作。",
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
    const track = ref<HTMLElement | null>(null);
    const scrollProgress = ref(0);
    const activePanel = ref(0);
    let renderer: THREE.WebGLRenderer | undefined;
    let frame = 0;
    let cleanupScene = () => {};

    const goTo = (index: number) => {
      const scroller = track.value;
      const target = scroller?.children.item(index) as HTMLElement | null;
      if (!scroller || !target) return;
      scroller.scrollTo({ left: target.offsetLeft, behavior: "smooth" });
      window.history.replaceState(null, "", index === 0 ? "#top" : `#${target.id}`);
    };

    onMounted(() => {
      const scroller = track.value;
      const onScroll = () => {
        if (!scroller) return;
        const total = scroller.scrollWidth - scroller.clientWidth;
        scrollProgress.value = total > 0 ? scroller.scrollLeft / total : 0;
        activePanel.value = Math.round(scroller.scrollLeft / Math.max(scroller.clientWidth, 1));
      };
      const onWheel = (event: WheelEvent) => {
        if (!scroller || event.ctrlKey || window.innerWidth <= 900) return;
        const amount = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
        if (Math.abs(amount) < 8) return;
        event.preventDefault();
        if (wheelLocked) return;
        wheelLocked = true;
        goTo(Math.max(0, Math.min(4, activePanel.value + (amount > 0 ? 1 : -1))));
        wheelUnlock = window.setTimeout(() => { wheelLocked = false; }, 880);
      };
      let wheelLocked = false;
      let wheelUnlock = 0;
      const onKeydown = (event: KeyboardEvent) => {
        const element = event.target as HTMLElement;
        if (element.closest("a, button, input, textarea, select")) return;
        if (["ArrowRight", "PageDown", " "].includes(event.key)) {
          event.preventDefault();
          goTo(Math.min(activePanel.value + 1, 4));
        } else if (["ArrowLeft", "PageUp"].includes(event.key)) {
          event.preventDefault();
          goTo(Math.max(activePanel.value - 1, 0));
        } else if (event.key === "Home") {
          event.preventDefault();
          goTo(0);
        } else if (event.key === "End") {
          event.preventDefault();
          goTo(4);
        }
      };
      scroller?.addEventListener("scroll", onScroll, { passive: true });
      scroller?.addEventListener("wheel", onWheel, { passive: false });
      scroller?.addEventListener("keydown", onKeydown);
      onScroll();

      const target = canvas.value;
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (!target) return;

      try {
        renderer = new THREE.WebGLRenderer({ canvas: target, alpha: true, antialias: true, powerPreference: "high-performance" });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
        renderer.setSize(window.innerWidth, window.innerHeight, false);
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.12;

        const scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2(0x050814, 0.055);
        const camera = new THREE.PerspectiveCamera(38, window.innerWidth / window.innerHeight, 0.1, 100);
        camera.position.set(0, 0, 10);

        const group = new THREE.Group();
        group.position.set(window.innerWidth > 880 ? 2.8 : 0.9, -0.3, 0);
        scene.add(group);

        const coreGeometry = new THREE.IcosahedronGeometry(2.15, 3);
        const coreMaterial = new THREE.MeshPhysicalMaterial({
          color: 0x795cff,
          emissive: 0x211049,
          emissiveIntensity: 0.8,
          roughness: 0.18,
          metalness: 0.42,
          flatShading: true,
          transparent: true,
          opacity: 0.76,
          clearcoat: 1,
          clearcoatRoughness: 0.07,
          sheen: 0.35,
          sheenColor: new THREE.Color(0x9fb5ff),
          iridescence: 0.22,
          iridescenceIOR: 1.45,
        });
        const core = new THREE.Mesh(coreGeometry, coreMaterial);
        group.add(core);

        const innerGeometry = new THREE.IcosahedronGeometry(1.64, 2);
        const innerMaterial = new THREE.MeshPhysicalMaterial({ color: 0x5035ff, emissive: 0x1b1054, emissiveIntensity: 1.25, roughness: 0.12, metalness: 0.16, transparent: true, opacity: 0.46, clearcoat: 1, clearcoatRoughness: 0.05 });
        const innerCore = new THREE.Mesh(innerGeometry, innerMaterial);
        group.add(innerCore);

        const glossGeometry = new THREE.IcosahedronGeometry(2.19, 3);
        const glossMaterial = new THREE.MeshPhysicalMaterial({ color: 0xffffff, roughness: 0.02, metalness: 0, clearcoat: 1, clearcoatRoughness: 0.02, transparent: true, opacity: 0.09, depthWrite: false, blending: THREE.AdditiveBlending });
        const glossShell = new THREE.Mesh(glossGeometry, glossMaterial);
        group.add(glossShell);

        const haloGeometry = new THREE.SphereGeometry(2.52, 32, 32);
        const haloMaterial = new THREE.MeshBasicMaterial({ color: 0x795cff, transparent: true, opacity: 0.055, side: THREE.BackSide, depthWrite: false, blending: THREE.AdditiveBlending });
        const halo = new THREE.Mesh(haloGeometry, haloMaterial);
        group.add(halo);

        const wireGeometry = new THREE.IcosahedronGeometry(2.28, 2);
        const wireMaterial = new THREE.MeshBasicMaterial({ color: 0xb8ff57, wireframe: true, transparent: true, opacity: 0.18 });
        const wire = new THREE.Mesh(wireGeometry, wireMaterial);
        group.add(wire);

        const nodeGeometry = new THREE.BufferGeometry();
        nodeGeometry.setAttribute("position", wireGeometry.getAttribute("position").clone());
        const nodeMaterial = new THREE.PointsMaterial({ color: 0xd9ffae, size: 0.028, transparent: true, opacity: 0.52, sizeAttenuation: true, depthWrite: false });
        const surfaceNodes = new THREE.Points(nodeGeometry, nodeMaterial);
        wire.add(surfaceNodes);

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

        scene.add(new THREE.AmbientLight(0x8aa4ff, 1.15));
        scene.add(new THREE.HemisphereLight(0xc8dcff, 0x160b32, 1.3));
        const keyLight = new THREE.PointLight(0xb8ff57, 32, 18);
        keyLight.position.set(4, 4, 6);
        scene.add(keyLight);
        const violetLight = new THREE.PointLight(0x6a4cff, 40, 20);
        violetLight.position.set(-4, -2, 4);
        scene.add(violetLight);
        const glossLight = new THREE.PointLight(0xffffff, 24, 24);
        glossLight.position.set(3.5, 5.5, 7);
        scene.add(glossLight);
        const rimLight = new THREE.PointLight(0x75ddff, 18, 20);
        rimLight.position.set(-5, 1, -2);
        scene.add(rimLight);

        const pointer = new THREE.Vector2();
        const onPointer = (event: PointerEvent) => {
          pointer.x = event.clientX / window.innerWidth - 0.5;
          pointer.y = event.clientY / window.innerHeight - 0.5;
        };
        const onResize = () => {
          camera.aspect = window.innerWidth / window.innerHeight;
          camera.updateProjectionMatrix();
          renderer?.setSize(window.innerWidth, window.innerHeight, false);
        };
        window.addEventListener("pointermove", onPointer, { passive: true });
        window.addEventListener("resize", onResize, { passive: true });

        const clock = new THREE.Clock();
        const pageColors = [0x795cff, 0x367dff, 0xb8ff57, 0x75ddff, 0xffc857].map((color) => new THREE.Color(color));
        const pageEmissives = [0x211049, 0x102d68, 0x183c12, 0x10364a, 0x4a2c08].map((color) => new THREE.Color(color));
        const wireColors = [0xb8ff57, 0x75ddff, 0x8b71ff, 0xb8ff57, 0x75ddff].map((color) => new THREE.Color(color));
        const pageTransforms = [
          { x: 2.8, y: -0.3, z: 0, scale: 1, speedX: 0.11, speedY: 0.16 },
          { x: -2.7, y: 0.45, z: -1.2, scale: 0.76, speedX: -0.08, speedY: 0.22 },
          { x: 2.35, y: 0.9, z: 0.5, scale: 1.18, speedX: 0.18, speedY: -0.1 },
          { x: -2.15, y: -0.55, z: -1.7, scale: 0.68, speedX: -0.14, speedY: -0.18 },
          { x: 0.25, y: 0.1, z: 0.8, scale: 1.34, speedX: 0.07, speedY: 0.24 },
        ];
        const draw = () => {
          const time = clock.getElapsedTime();
          const state = Math.max(0, Math.min(4, activePanel.value));
          const page = pageTransforms[state];
          const mobileOffset = window.innerWidth > 880 ? 0 : state % 2 === 0 ? -1.35 : 1.35;
          core.rotation.x = time * page.speedX + pointer.y * 0.22;
          core.rotation.y = time * page.speedY + pointer.x * 0.32;
          innerCore.rotation.x = -time * page.speedY * 0.72 - pointer.y * 0.12;
          innerCore.rotation.y = time * page.speedX * 0.9 - pointer.x * 0.16;
          glossShell.rotation.copy(core.rotation);
          glossShell.rotation.z = time * 0.025;
          wire.rotation.x = -time * page.speedY * 0.55 + state * 0.45;
          wire.rotation.y = time * page.speedX * 0.65 + state * 0.6;
          particles.rotation.y = time * (0.008 + state * 0.003) + scrollProgress.value * 0.8;
          group.position.x += ((window.innerWidth > 880 ? page.x : mobileOffset) - group.position.x) * 0.045;
          group.position.y += (page.y - group.position.y) * 0.045;
          group.position.z += (page.z - group.position.z) * 0.045;
          const targetScale = window.innerWidth > 880 ? page.scale : page.scale * 0.58;
          const nextScale = group.scale.x + (targetScale - group.scale.x) * 0.045;
          group.scale.setScalar(nextScale);
          coreMaterial.color.lerp(pageColors[state], 0.04);
          coreMaterial.emissive.lerp(pageEmissives[state], 0.04);
          innerMaterial.color.lerp(pageColors[state], 0.025);
          innerMaterial.emissive.lerp(pageEmissives[state], 0.035);
          haloMaterial.color.lerp(pageColors[state], 0.035);
          wireMaterial.color.lerp(wireColors[state], 0.04);
          nodeMaterial.color.lerp(wireColors[state], 0.04);
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
          innerGeometry.dispose();
          innerMaterial.dispose();
          glossGeometry.dispose();
          glossMaterial.dispose();
          haloGeometry.dispose();
          haloMaterial.dispose();
          wireGeometry.dispose();
          wireMaterial.dispose();
          nodeGeometry.dispose();
          nodeMaterial.dispose();
          particleGeometry.dispose();
          particleMaterial.dispose();
          renderer?.dispose();
        };
      } catch {
        target.classList.add("three-fallback");
      }

      cleanupScene = ((sceneCleanup) => () => {
        scroller?.removeEventListener("scroll", onScroll);
        scroller?.removeEventListener("wheel", onWheel);
        scroller?.removeEventListener("keydown", onKeydown);
        window.clearTimeout(wheelUnlock);
        sceneCleanup();
      })(cleanupScene);
    });

    onBeforeUnmount(() => cleanupScene());

    return () => h("div", { class: ["portfolio-shell", `scene-${activePanel.value}`] }, [
      h("canvas", { ref: canvas, class: "three-canvas", "aria-hidden": "true" }),
      ...[0, 1, 2, 3, 4].map((index) => h("div", { class: ["scene-wash", `scene-wash-${index}`, { active: activePanel.value === index }], "aria-hidden": "true" })),
      h("div", { class: "ambient-grid", "aria-hidden": "true" }),
      h("div", { class: "background-details", "aria-hidden": "true" }, [
        h("span", { class: "detail-a" }, "SYS / LOLIHOST"),
        h("span", { class: "detail-b" }, `VIEW / 0${activePanel.value + 1}`),
        h("span", { class: "detail-c" }, "X 0555 · Y 2026"),
      ]),
      h("div", { class: "viewport-fades", "aria-hidden": "true" }, [
        h("span", { class: "fade-left" }),
        h("span", { class: "fade-right" }),
        h("span", { class: "fade-bottom" }),
      ]),
      h("div", { class: "page-progress", style: { transform: `scaleX(${scrollProgress.value})` }, "aria-hidden": "true" }),
      h("main", { id: "top", ref: track, class: "horizontal-track", tabindex: "0", "aria-label": "作品集，左右滑动浏览" }, [
        h("section", { class: ["panel", "hero", "section-pad", { "is-active": activePanel.value === 0 }] }, [
          h("div", { class: "hero-copy" }, [
            h("p", { class: "eyebrow" }, [h("span", { class: "status-dot" }), "WELCOME · LOLIHOST"]),
            h("h1", ["欢迎来到", h("br"), h("span", "我的小站"), h("br"), "随便看看。"]),
            h("p", { class: "hero-lead" }, "我是 Flash。这里放着一些项目、技术和正在尝试的东西。"),
            h("div", { class: "hero-actions" }, [h("a", { href: "#work", class: "button button-primary", onClick: (event: Event) => { event.preventDefault(); goTo(1); } }, "开始浏览 →"), externalLink("GitHub", "https://github.com/flash555588", "button button-ghost")]),
          ]),
          h("div", { class: "scroll-mark", "aria-hidden": "true" }, [h("span", "SCROLL / SWIPE TO EXPLORE"), h("i"), h("b", "→")]),
        ]),
        h("section", { id: "work", class: ["panel", "work", "section-pad", { "is-active": activePanel.value === 1 }] }, [
          h("div", { class: "section-heading" }, [h("div", [h("p", { class: "section-index" }, "01 / WORK"), h("h2", "项目。")]), externalLink("全部仓库", "https://github.com/flash555588?tab=repositories", "text-link")]),
          h("div", { class: "project-grid" }, projects.map((project) => h("article", { class: ["project-card", project.featured && "featured"] }, [
            h("div", { class: "project-meta" }, [h("span", project.index), h("span", project.metric)]),
            h("div", { class: "project-body" }, [h("h3", project.title), h("p", project.description)]),
            h("ul", { class: "tag-list", "aria-label": `${project.title} 技术标签` }, project.tags.map((tag) => h("li", tag))),
            externalLink("OPEN REPOSITORY", project.href, "project-link"),
          ]))),
        ]),
        h("section", { id: "stack", class: ["panel", "stack", "section-pad", { "is-active": activePanel.value === 2 }] }, [
          h("p", { class: "section-index" }, "02 / STACK"),
          h("div", { class: "stack-grid" }, [
            h("h2", "技术栈。"),
            h("p", "根据问题选择工具。"),
          ]),
          h("div", { class: "stack-cloud" }, stack.map((item, index) => h("span", { style: { "--delay": `${index * 45}ms` } }, [
            h("i", String(index + 1).padStart(2, "0")),
            h("b", item),
          ]))),
          h("div", { class: "principles" }, [
            h("article", [h("span", "A"), h("h3", "CLEAR"), h("p", "目标明确。")]),
            h("article", [h("span", "B"), h("h3", "OPEN"), h("p", "开放协作。")]),
            h("article", [h("span", "C"), h("h3", "SHIP"), h("p", "快速交付。")]),
          ]),
        ]),
        h("section", { id: "contact", class: ["panel", "contact", "section-pad", { "is-active": activePanel.value === 3 }] }, [
          h("p", { class: "section-index" }, "03 / CONTACT"),
          h("h2", ["有想法？", h("br"), h("span", "一起做出来。")]),
          h("div", { class: "contact-actions" }, [externalLink("GITHUB / FLASH555588", "https://github.com/flash555588", "button button-primary"), externalLink("WWW.LOLIHOST.COM", "https://www.lolihost.com/", "button button-ghost")]),
        ]),
        h("section", { id: "friends", class: ["panel", "friends", "section-pad", { "is-active": activePanel.value === 4 }] }, [
          h("p", { class: "section-index" }, "04 / FRIEND LINKS"),
          h("div", { class: "friends-heading" }, [
            h("h2", "友链。"),
            h("p", "保持连接，交换有趣的站点。"),
          ]),
          h("div", { class: "friend-grid" }, [
            externalLink("LOLIHOST", "https://www.lolihost.com/", "friend-link"),
            externalLink("FLASH / GITHUB", "https://github.com/flash555588", "friend-link"),
            externalLink("交换友链", "https://github.com/flash555588", "friend-link friend-exchange"),
          ]),
          h("footer", [
            h("span", "© 2026 FLASH"),
            h("span", "BUILT WITH VUE × THREE.JS"),
            h("a", { href: "https://beian.miit.gov.cn/", target: "_blank", rel: "noreferrer" }, "皖ICP备2025095537号-1"),
            h("span", "WWW.LOLIHOST.COM"),
          ]),
        ]),
      ]),
      h("div", { class: "panel-dots", "aria-label": "页面导航" }, ["首页", "项目", "技术栈", "联系", "友链"].map((label, index) =>
        h("button", { class: { active: activePanel.value === index }, onClick: () => goTo(index), "aria-label": `前往${label}`, "aria-current": activePanel.value === index ? "page" : undefined }, `0${index + 1}`),
      )),
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
