import { useState } from "react";
import { C, font, fontMono, fontSans } from "./theme";

// ─── Logo ────────────────────────────────
export const GovLogo = ({ size = 40, light = false }) => (
  <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
    <div style={{
      width: size, height: size,
      background: light ? "rgba(255,255,255,.15)" : C.wine,
      borderRadius: "50%",
      border: `2px solid ${light ? "rgba(255,255,255,.4)" : C.gold}`,
      display:"flex", alignItems:"center", justifyContent:"center", flexShrink: 0,
    }}>
      <svg width={size*.5} height={size*.5} viewBox="0 0 24 24" fill="none" stroke={light ? C.white : C.gold} strokeWidth="1.8">
        <circle cx="11" cy="11" r="7"/>
        <path d="m21 21-4.35-4.35"/>
        <path d="M11 7v8M7 11h8" strokeWidth="2"/>
      </svg>
    </div>
    <div>
      <div style={{ fontFamily:font, fontWeight:700, fontSize:size*.38, color:light?C.white:C.gray900, letterSpacing:"-.3px", lineHeight:1.1 }}>REUNITE</div>
      <div style={{ fontFamily:fontSans, fontSize:size*.2, fontWeight:400, color:light?"rgba(255,255,255,.7)":C.gray600, letterSpacing:".04em", textTransform:"uppercase", lineHeight:1 }}>Plataforma Nacional</div>
    </div>
  </div>
);

// ─── Section Header ───────────────────────
export const SectionHeader = ({ label, title, sub, accent = false }) => (
  <div style={{ marginBottom:"28px" }}>
    {label && (
      <div style={{ display:"inline-flex", alignItems:"center", gap:"8px", background:C.tealBg, border:`1px solid ${C.teal}44`, padding:"4px 12px", borderRadius:"2px", marginBottom:"10px" }}>
        <div style={{ width:"6px", height:"6px", borderRadius:"50%", background:C.teal }}/>
        <span style={{ fontFamily:fontSans, fontSize:"11px", fontWeight:700, color:C.teal, letterSpacing:".08em", textTransform:"uppercase" }}>{label}</span>
      </div>
    )}
    <h2 style={{ fontFamily:font, fontSize:"26px", fontWeight:700, color:accent?C.wine:C.gray900, lineHeight:1.2, marginBottom:"8px" }}>{title}</h2>
    {sub && <p style={{ fontFamily:fontSans, fontSize:"14px", color:C.gray600, maxWidth:"540px", lineHeight:1.6 }}>{sub}</p>}
    <div style={{ width:"48px", height:"3px", background:accent?C.gold:C.teal, marginTop:"12px" }}/>
  </div>
);

// ─── Card ─────────────────────────────────
export const GovCard = ({ children, style = {}, onClick }) => {
  const [hov, setHov] = useState(false);
  return (
    <div onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)} onClick={onClick}
      style={{ background:C.white, border:`1px solid ${hov?C.teal+"55":C.gray200}`, borderTop:`3px solid ${hov?C.teal:C.gray200}`, boxShadow:hov?"0 4px 20px rgba(0,132,127,.1)":"0 1px 4px rgba(0,0,0,.06)", transition:"all .25s", cursor:onClick?"pointer":"default", ...style }}>
      {children}
    </div>
  );
};

// ─── Tag ─────────────────────────────────
export const Tag = ({ children, color = C.teal }) => (
  <span style={{ display:"inline-block", padding:"2px 8px", borderRadius:"2px", background:color+"15", border:`1px solid ${color}33`, color, fontSize:"11px", fontFamily:fontSans, fontWeight:700, letterSpacing:".04em", textTransform:"uppercase" }}>{children}</span>
);

// ─── Button ──────────────────────────────
export const GovBtn = ({ children, onClick, type="button", variant="primary", disabled=false, full=false }) => {
  const [hov, setHov] = useState(false);
  const styles = {
    primary:   { bg:hov?C.tealL:C.teal,    color:C.white,   border:`1px solid ${C.teal}` },
    secondary: { bg:hov?C.gray100:C.white,  color:C.gray700, border:`1px solid ${C.gray200}` },
    wine:      { bg:hov?C.wineD:C.wine,     color:C.white,   border:`1px solid ${C.wine}` },
    ghost:     { bg:hov?C.tealBg:"transparent", color:C.teal, border:`1px solid ${C.teal}` },
  };
  const s = styles[variant];
  return (
    <button type={type} onClick={onClick} disabled={disabled}
      onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{ background:s.bg, color:s.color, border:s.border, padding:"9px 20px", borderRadius:"3px", fontFamily:fontSans, fontSize:"12px", fontWeight:700, letterSpacing:".06em", textTransform:"uppercase", cursor:disabled?"not-allowed":"pointer", opacity:disabled?.5:1, transition:"all .2s", width:full?"100%":"auto", display:"inline-flex", alignItems:"center", justifyContent:"center", gap:"6px" }}>
      {children}
    </button>
  );
};

// ─── Input ───────────────────────────────
export const GovInput = ({ label, required, hint, textarea, rows=3, value, onChange, ...props }) => (
  <div style={{ marginBottom:"16px" }}>
    {label && (
      <label style={{ display:"block", fontFamily:fontSans, fontSize:"12px", fontWeight:700, color:C.gray700, letterSpacing:".04em", textTransform:"uppercase", marginBottom:"6px" }}>
        {label}{required && <span style={{ color:"#CC0000", marginLeft:"3px" }}>*</span>}
      </label>
    )}
    {hint && <p style={{ fontFamily:fontSans, fontSize:"12px", color:C.gray600, marginBottom:"6px" }}>{hint}</p>}
    {textarea ? (
      <textarea rows={rows} value={value} onChange={onChange} {...props}
        style={{ width:"100%", padding:"9px 12px", border:`1px solid ${C.gray200}`, borderRadius:"3px", background:C.gray50, fontFamily:fontSans, fontSize:"13px", color:C.gray800, outline:"none", resize:"vertical", transition:"border-color .2s" }}
        onFocus={e=>e.target.style.borderColor=C.teal} onBlur={e=>e.target.style.borderColor=C.gray200}/>
    ) : (
      <input value={value} onChange={onChange} {...props}
        style={{ width:"100%", padding:"9px 12px", border:`1px solid ${C.gray200}`, borderRadius:"3px", background:C.gray50, fontFamily:fontSans, fontSize:"13px", color:C.gray800, outline:"none", transition:"border-color .2s" }}
        onFocus={e=>e.target.style.borderColor=C.teal} onBlur={e=>e.target.style.borderColor=C.gray200}/>
    )}
  </div>
);

// ─── Select ──────────────────────────────
export const GovSelect = ({ label, required, children, value, onChange }) => (
  <div style={{ marginBottom:"16px" }}>
    {label && (
      <label style={{ display:"block", fontFamily:fontSans, fontSize:"12px", fontWeight:700, color:C.gray700, letterSpacing:".04em", textTransform:"uppercase", marginBottom:"6px" }}>
        {label}{required && <span style={{ color:"#CC0000", marginLeft:"3px" }}>*</span>}
      </label>
    )}
    <select value={value} onChange={onChange}
      style={{ width:"100%", padding:"9px 12px", border:`1px solid ${C.gray200}`, borderRadius:"3px", background:C.gray50, fontFamily:fontSans, fontSize:"13px", color:C.gray800, outline:"none", cursor:"pointer" }}>
      {children}
    </select>
  </div>
);

// ─── InfoBox ─────────────────────────────
export const InfoBox = ({ type = "info", children }) => {
  const colors = {
    info:    { bg:"#EFF6FF", border:"#BFDBFE", icon:"ℹ", text:"#1D4ED8" },
    warn:    { bg:"#FFFBEB", border:"#FDE68A", icon:"⚠", text:"#92400E" },
    success: { bg:C.tealBg,  border:C.teal+"44", icon:"✓", text:C.teal },
    danger:  { bg:"#FEF2F2", border:"#FECACA", icon:"✕", text:"#DC2626" },
  };
  const c = colors[type];
  return (
    <div style={{ background:c.bg, border:`1px solid ${c.border}`, borderLeft:`4px solid ${c.text}`, padding:"12px 16px", marginBottom:"16px", display:"flex", gap:"10px", alignItems:"flex-start" }}>
      <span style={{ color:c.text, fontWeight:700, fontSize:"14px", flexShrink:0 }}>{c.icon}</span>
      <div style={{ fontFamily:fontSans, fontSize:"13px", color:C.gray700, lineHeight:1.5 }}>{children}</div>
    </div>
  );
};

// ─── Modal ───────────────────────────────
export const Modal = ({ show, onClose, title, children }) => {
  if (!show) return null;
  return (
    <div style={{ position:"fixed", inset:0, zIndex:100, display:"flex", alignItems:"center", justifyContent:"center", padding:"16px", background:"rgba(0,0,0,.55)", backdropFilter:"blur(3px)" }}>
      <div style={{ background:C.white, width:"100%", maxWidth:"480px", boxShadow:"0 20px 60px rgba(0,0,0,.2)" }}>
        <div style={{ background:C.wine, padding:"14px 20px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <h3 style={{ fontFamily:font, fontSize:"16px", fontWeight:700, color:C.white }}>{title}</h3>
          <button onClick={onClose} style={{ background:"none", border:"none", color:"rgba(255,255,255,.7)", fontSize:"18px", cursor:"pointer", lineHeight:1 }}>✕</button>
        </div>
        <div style={{ padding:"24px 20px" }}>{children}</div>
      </div>
    </div>
  );
};

// ─── PageWrap ────────────────────────────
export const PageWrap = ({ children }) => (
  <div style={{ maxWidth:"1200px", margin:"0 auto", padding:"32px 24px" }}>{children}</div>
);

// ─── Divider ─────────────────────────────
export const Divider = () => (
  <div style={{ height:"1px", background:C.gray200, margin:"24px 0" }}/>
);

// ─── Section divider label ───────────────
export const SecTitle = ({ num, title }) => (
  <div style={{ fontFamily:fontSans, fontSize:"11px", fontWeight:700, color:C.wine, letterSpacing:".08em", textTransform:"uppercase", marginBottom:"14px", padding:"8px 0", borderBottom:`2px solid ${C.wine}` }}>
    {num}. {title}
  </div>
);
