import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Toaster } from "@/components/ui/sonner";
import { Textarea } from "@/components/ui/textarea";
import { useSubmitContactForm } from "@/hooks/useQueries";
import {
  AlertCircle,
  Award,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Clock,
  Coffee,
  Heart,
  Home,
  Loader2,
  Mail,
  MapPin,
  Menu,
  Phone,
  ShieldCheck,
  Smile,
  Star,
  Users,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

// ─── Data ─────────────────────────────────────────────────────────────────────

const NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "Contact", href: "#contact" },
];

const SERVICES = [
  {
    icon: Heart,
    title: "Personal Care Support",
    description:
      "Dignified, compassionate assistance with daily personal care routines — helping you maintain independence and wellbeing in the comfort of your own home.",
    color: "from-rose-50 to-pink-50",
    accentColor: "text-rose-600",
    bgColor: "bg-rose-50",
  },
  {
    icon: Users,
    title: "Community Participation",
    description:
      "Empowering you to engage meaningfully with your community — attending events, joining groups, and building social connections that matter.",
    color: "from-sky-50 to-blue-50",
    accentColor: "text-sky-600",
    bgColor: "bg-sky-50",
  },
  {
    icon: Home,
    title: "Domestic Assistance",
    description:
      "Reliable support with household tasks like cleaning, laundry, and meal preparation so your home stays a comfortable, safe haven.",
    color: "from-amber-50 to-yellow-50",
    accentColor: "text-amber-600",
    bgColor: "bg-amber-50",
  },
  {
    icon: Smile,
    title: "Social & Recreational Support",
    description:
      "Accompanying you to activities, hobbies, and social outings to nurture joy, purpose, and connection in your everyday life.",
    color: "from-violet-50 to-purple-50",
    accentColor: "text-violet-600",
    bgColor: "bg-violet-50",
  },
  {
    icon: Coffee,
    title: "Respite Care",
    description:
      "Giving family carers a well-deserved break while ensuring your loved one receives warm, attentive care from our experienced team.",
    color: "from-orange-50 to-amber-50",
    accentColor: "text-orange-600",
    bgColor: "bg-orange-50",
  },
  {
    icon: BookOpen,
    title: "Life Skills Development",
    description:
      "Building confidence and practical skills — from budgeting and cooking to public transport and communication — to support greater independence.",
    color: "from-teal-50 to-emerald-50",
    accentColor: "text-teal-600",
    bgColor: "bg-teal-50",
  },
];

const TESTIMONIALS = [
  {
    name: "Margaret T.",
    role: "Client for 3 years",
    rating: 5,
    text: "Lily of the Valley Supports has transformed my daily life. The team is warm, professional, and genuinely cares about my wellbeing. I feel heard and supported every single day.",
    initials: "MT",
  },
  {
    name: "David & Susan K.",
    role: "Family of a client",
    rating: 5,
    text: "Having this team support our son has given our whole family peace of mind. They treat him with such respect and dignity — we couldn't ask for better care.",
    initials: "DS",
  },
  {
    name: "Priya R.",
    role: "Client for 18 months",
    rating: 5,
    text: "Thanks to the life skills support I've received, I've gained so much confidence. I'm now catching the bus on my own and have joined a community gardening group!",
    initials: "PR",
  },
];

const CONTACT_DETAILS = [
  {
    icon: Phone,
    label: "Phone",
    value: "0403 688 734",
    sub: "Mon – Fri: 10:00 – 17:30",
  },
  {
    icon: Mail,
    label: "Email",
    value: "info@lilyofthevalleysupports.com.au",
    sub: "We respond within 24 hours",
  },
  {
    icon: MapPin,
    label: "Address",
    value: "Rooty Hill NSW 2766",
    sub: "NDIS registered provider",
  },
  {
    icon: Clock,
    label: "Working Hours",
    value: "Mon – Fri: 10:00 – 17:30",
    sub: "Weekend enquiries via email",
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const STAR_POSITIONS = [1, 2, 3, 4, 5] as const;

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${count} out of 5 stars`}>
      {STAR_POSITIONS.slice(0, count).map((pos) => (
        <Star key={pos} className="w-4 h-4 fill-amber-400 text-amber-400" />
      ))}
    </div>
  );
}

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: "easeOut" as const, delay },
  }),
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

// ─── Wave divider ─────────────────────────────────────────────────────────────

function WaveDivider({
  fill = "currentColor",
  className = "",
  flip = false,
}: {
  fill?: string;
  className?: string;
  flip?: boolean;
}) {
  return (
    <div
      className={`wave-divider ${className}`}
      aria-hidden="true"
      style={{ transform: flip ? "scaleX(-1)" : undefined }}
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 1440 60"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        style={{ fill }}
      >
        <path d="M0,30 C240,60 480,0 720,30 C960,60 1200,0 1440,30 L1440,60 L0,60 Z" />
      </svg>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [formErrors, setFormErrors] = useState<{
    name?: string;
    email?: string;
    message?: string;
  }>({});

  const submitMutation = useSubmitContactForm();

  const handleNavClick = (href: string) => {
    setMenuOpen(false);
    const el = document.querySelector(href);
    if (el) {
      const offset = 72;
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  const validateForm = () => {
    const errors: typeof formErrors = {};
    if (!form.name.trim()) errors.name = "Name is required.";
    if (!form.email.trim()) errors.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errors.email = "Please enter a valid email address.";
    if (!form.message.trim()) errors.message = "Message is required.";
    return errors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    setFormErrors({});
    submitMutation.mutate(
      { name: form.name, email: form.email, message: form.message },
      {
        onSuccess: () => {
          setForm({ name: "", email: "", message: "" });
          toast.success("Message sent! We'll be in touch shortly.");
        },
        onError: () => {
          toast.error("Something went wrong. Please try again.");
        },
      },
    );
  };

  return (
    <div className="min-h-screen bg-background font-body">
      <Toaster position="top-right" />

      {/* ═══════════════════════════════════════════════════════
          NAVIGATION
      ═══════════════════════════════════════════════════════ */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/92 backdrop-blur-xl border-b border-border/60 shadow-xs">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <button
            type="button"
            className="flex items-center gap-2.5 group"
            onClick={() => handleNavClick("#home")}
            data-ocid="nav.home.link"
          >
            <img
              src="/assets/generated/lily-logo-transparent.dim_200x200.png"
              alt="Lily of the Valley Supports logo"
              className="w-9 h-9 object-contain"
            />
            <div className="leading-tight">
              <span className="block text-[10px] font-body font-semibold tracking-[0.18em] uppercase text-primary/70">
                Lily of the Valley
              </span>
              <span className="block text-[15px] font-display font-semibold text-foreground tracking-tight">
                Supports
              </span>
            </div>
          </button>

          {/* Desktop Nav */}
          <ul className="hidden md:flex items-center gap-0.5">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <button
                  type="button"
                  onClick={() => handleNavClick(link.href)}
                  className="px-3.5 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  data-ocid={`nav.${link.label.toLowerCase()}.link`}
                >
                  {link.label}
                </button>
              </li>
            ))}
          </ul>

          {/* CTA + NDIS badge + Mobile toggle */}
          <div className="flex items-center gap-2">
            <span className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[11px] font-semibold text-primary tracking-wide">
              <ShieldCheck className="w-3 h-3" />
              NDIS Registered
            </span>
            <Button
              onClick={() => handleNavClick("#contact")}
              size="sm"
              className="hidden md:flex bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-5 shadow-soft font-semibold text-sm"
              data-ocid="nav.contact.link"
            >
              Get in Touch
            </Button>
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-secondary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
            >
              {menuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </nav>

        {/* Mobile Menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.22, ease: "easeInOut" }}
              className="md:hidden border-t border-border bg-background overflow-hidden"
            >
              <div className="px-4 py-3 flex flex-col gap-1">
                {NAV_LINKS.map((link) => (
                  <button
                    key={link.href}
                    type="button"
                    onClick={() => handleNavClick(link.href)}
                    className="text-left px-4 py-3 rounded-xl text-sm font-medium text-foreground hover:bg-secondary transition-colors"
                    data-ocid={`nav.${link.label.toLowerCase()}.link`}
                  >
                    {link.label}
                  </button>
                ))}
                <Button
                  onClick={() => handleNavClick("#contact")}
                  className="mt-2 bg-primary text-primary-foreground rounded-full shadow-soft"
                >
                  Get in Touch
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main>
        {/* ═══════════════════════════════════════════════════════
            HERO SECTION
        ═══════════════════════════════════════════════════════ */}
        <section
          id="home"
          className="relative min-h-screen flex items-center overflow-hidden pt-16"
        >
          {/* Layered background */}
          <div className="absolute inset-0">
            <img
              src="/assets/generated/hero-background.dim_1600x900.jpg"
              alt=""
              className="w-full h-full object-cover scale-105"
              aria-hidden="true"
            />
            {/* Deep green gradient overlay left-to-right */}
            <div className="absolute inset-0 bg-gradient-to-r from-foreground/85 via-foreground/60 to-transparent" />
            {/* Warm golden tint at bottom */}
            <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent" />
          </div>

          {/* Content */}
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28 lg:py-36 grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Text */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={stagger}
              className="max-w-xl"
            >
              {/* NDIS badge */}
              <motion.div variants={fadeUp} custom={0}>
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-sm border border-white/25 text-white/90 text-xs font-semibold tracking-widest uppercase mb-6">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  NDIS Registered Provider
                </span>
              </motion.div>

              <motion.h1
                variants={fadeUp}
                custom={0.08}
                className="font-display text-4xl sm:text-5xl lg:text-[3.4rem] font-semibold leading-[1.1] text-white mb-5 text-balance"
              >
                Welcome to Lily of the Valley Supports
              </motion.h1>

              <motion.p
                variants={fadeUp}
                custom={0.16}
                className="text-lg sm:text-xl text-white/85 leading-relaxed mb-4"
              >
                We are committed to providing compassionate and personalized
                care for your loved ones.
              </motion.p>

              <motion.p
                variants={fadeUp}
                custom={0.22}
                className="text-base text-white/70 leading-relaxed mb-10"
              >
                Walking alongside individuals with disability and their families
                — delivering warm, person-centred care that honours your goals,
                your choices, and your independence.
              </motion.p>

              <motion.div
                variants={fadeUp}
                custom={0.28}
                className="flex flex-col sm:flex-row gap-3"
              >
                <Button
                  onClick={() => handleNavClick("#contact")}
                  size="lg"
                  className="bg-white text-foreground hover:bg-white/90 rounded-full px-8 shadow-3d font-bold text-base group"
                  data-ocid="hero.primary_button"
                >
                  Start Your Journey
                  <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => handleNavClick("#about")}
                  className="rounded-full px-8 text-base font-semibold border-white/40 text-white bg-white/10 hover:bg-white/20 backdrop-blur-sm"
                >
                  Learn About Us
                </Button>
              </motion.div>

              {/* Stats row */}
              <motion.div
                variants={fadeUp}
                custom={0.35}
                className="mt-12 flex flex-wrap gap-8"
              >
                {[
                  { value: "500+", label: "Lives Supported" },
                  { value: "10+", label: "Years Experience" },
                  { value: "Best Practice", label: "Audit Recognised" },
                ].map((stat) => (
                  <div key={stat.label}>
                    <p className="font-display text-2xl font-bold text-white leading-none mb-1">
                      {stat.value}
                    </p>
                    <p className="text-xs text-white/60 font-medium tracking-wide">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* Right: Photo card — visible lg+ */}
            <motion.div
              initial={{ opacity: 0, x: 40, scale: 0.97 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
              className="hidden lg:block"
            >
              <div className="relative">
                <div className="rounded-3xl overflow-hidden shadow-3d-hover">
                  <img
                    src="/assets/generated/carer-consoling-elderly.dim_800x600.jpg"
                    alt="A carer providing compassionate support to an elderly person"
                    className="w-full h-[460px] object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/30 to-transparent rounded-3xl" />
                </div>
                {/* Floating glass card */}
                <div className="absolute -bottom-6 -left-8 glass-card rounded-2xl p-4 shadow-3d max-w-[210px]">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <Award className="w-4 h-4 text-primary" />
                    <span className="text-xs font-bold text-foreground">
                      Best Practice
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-snug">
                    Recognised in our most recent NDIS quality audit
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Scroll indicator */}
          <motion.div
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
            animate={{ y: [0, 8, 0] }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          >
            <div className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center pt-2">
              <div className="w-1 h-2.5 rounded-full bg-white/60" />
            </div>
          </motion.div>
        </section>

        {/* Wave into About */}
        <div className="relative">
          <WaveDivider fill="oklch(0.985 0.004 100)" className="-mt-1" />
        </div>

        {/* ═══════════════════════════════════════════════════════
            ABOUT SECTION
        ═══════════════════════════════════════════════════════ */}
        <section id="about" className="section-padding bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section label */}
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-primary font-semibold tracking-[0.18em] text-xs uppercase text-center mb-3"
            >
              About Us
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: 0.05 }}
              className="font-display text-4xl sm:text-5xl font-semibold text-foreground text-center mb-16 text-balance"
            >
              Welcome to Lily of the Valley
            </motion.h2>

            <div className="grid lg:grid-cols-2 gap-14 lg:gap-20 items-start">
              {/* Left: Image collage */}
              <motion.div
                initial={{ opacity: 0, x: -28 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className="relative"
              >
                {/* Main image */}
                <div className="rounded-2xl overflow-hidden shadow-3d">
                  <img
                    src="/assets/generated/carer-consoling-elderly.dim_800x600.jpg"
                    alt="Our carer providing warm, compassionate support"
                    className="w-full aspect-[4/3] object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent rounded-2xl pointer-events-none" />
                </div>

                {/* Second overlapping image */}
                <div className="absolute -bottom-8 -right-6 w-48 h-36 md:w-56 md:h-44 rounded-xl overflow-hidden shadow-3d-hover border-4 border-background">
                  <img
                    src="/assets/generated/support-team-community.dim_800x600.jpg"
                    alt="Our community support team"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Floating badge */}
                <div className="absolute -top-4 -left-4 glass-card rounded-xl p-3.5 shadow-3d">
                  <div className="flex items-center gap-2 mb-1">
                    {STAR_POSITIONS.map((pos) => (
                      <Star
                        key={pos}
                        className="w-3 h-3 fill-amber-400 text-amber-400"
                      />
                    ))}
                  </div>
                  <p className="text-xs font-bold text-foreground">
                    Trusted by families
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    across NSW
                  </p>
                </div>

                {/* Dot grid decoration */}
                <div
                  className="absolute -bottom-2 left-10 w-20 h-20 opacity-[0.15] pointer-events-none"
                  aria-hidden="true"
                >
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 80 80"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {[0, 1, 2, 3].map((row) =>
                      [0, 1, 2, 3].map((col) => (
                        <circle
                          key={`${row}-${col}`}
                          cx={col * 20 + 10}
                          cy={row * 20 + 10}
                          r="2.5"
                          fill="oklch(0.32 0.095 155)"
                        />
                      )),
                    )}
                  </svg>
                </div>
              </motion.div>

              {/* Right: Full about text */}
              <motion.div
                initial={{ opacity: 0, x: 28 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
                className="pb-8 lg:pb-0"
              >
                <p className="font-serif-alt text-xl sm:text-2xl text-primary font-medium leading-relaxed mb-6 italic">
                  Where compassion, connection, and quality support come
                  together.
                </p>

                <div className="space-y-4 text-muted-foreground leading-[1.85] text-[15px]">
                  <p>
                    As a registered NDIS provider, we are committed to
                    empowering individuals to live with confidence,
                    independence, and dignity.
                  </p>
                  <p>
                    Our team brings years of combined experience in Disability,
                    Aged Care, and Youth Services. We are more than just a
                    service provider — we are a family that values honesty,
                    transparency, and the unique experiences each person brings.
                    We take the time to listen, understand, and build
                    personalised support plans that reflect your goals, needs,
                    and preferences.
                  </p>
                  <p>
                    We believe that lived experience keeps us grounded and
                    connected as humans. That's why we approach every
                    relationship with respect, empathy, and genuine care. Our
                    diverse and compassionate staff are here to walk beside you,
                    offering support that truly makes a difference.
                  </p>
                  <p>
                    We're proud to have been recognised for 'best practice' in
                    our recent audit — an acknowledgment of the real and lasting
                    impact we're making together.
                  </p>
                  <p className="font-medium text-foreground">
                    At Lily of the Valley, your journey is our purpose — and
                    we're honoured to be part of it.
                  </p>
                </div>

                {/* Value pills */}
                <div className="mt-8 grid grid-cols-2 gap-3">
                  {[
                    { icon: Heart, label: "Person-Centred Care" },
                    { icon: ShieldCheck, label: "NDIS Registered" },
                    { icon: Users, label: "Experienced Team" },
                    { icon: Award, label: "Best Practice Audit" },
                  ].map(({ icon: Icon, label }) => (
                    <div
                      key={label}
                      className="flex items-center gap-3 p-3 rounded-xl bg-secondary border border-border shadow-xs"
                    >
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-4 h-4 text-primary" />
                      </div>
                      <span className="text-sm font-medium text-foreground leading-snug">
                        {label}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Wave into Services */}
        <WaveDivider fill="oklch(0.95 0.018 138)" className="text-secondary" />

        {/* ═══════════════════════════════════════════════════════
            SERVICES SECTION
        ═══════════════════════════════════════════════════════ */}
        <section
          id="services"
          className="section-padding"
          style={{
            background:
              "linear-gradient(180deg, oklch(0.95 0.018 138) 0%, oklch(0.985 0.004 100) 100%)",
          }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-6"
            >
              <p className="text-primary font-semibold tracking-[0.18em] text-xs uppercase mb-3">
                What We Offer
              </p>
              <h2 className="font-display text-4xl sm:text-5xl font-semibold text-foreground mb-5 text-balance">
                Our Support Services
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
                Tailored, flexible services designed to support your
                independence, wellbeing, and full participation in everyday
                life.
              </p>
            </motion.div>

            {/* Photo strip */}
            <div className="flex gap-3 mb-12 overflow-hidden rounded-2xl h-40 sm:h-52">
              {[
                {
                  src: "/assets/generated/carer-walking-wheelchair.dim_800x600.jpg",
                  alt: "Support worker walking with wheelchair user",
                },
                {
                  src: "/assets/generated/carer-activity-support.dim_800x600.jpg",
                  alt: "Carer doing creative activities with a person",
                },
                {
                  src: "/assets/generated/support-team-community.dim_800x600.jpg",
                  alt: "Support team and community members together",
                },
              ].map(({ src, alt }) => (
                <div
                  key={src}
                  className="flex-1 overflow-hidden rounded-xl shadow-soft"
                >
                  <img
                    src={src}
                    alt={alt}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
              ))}
            </div>

            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
            >
              {SERVICES.map((service, i) => {
                const Icon = service.icon;
                return (
                  <motion.div
                    key={service.title}
                    variants={fadeUp}
                    custom={i * 0.06}
                    whileHover={{ y: -6, scale: 1.01 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Card className="h-full bg-card border-border shadow-3d hover:shadow-3d-hover transition-all duration-300 overflow-hidden group card-accent-top">
                      <CardContent className="p-6">
                        <div
                          className={`w-12 h-12 rounded-2xl ${service.bgColor} flex items-center justify-center mb-5`}
                        >
                          <Icon className={`w-6 h-6 ${service.accentColor}`} />
                        </div>
                        <h3 className="font-display text-[1.1rem] font-semibold text-foreground mb-2.5 leading-snug">
                          {service.title}
                        </h3>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                          {service.description}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-center mt-12"
            >
              <Button
                type="button"
                onClick={() => handleNavClick("#contact")}
                variant="outline"
                size="lg"
                className="rounded-full px-8 border-primary/30 hover:bg-primary/5 text-primary font-semibold"
              >
                Enquire About Our Services
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </motion.div>
          </div>
        </section>

        {/* Wave into Testimonials */}
        <WaveDivider fill="oklch(0.985 0.004 100)" />

        {/* ═══════════════════════════════════════════════════════
            TESTIMONIALS SECTION
        ═══════════════════════════════════════════════════════ */}
        <section id="testimonials" className="section-padding bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <p className="text-primary font-semibold tracking-[0.18em] text-xs uppercase mb-3">
                Testimonials
              </p>
              <h2 className="font-display text-4xl sm:text-5xl font-semibold text-foreground mb-5 text-balance">
                Words From Those We Support
              </h2>
              <p className="text-muted-foreground text-lg max-w-xl mx-auto">
                Real stories from real people whose lives have been touched by
                our care.
              </p>
            </motion.div>

            {/* Community image banner */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="rounded-2xl overflow-hidden shadow-3d mb-14 h-56 sm:h-72"
            >
              <img
                src="/assets/generated/support-team-community.dim_800x600.jpg"
                alt="Our community — participants, families, and support team together"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-foreground/40 via-transparent to-transparent rounded-2xl pointer-events-none" />
            </motion.div>

            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid md:grid-cols-3 gap-6"
            >
              {TESTIMONIALS.map((t, i) => (
                <motion.div
                  key={t.name}
                  variants={fadeUp}
                  custom={i * 0.1}
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.2 }}
                  className="relative"
                >
                  <Card className="h-full bg-card border-border shadow-3d hover:shadow-3d-hover transition-all duration-300">
                    <CardContent className="p-7">
                      <div
                        className="font-display text-7xl leading-none text-primary/10 mb-2 select-none -ml-1"
                        aria-hidden="true"
                      >
                        "
                      </div>
                      <StarRating count={t.rating} />
                      <p className="mt-4 text-foreground/85 leading-[1.8] text-[14px] mb-6 italic">
                        "{t.text}"
                      </p>
                      <div className="flex items-center gap-3 pt-4 border-t border-border">
                        <div className="w-10 h-10 rounded-full bg-primary/12 flex items-center justify-center flex-shrink-0">
                          <span className="text-[11px] font-bold text-primary">
                            {t.initials}
                          </span>
                        </div>
                        <div>
                          <p className="font-semibold text-sm text-foreground">
                            {t.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {t.role}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Wave into Contact */}
        <WaveDivider fill="oklch(0.95 0.022 138)" className="text-secondary" />

        {/* ═══════════════════════════════════════════════════════
            CONTACT SECTION
        ═══════════════════════════════════════════════════════ */}
        <section
          id="contact"
          className="section-padding"
          style={{
            background:
              "linear-gradient(145deg, oklch(0.95 0.022 138) 0%, oklch(0.97 0.016 130) 50%, oklch(0.93 0.028 148) 100%)",
          }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-14"
            >
              <p className="text-primary font-semibold tracking-[0.18em] text-xs uppercase mb-3">
                Get In Touch
              </p>
              <h2 className="font-display text-4xl sm:text-5xl font-semibold text-foreground mb-5 text-balance">
                Let's Start a Conversation
              </h2>
              <p className="text-muted-foreground text-lg max-w-xl mx-auto">
                Whether you're ready to begin or just exploring your options,
                we're here to help.
              </p>
            </motion.div>

            <div className="grid lg:grid-cols-5 gap-10 lg:gap-14">
              {/* Contact Info */}
              <motion.div
                initial={{ opacity: 0, x: -24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.65 }}
                className="lg:col-span-2 space-y-4"
              >
                <h3 className="font-display text-2xl font-semibold text-foreground mb-6">
                  Contact Information
                </h3>

                {CONTACT_DETAILS.map(({ icon: Icon, label, value, sub }) => (
                  <div
                    key={label}
                    className="flex items-start gap-4 p-4 rounded-2xl bg-card/70 backdrop-blur-sm border border-border/60 shadow-xs hover:shadow-soft transition-shadow duration-200"
                  >
                    <div className="w-10 h-10 rounded-xl bg-primary/12 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest mb-0.5">
                        {label}
                      </p>
                      <p className="font-semibold text-foreground text-sm">
                        {value}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {sub}
                      </p>
                    </div>
                  </div>
                ))}

                {/* NDIS callout */}
                <div className="mt-2 p-5 rounded-2xl bg-primary/8 border border-primary/20">
                  <div className="flex items-center gap-2 mb-2">
                    <ShieldCheck className="w-4 h-4 text-primary" />
                    <p className="text-sm font-bold text-foreground">
                      NDIS Participant?
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    We work with self-managed, plan-managed, and NDIA-managed
                    participants. We'd love to help you make the most of your
                    plan.
                  </p>
                </div>
              </motion.div>

              {/* Contact Form */}
              <motion.div
                initial={{ opacity: 0, x: 24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.65, delay: 0.1 }}
                className="lg:col-span-3"
              >
                <Card className="bg-card/80 backdrop-blur-md border-border/60 shadow-3d">
                  <CardContent className="p-8">
                    <AnimatePresence mode="wait">
                      {submitMutation.isSuccess ? (
                        <motion.div
                          key="success"
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className="flex flex-col items-center justify-center py-14 text-center"
                          data-ocid="contact.success_state"
                        >
                          <div className="w-16 h-16 rounded-full bg-primary/12 flex items-center justify-center mb-5 shadow-soft">
                            <CheckCircle2 className="w-8 h-8 text-primary" />
                          </div>
                          <h3 className="font-display text-2xl font-semibold text-foreground mb-3">
                            Message Received!
                          </h3>
                          <p className="text-muted-foreground text-sm max-w-xs leading-relaxed">
                            Thank you for reaching out. A member of our team
                            will be in touch within one business day.
                          </p>
                          <Button
                            type="button"
                            variant="outline"
                            className="mt-6 rounded-full"
                            onClick={() => submitMutation.reset()}
                          >
                            Send Another Message
                          </Button>
                        </motion.div>
                      ) : (
                        <motion.form
                          key="form"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          onSubmit={handleSubmit}
                          noValidate
                          className="space-y-5"
                        >
                          <div>
                            <h3 className="font-display text-xl font-semibold text-foreground mb-5">
                              Send Us a Message
                            </h3>
                          </div>

                          <div>
                            <Label
                              htmlFor="contact-name"
                              className="text-sm font-semibold text-foreground mb-1.5 block"
                            >
                              Full Name{" "}
                              <span className="text-destructive">*</span>
                            </Label>
                            <Input
                              id="contact-name"
                              type="text"
                              placeholder="Your full name"
                              value={form.name}
                              onChange={(e) =>
                                setForm((p) => ({
                                  ...p,
                                  name: e.target.value,
                                }))
                              }
                              aria-invalid={!!formErrors.name}
                              aria-describedby={
                                formErrors.name ? "name-error" : undefined
                              }
                              className="rounded-xl text-base"
                              autoComplete="name"
                              data-ocid="contact.name.input"
                            />
                            {formErrors.name && (
                              <p
                                id="name-error"
                                className="mt-1.5 text-xs text-destructive flex items-center gap-1"
                                role="alert"
                              >
                                <AlertCircle className="w-3 h-3" />
                                {formErrors.name}
                              </p>
                            )}
                          </div>

                          <div>
                            <Label
                              htmlFor="contact-email"
                              className="text-sm font-semibold text-foreground mb-1.5 block"
                            >
                              Email Address{" "}
                              <span className="text-destructive">*</span>
                            </Label>
                            <Input
                              id="contact-email"
                              type="email"
                              placeholder="you@example.com"
                              value={form.email}
                              onChange={(e) =>
                                setForm((p) => ({
                                  ...p,
                                  email: e.target.value,
                                }))
                              }
                              aria-invalid={!!formErrors.email}
                              aria-describedby={
                                formErrors.email ? "email-error" : undefined
                              }
                              className="rounded-xl text-base"
                              autoComplete="email"
                              data-ocid="contact.email.input"
                            />
                            {formErrors.email && (
                              <p
                                id="email-error"
                                className="mt-1.5 text-xs text-destructive flex items-center gap-1"
                                role="alert"
                              >
                                <AlertCircle className="w-3 h-3" />
                                {formErrors.email}
                              </p>
                            )}
                          </div>

                          <div>
                            <Label
                              htmlFor="contact-message"
                              className="text-sm font-semibold text-foreground mb-1.5 block"
                            >
                              Message{" "}
                              <span className="text-destructive">*</span>
                            </Label>
                            <Textarea
                              id="contact-message"
                              placeholder="Tell us a little about yourself and how we can support you..."
                              value={form.message}
                              onChange={(e) =>
                                setForm((p) => ({
                                  ...p,
                                  message: e.target.value,
                                }))
                              }
                              aria-invalid={!!formErrors.message}
                              aria-describedby={
                                formErrors.message ? "message-error" : undefined
                              }
                              rows={5}
                              className="rounded-xl resize-none text-base"
                              data-ocid="contact.message.textarea"
                            />
                            {formErrors.message && (
                              <p
                                id="message-error"
                                className="mt-1.5 text-xs text-destructive flex items-center gap-1"
                                role="alert"
                              >
                                <AlertCircle className="w-3 h-3" />
                                {formErrors.message}
                              </p>
                            )}
                          </div>

                          {submitMutation.isError && (
                            <div
                              className="flex items-center gap-2 p-3.5 rounded-xl bg-destructive/10 text-destructive text-sm"
                              role="alert"
                              data-ocid="contact.error_state"
                            >
                              <AlertCircle className="w-4 h-4 flex-shrink-0" />
                              <span>
                                Something went wrong. Please try again or
                                contact us directly.
                              </span>
                            </div>
                          )}

                          <Button
                            type="submit"
                            disabled={submitMutation.isPending}
                            size="lg"
                            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-full font-bold shadow-soft text-base"
                            data-ocid="contact.submit_button"
                          >
                            {submitMutation.isPending ? (
                              <>
                                <Loader2
                                  className="mr-2 w-4 h-4 animate-spin"
                                  data-ocid="contact.loading_state"
                                />
                                Sending…
                              </>
                            ) : (
                              "Send Message"
                            )}
                          </Button>
                        </motion.form>
                      )}
                    </AnimatePresence>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      {/* ═══════════════════════════════════════════════════════
          FOOTER
      ═══════════════════════════════════════════════════════ */}
      <footer
        style={{
          background:
            "linear-gradient(160deg, oklch(0.17 0.04 155) 0%, oklch(0.13 0.03 152) 100%)",
        }}
        className="text-white/85"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid md:grid-cols-4 gap-10 mb-12">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-5">
                <img
                  src="/assets/generated/lily-logo-transparent.dim_200x200.png"
                  alt=""
                  className="w-10 h-10 object-contain brightness-0 invert"
                />
                <span className="font-display text-[17px] font-semibold text-white">
                  Lily of the Valley Supports
                </span>
              </div>
              <p className="text-sm text-white/60 leading-relaxed max-w-xs mb-4">
                Person-centred disability support services delivered with
                compassion, integrity, and genuine care.
              </p>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/30 border border-primary/40 text-[11px] font-semibold text-white/90 tracking-wide">
                  <ShieldCheck className="w-3 h-3" />
                  NDIS Registered Provider
                </span>
              </div>
              <p className="text-[11px] text-white/35 mt-4">
                Rooty Hill NSW 2766 · ABN available on request
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/40 mb-5">
                Quick Links
              </h4>
              <ul className="space-y-2.5">
                {NAV_LINKS.map((link) => (
                  <li key={link.href}>
                    <button
                      type="button"
                      onClick={() => handleNavClick(link.href)}
                      className="text-sm text-white/60 hover:text-white transition-colors text-left"
                      data-ocid={`nav.${link.label.toLowerCase()}.link`}
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/40 mb-5">
                Contact
              </h4>
              <ul className="space-y-3 text-sm text-white/60">
                <li>0403 688 734</li>
                <li className="break-words text-xs">
                  info@lilyofthevalleysupports.com.au
                </li>
                <li>Rooty Hill NSW 2766</li>
                <li>Mon – Fri: 10:00 – 17:30</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-white/35">
              © {new Date().getFullYear()} Lily of the Valley Supports. All
              rights reserved.
            </p>
            <p className="text-xs text-white/30">
              Built with{" "}
              <Heart className="w-3 h-3 inline fill-pink-300 text-pink-300" />{" "}
              using{" "}
              <a
                href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white/60 underline underline-offset-2 transition-colors"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
