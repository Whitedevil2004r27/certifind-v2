"use client";

import { useEffect, useRef } from "react";
import type { CSSProperties } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Award,
  BrainCircuit,
  Cloud,
  Code,
  Compass,
  GraduationCap,
  Layers3,
  Orbit,
  Sparkles,
  Trees,
  User,
  Zap,
} from "lucide-react";

type GsapApi = typeof import("gsap").default;
type LenisLike = {
  on(event: "scroll", callback: () => void): void;
  raf(time: number): void;
  destroy(): void;
};

const codeFragments = ["HTML", "React", "Python", "AI", "Cloud", "UI/UX"];

const courseCards = [
  { title: "React Systems", meta: "Frontend path", icon: Code, tone: "cyan" },
  { title: "Python Core", meta: "Automation path", icon: BrainCircuit, tone: "violet" },
  { title: "AI Foundations", meta: "Model literacy", icon: Sparkles, tone: "gold" },
  { title: "Cloud Launch", meta: "AWS + DevOps", icon: Cloud, tone: "cyan" },
  { title: "UX Motion", meta: "Product craft", icon: Layers3, tone: "violet" },
];

const certificates = ["Frontend", "Data", "Cloud", "AI", "Product"];
const mobileCertificatePositions = [
  { left: "50%", top: "16%" },
  { left: "80%", top: "40%" },
  { left: "70%", top: "77%" },
  { left: "30%", top: "77%" },
  { left: "20%", top: "40%" },
];

const roadmapNodes = [
  { role: "Frontend Developer", x: "10%", y: "28%", mobileX: "7%", mobileY: "24%", tone: "cyan" },
  { role: "Data Analyst", x: "58%", y: "18%", mobileX: "50%", mobileY: "18%", tone: "violet" },
  { role: "Cloud Engineer", x: "72%", y: "58%", mobileX: "50%", mobileY: "58%", tone: "gold" },
  { role: "AI Engineer", x: "24%", y: "70%", mobileX: "8%", mobileY: "68%", tone: "cyan" },
];

const achievements = ["React verified", "Python certified", "Cloud ready", "AI portfolio"];
const corridorFloorLights = Array.from({ length: 6 }, (_, index) => index);

const growthBranches = [
  { label: "Skills", top: "20%", left: "22%", mobileLeft: "40%", mobileTop: "19%", rotate: "-34deg" },
  { label: "Certifications", top: "18%", left: "61%", mobileLeft: "62%", mobileTop: "17%", rotate: "32deg" },
  { label: "Projects", top: "43%", left: "18%", mobileLeft: "38%", mobileTop: "47%", rotate: "-58deg" },
  { label: "Jobs", top: "46%", left: "68%", mobileLeft: "64%", mobileTop: "48%", rotate: "56deg" },
  { label: "Growth", top: "67%", left: "52%", mobileLeft: "52%", mobileTop: "61%", rotate: "18deg" },
];

const sceneShell =
  "cinematic-scene relative isolate grid min-h-screen items-center overflow-hidden px-6 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24 xl:px-14";
const sceneContainer = "mx-auto grid w-full max-w-[1360px] items-center gap-10 lg:gap-12";
const sceneLabel =
  "text-xs font-semibold uppercase tracking-tight sm:text-sm";
const heroHeading =
  "max-w-3xl text-4xl font-black leading-tight tracking-tight text-white [text-wrap:balance] sm:text-5xl lg:text-6xl";
const sectionHeading =
  "mt-4 max-w-3xl text-2xl font-black leading-tight tracking-tight text-white [text-wrap:balance] sm:text-3xl lg:text-4xl";
const sceneParagraph =
  "mt-5 max-w-3xl text-sm leading-relaxed text-white/60 sm:text-base lg:text-lg";

function VoidParticles() {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const connection = navigator as Navigator & { connection?: { saveData?: boolean } };
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion || connection.connection?.saveData) return;

    let cancelled = false;
    let cleanupScene: (() => void) | null = null;

    import("three").then((THREE) => {
      if (cancelled || !mountRef.current) return;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 100);
      camera.position.z = 3.2;

      const renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: false,
        powerPreference: "low-power",
      });
      const isSmallViewport = window.innerWidth < 640;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, isSmallViewport ? 1.15 : 1.5));
      renderer.setClearColor(0x000000, 0);
      mount.appendChild(renderer.domElement);

      const particleCount = isSmallViewport ? 420 : 720;
      const positions = new Float32Array(particleCount * 3);
      const colors = new Float32Array(particleCount * 3);
      const cyan = new THREE.Color("#67e8f9");
      const violet = new THREE.Color("#8b5cf6");
      const gold = new THREE.Color("#f7d774");

      for (let index = 0; index < particleCount; index += 1) {
        const radius = 1.2 + Math.random() * 2.8;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        positions[index * 3] = radius * Math.sin(phi) * Math.cos(theta);
        positions[index * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        positions[index * 3 + 2] = radius * Math.cos(phi);

        const color = index % 11 === 0 ? gold : index % 3 === 0 ? violet : cyan;
        colors[index * 3] = color.r;
        colors[index * 3 + 1] = color.g;
        colors[index * 3 + 2] = color.b;
      }

      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

      const material = new THREE.PointsMaterial({
        size: 0.018,
        vertexColors: true,
        transparent: true,
        opacity: 0.84,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });

      const points = new THREE.Points(geometry, material);
      scene.add(points);

      let frameId = 0;
      let sceneVisible = true;

      const resize = () => {
        const width = mount.clientWidth || window.innerWidth;
        const height = mount.clientHeight || window.innerHeight;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
      };

      const render = () => {
        if (sceneVisible && document.visibilityState === "visible") {
          points.rotation.y += 0.00075;
          points.rotation.x += 0.00022;
          renderer.render(scene, camera);
        }

        frameId = window.requestAnimationFrame(render);
      };

      const observer = new IntersectionObserver(
        ([entry]) => {
          sceneVisible = Boolean(entry?.isIntersecting);
        },
        { threshold: 0.02 }
      );

      resize();
      observer.observe(mount);
      render();
      window.addEventListener("resize", resize);

      cleanupScene = () => {
        observer.disconnect();
        window.removeEventListener("resize", resize);
        window.cancelAnimationFrame(frameId);
        geometry.dispose();
        material.dispose();
        renderer.dispose();
        renderer.domElement.remove();
      };
    });

    return () => {
      cancelled = true;
      cleanupScene?.();
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0 -z-10" aria-hidden="true" />;
}

function CourseTile({ title, meta, icon: Icon, tone }: (typeof courseCards)[number]) {
  const toneClass =
    tone === "gold"
      ? "border-yellow-300/[0.35] bg-yellow-300/10 text-yellow-100 shadow-[0_0_42px_rgba(247,215,116,0.16)]"
      : tone === "violet"
        ? "border-violet-400/[0.35] bg-violet-400/10 text-violet-100 shadow-[0_0_42px_rgba(139,92,246,0.18)]"
        : "border-cyan-300/[0.35] bg-cyan-300/10 text-cyan-100 shadow-[0_0_42px_rgba(103,232,249,0.18)]";

  return (
    <article
      data-course-card
      data-hoverable
      className={`group min-h-36 rounded-2xl border p-5 backdrop-blur-2xl transition duration-700 hover:-translate-y-2 hover:scale-[1.03] ${toneClass}`}
    >
      <Icon className="h-6 w-6" />
      <h3 className="mt-6 text-xl font-black text-white">{title}</h3>
      <p className="mt-2 text-sm text-white/[0.56]">{meta}</p>
    </article>
  );
}

function CertificateCard({ label, index }: { label: string; index: number }) {
  const mobilePosition = mobileCertificatePositions[index] ?? mobileCertificatePositions[0];

  return (
    <div
      data-certificate-shell
      className="certificate-card absolute left-1/2 top-1/2 h-24 w-28 sm:h-32 sm:w-48 lg:h-36"
      style={
        {
          "--cert-angle": `${index * 72}deg`,
          "--cert-counter-angle": `${-index * 72}deg`,
          "--cert-mobile-left": mobilePosition.left,
          "--cert-mobile-top": mobilePosition.top,
        } as CSSProperties
      }
    >
      <div
        data-certificate-card
        data-hoverable
        className="certificate-card-inner flex h-full w-full flex-col justify-between rounded-2xl border border-yellow-200/40 bg-[linear-gradient(135deg,rgba(247,215,116,0.18),rgba(255,255,255,0.04))] p-3 text-left text-yellow-50 shadow-[0_0_34px_rgba(247,215,116,0.13)] backdrop-blur-md transition-[border-color,background-color,box-shadow] duration-500 hover:border-yellow-100/60 hover:shadow-[0_0_46px_rgba(247,215,116,0.18)] sm:p-5 lg:shadow-[0_0_54px_rgba(247,215,116,0.16)]"
      >
        <Award className="h-4 w-4 text-yellow-200 sm:h-7 sm:w-7 lg:h-8 lg:w-8" />
        <div>
          <p className="text-[9px] uppercase leading-none text-yellow-100/70 sm:text-xs">Verified path</p>
          <h3 className="mt-1 text-sm font-black tracking-tight text-white sm:text-xl lg:text-2xl">{label}</h3>
        </div>
      </div>
    </div>
  );
}

function RoadmapNode({ role, x, y, mobileX, mobileY, tone }: (typeof roadmapNodes)[number]) {
  const toneClass =
    tone === "gold"
      ? "border-yellow-300/40 bg-yellow-300/[0.12] shadow-[0_0_52px_rgba(247,215,116,0.22)]"
      : tone === "violet"
        ? "border-violet-400/40 bg-violet-400/[0.12] shadow-[0_0_52px_rgba(139,92,246,0.2)]"
        : "border-cyan-300/40 bg-cyan-300/[0.12] shadow-[0_0_52px_rgba(103,232,249,0.2)]";

  return (
    <div
      data-road-node
      data-hoverable
      className={`roadmap-node absolute max-w-[8.75rem] rounded-2xl border p-3 text-xs font-black leading-snug text-white backdrop-blur-2xl transition duration-700 hover:-translate-y-1 sm:min-w-44 sm:max-w-none sm:p-4 sm:text-sm ${toneClass}`}
      style={
        {
          "--road-x": x,
          "--road-y": y,
          "--road-mobile-x": mobileX,
          "--road-mobile-y": mobileY,
        } as CSSProperties
      }
    >
      <Compass className="mb-3 h-4 w-4 text-cyan-200 sm:mb-4 sm:h-5 sm:w-5" />
      {role}
    </div>
  );
}

export default function CinematicCertifindStory() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const cursorRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    let cancelled = false;
    let cleanupAnimations: (() => void) | null = null;

    void (async () => {
      const [{ default: gsap }, { ScrollTrigger }, { default: Lenis }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
        import("lenis"),
      ]);

      if (cancelled || !rootRef.current) return;

      gsap.registerPlugin(ScrollTrigger);
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (prefersReducedMotion) {
        gsap.set(root.querySelectorAll("[data-reveal]"), { autoAlpha: 1, y: 0, filter: "none" });
        cleanupAnimations = () => ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
        return;
      }

      let lenis: LenisLike | null = null;
      let lenisTicker: ((time: number) => void) | null = null;

      lenis = new Lenis({
        duration: 1.45,
        easing: (value: number) => Math.min(1, 1.001 - Math.pow(2, -10 * value)),
        smoothWheel: true,
        wheelMultiplier: 0.78,
      }) as LenisLike;

      lenis.on("scroll", ScrollTrigger.update);
      lenisTicker = (time: number) => lenis?.raf(time * 1000);
      gsap.ticker.add(lenisTicker);
      gsap.ticker.lagSmoothing(0);

      const pointerFine = window.matchMedia("(pointer: fine)").matches;
      const cursorX = cursorRef.current
        ? (gsap as GsapApi).quickTo(cursorRef.current, "x", { duration: 0.65, ease: "power3.out" })
        : null;
      const cursorY = cursorRef.current
        ? (gsap as GsapApi).quickTo(cursorRef.current, "y", { duration: 0.65, ease: "power3.out" })
        : null;
      const moveCursor = (event: PointerEvent) => {
        if (!pointerFine) return;
        cursorX?.(event.clientX);
        cursorY?.(event.clientY);
      };

      if (pointerFine) {
        window.addEventListener("pointermove", moveCursor, { passive: true });
      }

      const scenePointerCleanups: Array<() => void> = [];

      const ctx = gsap.context(() => {
        gsap.utils.toArray<HTMLElement>("[data-scene]").forEach((scene) => {
          const revealTargets = scene.querySelectorAll("[data-reveal]");
          const slowParallaxTargets = scene.querySelectorAll("[data-parallax-slow]");
          const deepParallaxTargets = scene.querySelectorAll("[data-parallax-deep]");

          if (revealTargets.length) {
            gsap.fromTo(
              revealTargets,
              { autoAlpha: 0, y: 52, filter: "blur(14px)" },
              {
                autoAlpha: 1,
                y: 0,
                filter: "blur(0px)",
                duration: 1.2,
                ease: "power3.out",
                stagger: 0.1,
                scrollTrigger: {
                  trigger: scene,
                  start: "top 72%",
                },
              }
            );
          }

          if (slowParallaxTargets.length) {
            gsap.to(slowParallaxTargets, {
              yPercent: -10,
              ease: "none",
              scrollTrigger: {
                trigger: scene,
                start: "top bottom",
                end: "bottom top",
                scrub: 1.8,
              },
            });
          }

          if (deepParallaxTargets.length) {
            gsap.to(deepParallaxTargets, {
              yPercent: -18,
              ease: "none",
              scrollTrigger: {
                trigger: scene,
                start: "top bottom",
                end: "bottom top",
                scrub: 2,
              },
            });
          }
        });

        gsap.to("[data-code-token]", {
          rotateY: 280,
          rotateX: 22,
          z: 96,
          opacity: 0.24,
          scale: 0.8,
          stagger: 0.12,
          ease: "none",
          scrollTrigger: {
            trigger: "[data-scene='code']",
            start: "top 62%",
            end: "bottom 24%",
            scrub: 1.6,
          },
        });

        gsap.fromTo(
          "[data-course-card]",
          { opacity: 0.42, y: 30, rotateX: -12, scale: 0.94 },
          {
            opacity: 1,
            y: 0,
            rotateX: 0,
            scale: 1,
            stagger: 0.1,
            duration: 1.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: "[data-scene='code']",
              start: "top 76%",
            },
          }
        );

        gsap.to("[data-expand-frame]", {
          scale: 1.06,
          borderRadius: "2rem",
          ease: "none",
          scrollTrigger: {
            trigger: "[data-scene='code']",
            start: "top bottom",
            end: "bottom top",
            scrub: 1.4,
          },
        });

        const certificateScene = root.querySelector<HTMLElement>("[data-scene='certificates']");
        if (certificateScene) {
          const orbitRing = certificateScene.querySelector<HTMLElement>("[data-orbit-ring]");
          const certificateCards = certificateScene.querySelectorAll<HTMLElement>("[data-certificate-card]");
          const compactMotion = window.matchMedia("(max-width: 640px)").matches;

          gsap.set(certificateCards, {
            autoAlpha: 0.35,
            scale: 0.96,
            y: 10,
            force3D: true,
            transformOrigin: "50% 50%",
          });

          if (orbitRing) {
            gsap.set(orbitRing, { force3D: true, transformOrigin: "50% 50%" });
            gsap.to(orbitRing, {
              rotate: compactMotion ? 90 : 180,
              ease: "none",
              scrollTrigger: {
                trigger: certificateScene,
                start: "top bottom",
                end: "bottom top",
                scrub: compactMotion ? 3 : 2.4,
                invalidateOnRefresh: false,
              },
            });
          }

          if (certificateCards.length) {
            gsap.to(certificateCards, {
              autoAlpha: 1,
              scale: 1,
              y: 0,
              stagger: 0.055,
              duration: 0.75,
              ease: "power2.out",
              force3D: true,
              scrollTrigger: {
                trigger: certificateScene,
                start: "top 62%",
                once: true,
              },
            });
          }
        }

        gsap.fromTo(
          "[data-road-line]",
          { scaleX: 0, transformOrigin: "left center" },
          {
            scaleX: 1,
            stagger: 0.08,
            duration: 1.05,
            ease: "power3.out",
            scrollTrigger: {
              trigger: "[data-scene='roadmap']",
              start: "top 62%",
            },
          }
        );

        const corridorScene = root.querySelector<HTMLElement>("[data-scene='corridor']");
        if (corridorScene) {
          const corridorPanels = corridorScene.querySelectorAll<HTMLElement>("[data-corridor-panel]");
          const corridorLights = corridorScene.querySelectorAll<HTMLElement>("[data-corridor-light]");
          const corridorAchievements = corridorScene.querySelectorAll<HTMLElement>("[data-corridor-achievement]");
          const corridorAchievementLines = corridorScene.querySelectorAll<HTMLElement>("[data-corridor-achievement-line]");
          const corridorHorizon = corridorScene.querySelector<HTMLElement>("[data-corridor-horizon]");
          const corridorAvatar = corridorScene.querySelector<HTMLElement>("[data-corridor-avatar]");
          const corridorAvatarCore = corridorScene.querySelector<HTMLElement>("[data-corridor-avatar-core]");
          const corridorTrail = corridorScene.querySelector<HTMLElement>("[data-corridor-trail]");
          const corridorTilt = corridorScene.querySelector<HTMLElement>("[data-corridor-tilt]");

          gsap.fromTo(
            corridorPanels,
            { autoAlpha: 0.14, z: -150, scale: 0.84 },
            {
              autoAlpha: 1,
              z: 0,
              scale: 1,
              stagger: 0.08,
              ease: "power2.out",
              scrollTrigger: {
                trigger: corridorScene,
                start: "top 65%",
                end: "bottom 28%",
                scrub: 1.45,
              },
            }
          );

          const corridorTimeline = gsap.timeline({
            scrollTrigger: {
              trigger: corridorScene,
              start: "top 72%",
              end: "bottom 18%",
              scrub: 1.8,
            },
          });

          if (corridorHorizon) {
            corridorTimeline.fromTo(
              corridorHorizon,
              { autoAlpha: 0.25, scaleX: 0.32 },
              { autoAlpha: 1, scaleX: 1, ease: "none" },
              0
            );
          }

          if (corridorAvatar) {
            corridorTimeline.fromTo(
              corridorAvatar,
              { y: 60, z: -40, scale: 0.82, autoAlpha: 0.72 },
              { y: -78, z: 120, scale: 1.16, autoAlpha: 1, ease: "none" },
              0
            );
          }

          if (corridorTrail) {
            corridorTimeline.fromTo(
              corridorTrail,
              { scaleY: 0.18, autoAlpha: 0.22, transformOrigin: "bottom center" },
              { scaleY: 1, autoAlpha: 0.8, ease: "none" },
              0.08
            );
          }

          if (corridorLights.length) {
            corridorTimeline.fromTo(
              corridorLights,
              { autoAlpha: 0.12, scaleX: 0.28 },
              { autoAlpha: 0.92, scaleX: 1, stagger: 0.08, ease: "none" },
              0.02
            );
          }

          if (corridorAchievements.length) {
            gsap.fromTo(
              corridorAchievements,
              { autoAlpha: 0.18, x: -34, filter: "blur(8px)" },
              {
                autoAlpha: 1,
                x: 0,
                filter: "blur(0px)",
                stagger: 0.11,
                duration: 0.95,
                ease: "power3.out",
                scrollTrigger: {
                  trigger: corridorScene,
                  start: "top 56%",
                  once: true,
                },
              }
            );
          }

          if (corridorAchievementLines.length) {
            gsap.fromTo(
              corridorAchievementLines,
              { scaleX: 0, transformOrigin: "left center" },
              {
                scaleX: 1,
                stagger: 0.1,
                duration: 0.8,
                ease: "power3.out",
                scrollTrigger: {
                  trigger: corridorScene,
                  start: "top 50%",
                  once: true,
                },
              }
            );
          }

          if (corridorAvatarCore) {
            gsap.to(corridorAvatarCore, {
              y: -8,
              duration: 1.55,
              ease: "sine.inOut",
              repeat: -1,
              yoyo: true,
            });
          }

          if (corridorTilt && pointerFine) {
            const rotateX = (gsap as GsapApi).quickTo(corridorTilt, "rotationX", { duration: 0.75, ease: "power3.out" });
            const rotateY = (gsap as GsapApi).quickTo(corridorTilt, "rotationY", { duration: 0.75, ease: "power3.out" });
            const handleCorridorMove = (event: PointerEvent) => {
              const rect = corridorTilt.getBoundingClientRect();
              const x = (event.clientX - rect.left) / rect.width - 0.5;
              const y = (event.clientY - rect.top) / rect.height - 0.5;
              rotateY(x * 5);
              rotateX(y * -4);
            };
            const handleCorridorLeave = () => {
              rotateX(0);
              rotateY(0);
            };

            corridorTilt.addEventListener("pointermove", handleCorridorMove, { passive: true });
            corridorTilt.addEventListener("pointerleave", handleCorridorLeave);
            scenePointerCleanups.push(() => {
              corridorTilt.removeEventListener("pointermove", handleCorridorMove);
              corridorTilt.removeEventListener("pointerleave", handleCorridorLeave);
            });
          }
        }

        gsap.fromTo(
          "[data-tree-branch]",
          { scaleY: 0, autoAlpha: 0, transformOrigin: "bottom center" },
          {
            scaleY: 1,
            autoAlpha: 1,
            stagger: 0.12,
            duration: 1.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: "[data-scene='tree']",
              start: "top 58%",
            },
          }
        );

        ScrollTrigger.refresh();
      }, root);

      cleanupAnimations = () => {
        scenePointerCleanups.forEach((cleanup) => cleanup());
        ctx.revert();
        if (pointerFine) window.removeEventListener("pointermove", moveCursor);
        if (lenisTicker) gsap.ticker.remove(lenisTicker);
        lenis?.destroy();
      };
    })();

    return () => {
      cancelled = true;
      cleanupAnimations?.();
    };
  }, []);

  return (
    <div ref={rootRef} className="certifind-story relative overflow-hidden bg-black text-white">
      <div
        ref={cursorRef}
        className="pointer-events-none fixed left-0 top-0 z-[80] hidden h-12 w-12 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-200/40 bg-cyan-200/5 mix-blend-screen shadow-[0_0_36px_rgba(103,232,249,0.28)] lg:block"
        aria-hidden="true"
      />

      <section data-scene="void" className="cinematic-scene relative isolate flex min-h-[calc(100svh-4rem)] items-center overflow-hidden px-6 py-16 sm:px-8 sm:py-20 lg:min-h-[calc(100svh-5rem)] lg:px-10 xl:px-14">
        <VoidParticles />
        <div className="absolute inset-0 -z-20 bg-black" />
        <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-black to-transparent" aria-hidden="true" />

        <div className="mx-auto grid w-full max-w-[1360px] items-end gap-8 md:gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(340px,0.52fr)] lg:gap-12">
          <div className="max-w-3xl">
            <p data-reveal className={`${sceneLabel} mb-4 text-cyan-200/[0.78]`}>
              CertiFind — From Learning to Legacy
            </p>
            <h1 data-reveal className={heroHeading}>
              Every career begins in darkness — with one question: where do I start?
            </h1>
          </div>

          <div data-reveal data-parallax-slow className="relative max-w-md rounded-[1.5rem] border border-white/[0.12] bg-white/[0.03] p-5 shadow-[0_0_80px_rgba(103,232,249,0.08)] backdrop-blur-xl sm:p-6 lg:justify-self-end">
            <div className="absolute -inset-px rounded-[2rem] bg-[radial-gradient(circle_at_20%_0%,rgba(103,232,249,0.24),transparent_42%),radial-gradient(circle_at_80%_80%,rgba(139,92,246,0.20),transparent_45%)] opacity-70" aria-hidden="true" />
            <div className="relative">
              <p className="text-sm text-white/[0.54]">The first signal</p>
              <p className="mt-4 text-2xl font-black leading-tight tracking-tight text-white sm:text-3xl">CertiFind turns confusion into direction.</p>
              <Link
                data-hoverable
                href="#story-begins"
                className="mt-8 inline-flex min-h-12 items-center gap-3 rounded-full bg-white px-6 text-sm font-black text-black transition duration-500 hover:-translate-y-1 hover:shadow-[0_0_50px_rgba(255,255,255,0.24)]"
              >
                Enter the story
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section id="story-begins" data-scene="code" className={sceneShell}>
        <div className="absolute inset-0 -z-20 bg-black" />
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_70%_38%,rgba(103,232,249,0.16),transparent_32%),radial-gradient(circle_at_18%_72%,rgba(139,92,246,0.15),transparent_34%)]" aria-hidden="true" />

        <div className={`${sceneContainer} lg:grid-cols-[0.9fr_1.1fr]`}>
          <div className="max-w-3xl">
            <p data-reveal className="text-sm font-semibold uppercase text-cyan-200/[0.76]">Scene Two</p>
            <h2 data-reveal className={sectionHeading}>
              From scattered skills, a path begins to form.
            </h2>
            <p data-reveal className={sceneParagraph}>
              Code fragments resolve into real course tiles, shaped around the skills that move a learner forward.
            </p>
          </div>

          <div data-expand-frame className="cinematic-perspective relative min-h-[460px] rounded-[2rem] border border-white/10 bg-white/[0.025] p-4 shadow-[0_0_95px_rgba(103,232,249,0.07)] sm:min-h-[540px] sm:p-6 lg:min-h-[620px] lg:rounded-[2.5rem] lg:p-8">
            <div className="absolute inset-0 rounded-[inherit] bg-[linear-gradient(135deg,rgba(255,255,255,0.08),transparent_42%),radial-gradient(circle_at_70%_20%,rgba(103,232,249,0.18),transparent_28%)]" aria-hidden="true" />
            <div className="relative grid h-full min-h-[420px] gap-5 md:min-h-[500px] lg:min-h-[560px] lg:grid-cols-[0.8fr_1fr]">
              <div className="relative min-h-56 rounded-[1.5rem] border border-cyan-200/10 bg-black/[0.42] p-4 sm:min-h-64 sm:rounded-[2rem] sm:p-5">
                {codeFragments.map((fragment, index) => (
                  <div
                    key={fragment}
                    data-code-token
                    className="absolute rounded-xl border border-cyan-200/[0.22] bg-cyan-200/[0.08] px-3 py-2 font-mono text-xs font-bold text-cyan-100 shadow-[0_0_32px_rgba(103,232,249,0.14)] sm:px-4 sm:py-3 sm:text-sm"
                    style={{
                      left: `${10 + ((index * 29) % 66)}%`,
                      top: `${12 + ((index * 23) % 66)}%`,
                      transform: `translateZ(${index * 22}px) rotate(${index * 8}deg)`,
                    }}
                  >
                    {fragment}
                  </div>
                ))}
              </div>

              <div className="grid content-center gap-4 sm:grid-cols-2">
                {courseCards.map((card) => (
                  <CourseTile key={card.title} {...card} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section data-scene="certificates" className={sceneShell}>
        <div className="absolute inset-0 -z-20 bg-black" />
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_50%,rgba(247,215,116,0.14),transparent_34%),radial-gradient(circle_at_20%_20%,rgba(139,92,246,0.13),transparent_32%)]" aria-hidden="true" />

        <div className={`${sceneContainer} items-center lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.82fr)] xl:grid-cols-[minmax(620px,1.02fr)_minmax(360px,0.78fr)]`}>
          <div data-parallax-slow className="certificate-stage cinematic-perspective relative mx-auto flex min-h-[430px] w-full max-w-[680px] items-center justify-center overflow-hidden rounded-[2rem] border border-yellow-200/[0.12] bg-white/[0.025] p-4 shadow-[0_0_100px_rgba(247,215,116,0.045)] sm:min-h-[540px] sm:p-6 lg:min-h-[620px] lg:max-w-none lg:rounded-[2.75rem] lg:p-8">
            <div className="absolute inset-4 rounded-[1.5rem] border border-white/[0.045] bg-[radial-gradient(circle_at_50%_46%,rgba(247,215,116,0.10),transparent_36%),linear-gradient(180deg,rgba(255,255,255,0.045),transparent_48%)] sm:inset-6 lg:inset-8 lg:rounded-[2rem]" aria-hidden="true" />
            <div className="certificate-orbit-area absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" aria-hidden="true">
              <div data-orbit-ring className="orbit-ring h-full w-full rounded-full border border-yellow-200/[0.18] shadow-[0_0_54px_rgba(247,215,116,0.07)]" />
            </div>
            {certificates.map((certificate, index) => (
              <CertificateCard key={certificate} label={certificate} index={index} />
            ))}
            <div className="certificate-core absolute left-1/2 top-1/2 grid h-24 w-24 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-cyan-200/30 bg-black shadow-[0_0_48px_rgba(103,232,249,0.16)] sm:h-32 sm:w-32 lg:h-36 lg:w-36 xl:h-40 xl:w-40">
              <GraduationCap className="h-10 w-10 text-cyan-100 sm:h-12 sm:w-12 lg:h-14 lg:w-14" />
            </div>
          </div>

          <div className="mx-auto max-w-3xl text-center lg:mx-0 lg:max-w-xl lg:text-left">
            <p data-reveal className="text-sm font-semibold uppercase text-yellow-100/[0.76]">Scene Three</p>
            <h2 data-reveal className={sectionHeading}>
              Every lesson becomes proof. Every certificate becomes power.
            </h2>
            <p data-reveal className={sceneParagraph}>
              Course cards move into orbit, then ignite into credentials a learner can carry into the next chapter.
            </p>
          </div>
        </div>
      </section>

      <section data-scene="roadmap" className={sceneShell}>
        <div className="absolute inset-0 -z-20 bg-black" />
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_65%_48%,rgba(103,232,249,0.14),transparent_36%),linear-gradient(180deg,rgba(139,92,246,0.08),transparent_45%)]" aria-hidden="true" />

        <div className={`${sceneContainer} lg:grid-cols-[0.78fr_1.12fr]`}>
          <div className="max-w-3xl">
            <p data-reveal className="text-sm font-semibold uppercase text-cyan-200/[0.76]">Scene Four</p>
            <h2 data-reveal className={sectionHeading}>
              CertiFind does not just show courses. It reveals your next direction.
            </h2>
            <p data-reveal className={sceneParagraph}>
              Certificates connect into roadmaps for roles that once felt distant, abstract, or hidden.
            </p>
          </div>

          <div data-parallax-deep className="relative min-h-[460px] overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.025] p-4 shadow-[0_0_95px_rgba(139,92,246,0.08)] sm:min-h-[540px] sm:p-6 lg:min-h-[620px] lg:rounded-[2.75rem]">
            <svg className="absolute inset-0 h-full w-full text-cyan-200/[0.26]" viewBox="0 0 900 620" aria-hidden="true">
              <path data-road-line d="M120 210 C270 130 420 130 540 168" stroke="currentColor" strokeWidth="2" fill="none" />
              <path data-road-line d="M545 168 C670 240 710 300 724 358" stroke="currentColor" strokeWidth="2" fill="none" />
              <path data-road-line d="M722 360 C560 430 420 444 272 438" stroke="currentColor" strokeWidth="2" fill="none" />
              <path data-road-line d="M272 438 C210 360 154 296 120 210" stroke="currentColor" strokeWidth="2" fill="none" />
            </svg>
            <div className="absolute left-1/2 top-1/2 grid h-20 w-20 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-white/[0.18] bg-black shadow-[0_0_58px_rgba(103,232,249,0.18)] sm:h-24 sm:w-24 lg:h-28 lg:w-28">
              <Orbit className="h-7 w-7 text-cyan-100 sm:h-9 sm:w-9 lg:h-10 lg:w-10" />
            </div>
            {roadmapNodes.map((node) => (
              <RoadmapNode key={node.role} {...node} />
            ))}
          </div>
        </div>
      </section>

      <section data-scene="corridor" className={sceneShell}>
        <div className="absolute inset-0 -z-20 bg-black" />
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_50%_0%,rgba(103,232,249,0.16),transparent_28%),linear-gradient(180deg,transparent,rgba(139,92,246,0.08)_70%,transparent)]" aria-hidden="true" />

        <div className={`${sceneContainer} lg:grid-cols-[1.05fr_0.8fr]`}>
          <div data-parallax-slow className="cinematic-corridor cinematic-perspective relative min-h-[480px] overflow-hidden rounded-[2rem] border border-cyan-200/10 bg-black shadow-[0_0_95px_rgba(103,232,249,0.07)] sm:min-h-[560px] lg:min-h-[640px] lg:rounded-[2.75rem]">
            <div data-corridor-tilt className="absolute inset-0 rounded-[inherit] will-change-transform">
              <div data-corridor-horizon className="absolute left-1/2 top-[18%] h-px w-[62%] -translate-x-1/2 bg-gradient-to-r from-transparent via-cyan-100/60 to-transparent shadow-[0_0_36px_rgba(103,232,249,0.45)]" aria-hidden="true" />
              <div className="absolute inset-x-[16%] bottom-0 top-14 bg-[linear-gradient(90deg,transparent,rgba(103,232,249,0.10),transparent)]" aria-hidden="true" />

              {corridorFloorLights.map((light) => (
                <div
                  key={light}
                  data-corridor-light
                  className="corridor-floor-light absolute left-1/2 h-px rounded-full bg-cyan-100/70 shadow-[0_0_34px_rgba(103,232,249,0.38)]"
                  style={
                    {
                      "--corridor-light-bottom": `${16 + light * 10}%`,
                      "--corridor-light-width": `${24 + light * 9}%`,
                    } as CSSProperties
                  }
                  aria-hidden="true"
                />
              ))}

              {[0, 1, 2, 3, 4].map((panel) => (
                <div
                  key={panel}
                  data-corridor-panel
                  className="absolute left-1/2 top-1/2 h-[76%] w-[78%] -translate-x-1/2 -translate-y-1/2 rounded-[2rem] border border-cyan-200/[0.12] shadow-[inset_0_0_32px_rgba(103,232,249,0.05)]"
                  style={{ transform: `translate(-50%, -50%) translateZ(${-panel * 95}px) scale(${1 - panel * 0.1})` }}
                />
              ))}

              <div data-corridor-avatar className="absolute bottom-20 left-1/2 flex -translate-x-1/2 flex-col items-center will-change-transform">
                <div data-corridor-avatar-core className="corridor-avatar-core grid h-20 w-20 place-items-center rounded-full border border-cyan-200/[0.42] bg-cyan-200/10 shadow-[0_0_70px_rgba(103,232,249,0.25)] sm:h-24 sm:w-24">
                  <User className="h-8 w-8 text-cyan-100 sm:h-10 sm:w-10" />
                </div>
                <div data-corridor-trail className="mt-4 h-36 w-1 rounded-full bg-gradient-to-b from-cyan-100 via-violet-300/70 to-transparent shadow-[0_0_34px_rgba(103,232,249,0.35)]" />
              </div>

              <div className="absolute left-5 top-8 space-y-3 sm:left-10 sm:top-10 sm:space-y-4">
                {achievements.map((achievement, index) => (
                  <div
                    key={achievement}
                    data-corridor-achievement
                    data-hoverable
                    className="group relative rounded-full border border-yellow-200/20 bg-yellow-200/[0.08] px-4 py-2 text-xs font-bold text-yellow-100 shadow-[0_0_32px_rgba(247,215,116,0.10)] backdrop-blur-md transition duration-500 hover:-translate-y-1 hover:border-yellow-100/45 hover:bg-yellow-200/[0.14] sm:text-sm"
                  >
                    <span data-corridor-achievement-line className="absolute left-full top-1/2 hidden h-px w-16 origin-left bg-gradient-to-r from-yellow-200/55 to-transparent shadow-[0_0_18px_rgba(247,215,116,0.28)] sm:block" aria-hidden="true" />
                    <span className="mr-2 text-cyan-100/80">0{index + 1}</span>
                    {achievement}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="max-w-3xl">
            <p data-reveal className="text-sm font-semibold uppercase text-violet-200/[0.76]">Scene Five</p>
            <h2 data-reveal className={sectionHeading}>
              Learn. Prove. Rise.
            </h2>
            <p data-reveal className={sceneParagraph}>
              A learner moves forward through a black futuristic corridor while every completed milestone lights the path behind them.
            </p>
          </div>
        </div>
      </section>

      <section data-scene="tree" className={sceneShell}>
        <div className="absolute inset-0 -z-20 bg-black" />
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_48%,rgba(103,232,249,0.15),transparent_32%),radial-gradient(circle_at_52%_58%,rgba(247,215,116,0.10),transparent_38%)]" aria-hidden="true" />

        <div className={`${sceneContainer} lg:grid-cols-[0.82fr_1fr]`}>
          <div className="max-w-3xl">
            <p data-reveal className="text-sm font-semibold uppercase text-cyan-200/[0.76]">The Harvest</p>
            <h2 data-reveal className={sectionHeading}>
              Your future is not found. It is built.
            </h2>
            <p data-reveal className={sceneParagraph}>
              The roadmap becomes a living system of skills, certifications, projects, jobs, and growth.
            </p>
            <div data-reveal className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                data-hoverable
                href="/courses/live"
                className="inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-cyan-200 px-6 text-sm font-black text-black transition duration-500 hover:-translate-y-1 hover:bg-white hover:shadow-[0_0_55px_rgba(103,232,249,0.25)]"
              >
                Start building
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                data-hoverable
                href="/dashboard"
                className="inline-flex min-h-12 items-center justify-center gap-3 rounded-full border border-white/[0.15] bg-white/[0.04] px-6 text-sm font-black text-white transition duration-500 hover:-translate-y-1 hover:border-violet-300/[0.45] hover:bg-white/[0.08]"
              >
                Open dashboard
              </Link>
            </div>
          </div>

          <div data-parallax-deep className="relative min-h-[660px] rounded-[2.75rem] border border-white/10 bg-white/[0.025] shadow-[0_0_150px_rgba(103,232,249,0.08)]">
            <div className="absolute bottom-24 left-1/2 h-[430px] w-3 -translate-x-1/2 rounded-full bg-gradient-to-t from-yellow-200 via-cyan-200 to-violet-300 shadow-[0_0_58px_rgba(103,232,249,0.42)]" />
            <div className="absolute bottom-14 left-1/2 h-24 w-64 -translate-x-1/2 rounded-[100%] bg-cyan-200/10 blur-2xl" aria-hidden="true" />
            {growthBranches.map((branch) => (
              <div
                key={branch.label}
                data-tree-branch
                className="growth-branch absolute h-40 w-2 rounded-full bg-gradient-to-t from-cyan-200 via-violet-300 to-yellow-200 shadow-[0_0_46px_rgba(103,232,249,0.38)]"
                style={
                  {
                    "--branch-top": branch.top,
                    "--branch-left": branch.left,
                    "--branch-mobile-left": branch.mobileLeft,
                    "--branch-rotate": branch.rotate,
                    "--branch-counter-rotate": branch.rotate.startsWith("-")
                      ? branch.rotate.slice(1)
                      : `-${branch.rotate}`,
                  } as CSSProperties
                }
              >
                <span className="growth-label absolute -top-12 left-1/2 hidden min-w-32 rounded-full border border-white/[0.14] bg-black/80 px-4 py-2 text-center text-sm font-black text-white shadow-[0_0_30px_rgba(255,255,255,0.08)] backdrop-blur-xl sm:block">
                  {branch.label}
                </span>
              </div>
            ))}
            <div className="pointer-events-none absolute inset-0 z-20 sm:hidden">
              {growthBranches.map((branch) => (
                <span
                  key={`mobile-${branch.label}`}
                  className="absolute min-w-24 -translate-x-1/2 rounded-full border border-white/[0.14] bg-black/[0.82] px-3 py-1.5 text-center text-[11px] font-black leading-4 text-white shadow-[0_0_30px_rgba(255,255,255,0.08)] backdrop-blur-xl"
                  style={{ left: branch.mobileLeft, top: branch.mobileTop }}
                >
                  {branch.label}
                </span>
              ))}
            </div>
            <div className="absolute left-1/2 top-[42%] grid h-32 w-32 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-cyan-200/[0.35] bg-black shadow-[0_0_80px_rgba(103,232,249,0.22)]">
              <Trees className="h-14 w-14 text-cyan-100" />
            </div>
            <div className="absolute bottom-10 right-8 rounded-2xl border border-white/10 bg-black/[0.64] p-5 backdrop-blur-xl">
              <Zap className="h-5 w-5 text-yellow-100" />
              <p className="mt-3 max-w-52 text-sm leading-6 text-white/[0.64]">
                CertiFind maps the next credential before momentum fades.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
