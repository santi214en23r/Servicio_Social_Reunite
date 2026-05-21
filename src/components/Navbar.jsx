import { useState } from "react";
import { C, font, fontSans } from "../shared/theme";
import { GovLogo } from "../shared/components";

const GovTopBar = () => (
  <div style={{ background:C.wineD, height:"32px", display:"flex", alignItems:"center", justifyContent:"flex-end", padding:"0 24px", gap:"16px" }}>
    {["Trámites","Gobierno","Contacto"].map(l => (
      <span key={l} style={{ fontFamily:fontSans, fontSize:"11px", color:"rgba(255,255,255,.75)", fontWeight:500, letterSpacing:".03em", cursor:"pointer" }}
        onMouseEnter={e=>e.target.style.color="#fff"} onMouseLeave={e=>e.target.style.color="rgba(255,255,255,.75)"}>{l}</span>
    ))}
    <span style={{ color:"rgba(255,255,255,.3)", fontSize:"11px" }}>|</span>
    <span style={{ fontFamily:fontSans, fontSize:"11px", color:"rgba(255,255,255,.75)", letterSpacing:".03em" }}>gob.mx</span>
  </div>
);

const NavLink = ({ children, active, onClick }) => (
  <button onClick={onClick} style={{ background:active?"rgba(255,255,255,.2)":"transparent", border:"none", color:C.white, padding:"14px 14px", fontSize:"12.5px", fontFamily:fontSans, fontWeight:active?700:500, letterSpacing:".04em", textTransform:"uppercase", borderBottom:active?`3px solid ${C.white}`:"3px solid transparent", transition:"all .2s", cursor:"pointer" }}
    onMouseEnter={e=>{ if(!active) e.currentTarget.style.background="rgba(255,255,255,.1)"; }}
    onMouseLeave={e=>{ if(!active) e.currentTarget.style.background="transparent"; }}>
    {children}
  </button>
);

const QuickBtn = ({ icon, label, onClick, accent }) => (
  <button onClick={onClick} style={{ display:"flex", alignItems:"center", gap:"4px", background:accent?C.wine:"rgba(255,255,255,.12)", border:`1px solid ${accent?C.wine:"rgba(255,255,255,.25)"}`, color:C.white, padding:"5px 10px", borderRadius:"20px", fontSize:"11px", fontFamily:fontSans, fontWeight:600, letterSpacing:".04em", textTransform:"uppercase", cursor:"pointer", transition:"all .2s" }}
    onMouseEnter={e=>e.currentTarget.style.background=accent?C.wineD:"rgba(255,255,255,.22)"}
    onMouseLeave={e=>e.currentTarget.style.background=accent?C.wine:"rgba(255,255,255,.12)"}>
    <span style={{fontSize:"12px"}}>{icon}</span>{label}
  </button>
);

export const Navbar = ({ page, setPage, isAssoc, onLogout }) => {
  const userLinks = [
    { id:"home",           label:"Inicio" },
    { id:"reportes",       label:"Reportes" },
    { id:"galeria",        label:"Imágenes" },
    { id:"search-matches", label:"Búsqueda" },
    { id:"add-person",     label:"Reporte" },
    { id:"statistics",     label:"Estadística" },
    { id:"register-assoc", label:"Acceso Asociaciones" },
  ];
  const assocLinks = [
    { id:"dash-assoc",     label:"Panel" },
    { id:"reportes",       label:"Reportes" },
    { id:"galeria",        label:"Imágenes" },
    { id:"add-person",     label:"Subir Persona" },
    { id:"search-place",   label:"Lugar de Búsqueda" },
    { id:"search-matches", label:"Coincidencias" },
    { id:"statistics",     label:"Estadísticas" },
  ];
  const links = isAssoc ? assocLinks : userLinks;

  return (
    <>
      <GovTopBar />
      {/* Logo + buscador */}
      <div style={{ background:C.white, borderBottom:`1px solid ${C.gray200}`, padding:"0 24px", height:"60px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <button onClick={()=>setPage(isAssoc?"dash-assoc":"home")} style={{background:"none",border:"none"}}>
          <GovLogo size={38}/>
        </button>
        <div style={{ display:"flex", alignItems:"center", gap:"8px" }}>
          <div style={{ display:"flex", alignItems:"center", gap:"6px", border:`1px solid ${C.gray200}`, borderRadius:"4px", padding:"6px 12px", background:C.gray50 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.gray400} strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            <input placeholder="Buscar en el sitio…" style={{ border:"none", background:"transparent", outline:"none", fontSize:"13px", fontFamily:fontSans, color:C.gray800, width:"180px" }}/>
          </div>
          <button style={{ background:C.teal, color:C.white, border:"none", padding:"7px 14px", borderRadius:"4px", fontSize:"12px", fontFamily:fontSans, fontWeight:600, letterSpacing:".04em" }}>BUSCAR</button>
        </div>
      </div>
      {/* Nav links */}
      <nav style={{ background:C.teal, display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 20px", position:"sticky", top:0, zIndex:50, boxShadow:"0 2px 8px rgba(0,0,0,.15)" }}>
        <div style={{ display:"flex", alignItems:"center", gap:"2px" }}>
          {links.map(l => <NavLink key={l.id} active={page===l.id} onClick={()=>setPage(l.id)}>{l.label}</NavLink>)}
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:"8px" }}>
          <QuickBtn icon="" label="Llámanos" onClick={()=>{}}/>
          <QuickBtn icon="" label="Reporte" onClick={()=>setPage("add-person")} accent/>
          <QuickBtn icon="" label="Consulta" onClick={()=>setPage("search-matches")}/>
          <QuickBtn icon="" label="Estadística" onClick={()=>setPage("statistics")}/>
          {isAssoc && (
            <button onClick={onLogout} style={{ marginLeft:"8px", background:"rgba(255,255,255,.15)", border:"1px solid rgba(255,255,255,.3)", color:C.white, fontSize:"11px", fontFamily:fontSans, fontWeight:600, padding:"5px 10px", borderRadius:"3px", letterSpacing:".04em" }}>CERRAR SESIÓN</button>
          )}
          {["f","𝕏","▶"].map((s,i) => (
            <span key={i} style={{ color:"rgba(255,255,255,.8)", fontSize:"14px", padding:"4px 6px", cursor:"pointer", fontWeight:"bold" }}>{s}</span>
          ))}
        </div>
      </nav>
    </>
  );
};

export default Navbar;
