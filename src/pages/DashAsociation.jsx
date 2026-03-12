import { useState } from "react";
import { C, font, fontSans } from "../shared/theme";
import { SectionHeader, GovCard, Tag, GovBtn, Modal } from "../shared/components";

const DashAsociation = ({ setPage, onLogout }) => {
  const [logoutModal, setLogoutModal] = useState(false);

  const assoc = {
    nombre:"Asociación Civil para el Desarrollo Comunitario A.C.",
    ciudad:"Ciudad de México", representante:"María González Hernández",
    telefono:"+52 55 1234 5678", email:"contacto@asociacion.org",
    domicilio:"Av. Reforma 123, Col. Centro, CDMX, CP 06040",
    integrantes:"45 miembros", registro:"15/03/2020",
  };

  const tools = [
    { icon:"", tag:"IA",       title:"Buscar Coincidencias de Evidencia", desc:"Identifica prendas, objetos y personas mediante comparación inteligente de imágenes y datos.", page:"search-matches" },
    { icon:"", tag:"Registro", title:"Subir Persona Desaparecida",        desc:"Agrega una nueva ficha al Registro Nacional de Personas Desaparecidas o No Localizadas.",     page:"add-person" },
    { icon:"", tag:"Campo",    title:"Registrar Lugar de Búsqueda",       desc:"Documenta áreas, condiciones y evidencia encontrada durante operativos de búsqueda.",          page:"search-place" },
    { icon:"", tag:"Análisis", title:"Estadísticas y Reportes",           desc:"Consulta indicadores, tendencias y datos de tu asociación e indicadores nacionales.",           page:"statistics" },
  ];

  const statsLocal = [
    { n:"24",  label:"Casos Activos" },
    { n:"156", label:"Casos Resueltos" },
    { n:"12",  label:"Colaboradores" },
    { n:"89%", label:"Efectividad" },
  ];

  return (
    <div style={{ minHeight:"80vh", background:C.gray50 }}>
      {/* ── Header ── */}
      <div style={{ background:C.wine, borderBottom:`3px solid ${C.gold}` }}>
        <div style={{ maxWidth:"1200px", margin:"0 auto", padding:"20px 24px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div>
            <div style={{ fontFamily:fontSans, fontSize:"11px", fontWeight:700, color:C.gold, letterSpacing:".1em", textTransform:"uppercase", marginBottom:"4px" }}>PANEL DE CONTROL — ASOCIACIONES</div>
            <h1 style={{ fontFamily:font, fontSize:"22px", fontWeight:700, color:C.white }}>{assoc.nombre}</h1>
          </div>
          <div style={{ display:"flex", gap:"10px", alignItems:"center" }}>
            <Tag color={C.gold}>● Activa y Verificada</Tag>
            <button onClick={()=>setLogoutModal(true)} style={{ background:"transparent", border:"1px solid rgba(255,255,255,.4)", color:C.white, padding:"9px 20px", borderRadius:"3px", fontFamily:fontSans, fontSize:"12px", fontWeight:700, letterSpacing:".06em", textTransform:"uppercase", cursor:"pointer" }}>Cerrar Sesión</button>
          </div>
        </div>
        {/* Stats bar */}
        <div style={{ maxWidth:"1200px", margin:"0 auto", padding:"0 24px 20px", display:"flex", gap:"24px", flexWrap:"wrap" }}>
          {statsLocal.map((s,i) => (
            <div key={i} style={{ background:"rgba(255,255,255,.1)", padding:"10px 20px", borderLeft:`3px solid ${C.tealL}` }}>
              <div style={{ fontFamily:font, fontSize:"22px", fontWeight:900, color:C.white }}>{s.n}</div>
              <div style={{ fontFamily:fontSans, fontSize:"11px", color:"rgba(255,255,255,.7)", textTransform:"uppercase", letterSpacing:".04em" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Body ── */}
      <div style={{ maxWidth:"1200px", margin:"0 auto", padding:"32px 24px" }}>
        <div style={{ display:"grid", gridTemplateColumns:"300px 1fr", gap:"24px", alignItems:"start" }}>

          {/* Left: Assoc info card */}
          <div>
            <div style={{ background:C.white, border:`1px solid ${C.gray200}`, marginBottom:"16px" }}>
              <div style={{ background:C.gray50, padding:"12px 16px", borderBottom:`1px solid ${C.gray200}`, fontFamily:fontSans, fontSize:"11px", fontWeight:700, color:C.gray600, letterSpacing:".06em", textTransform:"uppercase" }}>DATOS DE LA ASOCIACIÓN</div>
              <div style={{ padding:"16px" }}>
                {[
                  ["Ciudad de Origen",    assoc.ciudad],
                  ["Representante Legal", assoc.representante],
                  ["Teléfono",            assoc.telefono],
                  ["Correo Electrónico",  assoc.email],
                  ["Domicilio",           assoc.domicilio],
                  ["N.° de Integrantes",  assoc.integrantes],
                  ["Fecha de Registro",   assoc.registro],
                ].map(([k,v]) => (
                  <div key={k} style={{ padding:"8px 0", borderBottom:`1px solid ${C.gray100}` }}>
                    <div style={{ fontFamily:fontSans, fontSize:"10px", fontWeight:700, color:C.gray400, textTransform:"uppercase", letterSpacing:".06em" }}>{k}</div>
                    <div style={{ fontFamily:fontSans, fontSize:"13px", color:C.gray800, fontWeight:500, marginTop:"2px" }}>{v}</div>
                  </div>
                ))}
                <div style={{ marginTop:"12px" }}><GovBtn full>Editar Información</GovBtn></div>
              </div>
            </div>

            {/* Resources */}
            <div style={{ background:C.tealBg, border:`1px solid ${C.teal}33`, padding:"16px" }}>
              <div style={{ fontFamily:fontSans, fontSize:"11px", fontWeight:700, color:C.teal, letterSpacing:".06em", textTransform:"uppercase", marginBottom:"10px" }}>RECURSOS</div>
              {["Manual de Usuario","Normatividad Vigente","Guía de Reportes","Soporte Técnico"].map(l => (
                <div key={l} style={{ padding:"7px 0", borderBottom:`1px solid ${C.teal}22` }}>
                  <button style={{ background:"none", border:"none", fontFamily:fontSans, fontSize:"13px", color:C.teal, cursor:"pointer" }}>→ {l}</button>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Tool cards */}
          <div>
            <SectionHeader label="Herramientas" title="Panel de Gestión"/>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"14px" }}>
              {tools.map((t,i) => (
                <GovCard key={i} style={{ padding:"20px" }} onClick={()=>setPage(t.page)}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"12px" }}>
                    <div style={{ width:"40px", height:"40px", background:C.tealBg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"18px", border:`1px solid ${C.teal}33` }}>{t.icon}</div>
                    <Tag>{t.tag}</Tag>
                  </div>
                  <h3 style={{ fontFamily:font, fontSize:"15px", fontWeight:700, color:C.gray900, marginBottom:"6px", lineHeight:1.2 }}>{t.title}</h3>
                  <p style={{ fontFamily:fontSans, fontSize:"12px", color:C.gray600, lineHeight:1.6, marginBottom:"14px" }}>{t.desc}</p>
                  <GovBtn full onClick={e=>{e.stopPropagation();setPage(t.page);}}>Acceder →</GovBtn>
                </GovCard>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Logout modal */}
      <Modal show={logoutModal} onClose={()=>setLogoutModal(false)} title="Confirmar Cierre de Sesión">
        <p style={{ fontFamily:fontSans, fontSize:"13px", color:C.gray700, marginBottom:"20px", lineHeight:1.7 }}>Estás a punto de cerrar tu sesión en el panel de asociaciones. ¿Deseas continuar?</p>
        <div style={{ display:"flex", gap:"10px" }}>
          <GovBtn variant="secondary" onClick={()=>setLogoutModal(false)} full>Cancelar</GovBtn>
          <GovBtn variant="wine" onClick={onLogout} full>Sí, Cerrar Sesión</GovBtn>
        </div>
      </Modal>
    </div>
  );
};

export default DashAsociation;
