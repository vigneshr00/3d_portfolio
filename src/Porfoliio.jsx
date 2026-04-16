import { useState, useEffect, useRef, useCallback } from "react";
import * as THREE from "three";

const ACCENT = "#00f0ff";
const ACCENT2 = "#7b2fff";
const BG = "#0a0a0f";
const SURFACE = "#12121a";
const SURFACE2 = "#1a1a2e";
const TEXT = "#e0e0e8";
const TEXT_DIM = "#8888a0";

const PROJECTS = [
    {
        title: "ShopFlow – E-Commerce Platform",
        desc: "Full-stack e-commerce app with Next.js SSR, Stripe payments, admin dashboard, and real-time inventory. Optimized for SEO with 95+ Lighthouse score.",
        tech: ["Next.js", "Node.js", "PostgreSQL", "Stripe", "Redux"],
        color: "#00f0ff",
    },
    {
        title: "TaskSync – Project Management Tool",
        desc: "Real-time collaborative project management with drag-and-drop Kanban boards, WebSocket updates, and role-based access control.",
        tech: ["React", "Express.js", "Socket.io", "MySQL", "JWT"],
        color: "#7b2fff",
    },
    {
        title: "HealthPulse – Fitness Tracker App",
        desc: "Cross-platform mobile app for tracking workouts, nutrition, and health metrics with beautiful charts and AI-powered recommendations.",
        tech: ["React Native", "Node.js", "MongoDB", "Chart.js"],
        color: "#ff2f7b",
    },
    {
        title: "DevConnect – Developer Social Network",
        desc: "A social platform for developers to share code snippets, collaborate on projects, and build professional profiles with GitHub integration.",
        tech: ["React", "GraphQL", "Node.js", "PostgreSQL"],
        color: "#f0ff00",
    },
];

const EXPERIENCES = [
    {
        role: "Frontend Developer",
        company: "Charles Technologies",
        period: "Jun 2025 – Present",
        points: [
            "Architected scalable web apps with React & Next.js, achieving major SEO improvements via SSR",
            "Built cross-platform mobile solutions using React Native for iOS & Android",
            "Implemented performance optimizations resulting in 40% faster page load times",
            "Built smart caching mechanisms reducing network overhead significantly",
        ],
    },
    {
        role: "Junior Software Developer",
        company: "VR Della",
        period: "Aug 2023 – Jun 2025",
        points: [
            "Developed full-stack apps with React frontend and Node.js/Express.js backend",
            "Designed secure JWT-based authentication with access/refresh tokens",
            "Optimized MySQL queries improving data retrieval performance by 35%",
            "Built reusable component libraries reducing development time by 30%",
        ],
    },
    // {
    //     role: "Freelance Full-Stack Developer",
    //     company: "Self-Employed",
    //     period: "2022 – Present",
    //     points: [
    //         "Delivered 5+ projects for clients across e-commerce, SaaS, and health-tech",
    //         "Built end-to-end solutions from database design to pixel-perfect frontends",
    //         "Specialized in rapid prototyping and MVP development for startups",
    //         "Maintained long-term client relationships with 100% satisfaction rate",
    //     ],
    // },
];

const SKILLS = {
    Frontend: ["React", "Next.js", "React Native", "Redux", "JavaScript ES6+", "HTML5", "CSS3", "SCSS", "Tailwind"],
    Backend: ["Node.js", "Express.js", "REST APIs", "JWT Auth", "Middleware", "WebSocket", "GraphQL"],
    Database: ["PostgreSQL", "MySQL", "MongoDB", "Redis"],
    "DevOps & Tools": ["Git", "Azure", "Docker", "CI/CD", "Agile/Scrum"],
    "AI & Vibe Coding": ["Claude AI", "Prompt Engineering", "AI-Assisted Development"],
};

const SKILL_COLORS = {
    Frontend: "#00f0ff",
    Backend: "#7b2fff",
    Database: "#ff2f7b",
    "DevOps & Tools": "#f0ff00",
    "AI & Vibe Coding": "#00ff7b",
};

// 3D Dark Cube Background — rotates on scroll
function ThreeBackground() {
    const mountRef = useRef(null);

    useEffect(() => {
        if (!mountRef.current) return;
        const container = mountRef.current;
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setClearColor(0x000000, 0);
        container.appendChild(renderer.domElement);

        // Main dark cube — wireframe with glowing edges
        const cubeSize = 5;
        const cubeGeo = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
        const cubeEdges = new THREE.EdgesGeometry(cubeGeo);
        const cubeMat = new THREE.LineBasicMaterial({ color: ACCENT, transparent: true, opacity: 0.35 });
        const cube = new THREE.LineSegments(cubeEdges, cubeMat);
        scene.add(cube);

        // Inner cube — smaller, different color, rotates opposite
        const innerGeo = new THREE.BoxGeometry(cubeSize * 0.55, cubeSize * 0.55, cubeSize * 0.55);
        const innerEdges = new THREE.EdgesGeometry(innerGeo);
        const innerMat = new THREE.LineBasicMaterial({ color: ACCENT2, transparent: true, opacity: 0.25 });
        const innerCube = new THREE.LineSegments(innerEdges, innerMat);
        scene.add(innerCube);

        // Outer cube — larger, faint
        const outerGeo = new THREE.BoxGeometry(cubeSize * 1.6, cubeSize * 1.6, cubeSize * 1.6);
        const outerEdges = new THREE.EdgesGeometry(outerGeo);
        const outerMat = new THREE.LineBasicMaterial({ color: "#ff2f7b", transparent: true, opacity: 0.1 });
        const outerCube = new THREE.LineSegments(outerEdges, outerMat);
        scene.add(outerCube);

        // Corner particles — dots at cube vertices
        const dotGeo = new THREE.BufferGeometry();
        const dotPositions = [];
        const half = cubeSize / 2;
        for (let x = -1; x <= 1; x += 2)
            for (let y = -1; y <= 1; y += 2)
                for (let z = -1; z <= 1; z += 2)
                    dotPositions.push(x * half, y * half, z * half);
        dotGeo.setAttribute("position", new THREE.Float32BufferAttribute(dotPositions, 3));
        const dotMat = new THREE.PointsMaterial({ color: ACCENT, size: 0.12, transparent: true, opacity: 0.8 });
        const dots = new THREE.Points(dotGeo, dotMat);
        scene.add(dots);

        // Floating dust particles
        const dustGeo = new THREE.BufferGeometry();
        const dustCount = 300;
        const dustPos = new Float32Array(dustCount * 3);
        for (let i = 0; i < dustCount * 3; i += 3) {
            dustPos[i] = (Math.random() - 0.5) * 30;
            dustPos[i + 1] = (Math.random() - 0.5) * 30;
            dustPos[i + 2] = (Math.random() - 0.5) * 30;
        }
        dustGeo.setAttribute("position", new THREE.Float32BufferAttribute(dustPos, 3));
        const dustMat = new THREE.PointsMaterial({ color: 0x667799, size: 0.02, transparent: true, opacity: 0.4 });
        const dust = new THREE.Points(dustGeo, dustMat);
        scene.add(dust);

        camera.position.z = 12;

        // Scroll tracking
        let scrollY = 0;
        let targetScrollY = 0;
        const onScroll = () => {
            const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
            targetScrollY = maxScroll > 0 ? window.scrollY / maxScroll : 0;
        };
        window.addEventListener("scroll", onScroll, { passive: true });

        // Mouse tracking
        let mouseX = 0, mouseY = 0;
        const onMouse = (e) => {
            mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
            mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
        };
        window.addEventListener("mousemove", onMouse);

        let frame;
        let time = 0;
        const animate = () => {
            frame = requestAnimationFrame(animate);
            time += 0.008;

            // Smooth scroll interpolation
            scrollY += (targetScrollY - scrollY) * 0.05;

            // Cube rotates based on scroll (full rotation over page scroll)
            const scrollAngle = scrollY * Math.PI * 4;
            cube.rotation.x = scrollAngle * 0.6 + time * 0.1;
            cube.rotation.y = scrollAngle + time * 0.15;
            cube.rotation.z = scrollAngle * 0.3;

            // Inner cube — opposite & faster
            innerCube.rotation.x = -scrollAngle * 0.8 + time * 0.2;
            innerCube.rotation.y = -scrollAngle * 1.2 + time * 0.1;
            innerCube.rotation.z = scrollAngle * 0.5;

            // Outer cube — slow, subtle
            outerCube.rotation.x = scrollAngle * 0.2 + time * 0.03;
            outerCube.rotation.y = scrollAngle * 0.3 + time * 0.05;

            // Corner dots follow main cube
            dots.rotation.copy(cube.rotation);

            // Dust drift
            dust.rotation.y += 0.0002;
            dust.rotation.x += 0.0001;

            // Mouse parallax on camera
            camera.position.x += (mouseX * 0.8 - camera.position.x) * 0.02;
            camera.position.y += (-mouseY * 0.6 - camera.position.y) * 0.02;
            camera.lookAt(scene.position);

            renderer.render(scene, camera);
        };
        animate();

        const onResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };
        window.addEventListener("resize", onResize);

        return () => {
            cancelAnimationFrame(frame);
            window.removeEventListener("scroll", onScroll);
            window.removeEventListener("mousemove", onMouse);
            window.removeEventListener("resize", onResize);
            if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
            renderer.dispose();
        };
    }, []);

    return <div ref={mountRef} style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", zIndex: 0 }} />;
}

// Animated section wrapper
function Section({ children, id }) {
    const ref = useRef(null);
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.1 });
        if (ref.current) obs.observe(ref.current);
        return () => obs.disconnect();
    }, []);
    return (
        <section ref={ref} id={id} style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(40px)", transition: "all 0.8s cubic-bezier(.22,1,.36,1)", position: "relative", zIndex: 2, padding: "80px 0" }}>
            {children}
        </section>
    );
}

function GlowText({ children, style }) {
    return <span style={{ background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT2})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", ...style }}>{children}</span>;
}

function SkillRow({ category, items, color, delay }) {
    const ref = useRef(null);
    const [visible, setVisible] = useState(false);
    const [hovered, setHovered] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 600);

    useEffect(() => {
        const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.2 });
        if (ref.current) obs.observe(ref.current);
        const onResize = () => setIsMobile(window.innerWidth <= 600);
        window.addEventListener("resize", onResize);
        return () => { obs.disconnect(); window.removeEventListener("resize", onResize); };
    }, []);

    return (
        <div ref={ref} style={{ perspective: 800, width: "100%" }}>
            <div
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                style={{
                    animation: visible ? `flipIn 0.7s cubic-bezier(.22,1,.36,1) ${delay}s both` : "none",
                    opacity: visible ? undefined : 0,
                    cursor: "pointer",
                    display: "flex",
                    flexDirection: isMobile ? "column" : "row",
                    alignItems: isMobile ? "flex-start" : "center",
                    gap: isMobile ? 12 : 20,
                    background: hovered ? `${color}08` : `${SURFACE}cc`,
                    border: `1px solid ${hovered ? color + "44" : SURFACE2}`,
                    borderRadius: 16,
                    padding: isMobile ? "16px 16px" : "18px 24px",
                    backdropFilter: "blur(10px)",
                    transition: "all 0.4s cubic-bezier(.22,1,.36,1)",
                    boxShadow: hovered ? `0 4px 24px ${color}15` : "none",
                }}
            >
                {/* Category label */}
                <div style={{
                    fontFamily: "'JetBrains Mono'",
                    fontSize: isMobile ? 13 : 14,
                    fontWeight: 700,
                    color: color,
                    letterSpacing: 1,
                    flexShrink: 0,
                    borderRight: isMobile ? "none" : `2px solid ${color}33`,
                    borderBottom: isMobile ? `2px solid ${color}33` : "none",
                    paddingRight: isMobile ? 0 : 20,
                    paddingBottom: isMobile ? 8 : 0,
                    width: isMobile ? "100%" : "auto",
                    minWidth: isMobile ? "auto" : 160,
                }}>{category}</div>

                {/* Tech items in a row */}
                <div style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: isMobile ? 6 : 8,
                    flex: 1,
                    width: isMobile ? "100%" : "auto",
                }}>
                    {items.map((s, i) => (
                        <span key={s} style={{
                            fontFamily: "'JetBrains Mono'",
                            fontSize: isMobile ? 11 : 12,
                            color: hovered ? TEXT : TEXT_DIM,
                            background: hovered ? `${color}15` : SURFACE2,
                            padding: isMobile ? "5px 10px" : "6px 14px",
                            borderRadius: 20,
                            border: `1px solid ${hovered ? color + "33" : color + "11"}`,
                            whiteSpace: "nowrap",
                            transition: "all 0.3s ease",
                            transitionDelay: hovered ? `${i * 0.03}s` : "0s",
                        }}>{s}</span>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default function Portfolio() {
    const [activeNav, setActiveNav] = useState("home");
    const [formData, setFormData] = useState({ name: "", mobile: "", email: "", description: "" });
    const [formStatus, setFormStatus] = useState("");
    const [mobileMenu, setMobileMenu] = useState(false);

    const navItems = ["home", "about", "experience", "skills", "contact"];

    useEffect(() => {
        const handleScroll = () => {
            for (const id of [...navItems].reverse()) {
                const el = document.getElementById(id);
                if (el && el.getBoundingClientRect().top < 200) { setActiveNav(id); break; }
            }
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollTo = (id) => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
        setMobileMenu(false);
    };

    const [sending, setSending] = useState(false);

    const handleSubmit = useCallback(async () => {
        if (!formData.name || !formData.email) { setFormStatus("Please fill in name and email."); return; }
        setSending(true);
        setFormStatus("");
        try {
            const res = await fetch("https://formspree.io/f/mzdyedev", {
                method: "POST",
                headers: { "Content-Type": "application/json", Accept: "application/json" },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    mobile: formData.mobile || "N/A",
                    message: formData.description || "No message provided.",
                    _subject: `Portfolio Inquiry from ${formData.name}`,
                }),
            });
            if (res.ok) {
                setFormStatus("Message sent successfully! Thank you!");
                setFormData({ name: "", mobile: "", email: "", description: "" });
            } else {
                setFormStatus("Something went wrong. Please try again.");
            }
        } catch {
            setFormStatus("Network error. Please try again later.");
        }
        setSending(false);
        setTimeout(() => setFormStatus(""), 5000);
    }, [formData]);

    const css = `
    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;700&display=swap');
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html { scroll-behavior: smooth; }
    body { background: #050510; color: ${TEXT}; font-family: 'Outfit', sans-serif; overflow-x: hidden; }
    ::-webkit-scrollbar { width: 6px; }
    ::-webkit-scrollbar-track { background: ${BG}; }
    ::-webkit-scrollbar-thumb { background: ${ACCENT2}; border-radius: 3px; }
    ::selection { background: ${ACCENT}33; color: ${ACCENT}; }
    @keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-12px); } }
    @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.5; } }
    @keyframes slideRight { from { width: 0; } to { width: 100%; } }
    @keyframes typing { from { width: 0; } to { width: 100%; } }
    @keyframes blink { 50% { border-color: transparent; } }
    @keyframes glow { 0%,100% { box-shadow: 0 0 20px ${ACCENT}33; } 50% { box-shadow: 0 0 40px ${ACCENT}55; } }
    @keyframes flipIn { from { transform: rotateX(90deg); opacity: 0; } to { transform: rotateX(0deg); opacity: 1; } }
  `;

    return (
        <div style={{ background: `radial-gradient(ellipse at 50% 0%, #0d1a2d 0%, #050510 60%)`, minHeight: "100vh", position: "relative" }}>
            <style>{css}</style>
            <ThreeBackground />

            {/* NAV */}
            <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, background: `${BG}dd`, backdropFilter: "blur(20px)", borderBottom: `1px solid ${SURFACE2}` }}>
                <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", display: "flex", justifyContent: "space-between", alignItems: "center", height: 64 }}>
                    <div onClick={() => scrollTo("home")} style={{
                        width: 40, height: 40, borderRadius: 12, cursor: "pointer",
                        background: `linear-gradient(135deg, ${ACCENT}22, ${ACCENT2}22)`,
                        border: `2px solid ${ACCENT}66`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontFamily: "'JetBrains Mono'", fontWeight: 900, fontSize: 22,
                        transition: "all 0.3s",
                    }}>
                        <GlowText>{"VR"}</GlowText>
                    </div>
                    {/* Desktop nav */}
                    <div style={{ display: "flex", gap: 8 }} className="desktop-nav">
                        {navItems.map(item => (
                            <button key={item} onClick={() => scrollTo(item)} style={{
                                background: activeNav === item ? `${ACCENT}15` : "transparent",
                                border: activeNav === item ? `1px solid ${ACCENT}44` : "1px solid transparent",
                                color: activeNav === item ? ACCENT : TEXT_DIM,
                                padding: "6px 16px", borderRadius: 20, cursor: "pointer",
                                fontFamily: "'Outfit'", fontSize: 13, fontWeight: 500, textTransform: "capitalize",
                                transition: "all 0.3s",
                            }}>{item}</button>
                        ))}
                    </div>
                    {/* Mobile burger */}
                    <div style={{ display: "none", cursor: "pointer", flexDirection: "column", gap: 4 }} className="mobile-burger" onClick={() => setMobileMenu(!mobileMenu)}>
                        <div style={{ width: 24, height: 2, background: ACCENT, transition: "0.3s", transform: mobileMenu ? "rotate(45deg) translate(4px,4px)" : "none" }} />
                        <div style={{ width: 24, height: 2, background: ACCENT, transition: "0.3s", opacity: mobileMenu ? 0 : 1 }} />
                        <div style={{ width: 24, height: 2, background: ACCENT, transition: "0.3s", transform: mobileMenu ? "rotate(-45deg) translate(4px,-4px)" : "none" }} />
                    </div>
                </div>
                {mobileMenu && (
                    <div style={{ background: `${BG}f5`, backdropFilter: "blur(20px)", padding: 16, display: "flex", flexDirection: "column", gap: 4 }}>
                        {navItems.map(item => (
                            <button key={item} onClick={() => scrollTo(item)} style={{
                                background: activeNav === item ? `${ACCENT}15` : "transparent",
                                border: "none", color: activeNav === item ? ACCENT : TEXT_DIM,
                                padding: "10px 16px", borderRadius: 8, cursor: "pointer",
                                fontFamily: "'Outfit'", fontSize: 15, fontWeight: 500, textTransform: "capitalize", textAlign: "left",
                            }}>{item}</button>
                        ))}
                    </div>
                )}
                <style>{`
          @media(max-width:768px) { .desktop-nav { display: none !important; } .mobile-burger { display: flex !important; } }
        `}</style>
            </nav>

            <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>

                {/* HERO */}
                <section id="home" style={{ minHeight: "100vh", display: "flex", alignItems: "center", position: "relative", zIndex: 2, paddingTop: 80 }}>
                    <div style={{ width: "100%" }}>
                        <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 13, color: ACCENT, marginBottom: 16, letterSpacing: 3 }}>
                            <span style={{ animation: "pulse 2s infinite" }}>●</span> AVAILABLE FOR WORK
                        </div>
                        <h1 style={{ fontSize: "clamp(40px, 7vw, 80px)", fontWeight: 900, lineHeight: 1.05, marginBottom: 20 }}>
                            <span style={{ color: TEXT }}>Hi, I'm </span>
                            <GlowText>Vignesh R</GlowText>
                        </h1>
                        <div style={{ fontFamily: "'JetBrains Mono'", fontSize: "clamp(14px, 2vw, 18px)", color: TEXT_DIM, marginBottom: 32, display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                            <span style={{ color: ACCENT }}>{">"}</span> Full-Stack Developer
                            <span style={{ color: ACCENT2 }}>|</span> Vibe Coder
                            <span style={{ color: ACCENT2 }}>|</span> Freelancer
                        </div>
                        <p style={{ fontSize: 17, color: TEXT_DIM, maxWidth: 600, lineHeight: 1.7, marginBottom: 40 }}>
                            Crafting scalable web experiences with React, Next.js & Node.js. 3+ years turning complex problems into elegant, performant solutions. I don't just write code — I vibe with it.
                        </p>
                        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                            <button onClick={() => scrollTo("contact")} style={{
                                background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT2})`,
                                border: "none", color: BG, padding: "14px 32px", borderRadius: 30, cursor: "pointer",
                                fontFamily: "'Outfit'", fontSize: 15, fontWeight: 700, letterSpacing: 0.5,
                                transition: "all 0.3s", animation: "glow 3s infinite",
                            }}>Let's Connect</button>
                            {/* <button onClick={() => scrollTo("projects")} style={{
                                background: "transparent", border: `1px solid ${ACCENT}55`, color: ACCENT,
                                padding: "14px 32px", borderRadius: 30, cursor: "pointer",
                                fontFamily: "'Outfit'", fontSize: 15, fontWeight: 600, transition: "all 0.3s",
                            }}>View Projects</button> */}
                        </div>
                        <div style={{ display: "flex", gap: 40, marginTop: 56, flexWrap: "wrap" }}>
                            {[["3+", "Years Exp."], ["95%+", "Code Review Rate"]].map(([n, l]) => (
                                <div key={l}>
                                    <div style={{ fontSize: 32, fontWeight: 800 }}><GlowText>{n}</GlowText></div>
                                    <div style={{ fontSize: 13, color: TEXT_DIM, marginTop: 4 }}>{l}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ABOUT */}
                <Section id="about">
                    <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 12, color: ACCENT, letterSpacing: 3, marginBottom: 8 }}>01 // ABOUT ME</div>
                    <h2 style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 800, marginBottom: 32 }}>
                        Developer, <GlowText>Vibe Coder</GlowText>, Problem Solver
                    </h2>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
                        <div style={{ background: `${SURFACE}cc`, border: `1px solid ${SURFACE2}`, borderRadius: 16, padding: 28, backdropFilter: "blur(10px)" }}>
                            <div style={{ fontSize: 28, marginBottom: 12 }}>⚡</div>
                            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 10 }}>Full-Stack Mastery</h3>
                            <p style={{ fontSize: 14, color: TEXT_DIM, lineHeight: 1.7 }}>
                                From designing robust database schemas to crafting pixel-perfect UIs — I own the entire stack. React, Next.js, Node.js, Express.js, PostgreSQL, and MySQL are my daily drivers. I build APIs, optimize queries, and architect systems that scale.
                            </p>
                        </div>
                        <div style={{ background: `${SURFACE}cc`, border: `1px solid ${SURFACE2}`, borderRadius: 16, padding: 28, backdropFilter: "blur(10px)" }}>
                            <div style={{ fontSize: 28, marginBottom: 12 }}>🎯</div>
                            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 10 }}>Vibe Coding Philosophy</h3>
                            <p style={{ fontSize: 14, color: TEXT_DIM, lineHeight: 1.7 }}>
                                I believe great software is built when you're in flow state. I leverage AI tools, modern workflows, and intuitive coding practices to ship faster without sacrificing quality. Clean code isn't just a practice — it's a vibe.
                            </p>
                        </div>
                        {/* <div style={{ background: `${SURFACE}cc`, border: `1px solid ${SURFACE2}`, borderRadius: 16, padding: 28, backdropFilter: "blur(10px)" }}>
                            <div style={{ fontSize: 28, marginBottom: 12 }}>🚀</div>
                            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 10 }}>Freelance & Beyond</h3>
                            <p style={{ fontSize: 14, color: TEXT_DIM, lineHeight: 1.7 }}>
                                Beyond my full-time roles, I've delivered 5+ freelance projects for clients worldwide — from MVPs for startups to production apps for established businesses. I thrive on turning ideas into shipped products.
                            </p>
                        </div> */}
                    </div>
                </Section>

                {/* EXPERIENCE */}
                <Section id="experience">
                    <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 12, color: ACCENT, letterSpacing: 3, marginBottom: 8 }}>02 // EXPERIENCE</div>
                    <h2 style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 800, marginBottom: 40 }}>
                        Where I've <GlowText>Built Things</GlowText>
                    </h2>
                    <div style={{ position: "relative" }}>
                        <div style={{ position: "absolute", left: 16, top: 0, bottom: 0, width: 2, background: `linear-gradient(to bottom, ${ACCENT}, ${ACCENT2})`, opacity: 0.3 }} />
                        {EXPERIENCES.map((exp, i) => (
                            <div key={i} style={{ position: "relative", paddingLeft: 52, marginBottom: 40 }}>
                                <div style={{
                                    position: "absolute", left: 8, top: 8, width: 18, height: 18, borderRadius: "50%",
                                    background: i === 0 ? ACCENT : ACCENT2, border: `3px solid ${BG}`,
                                    boxShadow: `0 0 15px ${i === 0 ? ACCENT : ACCENT2}55`,
                                }} />
                                <div style={{
                                    background: `${SURFACE}cc`, border: `1px solid ${SURFACE2}`, borderRadius: 16, padding: 28,
                                    backdropFilter: "blur(10px)", transition: "all 0.3s",
                                }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
                                        <div>
                                            <h3 style={{ fontSize: 20, fontWeight: 700 }}>{exp.role}</h3>
                                            <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 14, color: ACCENT }}>{exp.company}</div>
                                        </div>
                                        <div style={{
                                            fontFamily: "'JetBrains Mono'", fontSize: 12, color: TEXT_DIM,
                                            background: `${SURFACE2}`, padding: "4px 12px", borderRadius: 20,
                                        }}>{exp.period}</div>
                                    </div>
                                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                        {exp.points.map((p, j) => (
                                            <div key={j} style={{ display: "flex", gap: 10, fontSize: 14, color: TEXT_DIM, lineHeight: 1.6 }}>
                                                <span style={{ color: ACCENT, flexShrink: 0, marginTop: 2 }}>▹</span>
                                                <span>{p}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    {/* Education */}
                    <div style={{ marginTop: 20, background: `${SURFACE}cc`, border: `1px solid ${SURFACE2}`, borderRadius: 16, padding: 28, backdropFilter: "blur(10px)" }}>
                        <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 12, color: ACCENT2, letterSpacing: 2, marginBottom: 12 }}>EDUCATION</div>
                        <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
                            <div>
                                <h3 style={{ fontSize: 17, fontWeight: 700 }}>B.E. Computer Science & Engineering</h3>
                                <div style={{ fontSize: 14, color: TEXT_DIM }}>Bannari Amman Institute of Technology, Erode</div>
                                <div style={{ fontSize: 13, color: ACCENT, fontFamily: "'JetBrains Mono'", marginTop: 4 }}>2018 – 2022 · CGPA: 7.3/10</div>
                            </div>
                            <div>
                                <h3 style={{ fontSize: 17, fontWeight: 700 }}>HSC</h3>
                                <div style={{ fontSize: 14, color: TEXT_DIM }}>Chellamal Matriculation HSS, Trichy</div>
                                <div style={{ fontSize: 13, color: ACCENT, fontFamily: "'JetBrains Mono'", marginTop: 4 }}>2017 – 2018 · 92%</div>
                            </div>
                        </div>
                    </div>
                </Section>

                {/* PROJECTS — commented out for now
                <Section id="projects">
                    <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 12, color: ACCENT, letterSpacing: 3, marginBottom: 8 }}>03 // PROJECTS</div>
                    <h2 style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 800, marginBottom: 40 }}>
                        Things I've <GlowText>Shipped</GlowText>
                    </h2>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 20 }}>
                        {PROJECTS.map((p, i) => (
                            <div key={i} style={{
                                background: `${SURFACE}cc`, border: `1px solid ${SURFACE2}`, borderRadius: 16, padding: 28,
                                backdropFilter: "blur(10px)", transition: "all 0.4s", cursor: "pointer", position: "relative", overflow: "hidden",
                            }}
                                onMouseEnter={e => { e.currentTarget.style.borderColor = p.color + "66"; e.currentTarget.style.transform = "translateY(-4px)"; }}
                                onMouseLeave={e => { e.currentTarget.style.borderColor = SURFACE2; e.currentTarget.style.transform = "translateY(0)"; }}
                            >
                                <div style={{
                                    position: "absolute", top: -40, right: -40, width: 100, height: 100,
                                    background: `radial-gradient(circle, ${p.color}15 0%, transparent 70%)`,
                                }} />
                                <div style={{ width: 36, height: 4, background: p.color, borderRadius: 2, marginBottom: 16 }} />
                                <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 10 }}>{p.title}</h3>
                                <p style={{ fontSize: 13, color: TEXT_DIM, lineHeight: 1.7, marginBottom: 16 }}>{p.desc}</p>
                                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                                    {p.tech.map(t => (
                                        <span key={t} style={{
                                            fontFamily: "'JetBrains Mono'", fontSize: 11, color: p.color,
                                            background: p.color + "12", padding: "3px 10px", borderRadius: 12,
                                            border: `1px solid ${p.color}25`,
                                        }}>{t}</span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </Section>
                */}

                {/* SKILLS */}
                <Section id="skills">
                    <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 12, color: ACCENT, letterSpacing: 3, marginBottom: 8 }}>04 // SKILLS</div>
                    <h2 style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 800, marginBottom: 16 }}>
                        My <GlowText>Arsenal</GlowText>
                    </h2>
                    <p style={{ fontSize: 14, color: TEXT_DIM, marginBottom: 40 }}>Hover on a domain to explore the technologies</p>
                    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                        {Object.entries(SKILLS).map(([cat, items], ci) => (
                            <SkillRow key={cat} category={cat} items={items} color={SKILL_COLORS[cat]} delay={ci * 0.12} />
                        ))}
                    </div>
                </Section>

                {/* CONTACT */}
                <Section id="contact">
                    <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 12, color: ACCENT, letterSpacing: 3, marginBottom: 8 }}>05 // CONTACT</div>
                    <h2 style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 800, marginBottom: 12 }}>
                        Let's <GlowText>Build Together</GlowText>
                    </h2>
                    <p style={{ fontSize: 15, color: TEXT_DIM, marginBottom: 40, maxWidth: 500 }}>
                        Have a project idea or need a developer? Drop your details and I'll get back to you.
                    </p>
                    <div style={{ maxWidth: 560, background: `${SURFACE}cc`, border: `1px solid ${SURFACE2}`, borderRadius: 20, padding: 32, backdropFilter: "blur(10px)" }}>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                            {[["name", "Your Name *", "text"], ["mobile", "Mobile Number", "tel"]].map(([key, label, type]) => (
                                <div key={key}>
                                    <label style={{ fontSize: 12, color: TEXT_DIM, fontFamily: "'JetBrains Mono'", display: "block", marginBottom: 6 }}>{label}</label>
                                    <input
                                        type={type} value={formData[key]}
                                        onChange={e => setFormData(p => ({ ...p, [key]: e.target.value }))}
                                        style={{
                                            width: "100%", background: SURFACE2, border: `1px solid ${SURFACE2}`, borderRadius: 10,
                                            padding: "12px 16px", color: TEXT, fontSize: 14, fontFamily: "'Outfit'",
                                            outline: "none", transition: "border 0.3s",
                                        }}
                                        onFocus={e => e.target.style.borderColor = ACCENT + "66"}
                                        onBlur={e => e.target.style.borderColor = SURFACE2}
                                    />
                                </div>
                            ))}
                        </div>
                        <div style={{ marginBottom: 16 }}>
                            <label style={{ fontSize: 12, color: TEXT_DIM, fontFamily: "'JetBrains Mono'", display: "block", marginBottom: 6 }}>Email Address *</label>
                            <input
                                type="email" value={formData.email}
                                onChange={e => setFormData(p => ({ ...p, email: e.target.value }))}
                                style={{
                                    width: "100%", background: SURFACE2, border: `1px solid ${SURFACE2}`, borderRadius: 10,
                                    padding: "12px 16px", color: TEXT, fontSize: 14, fontFamily: "'Outfit'",
                                    outline: "none", transition: "border 0.3s",
                                }}
                                onFocus={e => e.target.style.borderColor = ACCENT + "66"}
                                onBlur={e => e.target.style.borderColor = SURFACE2}
                            />
                        </div>
                        <div style={{ marginBottom: 20 }}>
                            <label style={{ fontSize: 12, color: TEXT_DIM, fontFamily: "'JetBrains Mono'", display: "block", marginBottom: 6 }}>Project Description</label>
                            <textarea
                                rows={4} value={formData.description}
                                onChange={e => setFormData(p => ({ ...p, description: e.target.value }))}
                                style={{
                                    width: "100%", background: SURFACE2, border: `1px solid ${SURFACE2}`, borderRadius: 10,
                                    padding: "12px 16px", color: TEXT, fontSize: 14, fontFamily: "'Outfit'",
                                    outline: "none", resize: "vertical", transition: "border 0.3s",
                                }}
                                onFocus={e => e.target.style.borderColor = ACCENT + "66"}
                                onBlur={e => e.target.style.borderColor = SURFACE2}
                            />
                        </div>
                        <button onClick={handleSubmit} disabled={sending} style={{
                            width: "100%", background: sending ? `${SURFACE2}` : `linear-gradient(135deg, ${ACCENT}, ${ACCENT2})`,
                            border: "none", color: sending ? TEXT_DIM : BG, padding: "14px 0", borderRadius: 12,
                            cursor: sending ? "not-allowed" : "pointer",
                            fontFamily: "'Outfit'", fontSize: 15, fontWeight: 700, letterSpacing: 0.5, transition: "all 0.3s",
                        }}>
                            {sending ? "Sending..." : "Send Message →"}
                        </button>
                        {formStatus && (
                            <div style={{ marginTop: 12, fontSize: 13, fontFamily: "'JetBrains Mono'", color: formStatus.includes("success") ? "#00ff7b" : "#ff2f7b", textAlign: "center" }}>
                                {formStatus}
                            </div>
                        )}
                    </div>
                    <div style={{ marginTop: 32, display: "flex", gap: 24, flexWrap: "wrap" }}>
                        <a href="tel:+918110968283" style={{ color: TEXT_DIM, fontSize: 14, textDecoration: "none", display: "flex", alignItems: "center", gap: 8 }}>
                            <span style={{ color: ACCENT }}>📱</span> +91 8110968283
                        </a>
                        <a href="mailto:vignesh009612@gmail.com" style={{ color: TEXT_DIM, fontSize: 14, textDecoration: "none", display: "flex", alignItems: "center", gap: 8 }}>
                            <span style={{ color: ACCENT }}>✉️</span> vignesh009612@gmail.com
                        </a>
                        <a href="https://www.linkedin.com/in/vignesh-r-18781b171/" target="_blank" rel="noopener noreferrer" style={{ color: TEXT_DIM, fontSize: 14, textDecoration: "none", display: "flex", alignItems: "center", gap: 8 }}>
                            <span style={{ color: ACCENT }}>🔗</span> LinkedIn
                        </a>
                    </div>
                </Section>

                {/* FOOTER */}
                <footer style={{ position: "relative", zIndex: 2, borderTop: `1px solid ${SURFACE2}`, padding: "32px 0", marginTop: 40, textAlign: "center" }}>
                    <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 13, color: TEXT_DIM }}>
                        <GlowText style={{ fontWeight: 700 }}>{"V"}</GlowText>
                        <span style={{ margin: "0 12px", opacity: 0.3 }}>|</span>
                        Built with ⚡ by Vignesh R · {new Date().getFullYear()}
                    </div>
                    <div style={{ fontSize: 12, color: TEXT_DIM, marginTop: 8, opacity: 0.5 }}>Trichy, India</div>
                </footer>
            </div>
        </div>
    );
}