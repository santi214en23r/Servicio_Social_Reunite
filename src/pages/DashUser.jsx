import { useState, useEffect } from "react";
import { C, font, fontSans } from "../shared/theme";
import { SectionHeader, GovCard, Tag, GovBtn, Divider } from "../shared/components";

const PageWrap = ({ children }) => (
  <div style={{ maxWidth:"1200px", margin:"0 auto", padding:"32px 24px" }}>{children}</div>
);

const DashUser = ({ setPage }) => {
  const [slide, setSlide] = useState(0);
  const slides = [
    { label:"Plataforma Nacional de Búsqueda", title:"#HastaEncontrarles", sub:"Sistema Inteligente de Detección y Búsqueda de Personas Desaparecidas en México. Tecnología e Inteligencia Artificial al servicio de la justicia.", cta:"Realizar Búsqueda", ctaPage:"search-matches", cta2:"Reportar Caso", cta2Page:"add-person", accent:C.teal },
    { label:"Medidas de Prevención", title:"Medidas de Prevención de la Desaparición de Personas", sub:"Conoce los protocolos establecidos para la búsqueda y localización inmediata de personas no localizadas.", cta:"Ver Estadísticas", ctaPage:"statistics", cta2:"Acceso Asociaciones", cta2Page:"register-assoc", accent:C.gold },
    { label:"Acceso para Asociaciones", title:"Herramientas Profesionales para Colectivos de Búsqueda", sub:"Acceso especializado para asociaciones civiles, colectivos de búsqueda y autoridades.", cta:"Acceso Asociaciones", ctaPage:"register-assoc", cta2:"Ver Manual", cta2Page:"statistics", accent:C.tealL },
  ];
  const s = slides[slide];

  useEffect(() => {
    const t = setInterval(() => setSlide(x => (x+1)%slides.length), 6000);
    return () => clearInterval(t);
  }, []);

  const impactStats = [
    { n:"125,232", label:"Personas Desaparecidas Registradas" },
    { n:"54,321",  label:"Personas Localizadas" },
    { n:"89",      label:"Organizaciones Aliadas" },
    { n:"24/7",    label:"Atención Disponible" },
  ];

  const actions = [
    { icon:"", tag:"Ciudadano", title:"Buscar Coincidencias", desc:"Sistema con IA para identificar prendas, objetos y personas relacionadas con casos activos.", page:"search-matches", btn:"Acceder al Sistema" },
    { icon:"", tag:"Reporte", title:"Reportar Persona Desaparecida", desc:"Registro oficial para su incorporación al sistema nacional de personas desaparecidas.", page:"add-person", btn:"Iniciar Reporte", wine:true },
    { icon:"", tag:"Información", title:"Estadísticas Nacionales", desc:"Datos en tiempo real por estado, género, grupo etario y tendencia mensual.", page:"statistics", btn:"Consultar Datos" },
    { icon:"", tag:"Asociaciones", title:"Acceso para Organizaciones", desc:"Panel especializado para asociaciones civiles, colectivos y autoridades participantes.", page:"register-assoc", btn:"Registro / Acceso" },
  ];

  return (
    <div>
      {/* ── Hero ── */}
      <div style={{
        background:`linear-gradient(105deg, ${C.wineD} 0%, ${C.wine} 40%, #8B0040 100%)`,
        position:"relative", overflow:"hidden", minHeight:"400px", display:"flex", alignItems:"center",
        backgroundImage:`repeating-linear-gradient(45deg,transparent,transparent 10px,rgba(0,0,0,.018) 10px,rgba(0,0,0,.018) 11px), linear-gradient(105deg,${C.wineD} 0%,${C.wine} 40%,#8B0040 100%)`
      }}>
        <div style={{ position:"absolute", right:0, top:0, width:"45%", height:"100%", background:`linear-gradient(135deg,transparent 0%,${C.teal}22 100%)`, borderLeft:`2px solid ${C.teal}44` }}/>
        <div style={{ position:"absolute", right:"5%", top:"10%", width:"300px", height:"300px", borderRadius:"50%", border:`1px solid ${C.teal}22` }}/>

        <div style={{ maxWidth:"1200px", margin:"0 auto", padding:"60px 24px", width:"100%", position:"relative", zIndex:2 }}>
          <div style={{ maxWidth:"580px" }}>
            <div style={{ display:"inline-flex", alignItems:"center", gap:"8px", background:"rgba(255,255,255,.08)", border:`1px solid ${s.accent}66`, padding:"5px 14px", borderRadius:"2px", marginBottom:"20px" }}>
              <div style={{ width:"6px", height:"6px", borderRadius:"50%", background:s.accent, animation:"pulseDot 1.8s infinite" }}/>
              <span style={{ fontFamily:fontSans, fontSize:"11px", fontWeight:700, color:s.accent, letterSpacing:".1em", textTransform:"uppercase" }}>{s.label}</span>
            </div>
            <h1 style={{ fontFamily:font, fontSize:"clamp(28px,4vw,48px)", fontWeight:900, color:C.white, lineHeight:1.1, marginBottom:"16px" }}>{s.title}</h1>
            <p style={{ fontFamily:fontSans, fontSize:"15px", color:"rgba(255,255,255,.75)", lineHeight:1.7, marginBottom:"28px", maxWidth:"480px" }}>{s.sub}</p>
            <div style={{ display:"flex", gap:"12px", flexWrap:"wrap" }}>
              <GovBtn onClick={()=>setPage(s.ctaPage)}>{s.cta}</GovBtn>
              <button onClick={()=>setPage(s.cta2Page)} style={{ background:"transparent", border:"1px solid rgba(255,255,255,.4)", color:C.white, padding:"9px 20px", borderRadius:"3px", fontFamily:fontSans, fontSize:"12px", fontWeight:700, letterSpacing:".06em", textTransform:"uppercase", cursor:"pointer" }}>{s.cta2}</button>
            </div>
          </div>
        </div>

        {/* Slide dots */}
        <div style={{ position:"absolute", bottom:"20px", left:"50%", transform:"translateX(-50%)", display:"flex", gap:"6px" }}>
          {slides.map((_,i) => (
            <button key={i} onClick={()=>setSlide(i)} style={{ width:i===slide?"28px":"8px", height:"4px", borderRadius:"2px", background:i===slide?C.white:"rgba(255,255,255,.3)", border:"none", cursor:"pointer", transition:"all .3s" }}/>
          ))}
        </div>
      </div>

      {/* ── Impact stats bar ── */}
      <div style={{ background:C.teal }}>
        <div style={{ maxWidth:"1200px", margin:"0 auto", display:"grid", gridTemplateColumns:"repeat(4,1fr)" }}>
          {impactStats.map((s,i) => (
            <div key={i} style={{ padding:"18px 20px", textAlign:"center", borderRight:i<3?`1px solid rgba(255,255,255,.15)`:"none" }}>
              <div style={{ fontFamily:font, fontSize:"26px", fontWeight:900, color:C.white }}>{s.n}</div>
              <div style={{ fontFamily:fontSans, fontSize:"11px", color:"rgba(255,255,255,.8)", textTransform:"uppercase", letterSpacing:".04em", marginTop:"2px" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Action cards ── */}
      <PageWrap>
        <div style={{ marginTop:"8px" }}>
          <SectionHeader label="Servicios disponibles" title="¿Cómo podemos ayudarte?" sub="REUNITE ofrece herramientas especializadas para la búsqueda de personas desaparecidas. Selecciona la opción que mejor se adapte a tu situación."/>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(250px,1fr))", gap:"16px" }}>
            {actions.map((a,i) => (
              <GovCard key={i} style={{ padding:"24px" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"14px" }}>
                  <div style={{ width:"44px", height:"44px", background:C.tealBg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"20px", border:`1px solid ${C.teal}33` }}>{a.icon}</div>
                  <Tag color={a.wine?C.wine:C.teal}>{a.tag}</Tag>
                </div>
                <h3 style={{ fontFamily:font, fontSize:"17px", fontWeight:700, color:C.gray900, marginBottom:"8px", lineHeight:1.2 }}>{a.title}</h3>
                <p style={{ fontFamily:fontSans, fontSize:"13px", color:C.gray600, lineHeight:1.6, marginBottom:"18px" }}>{a.desc}</p>
                <GovBtn variant={a.wine?"wine":"primary"} onClick={()=>setPage(a.page)} full>{a.btn} →</GovBtn>
              </GovCard>
            ))}
          </div>
        </div>

        <Divider/>

        {/* ── About / protocols ── */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"32px", alignItems:"start" }}>
          <div>
            <SectionHeader label="Sobre la plataforma" title="¿Qué es REUNITE?" accent/>
            <p style={{ fontFamily:fontSans, fontSize:"14px", color:C.gray700, lineHeight:1.8, marginBottom:"16px" }}>REUNITE es una plataforma tecnológica basada en inteligencia artificial diseñada para mejorar la búsqueda y localización de personas desaparecidas en México. Analiza datos de diversas fuentes, incluyendo bases públicas y reportes de colectivos de búsqueda.</p>
            <p style={{ fontFamily:fontSans, fontSize:"14px", color:C.gray700, lineHeight:1.8 }}>Su enfoque humanístico garantiza el pleno respeto a la dignidad, privacidad y derechos humanos de las víctimas y sus familias, conforme a la normatividad nacional e internacional vigente.</p>
            <div style={{ marginTop:"20px", display:"flex", gap:"10px" }}>
              <GovBtn variant="ghost" onClick={()=>setPage("statistics")}>Ver Estadísticas</GovBtn>
              <GovBtn variant="secondary" onClick={()=>setPage("register-assoc")}>Acceso Organizaciones</GovBtn>
            </div>
          </div>
          <div style={{ background:C.cream, border:`1px solid ${C.gray200}`, padding:"20px" }}>
            <div style={{ fontFamily:fontSans, fontSize:"11px", fontWeight:700, color:C.wine, letterSpacing:".08em", textTransform:"uppercase", marginBottom:"14px", display:"flex", alignItems:"center", gap:"8px" }}>
              <div style={{ width:"6px", height:"6px", background:C.wine, borderRadius:"50%" }}/>
              SISTEMAS Y PROTOCOLOS VIGENTES
            </div>
            {[
              { name:"Alerta AMBER México", desc:"Menores desaparecidos — FGR", since:"2011" },
              { name:"Protocolo Alba", desc:"Mujeres y niñas — CONAVIM", since:"2003" },
              { name:"Comisión Nacional de Búsqueda", desc:"CNB — SEGOB", since:"2017" },
              { name:"RNPDNO", desc:"Registro Nacional Público", since:"2019" },
            ].map((p,i) => (
              <div key={i} style={{ padding:"10px 0", borderBottom:`1px solid ${C.gray200}`, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <div>
                  <div style={{ fontFamily:fontSans, fontSize:"13px", fontWeight:700, color:C.gray900 }}>{p.name}</div>
                  <div style={{ fontFamily:fontSans, fontSize:"11px", color:C.gray600 }}>{p.desc}</div>
                </div>
                <Tag color={C.gold}>{p.since}</Tag>
              </div>
            ))}
          </div>
        </div>
      </PageWrap>

      {/* ── Emergency banner ── */}
      <div style={{ background:C.wine, padding:"28px 24px" }}>
        <div style={{ maxWidth:"1200px", margin:"0 auto", display:"flex", justifyContent:"space-between", alignItems:"center", gap:"20px", flexWrap:"wrap" }}>
          <div>
            <div style={{ fontFamily:fontSans, fontSize:"11px", fontWeight:700, color:C.gold, letterSpacing:".1em", textTransform:"uppercase", marginBottom:"4px" }}>ATENCIÓN DE EMERGENCIA</div>
            <h3 style={{ fontFamily:font, fontSize:"22px", fontWeight:700, color:C.white }}>¿Es una emergencia? Actúa de inmediato.</h3>
            <p style={{ fontFamily:fontSans, fontSize:"13px", color:"rgba(255,255,255,.75)", marginTop:"4px" }}>Si una persona acaba de desaparecer, no esperes. Cada minuto es crucial.</p>
          </div>
          <div style={{ display:"flex", gap:"12px", flexWrap:"wrap" }}>
            <GovBtn>Llamar al 911</GovBtn>
            <button onClick={()=>setPage("add-person")} style={{ background:"transparent", border:"1px solid rgba(255,255,255,.5)", color:C.white, padding:"9px 20px", borderRadius:"3px", fontFamily:fontSans, fontSize:"12px", fontWeight:700, letterSpacing:".06em", textTransform:"uppercase", cursor:"pointer" }}>Reportar Inmediatamente</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashUser;
