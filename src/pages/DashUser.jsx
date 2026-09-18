import { useState, useEffect } from "react";
import { C, font, fontSans } from "../shared/theme";
import { SectionHeader, GovCard, Tag, GovBtn, Divider } from "../shared/components";
import "../styles/pages/DashUser.css";

const PageWrap = ({ children }) => (
  <div className="dash-user-page-wrap">{children}</div>
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
    <div className="dash-user-page">
      {/* ── Hero ── */}
      <div className="dash-user-hero">
        <div className="dash-user-hero-panel"/>
        <div className="dash-user-hero-ring"/>

        <div className="dash-user-hero-inner">
          <div className="dash-user-hero-copy">
            <div className="dash-user-hero-label" style={{ "--slide-accent": s.accent }}>
              <div className="dash-user-hero-dot"/>
              <span>{s.label}</span>
            </div>
            <h1 className="dash-user-hero-title">{s.title}</h1>
            <p className="dash-user-hero-subtitle">{s.sub}</p>
            <div className="dash-user-hero-actions">
              <GovBtn onClick={()=>setPage(s.ctaPage)}>{s.cta}</GovBtn>
              <button onClick={()=>setPage(s.cta2Page)} className="dash-user-outline-button">{s.cta2}</button>
            </div>
          </div>
        </div>

        {/* Slide dots */}
        <div className="dash-user-slide-dots">
          {slides.map((_,i) => (
            <button key={i} onClick={()=>setSlide(i)} className={`dash-user-slide-dot ${i===slide ? "is-active" : ""}`}/>
          ))}
        </div>
      </div>

      {/* ── Impact stats bar ── */}
      <div className="dash-user-impact">
        <div className="dash-user-impact-grid">
          {impactStats.map((s,i) => (
            <div key={i} className={`dash-user-impact-stat ${i<3 ? "has-divider" : ""}`}>
              <div className="dash-user-impact-value">{s.n}</div>
              <div className="dash-user-impact-label">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Action cards ── */}
      <PageWrap>
        <div className="dash-user-services">
          <SectionHeader label="Servicios disponibles" title="¿Cómo podemos ayudarte?" sub="REUNITE ofrece herramientas especializadas para la búsqueda de personas desaparecidas. Selecciona la opción que mejor se adapte a tu situación."/>
          <div className="reunite-page-grid dash-user-actions-grid">
            {actions.map((a,i) => (
              <GovCard key={i} className="dash-user-action-card">
                <div className="dash-user-action-top">
                  <div className="dash-user-action-icon">{a.icon}</div>
                  <Tag color={a.wine?C.wine:C.teal}>{a.tag}</Tag>
                </div>
                <h3 className="dash-user-action-title">{a.title}</h3>
                <p className="dash-user-action-description">{a.desc}</p>
                <GovBtn variant={a.wine?"wine":"primary"} onClick={()=>setPage(a.page)} full>{a.btn} →</GovBtn>
              </GovCard>
            ))}
          </div>
        </div>

        <Divider/>

        {/* ── About / protocols ── */}
        <div className="reunite-page-grid dash-user-about-grid">
          <div>
            <SectionHeader label="Sobre la plataforma" title="¿Qué es REUNITE?" accent/>
            <p className="dash-user-about-text dash-user-about-text-spaced">REUNITE es una plataforma tecnológica basada en inteligencia artificial diseñada para mejorar la búsqueda y localización de personas desaparecidas en México. Analiza datos de diversas fuentes, incluyendo bases públicas y reportes de colectivos de búsqueda.</p>
            <p className="dash-user-about-text">Su enfoque humanístico garantiza el pleno respeto a la dignidad, privacidad y derechos humanos de las víctimas y sus familias, conforme a la normatividad nacional e internacional vigente.</p>
            <div className="dash-user-about-actions">
              <GovBtn variant="ghost" onClick={()=>setPage("statistics")}>Ver Estadísticas</GovBtn>
              <GovBtn variant="secondary" onClick={()=>setPage("register-assoc")}>Acceso Organizaciones</GovBtn>
            </div>
          </div>
          <div className="dash-user-protocols">
            <div className="dash-user-protocols-heading">
              <div className="dash-user-protocols-dot"/>
              SISTEMAS Y PROTOCOLOS VIGENTES
            </div>
            {[
              { name:"Alerta AMBER México", desc:"Menores desaparecidos — FGR", since:"2011" },
              { name:"Protocolo Alba", desc:"Mujeres y niñas — CONAVIM", since:"2003" },
              { name:"Comisión Nacional de Búsqueda", desc:"CNB — SEGOB", since:"2017" },
              { name:"RNPDNO", desc:"Registro Nacional Público", since:"2019" },
            ].map((p,i) => (
              <div key={i} className="dash-user-protocol">
                <div>
                  <div className="dash-user-protocol-name">{p.name}</div>
                  <div className="dash-user-protocol-description">{p.desc}</div>
                </div>
                <Tag color={C.gold}>{p.since}</Tag>
              </div>
            ))}
          </div>
        </div>
      </PageWrap>

      {/* ── Emergency banner ── */}
      <div className="dash-user-emergency">
        <div className="dash-user-emergency-inner">
          <div>
            <div className="dash-user-emergency-eyebrow">ATENCIÓN DE EMERGENCIA</div>
            <h3 className="dash-user-emergency-title">¿Es una emergencia? Actúa de inmediato.</h3>
            <p className="dash-user-emergency-text">Si una persona acaba de desaparecer, no esperes. Cada minuto es crucial.</p>
          </div>
          <div className="dash-user-emergency-actions">
            <GovBtn>Llamar al 911</GovBtn>
            <button onClick={()=>setPage("add-person")} className="dash-user-outline-button">Reportar Inmediatamente</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashUser;
