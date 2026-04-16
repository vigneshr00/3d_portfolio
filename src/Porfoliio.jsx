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
    {
        title: "InvoiceGen – Freelance Invoice System",
        desc: "Automated invoicing system built for freelancers with PDF generation, payment tracking, client management, and recurring billing support.",
        tech: ["Next.js", "Express.js", "MySQL", "PDFKit"],
        color: "#00ff7b",
    },
    {
        title: "ChatBot AI – Customer Support Bot",
        desc: "AI-powered customer support chatbot with natural language processing, escalation workflows, and analytics dashboard for businesses.",
        tech: ["React", "Node.js", "OpenAI API", "Redis", "WebSocket"],
        color: "#ff7b2f",
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
    {
        role: "Freelance Full-Stack Developer",
        company: "Self-Employed",
        period: "2022 – Present",
        points: [
            "Delivered 15+ projects for clients across e-commerce, SaaS, and health-tech",
            "Built end-to-end solutions from database design to pixel-perfect frontends",
            "Specialized in rapid prototyping and MVP development for startups",
            "Maintained long-term client relationships with 100% satisfaction rate",
        ],
    },
];

const SKILLS = {
    Frontend: ["React", "Next.js", "React Native", "Redux", "JavaScript ES6+", "HTML5", "CSS3", "SCSS", "Tailwind"],
    Backend: ["Node.js", "Express.js", "REST APIs", "JWT Auth", "Middleware", "WebSocket", "GraphQL"],
    Database: ["PostgreSQL", "MySQL", "MongoDB", "Redis", "Query Optimization"],
    "DevOps & Tools": ["Git", "Azure", "Docker", "CI/CD", "Agile/Scrum", "Vibe Coding"],
};

// 3D Background Component
function ThreeBackground() {
    const mountRef = useRef(null);

    useEffect(() => {
        if (!mountRef.current) return;
        const container = mountRef.current;
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setClearColor(0x000000, 0);
        container.appendChild(renderer.domElement);

        // Particles with size variation
        const particlesGeo = new THREE.BufferGeometry();
        const count = 2000;
        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);
        const sizes = new Float32Array(count);
        const palette = [new THREE.Color(ACCENT), new THREE.Color(ACCENT2), new THREE.Color("#ff2f7b"), new THREE.Color("#00ff7b")];
        for (let i = 0; i < count; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 50;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 50;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 50;
            const c = palette[Math.floor(Math.random() * palette.length)];
            colors[i * 3] = c.r; colors[i * 3 + 1] = c.g; colors[i * 3 + 2] = c.b;
            sizes[i] = Math.random() * 0.08 + 0.02;
        }
        particlesGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
        particlesGeo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
        particlesGeo.setAttribute("size", new THREE.BufferAttribute(sizes, 1));
        const particlesMat = new THREE.PointsMaterial({ size: 0.05, vertexColors: true, transparent: true, opacity: 0.8, sizeAttenuation: true });
        const particles = new THREE.Points(particlesGeo, particlesMat);
        scene.add(particles);

        // Wireframe shapes with improved glow
        const torusGeo = new THREE.TorusGeometry(3.5, 1, 20, 60);
        const torusMat = new THREE.MeshBasicMaterial({ color: ACCENT, wireframe: true, transparent: true, opacity: 0.18 });
        const torus = new THREE.Mesh(torusGeo, torusMat);
        torus.position.set(10, 3, -12);
        scene.add(torus);

        const icoGeo = new THREE.IcosahedronGeometry(2.5, 1);
        const icoMat = new THREE.MeshBasicMaterial({ color: ACCENT2, wireframe: true, transparent: true, opacity: 0.2 });
        const ico = new THREE.Mesh(icoGeo, icoMat);
        ico.position.set(-9, -4, -10);
        scene.add(ico);

        const octGeo = new THREE.OctahedronGeometry(2, 0);
        const octMat = new THREE.MeshBasicMaterial({ color: "#ff2f7b", wireframe: true, transparent: true, opacity: 0.15 });
        const oct = new THREE.Mesh(octGeo, octMat);
        oct.position.set(6, -6, -8);
        scene.add(oct);

        // Extra shape - dodecahedron
        const dodGeo = new THREE.DodecahedronGeometry(1.8, 0);
        const dodMat = new THREE.MeshBasicMaterial({ color: "#00ff7b", wireframe: true, transparent: true, opacity: 0.12 });
        const dod = new THREE.Mesh(dodGeo, dodMat);
        dod.position.set(-5, 5, -9);
        scene.add(dod);

        camera.position.z = 8;
        let mouseX = 0, mouseY = 0;
        const onMouse = (e) => { mouseX = (e.clientX / window.innerWidth - 0.5) * 2; mouseY = (e.clientY / window.innerHeight - 0.5) * 2; };
        window.addEventListener("mousemove", onMouse);

        let frame;
        let time = 0;
        const animate = () => {
            frame = requestAnimationFrame(animate);
            time += 0.01;
            particles.rotation.y += 0.0004;
            particles.rotation.x += 0.0002;
            // Gentle floating motion for shapes
            torus.rotation.x += 0.003;
            torus.rotation.y += 0.005;
            torus.position.y = 3 + Math.sin(time * 0.5) * 0.8;
            ico.rotation.x += 0.004;
            ico.rotation.z += 0.003;
            ico.position.y = -4 + Math.sin(time * 0.7 + 1) * 0.6;
            oct.rotation.y += 0.006;
            oct.rotation.x += 0.002;
            oct.position.y = -6 + Math.sin(time * 0.6 + 2) * 0.5;
            dod.rotation.x += 0.003;
            dod.rotation.z += 0.004;
            dod.position.y = 5 + Math.sin(time * 0.4 + 3) * 0.7;
            camera.position.x += (mouseX * 0.6 - camera.position.x) * 0.02;
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

export default function Portfolio() {
    const [activeNav, setActiveNav] = useState("home");
    const [formData, setFormData] = useState({ name: "", mobile: "", email: "", description: "" });
    const [formStatus, setFormStatus] = useState("");
    const [mobileMenu, setMobileMenu] = useState(false);

    const navItems = ["home", "about", "experience", "projects", "skills", "contact"];

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
            const res = await fetch("https://formspree.io/f/YOUR_FORM_ID", {
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
    body { background: ${BG}; color: ${TEXT}; font-family: 'Outfit', sans-serif; overflow-x: hidden; }
    @keyframes gradientShift { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
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
  `;

    return (
        <div style={{ background: `linear-gradient(135deg, #0a0a1a 0%, #0d0d2b 25%, #0a0a1a 50%, #1a0a2e 75%, #0a0a1a 100%)`, backgroundSize: "400% 400%", animation: "gradientShift 15s ease infinite", minHeight: "100vh", position: "relative" }}>
            <style>{css}</style>
            <ThreeBackground />

            {/* NAV */}
            <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, background: `${BG}dd`, backdropFilter: "blur(20px)", borderBottom: `1px solid ${SURFACE2}` }}>
                <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", display: "flex", justifyContent: "space-between", alignItems: "center", height: 64 }}>
                    <div style={{ fontFamily: "'JetBrains Mono'", fontWeight: 700, fontSize: 22, cursor: "pointer" }} onClick={() => scrollTo("home")}>
                        <GlowText>{"<VR />"}</GlowText>
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
                            <button onClick={() => scrollTo("projects")} style={{
                                background: "transparent", border: `1px solid ${ACCENT}55`, color: ACCENT,
                                padding: "14px 32px", borderRadius: 30, cursor: "pointer",
                                fontFamily: "'Outfit'", fontSize: 15, fontWeight: 600, transition: "all 0.3s",
                            }}>View Projects</button>
                        </div>
                        <div style={{ display: "flex", gap: 40, marginTop: 56, flexWrap: "wrap" }}>
                            {[["3+", "Years Exp."], ["15+", "Freelance Projects"], ["95%+", "Code Review Rate"]].map(([n, l]) => (
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
                        <div style={{ background: `${SURFACE}cc`, border: `1px solid ${SURFACE2}`, borderRadius: 16, padding: 28, backdropFilter: "blur(10px)" }}>
                            <div style={{ fontSize: 28, marginBottom: 12 }}>🚀</div>
                            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 10 }}>Freelance & Beyond</h3>
                            <p style={{ fontSize: 14, color: TEXT_DIM, lineHeight: 1.7 }}>
                                Beyond my full-time roles, I've delivered 15+ freelance projects for clients worldwide — from MVPs for startups to production apps for established businesses. I thrive on turning ideas into shipped products.
                            </p>
                        </div>
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

                {/* PROJECTS */}
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

                {/* SKILLS */}
                <Section id="skills">
                    <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 12, color: ACCENT, letterSpacing: 3, marginBottom: 8 }}>04 // SKILLS</div>
                    <h2 style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 800, marginBottom: 40 }}>
                        My <GlowText>Arsenal</GlowText>
                    </h2>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20 }}>
                        {Object.entries(SKILLS).map(([cat, items], ci) => {
                            const colors = [ACCENT, ACCENT2, "#ff2f7b", "#f0ff00"];
                            const c = colors[ci % colors.length];
                            return (
                                <div key={cat} style={{ background: `${SURFACE}cc`, border: `1px solid ${SURFACE2}`, borderRadius: 16, padding: 24, backdropFilter: "blur(10px)" }}>
                                    <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16, color: c }}>{cat}</h3>
                                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                                        {items.map(s => (
                                            <span key={s} style={{
                                                fontFamily: "'JetBrains Mono'", fontSize: 12, color: TEXT,
                                                background: `${SURFACE2}`, padding: "6px 14px", borderRadius: 20,
                                                border: `1px solid ${c}22`, transition: "all 0.3s",
                                            }}>{s}</span>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
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
                        <GlowText style={{ fontWeight: 700 }}>{"<VR />"}</GlowText>
                        <span style={{ margin: "0 12px", opacity: 0.3 }}>|</span>
                        Built with ⚡ by Vignesh R · {new Date().getFullYear()}
                    </div>
                    <div style={{ fontSize: 12, color: TEXT_DIM, marginTop: 8, opacity: 0.5 }}>Trichy, India</div>
                </footer>
            </div>
        </div>
    );
}