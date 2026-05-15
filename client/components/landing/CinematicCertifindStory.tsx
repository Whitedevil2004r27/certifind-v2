"use client";

import { useEffect, useRef } from "react";
import type { CSSProperties } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
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
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

const codeFragments = ["HTML", "React", "Python", "AI", "Cloud", "UI/UX"];

const courseCards = [
  { title: "React Systems", meta: "Frontend path", icon: Code, tone: "cyan" },
  { title: "Python Core", meta: "Automation path", icon: BrainCircuit, tone: "violet" },
  { title: "AI Foundations", meta: "Model literacy", icon: Sparkles, tone: "gold" },
  { title: "Cloud Launch", meta: "AWS + DevOps", icon: Cloud, tone: "cyan" },
  { title: "UX Motion", meta: "Product craft", icon: Layers3, tone: "violet" },
];

const certificates = ["Frontend", "Data", "Cloud", "AI", "Product"];

const roadmapNodes = [
  { role: "Frontend Developer", x: "10%", y: "28%", tone: "cyan" },
  { role: "Data Analyst", x: "58%", y: "18%", tone: "violet" },
  { role: "Cloud Engineer", x: "72%", y: "58%", tone: "gold" },
  { role: "AI Engineer", x: "24%", y: "70%", tone: "cyan" },
];

const achievements = ["React verified", "Python certified", "Cloud ready", "AI portfolio"];

const growthBranches = [
  { label: "Skills", top: "20%", left: "22%", mobileLeft: "40%", mobileTop: "19%", rotate: "-34deg" },
  { label: "Certifications", top: "18%", left: "61%", mobileLeft: "62%", mobileTop: "17%", rotate: "32deg" },
  { label: "Projects", top: "43%", left: "18%", mobileLeft: "38%", mobileTop: "47%", rotate: "-58deg" },
  { label: "Jobs", top: "46%", left: "68%", mobileLeft: "64%", mobileTop: "48%", rotate: "56deg" },
  { label: "Growth", top: "67%", left: "52%", mobileLeft: "52%", mobileTop: "61%", rotate: "18deg" },
];

function VoidParticles() {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let cancelled = false;
    let cleanupScene: (() => void) | null = null;

    import("three").then((THREE) => {
      if (cancelled || !mountRef.current) return;

      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 100);
      camera.position.z = 3.2;

      const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setClearColor(0x000000, 0);
      mount.appendChild(renderer.domElement);

      const particleCount = 900;
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

      const resize = () => {
        const width = mount.clientWidth || window.innerWidth;
        const height = mount.clientHeight || window.innerHeight;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
      };

      const render = () => {
        if (!prefersReducedMotion) {
          points.rotation.y += 0.00075;
          points.rotation.x += 0.00022;
        }

        renderer.render(scene, camera);
        frameId = window.requestAnimationFrame(render);
      };

      resize();
      render();
      window.addEventListener("resize", resize);

      cleanupScene = () => {
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
    <motion.article
      data-course-card
      data-hoverable
      whileHover={{ y: -8, scale: 1.03 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className={`group min-h-36 rounded-2xl border p-5 backdrop-blur-2xl transition duration-700 hover:-translate-y-2 hover:scale-[1.03] ${toneClass}`}
    >
      <Icon className="h-6 w-6" />
      <h3 className="mt-6 text-xl font-black text-white">{title}</h3>
      <p className="mt-2 text-sm text-white/[0.56]">{meta}</p>
    </motion.article>
  );
}

function CertificateCard({ label, index }: { label: string; index: number }) {
  return (
    <div
      data-certificate
      data-hoverable
      className="absolute left-1/2 top-1/2 h-36 w-56 -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-yellow-200/40 bg-[linear-gradient(135deg,rgba(247,215,116,0.18),rgba(255,255,255,0.04))] p-5 text-yellow-50 shadow-[0_0_70px_rgba(247,215,116,0.18)] backdrop-blur-xl transition duration-700 hover:scale-105"
      style={{
        transform: `translate(-50%, -50%) rotate(${index * 72}deg) translateY(-170px) rotate(${-index * 72}deg)`,
      }}
    >
      <Award className="h-8 w-8 text-yellow-200" />
      <p className="mt-8 text-xs uppercase text-yellow-100/70">Verified path</p>
      <h3 className="mt-1 text-2xl font-black text-white">{label}</h3>
    </div>
  );
}

function RoadmapNode({ role, x, y, tone }: (typeof roadmapNodes)[number]) {
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
      className={`absolute min-w-44 rounded-2xl border p-4 text-sm font-black text-white backdrop-blur-2xl transition duration-700 hover:-translate-y-1 ${toneClass}`}
      style={{ left: x, top: y }}
    >
      <Compass className="mb-4 h-5 w-5 text-cyan-200" />
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

    gsap.registerPlugin(ScrollTrigger);
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let lenis: Lenis | null = null;
    let lenisTicker: ((time: number) => void) | null = null;

    if (!prefersReducedMotion) {
      lenis = new Lenis({
        duration: 1.6,
        easing: (value: number) => Math.min(1, 1.001 - Math.pow(2, -10 * value)),
        smoothWheel: true,
        wheelMultiplier: 0.78,
      });

      lenis.on("scroll", ScrollTrigger.update);
      lenisTicker = (time: number) => lenis?.raf(time * 1000);
      gsap.ticker.add(lenisTicker);
      gsap.ticker.lagSmoothing(0);
    }

    const pointerFine = window.matchMedia("(pointer: fine)").matches;
    const moveCursor = (event: PointerEvent) => {
      if (!cursorRef.current || !pointerFine || prefersReducedMotion) return;
      gsap.to(cursorRef.current, {
        x: event.clientX,
        y: event.clientY,
        duration: 0.65,
        ease: "power3.out",
      });
    };

    window.addEventListener("pointermove", moveCursor, { passive: true });

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-scene]").forEach((scene) => {
        const revealTargets = scene.querySelectorAll("[data-reveal]");
        const slowParallaxTargets = scene.querySelectorAll("[data-parallax-slow]");
        const deepParallaxTargets = scene.querySelectorAll("[data-parallax-deep]");

        if (revealTargets.length) {
          gsap.fromTo(
            revealTargets,
            { autoAlpha: 0, y: 72, filter: "blur(18px)" },
            {
              autoAlpha: 1,
              y: 0,
              filter: "blur(0px)",
              duration: 1.55,
              ease: "power3.out",
              stagger: 0.12,
              scrollTrigger: {
                trigger: scene,
                start: "top 72%",
              },
            }
          );
        }

        if (slowParallaxTargets.length) {
          gsap.to(slowParallaxTargets, {
            yPercent: -14,
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
            yPercent: -28,
            ease: "none",
            scrollTrigger: {
              trigger: scene,
              start: "top bottom",
              end: "bottom top",
              scrub: 2.2,
            },
          });
        }
      });

      gsap.to("[data-code-token]", {
        rotateY: 360,
        rotateX: 28,
        z: 140,
        opacity: 0.2,
        scale: 0.74,
        stagger: 0.08,
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
        { opacity: 0.42, y: 36, rotateX: -18, scale: 0.92 },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          scale: 1,
          stagger: 0.12,
          duration: 1.4,
          ease: "power3.out",
          scrollTrigger: {
            trigger: "[data-scene='code']",
            start: "top 76%",
          },
        }
      );

      gsap.to("[data-expand-frame]", {
        scale: 1.12,
        borderRadius: "2rem",
        ease: "none",
        scrollTrigger: {
          trigger: "[data-scene='code']",
          start: "top bottom",
          end: "bottom top",
          scrub: 1.4,
        },
      });

      gsap.to("[data-orbit-ring]", {
        rotate: 360,
        ease: "none",
        scrollTrigger: {
          trigger: "[data-scene='certificates']",
          start: "top bottom",
          end: "bottom top",
          scrub: 2.4,
        },
      });

      gsap.fromTo(
        "[data-certificate]",
        { autoAlpha: 0.22, scale: 0.76, rotateY: -40 },
        {
          autoAlpha: 1,
          scale: 1,
          rotateY: 0,
          stagger: 0.08,
          ease: "power2.out",
          scrollTrigger: {
            trigger: "[data-scene='certificates']",
            start: "top 58%",
            end: "bottom 40%",
            scrub: 1.3,
          },
        }
      );

      gsap.fromTo(
        "[data-road-line]",
        { scaleX: 0, transformOrigin: "left center" },
        {
          scaleX: 1,
          stagger: 0.08,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: "[data-scene='roadmap']",
            start: "top 62%",
          },
        }
      );

      gsap.fromTo(
        "[data-corridor-panel]",
        { autoAlpha: 0.12, z: -180, scale: 0.84 },
        {
          autoAlpha: 1,
          z: 0,
          scale: 1,
          stagger: 0.09,
          ease: "power2.out",
          scrollTrigger: {
            trigger: "[data-scene='corridor']",
            start: "top 60%",
            end: "bottom 30%",
            scrub: 1.5,
          },
        }
      );

      gsap.fromTo(
        "[data-tree-branch]",
        { scaleY: 0, autoAlpha: 0, transformOrigin: "bottom center" },
        {
          scaleY: 1,
          autoAlpha: 1,
          stagger: 0.12,
          duration: 1.4,
          ease: "power3.out",
          scrollTrigger: {
            trigger: "[data-scene='tree']",
            start: "top 58%",
          },
        }
      );

      ScrollTrigger.refresh();
    }, root);

    return () => {
      ctx.revert();
      window.removeEventListener("pointermove", moveCursor);
      if (lenisTicker) gsap.ticker.remove(lenisTicker);
      lenis?.destroy();
    };
  }, []);

  return (
    <div ref={rootRef} className="certifind-story relative overflow-hidden bg-black text-white">
      <div
        ref={cursorRef}
        className="pointer-events-none fixed left-0 top-0 z-[80] hidden h-12 w-12 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-200/40 bg-cyan-200/5 mix-blend-screen shadow-[0_0_36px_rgba(103,232,249,0.28)] lg:block"
        aria-hidden="true"
      />

      <section data-scene="void" className="cinematic-scene relative isolate flex min-h-[calc(100svh-4rem)] items-center overflow-hidden px-5 py-20 sm:px-8 lg:min-h-[calc(100svh-5rem)] lg:px-14">
        <VoidParticles />
        <div className="absolute inset-0 -z-20 bg-black" />
        <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-black to-transparent" aria-hidden="true" />

        <div className="mx-auto grid w-full max-w-[1440px] items-end gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(360px,0.55fr)]">
          <div>
            <p data-reveal className="mb-6 text-sm font-semibold uppercase text-cyan-200/[0.78]">
              CertiFind — From Learning to Legacy
            </p>
            <h1 data-reveal className="max-w-5xl text-5xl font-black leading-[0.92] text-white sm:text-7xl lg:text-8xl">
              Every career begins in darkness — with one question: where do I start?
            </h1>
          </div>

          <div data-reveal data-parallax-slow className="relative rounded-[2rem] border border-white/[0.12] bg-white/[0.03] p-6 shadow-[0_0_120px_rgba(103,232,249,0.08)] backdrop-blur-xl">
            <div className="absolute -inset-px rounded-[2rem] bg-[radial-gradient(circle_at_20%_0%,rgba(103,232,249,0.24),transparent_42%),radial-gradient(circle_at_80%_80%,rgba(139,92,246,0.20),transparent_45%)] opacity-70" aria-hidden="true" />
            <div className="relative">
              <p className="text-sm text-white/[0.54]">The first signal</p>
              <p className="mt-6 text-3xl font-black leading-tight text-white sm:text-4xl">CertiFind turns confusion into direction.</p>
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

      <section id="story-begins" data-scene="code" className="cinematic-scene relative isolate grid min-h-screen items-center overflow-hidden px-5 py-24 sm:px-8 lg:px-14">
        <div className="absolute inset-0 -z-20 bg-black" />
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_70%_38%,rgba(103,232,249,0.16),transparent_32%),radial-gradient(circle_at_18%_72%,rgba(139,92,246,0.15),transparent_34%)]" aria-hidden="true" />

        <div className="mx-auto grid w-full max-w-[1440px] items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p data-reveal className="text-sm font-semibold uppercase text-cyan-200/[0.76]">Scene Two</p>
            <h2 data-reveal className="mt-5 max-w-2xl text-4xl font-black leading-none text-white sm:text-6xl lg:text-7xl">
              From scattered skills, a path begins to form.
            </h2>
            <p data-reveal className="mt-7 max-w-xl text-lg leading-8 text-white/60">
              Code fragments resolve into real course tiles, shaped around the skills that move a learner forward.
            </p>
          </div>

          <div data-expand-frame className="cinematic-perspective relative min-h-[620px] rounded-[2.5rem] border border-white/10 bg-white/[0.025] p-5 shadow-[0_0_130px_rgba(103,232,249,0.07)] sm:p-8">
            <div className="absolute inset-0 rounded-[inherit] bg-[linear-gradient(135deg,rgba(255,255,255,0.08),transparent_42%),radial-gradient(circle_at_70%_20%,rgba(103,232,249,0.18),transparent_28%)]" aria-hidden="true" />
            <div className="relative grid h-full min-h-[560px] gap-5 lg:grid-cols-[0.8fr_1fr]">
              <div className="relative min-h-64 rounded-[2rem] border border-cyan-200/10 bg-black/[0.42] p-5">
                {codeFragments.map((fragment, index) => (
                  <div
                    key={fragment}
                    data-code-token
                    className="absolute rounded-xl border border-cyan-200/[0.22] bg-cyan-200/[0.08] px-4 py-3 font-mono text-sm font-bold text-cyan-100 shadow-[0_0_36px_rgba(103,232,249,0.16)]"
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

      <section data-scene="certificates" className="cinematic-scene relative isolate grid min-h-screen items-center overflow-hidden px-5 py-24 sm:px-8 lg:px-14">
        <div className="absolute inset-0 -z-20 bg-black" />
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_50%,rgba(247,215,116,0.14),transparent_34%),radial-gradient(circle_at_20%_20%,rgba(139,92,246,0.13),transparent_32%)]" aria-hidden="true" />

        <div className="mx-auto grid w-full max-w-[1440px] items-center gap-12 lg:grid-cols-[1.05fr_0.8fr]">
          <div data-parallax-slow className="cinematic-perspective relative min-h-[620px] rounded-[2.75rem] border border-yellow-200/[0.12] bg-white/[0.025]">
            <div data-orbit-ring className="absolute left-1/2 top-1/2 h-[440px] w-[440px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-yellow-200/[0.18] shadow-[0_0_80px_rgba(247,215,116,0.08)]" />
            {certificates.map((certificate, index) => (
              <CertificateCard key={certificate} label={certificate} index={index} />
            ))}
            <div className="absolute left-1/2 top-1/2 grid h-40 w-40 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-cyan-200/30 bg-black shadow-[0_0_70px_rgba(103,232,249,0.18)]">
              <GraduationCap className="h-14 w-14 text-cyan-100" />
            </div>
          </div>

          <div>
            <p data-reveal className="text-sm font-semibold uppercase text-yellow-100/[0.76]">Scene Three</p>
            <h2 data-reveal className="mt-5 max-w-2xl text-4xl font-black leading-none text-white sm:text-6xl lg:text-7xl">
              Every lesson becomes proof. Every certificate becomes power.
            </h2>
            <p data-reveal className="mt-7 max-w-xl text-lg leading-8 text-white/60">
              Course cards move into orbit, then ignite into credentials a learner can carry into the next chapter.
            </p>
          </div>
        </div>
      </section>

      <section data-scene="roadmap" className="cinematic-scene relative isolate grid min-h-screen items-center overflow-hidden px-5 py-24 sm:px-8 lg:px-14">
        <div className="absolute inset-0 -z-20 bg-black" />
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_65%_48%,rgba(103,232,249,0.14),transparent_36%),linear-gradient(180deg,rgba(139,92,246,0.08),transparent_45%)]" aria-hidden="true" />

        <div className="mx-auto grid w-full max-w-[1440px] items-center gap-12 lg:grid-cols-[0.78fr_1.12fr]">
          <div>
            <p data-reveal className="text-sm font-semibold uppercase text-cyan-200/[0.76]">Scene Four</p>
            <h2 data-reveal className="mt-5 max-w-2xl text-4xl font-black leading-none text-white sm:text-6xl lg:text-7xl">
              CertiFind does not just show courses. It reveals your next direction.
            </h2>
            <p data-reveal className="mt-7 max-w-xl text-lg leading-8 text-white/60">
              Certificates connect into roadmaps for roles that once felt distant, abstract, or hidden.
            </p>
          </div>

          <div data-parallax-deep className="relative min-h-[620px] rounded-[2.75rem] border border-white/10 bg-white/[0.025] p-6 shadow-[0_0_130px_rgba(139,92,246,0.08)]">
            <svg className="absolute inset-0 h-full w-full text-cyan-200/[0.26]" viewBox="0 0 900 620" aria-hidden="true">
              <path data-road-line d="M120 210 C270 130 420 130 540 168" stroke="currentColor" strokeWidth="2" fill="none" />
              <path data-road-line d="M545 168 C670 240 710 300 724 358" stroke="currentColor" strokeWidth="2" fill="none" />
              <path data-road-line d="M722 360 C560 430 420 444 272 438" stroke="currentColor" strokeWidth="2" fill="none" />
              <path data-road-line d="M272 438 C210 360 154 296 120 210" stroke="currentColor" strokeWidth="2" fill="none" />
            </svg>
            <div className="absolute left-1/2 top-1/2 grid h-28 w-28 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-white/[0.18] bg-black shadow-[0_0_70px_rgba(103,232,249,0.18)]">
              <Orbit className="h-10 w-10 text-cyan-100" />
            </div>
            {roadmapNodes.map((node) => (
              <RoadmapNode key={node.role} {...node} />
            ))}
          </div>
        </div>
      </section>

      <section data-scene="corridor" className="cinematic-scene relative isolate grid min-h-screen items-center overflow-hidden px-5 py-24 sm:px-8 lg:px-14">
        <div className="absolute inset-0 -z-20 bg-black" />
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_50%_0%,rgba(103,232,249,0.16),transparent_28%),linear-gradient(180deg,transparent,rgba(139,92,246,0.08)_70%,transparent)]" aria-hidden="true" />

        <div className="mx-auto grid w-full max-w-[1440px] items-center gap-12 lg:grid-cols-[1.05fr_0.8fr]">
          <div data-parallax-slow className="cinematic-corridor cinematic-perspective relative min-h-[640px] overflow-hidden rounded-[2.75rem] border border-cyan-200/10 bg-black shadow-[0_0_130px_rgba(103,232,249,0.07)]">
            <div className="absolute inset-x-[16%] bottom-0 top-14 bg-[linear-gradient(90deg,transparent,rgba(103,232,249,0.10),transparent)]" aria-hidden="true" />
            {[0, 1, 2, 3, 4].map((panel) => (
              <div
                key={panel}
                data-corridor-panel
                className="absolute left-1/2 top-1/2 h-[76%] w-[78%] -translate-x-1/2 -translate-y-1/2 rounded-[2rem] border border-cyan-200/[0.12]"
                style={{ transform: `translate(-50%, -50%) translateZ(${-panel * 95}px) scale(${1 - panel * 0.1})` }}
              />
            ))}
            <div className="absolute bottom-20 left-1/2 flex -translate-x-1/2 flex-col items-center">
              <div className="grid h-24 w-24 place-items-center rounded-full border border-cyan-200/[0.36] bg-cyan-200/10 shadow-[0_0_80px_rgba(103,232,249,0.25)]">
                <User className="h-10 w-10 text-cyan-100" />
              </div>
              <div className="mt-4 h-32 w-1 rounded-full bg-gradient-to-b from-cyan-200 to-transparent" />
            </div>
            <div className="absolute left-8 top-10 space-y-4 sm:left-12">
              {achievements.map((achievement) => (
                <div key={achievement} className="rounded-full border border-yellow-200/20 bg-yellow-200/[0.08] px-4 py-2 text-sm font-bold text-yellow-100 shadow-[0_0_32px_rgba(247,215,116,0.10)]">
                  {achievement}
                </div>
              ))}
            </div>
          </div>

          <div>
            <p data-reveal className="text-sm font-semibold uppercase text-violet-200/[0.76]">Scene Five</p>
            <h2 data-reveal className="mt-5 max-w-2xl text-5xl font-black leading-none text-white sm:text-7xl lg:text-8xl">
              Learn. Prove. Rise.
            </h2>
            <p data-reveal className="mt-7 max-w-xl text-lg leading-8 text-white/60">
              A learner moves forward through a black futuristic corridor while every completed milestone lights the path behind them.
            </p>
          </div>
        </div>
      </section>

      <section data-scene="tree" className="cinematic-scene relative isolate grid min-h-screen items-center overflow-hidden px-5 py-24 sm:px-8 lg:px-14">
        <div className="absolute inset-0 -z-20 bg-black" />
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_48%,rgba(103,232,249,0.15),transparent_32%),radial-gradient(circle_at_52%_58%,rgba(247,215,116,0.10),transparent_38%)]" aria-hidden="true" />

        <div className="mx-auto grid w-full max-w-[1440px] items-center gap-12 lg:grid-cols-[0.82fr_1fr]">
          <div>
            <p data-reveal className="text-sm font-semibold uppercase text-cyan-200/[0.76]">The Harvest</p>
            <h2 data-reveal className="mt-5 max-w-2xl text-5xl font-black leading-none text-white sm:text-7xl lg:text-8xl">
              Your future is not found. It is built.
            </h2>
            <p data-reveal className="mt-7 max-w-xl text-lg leading-8 text-white/60">
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
