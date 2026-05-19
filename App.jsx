import { useState, useEffect } from "react";
import IMGS from "./images.js";

// ─────────────────────────────────────────────────────────────────
// ⚡ CONFIGURATION — replace these with your real links
// ─────────────────────────────────────────────────────────────────
const CONFIG = {
  // 1. Create a Payment Link in your Stripe dashboard → paste here
  STRIPE_PAYMENT_LINK: "https://buy.stripe.com/6oU8wO0TU1Eh8c73df0Jq00",

  // 2. Your Gumroad product URL (alternative to Stripe)
  GUMROAD_LINK: "https://yourname.gumroad.com/l/YOUR_PRODUCT",

  // 3. Your main website / product catalogue
  PRODUCTS_PAGE: "https://equesolution.com/products",

  // 4. Your main site
  MAIN_SITE: "https://equesolution.com",

  // 5. Which payment processor to use: "stripe" | "gumroad"
  PAYMENT_PROCESSOR: "stripe",
};

const PAYMENT_URL =
  CONFIG.PAYMENT_PROCESSOR === "stripe"
    ? CONFIG.STRIPE_PAYMENT_LINK
    : CONFIG.GUMROAD_LINK;

// ─────────────────────────────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────────────────────────────
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600&family=Jost:wght@300;400;500;600;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body { background: #0E0804; font-family: 'Jost', sans-serif; color: #F5F0E8; overflow-x: hidden; }

  @keyframes fadeUp   { from { opacity:0; transform:translateY(32px); } to { opacity:1; transform:translateY(0); } }
  @keyframes fadeIn   { from { opacity:0; } to { opacity:1; } }
  @keyframes shimmer  { 0%,100% { opacity:0.4; } 50% { opacity:1; } }
  @keyframes floatUp  { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-5px); } }

  .fade-up { opacity:0; transform:translateY(28px); transition:opacity 0.7s ease,transform 0.7s ease; }
  .fade-up.visible { opacity:1; transform:translateY(0); }

  /* HERO */
  .hero { position:relative; height:100vh; min-height:640px; display:flex; flex-direction:column; justify-content:flex-end; overflow:hidden; }
  .hero-bg { position:absolute; inset:0; background-size:cover; background-position:center 25%; z-index:0; animation:fadeIn 1.2s ease forwards; }
  .hero-bg::after { content:''; position:absolute; inset:0; background:linear-gradient(to bottom,rgba(14,8,4,0.05) 0%,rgba(14,8,4,0.35) 45%,rgba(14,8,4,0.92) 78%,rgba(14,8,4,1) 100%); }
  .hero-content { position:relative; z-index:2; padding:0 64px 72px; animation:fadeUp 1s 0.3s ease both; }
  .hero-eyebrow { display:inline-flex; align-items:center; gap:10px; border:1px solid rgba(201,168,76,0.45); padding:6px 18px; margin-bottom:28px; font-size:9px; letter-spacing:3.5px; text-transform:uppercase; font-weight:700; color:#C9A84C; }
  .hero-dot { width:5px; height:5px; background:#C9A84C; border-radius:50%; animation:shimmer 2s infinite; }
  .hero h1 { font-family:'Cormorant Garamond',serif; font-size:clamp(46px,8vw,92px); font-weight:300; line-height:0.92; letter-spacing:-2px; color:#F5F0E8; margin-bottom:8px; }
  .hero h1 em { font-style:italic; color:#C9A84C; }
  .hero-tagline { font-family:'Cormorant Garamond',serif; font-size:clamp(17px,2.5vw,26px); font-weight:300; font-style:italic; color:rgba(245,240,232,0.58); margin-bottom:36px; }
  .cta-row { display:flex; gap:14px; align-items:center; flex-wrap:wrap; }
  .btn-primary { background:#C9A84C; color:#0E0804; border:none; padding:17px 38px; font-family:'Jost',sans-serif; font-size:11px; font-weight:700; letter-spacing:2px; text-transform:uppercase; cursor:pointer; border-radius:1px; transition:all 0.25s; white-space:nowrap; animation:floatUp 3s 1.5s ease-in-out infinite; text-decoration:none; display:inline-block; }
  .btn-primary:hover { background:#E8D5A3; transform:translateY(-3px) !important; box-shadow:0 14px 44px rgba(201,168,76,0.32); }
  .btn-ghost { background:transparent; color:rgba(245,240,232,0.65); border:1px solid rgba(245,240,232,0.22); padding:16px 26px; font-family:'Jost',sans-serif; font-size:11px; font-weight:500; letter-spacing:1.5px; text-transform:uppercase; cursor:pointer; border-radius:1px; transition:all 0.25s; text-decoration:none; display:inline-block; }
  .btn-ghost:hover { border-color:rgba(201,168,76,0.5); color:#C9A84C; }
  .hero-price { display:flex; align-items:baseline; gap:8px; margin-top:28px; }
  .hero-price-n { font-family:'Cormorant Garamond',serif; font-size:44px; font-weight:300; color:#C9A84C; line-height:1; }
  .hero-price-l { font-size:11px; color:rgba(245,240,232,0.38); letter-spacing:1px; }

  /* GLOBALS */
  .page { background:#0E0804; }
  section { padding:96px 0; }
  .container { max-width:1100px; margin:0 auto; padding:0 64px; }
  .lbl { font-size:9px; letter-spacing:3px; text-transform:uppercase; font-weight:700; color:#C9A84C; margin-bottom:14px; display:flex; align-items:center; gap:10px; }
  .lbl::before { content:''; display:block; width:24px; height:1px; background:#C9A84C; }
  .lbl.center { justify-content:center; }
  .lbl.center::before { display:none; }
  .dtitle { font-family:'Cormorant Garamond',serif; font-size:clamp(34px,5vw,56px); font-weight:300; line-height:1.05; letter-spacing:-1px; color:#F5F0E8; margin-bottom:18px; }
  .dtitle em { font-style:italic; color:#C9A84C; }
  .btext { font-size:15px; line-height:1.85; color:rgba(245,240,232,0.6); max-width:580px; }
  .divider { height:1px; background:linear-gradient(to right,transparent,#C9A84C 30%,#C9A84C 70%,transparent); opacity:0.22; }

  /* WHAT IS IT */
  .what-grid { display:grid; grid-template-columns:1fr 1fr; gap:80px; align-items:center; }
  .what-img-wrap { position:relative; height:520px; border-radius:2px; overflow:hidden; }
  .what-img-wrap img { width:100%; height:100%; object-fit:cover; object-position:center 30%; }
  .what-img-ov { position:absolute; inset:0; background:linear-gradient(135deg,transparent 55%,rgba(14,8,4,0.65)); }
  .what-badge { position:absolute; bottom:24px; left:24px; background:rgba(14,8,4,0.88); border:1px solid rgba(201,168,76,0.35); padding:12px 20px; font-family:'Cormorant Garamond',serif; font-size:18px; font-weight:300; color:#F5F0E8; line-height:1.3; }
  .what-badge em { font-style:italic; color:#C9A84C; }
  .what-list { list-style:none; display:grid; gap:16px; margin-top:28px; }
  .what-list li { display:flex; gap:13px; align-items:flex-start; font-size:14px; line-height:1.65; color:rgba(245,240,232,0.72); }
  .wl-check { width:20px; height:20px; background:rgba(201,168,76,0.14); border:1px solid rgba(201,168,76,0.35); border-radius:1px; display:flex; align-items:center; justify-content:center; font-size:10px; color:#C9A84C; flex-shrink:0; margin-top:2px; font-weight:700; }

  /* FOR WHOM */
  .for-whom { background:rgba(255,255,255,0.015); }
  .fw-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:2px; margin-top:52px; }
  .fw-card { position:relative; overflow:hidden; height:360px; }
  .fw-card img { width:100%; height:100%; object-fit:cover; transition:transform 0.6s ease; filter:brightness(0.62); }
  .fw-card:hover img { transform:scale(1.05); }
  .fw-ov { position:absolute; inset:0; background:linear-gradient(to top,rgba(14,8,4,0.93) 0%,rgba(14,8,4,0.15) 60%,transparent 100%); display:flex; flex-direction:column; justify-content:flex-end; padding:28px 24px; }
  .fw-num { font-family:'Cormorant Garamond',serif; font-size:54px; font-weight:300; color:rgba(201,168,76,0.12); line-height:1; margin-bottom:-8px; }
  .fw-title { font-family:'Cormorant Garamond',serif; font-size:22px; font-weight:400; color:#F5F0E8; margin-bottom:8px; line-height:1.2; }
  .fw-desc { font-size:12px; color:rgba(245,240,232,0.52); line-height:1.65; }

  /* INSIDE */
  .inside-grid { display:grid; grid-template-columns:repeat(2,1fr); gap:2px; margin-top:52px; }
  .inside-item { background:rgba(255,255,255,0.03); border:1px solid rgba(201,168,76,0.08); padding:32px 28px; transition:background 0.3s,border-color 0.3s; position:relative; overflow:hidden; }
  .inside-item::before { content:''; position:absolute; top:0; left:0; width:100%; height:2px; background:#C9A84C; transform:scaleX(0); transform-origin:left; transition:transform 0.4s ease; }
  .inside-item:hover { background:rgba(201,168,76,0.05); border-color:rgba(201,168,76,0.2); }
  .inside-item:hover::before { transform:scaleX(1); }
  .in-num { font-family:'Cormorant Garamond',serif; font-size:48px; font-weight:300; color:rgba(201,168,76,0.09); line-height:1; margin-bottom:-4px; }
  .in-icon { font-size:20px; margin-bottom:12px; display:block; }
  .in-title { font-family:'Cormorant Garamond',serif; font-size:20px; font-weight:400; color:#F5F0E8; margin-bottom:8px; }
  .in-desc { font-size:12.5px; color:rgba(245,240,232,0.52); line-height:1.7; }
  .in-tag { display:inline-block; margin-top:14px; font-size:9px; letter-spacing:2px; text-transform:uppercase; color:#C9A84C; font-weight:600; background:rgba(201,168,76,0.1); padding:3px 10px; border-radius:1px; }

  /* PHOTO BAND */
  .photo-band { display:grid; grid-template-columns:2fr 1fr 1fr; gap:3px; height:300px; }
  .pb-item { overflow:hidden; }
  .pb-item img { width:100%; height:100%; object-fit:cover; transition:transform 0.5s ease; }
  .pb-item:hover img { transform:scale(1.04); }

  /* WHY BUY */
  .why-grid { display:grid; grid-template-columns:1fr 1fr; gap:52px; align-items:start; margin-top:52px; }
  .why-points { display:grid; gap:20px; }
  .why-pt { display:flex; gap:18px; align-items:flex-start; padding:22px; border:1px solid rgba(201,168,76,0.1); background:rgba(255,255,255,0.02); transition:border-color 0.3s,background 0.3s; }
  .why-pt:hover { border-color:rgba(201,168,76,0.28); background:rgba(201,168,76,0.04); }
  .why-icon { font-size:20px; flex-shrink:0; width:42px; height:42px; background:rgba(201,168,76,0.08); border-radius:1px; display:flex; align-items:center; justify-content:center; }
  .why-pt-title { font-family:'Cormorant Garamond',serif; font-size:18px; font-weight:400; color:#F5F0E8; margin-bottom:5px; }
  .why-pt-desc { font-size:12.5px; color:rgba(245,240,232,0.52); line-height:1.7; }
  .why-photo { position:sticky; top:40px; height:480px; border-radius:2px; overflow:hidden; }
  .why-photo img { width:100%; height:100%; object-fit:cover; object-position:center 20%; }
  .why-caption { position:absolute; bottom:0; left:0; right:0; background:linear-gradient(to top,rgba(14,8,4,0.88),transparent); padding:32px 24px 22px; font-family:'Cormorant Garamond',serif; font-size:16px; font-style:italic; color:rgba(245,240,232,0.65); }

  /* TESTIMONIALS */
  .testi-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:2px; margin-top:52px; }
  .testi-card { background:rgba(255,255,255,0.03); border:1px solid rgba(245,240,232,0.06); padding:32px 26px; }
  .testi-stars { color:#C9A84C; font-size:11px; margin-bottom:14px; letter-spacing:2px; }
  .testi-qm { font-family:'Cormorant Garamond',serif; font-size:60px; color:rgba(201,168,76,0.14); line-height:0.6; margin-bottom:16px; display:block; }
  .testi-txt { font-size:13.5px; line-height:1.8; color:rgba(245,240,232,0.7); font-style:italic; margin-bottom:20px; }
  .testi-name { font-size:11px; font-weight:600; color:#F5F0E8; }
  .testi-role { font-size:10px; color:rgba(245,240,232,0.32); margin-top:3px; }

  /* PRICE */
  .price-sec { background:#0E0804; position:relative; overflow:hidden; }
  .price-sec::before { content:''; position:absolute; top:-200px; left:50%; transform:translateX(-50%); width:600px; height:600px; border:1px solid rgba(201,168,76,0.05); border-radius:50%; pointer-events:none; }
  .price-card { background:rgba(255,255,255,0.03); border:1px solid rgba(201,168,76,0.2); border-radius:2px; padding:56px; position:relative; overflow:hidden; max-width:720px; margin:52px auto 0; }
  .price-card::before { content:''; position:absolute; top:0; left:0; right:0; height:3px; background:linear-gradient(to right,#C9A84C,#E8D5A3,#C9A84C); }
  .price-glow { position:absolute; top:-80px; right:-80px; width:260px; height:260px; background:radial-gradient(circle,rgba(201,168,76,0.08) 0%,transparent 70%); pointer-events:none; }
  .price-top { display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:20px; margin-bottom:8px; }
  .price-product { font-family:'Cormorant Garamond',serif; }
  .price-product-sub { font-size:18px; font-weight:300; color:rgba(245,240,232,0.45); margin-bottom:4px; }
  .price-product-title { font-size:26px; font-weight:400; color:#F5F0E8; }
  .price-num { font-family:'Cormorant Garamond',serif; font-size:76px; font-weight:300; color:#C9A84C; line-height:1; letter-spacing:-2px; }
  .price-num-lbl { font-size:12px; color:rgba(245,240,232,0.35); margin-top:4px; letter-spacing:1px; text-align:right; }
  .price-includes { display:grid; grid-template-columns:1fr 1fr; gap:10px; margin:28px 0; }
  .pi-item { display:flex; gap:10px; align-items:center; font-size:12.5px; color:rgba(245,240,232,0.7); }
  .pi-check { color:#C9A84C; font-weight:700; font-size:11px; flex-shrink:0; }
  .price-cta { display:flex; gap:14px; align-items:center; flex-wrap:wrap; margin-top:32px; }
  .btn-pay { background:linear-gradient(135deg,#C9A84C,#E8D5A3 50%,#C9A84C); background-size:200% 100%; color:#0E0804; border:none; padding:18px 48px; font-family:'Jost',sans-serif; font-size:11px; font-weight:700; letter-spacing:2px; text-transform:uppercase; cursor:pointer; border-radius:1px; transition:all 0.4s; white-space:nowrap; animation:floatUp 3s ease-in-out infinite; text-decoration:none; display:inline-block; }
  .btn-pay:hover { background-position:100% 0; transform:translateY(-3px) !important; box-shadow:0 16px 48px rgba(201,168,76,0.35); }
  .price-secure { font-size:11px; color:rgba(245,240,232,0.28); display:flex; align-items:center; gap:6px; }

  /* OTHER PRODUCTS */
  .other-sec { background:rgba(201,168,76,0.035); border-top:1px solid rgba(201,168,76,0.12); }
  .other-inner { text-align:center; }
  .other-desc { font-size:14px; color:rgba(245,240,232,0.52); max-width:480px; margin:14px auto 36px; line-height:1.75; }
  .other-btns { display:flex; gap:14px; justify-content:center; flex-wrap:wrap; }

  /* FOOTER */
  .footer { background:#060402; padding:40px 0; border-top:1px solid rgba(245,240,232,0.06); }
  .footer-inner { display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:20px; }
  .footer-logo { font-family:'Cormorant Garamond',serif; font-size:20px; font-weight:300; color:#C9A84C; letter-spacing:2px; }
  .footer-logo em { font-style:italic; }
  .footer-links { display:flex; gap:24px; }
  .footer-lnk { font-size:10px; letter-spacing:1.5px; text-transform:uppercase; color:rgba(245,240,232,0.28); cursor:pointer; transition:color 0.2s; background:none; border:none; }
  .footer-lnk:hover { color:#C9A84C; }
  .footer-copy { font-size:10px; color:rgba(245,240,232,0.18); }

  @media(max-width:768px){
    .container { padding:0 24px; }
    section { padding:64px 0; }
    .hero-content { padding:0 24px 52px; }
    .hero h1 { letter-spacing:-1px; }
    .what-grid,.why-grid { grid-template-columns:1fr; }
    .what-img-wrap { height:300px; }
    .why-photo { height:260px; position:relative; top:0; }
    .fw-grid { grid-template-columns:1fr; }
    .fw-card { height:260px; }
    .inside-grid { grid-template-columns:1fr; }
    .testi-grid { grid-template-columns:1fr; }
    .photo-band { grid-template-columns:1fr; height:auto; }
    .pb-item { height:180px; }
    .price-includes { grid-template-columns:1fr; }
    .price-card { padding:32px 24px; }
    .footer-inner { flex-direction:column; text-align:center; }
  }
`;

// ─────────────────────────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────────────────────────
const INCLUDES = [
  { icon:"◎", title:"Instagram Bio Templates", desc:"4 professional bios — Riding School, Livery, Trainer, Breeder. Built on the Who → What → Where → CTA conversion formula.", tag:"4 templates" },
  { icon:"◷", title:"30-Day Strategic Calendar", desc:"A full month of content across 5 pillars: Education, Trust, Engagement, Atmosphere and Sales — with daily post ideas and platform guidance.", tag:"30 posts planned" },
  { icon:"✉", title:"5-Email Enquiry Sequence", desc:"Automated sequence that handles every lesson or livery enquiry — from immediate reply through to 30-day re-engagement.", tag:"Plug & play" },
  { icon:"◉", title:"Google Business Setup Guide", desc:"Step-by-step instructions to appear in local equestrian searches, including a keyword-optimised description template.", tag:"SEO-ready" },
  { icon:"✦", title:"Caption Bank & Hashtag Sets", desc:"40+ ready-to-use captions across 4 content categories, plus curated hashtag groups for every discipline and business type.", tag:"Copy & paste" },
  { icon:"◐", title:"Market Trends 2026", desc:"6 real shifts in the equestrian market right now — with clear, actionable positioning advice for each one.", tag:"Strategic insight" },
];

const FOR_WHOM = [
  { src: IMGS.IMG_0764, title:"Riding Schools & Lesson Businesses", desc:"You're brilliant with horses but marketing takes hours you don't have. This handles it." },
  { src: IMGS.IMG_0769, title:"Livery Yards & Equestrian Centres", desc:"Attract the right liveries, fill spaces faster, and look as professional online as you are in person." },
  { src: IMGS.IMG_0767, title:"Trainers, Coaches & Clinicians", desc:"Position yourself as the authority in your discipline and grow your enquiries without writing from scratch every week." },
];

const WHY = [
  { icon:"⚡", title:"Ready in 15 minutes", desc:"Every template uses [brackets] you simply replace. No blank page, no guessing — just copy, customise and publish." },
  { icon:"🐴", title:"Built for equestrian, not generic", desc:"Written by people who know the difference between a 20m circle and a 20-metre arena. Every word sounds like you." },
  { icon:"📈", title:"Based on what works in 2026", desc:"Not recycled advice from 2020. The trends, language and strategies reflect what the equestrian market is responding to right now." },
  { icon:"💡", title:"One purchase, use forever", desc:"Reuse templates month after month across disciplines, seasons and promotions. This is infrastructure, not a one-off post." },
];

const TESTIMONIALS = [
  { text:"I was spending 3+ hours a week trying to figure out what to post. Now I batch a full month in two hours on Sunday. The calendar alone was worth the €15.", author:"Sarah M.", role:"Riding School, Kent", stars:"★★★★★" },
  { text:"The email sequence is brilliant. I set it up in an afternoon and it's been quietly converting enquiries ever since. Had 3 new liveries sign up last month.", author:"Tom H.", role:"Livery Yard, Yorkshire", stars:"★★★★★" },
  { text:"Finally a kit that actually knows what a livery yard is. The Instagram bio template had me fully set up in 20 minutes. Highly recommend.", author:"Emma R.", role:"Equestrian Centre, Surrey", stars:"★★★★★" },
];

// ─────────────────────────────────────────────────────────────────
// SCROLL REVEAL
// ─────────────────────────────────────────────────────────────────
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".fade-up");
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.1 }
    );
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

// ─────────────────────────────────────────────────────────────────
// APP
// ─────────────────────────────────────────────────────────────────
export default function App() {
  useReveal();

  const scrollTo = id => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  const handleBuy = () => {
    window.open(PAYMENT_URL, "_blank");
  };

  const handleOtherProducts = () => {
    window.open(CONFIG.PRODUCTS_PAGE, "_blank");
  };

  const handleMainSite = () => {
    window.open(CONFIG.MAIN_SITE, "_blank");
  };

  return (
    <>
      <style>{styles}</style>
      <div className="page">

        {/* ── HERO ── */}
        <section className="hero" id="top">
          <div className="hero-bg" style={{ backgroundImage: `url(${IMGS.IMG_0764})` }} />
          <div className="hero-content">
            <div className="hero-eyebrow">
              <span className="hero-dot" />
              Equesolution · Digital Product · 2026
            </div>
            <h1>Equestrian Business<br /><em>Marketing Kit</em></h1>
            <div className="hero-tagline">Everything you need to market your yard — done for you.</div>
            <div className="cta-row">
              <button className="btn-primary" onClick={handleBuy}>Get the Kit — €15 →</button>
              <button className="btn-ghost" onClick={() => scrollTo("inside")}>See what's inside</button>
            </div>
            <div className="hero-price">
              <div className="hero-price-n">€15</div>
              <div className="hero-price-l">excl. VAT · one-time · instant digital delivery</div>
            </div>
          </div>
        </section>

        <div className="divider" />

        {/* ── WHAT IS IT ── */}
        <section>
          <div className="container">
            <div className="what-grid">
              <div className="fade-up">
                <div className="what-img-wrap">
                  <img src={IMGS.IMG_0769} alt="Horses" />
                  <div className="what-img-ov" />
                  <div className="what-badge">Templates built for<br /><em>equestrian businesses</em></div>
                </div>
              </div>
              <div className="fade-up" style={{ transitionDelay: "0.15s" }}>
                <div className="lbl">What is it?</div>
                <div className="dtitle">A complete marketing toolkit,<br />built for <em>equestrian businesses</em></div>
                <p className="btext">You know horses. You know your yard. But marketing? That's the part that eats your evenings.</p>
                <p className="btext" style={{ marginTop: 16 }}>This kit gives you every template, framework and calendar you need to look professional online, attract the right clients, and convert enquiries into bookings — without starting from a blank page.</p>
                <ul className="what-list">
                  {["Instagram bios that convert visitors into enquiries", "A strategic 30-day content calendar — no more 'what do I post?'", "5 emails that handle enquiries automatically", "Google Business setup to appear in local searches", "40+ ready-to-use captions — copy, edit and publish", "2026 market trends so you stay ahead of the competition"].map((item, i) => (
                    <li key={i}><div className="wl-check">✓</div><span>{item}</span></li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <div className="divider" />

        {/* ── FOR WHOM ── */}
        <section className="for-whom" id="forwho">
          <div className="container">
            <div className="fade-up">
              <div className="lbl">Who is it for?</div>
              <div className="dtitle">Built for every kind of<br /><em>equestrian business</em></div>
              <p className="btext">You don't need a marketing background. You need the right templates — and about 15 minutes.</p>
            </div>
          </div>
          <div className="fw-grid fade-up" style={{ marginTop: 48, transitionDelay: "0.2s" }}>
            {FOR_WHOM.map((f, i) => (
              <div className="fw-card" key={i}>
                <img src={f.src} alt={f.title} />
                <div className="fw-ov">
                  <div className="fw-num">0{i + 1}</div>
                  <div className="fw-title">{f.title}</div>
                  <div className="fw-desc">{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="divider" />

        {/* ── INSIDE ── */}
        <section id="inside">
          <div className="container">
            <div className="fade-up">
              <div className="lbl">What's inside?</div>
              <div className="dtitle">6 complete tools,<br /><em>ready to use today</em></div>
              <p className="btext">Every template is written specifically for equestrian businesses. Fill in the [brackets], and you're done.</p>
            </div>
            <div className="inside-grid fade-up" style={{ transitionDelay: "0.15s" }}>
              {INCLUDES.map((item, i) => (
                <div className="inside-item" key={i}>
                  <div className="in-num">0{i + 1}</div>
                  <span className="in-icon">{item.icon}</span>
                  <div className="in-title">{item.title}</div>
                  <div className="in-desc">{item.desc}</div>
                  <div className="in-tag">{item.tag}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── PHOTO BAND ── */}
        <div className="photo-band">
          {[IMGS.IMG_0765, IMGS.IMG_0766, IMGS.IMG_0768].map((src, i) => (
            <div className="pb-item" key={i}><img src={src} alt="" /></div>
          ))}
        </div>

        {/* ── WHY BUY ── */}
        <section>
          <div className="container">
            <div className="fade-up">
              <div className="lbl">Why buy this?</div>
              <div className="dtitle">Stop spending evenings<br /><em>on marketing.</em></div>
            </div>
            <div className="why-grid fade-up" style={{ transitionDelay: "0.15s" }}>
              <div className="why-points">
                {WHY.map((w, i) => (
                  <div className="why-pt" key={i}>
                    <div className="why-icon">{w.icon}</div>
                    <div>
                      <div className="why-pt-title">{w.title}</div>
                      <div className="why-pt-desc">{w.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="why-photo">
                <img src={IMGS.IMG_0767} alt="" />
                <div className="why-caption">"Two hours on a Sunday. Done for the whole month."</div>
              </div>
            </div>
          </div>
        </section>

        <div className="divider" />

        {/* ── TESTIMONIALS ── */}
        <section style={{ paddingTop: 80, paddingBottom: 80 }}>
          <div className="container">
            <div className="fade-up" style={{ textAlign: "center" }}>
              <div className="lbl center">What buyers say</div>
              <div className="dtitle" style={{ textAlign: "center" }}>Real results from real<br /><em>equestrian businesses</em></div>
            </div>
            <div className="testi-grid fade-up" style={{ transitionDelay: "0.15s" }}>
              {TESTIMONIALS.map((t, i) => (
                <div className="testi-card" key={i}>
                  <div className="testi-stars">{t.stars}</div>
                  <span className="testi-qm">"</span>
                  <div className="testi-txt">{t.text}</div>
                  <div className="testi-name">{t.author}</div>
                  <div className="testi-role">{t.role}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="divider" />

        {/* ── PRICE ── */}
        <section className="price-sec" id="buy">
          <div className="container">
            <div className="fade-up" style={{ textAlign: "center" }}>
              <div className="lbl center">Get the kit</div>
              <div className="dtitle" style={{ textAlign: "center" }}>One price.<br /><em>Everything included.</em></div>
              <p className="btext" style={{ textAlign: "center", margin: "0 auto" }}>No subscription. No upsells. You get everything the moment you pay.</p>
            </div>
            <div className="price-card fade-up" style={{ transitionDelay: "0.2s" }}>
              <div className="price-glow" />
              <div className="price-top">
                <div className="price-product">
                  <div className="price-product-sub">Equestrian Business</div>
                  <div className="price-product-title">PR & Marketing Kit</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div className="price-num">€15</div>
                  <div className="price-num-lbl">excl. VAT · one-time payment</div>
                </div>
              </div>
              <div className="divider" style={{ margin: "24px 0" }} />
              <div className="price-includes">
                {["6 complete marketing tools", "Instagram Bio Templates (×4)", "30-Day Strategic Content Calendar", "5-Email Enquiry Sequence", "Google Business Setup Guide", "Caption Bank — 40+ captions", "Hashtag Strategy Sets", "Market Trends 2026", "Instant digital delivery", "Use forever — no expiry"].map((item, i) => (
                  <div className="pi-item" key={i}><span className="pi-check">✓</span>{item}</div>
                ))}
              </div>
              <div className="divider" style={{ margin: "24px 0" }} />
              <div className="price-cta">
                <button className="btn-pay" onClick={handleBuy}>
                  Buy Now — €15 · Instant Access →
                </button>
                <div className="price-secure">🔒 Secure payment · Delivered to your inbox</div>
              </div>
            </div>
          </div>
        </section>

        <div className="divider" />

        {/* ── OTHER PRODUCTS ── */}
        <section className="other-sec">
          <div className="container">
            <div className="fade-up other-inner">
              <div className="lbl center">Equesolution</div>
              <div className="dtitle" style={{ textAlign: "center" }}>Looking for something<br /><em>more tailored?</em></div>
              <div className="other-desc">
                This kit is our entry point. We also offer one-to-one strategy sessions, full bespoke marketing strategies, and a growing library of equestrian business products.
              </div>
              <div className="other-btns">
                <button className="btn-primary" style={{ animation: "none" }} onClick={handleOtherProducts}>
                  Browse All Products & Services →
                </button>
                <button className="btn-ghost" onClick={handleMainSite}>
                  Visit Equesolution.com
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer className="footer">
          <div className="container">
            <div className="footer-inner">
              <div className="footer-logo">Eques<em>olution</em></div>
              <div className="footer-links">
                {["Privacy Policy", "Terms", "Contact", "Instagram"].map(l => (
                  <button key={l} className="footer-lnk">{l}</button>
                ))}
              </div>
              <div className="footer-copy">© 2026 Equesolution. All rights reserved.</div>
            </div>
          </div>
        </footer>

      </div>
    </>
  );
}
