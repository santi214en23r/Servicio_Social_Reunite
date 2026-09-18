import { C, font, fontSans } from "../shared/theme";
import { SectionHeader, GovBtn, Tag } from "../shared/components";
import "../styles/pages/About.css";

const About = ({ setPage }) => (
  <div className="about-page">
    <div className="about-page__container">

      {/* Breadcrumb */}
      <div className="about-page__breadcrumb">
        <button onClick={()=>setPage("home")} className="about-page__back-link">Inicio</button>
        <span>›</span><span>Acerca de</span>
      </div>

      {/* Header */}
      <div className="about-page__header">
        <div className="about-page__eyebrow">ACERCA DE LA PLATAFORMA</div>
        <h1 className="about-page__title">REUNITE — Plataforma Nacional de Búsqueda</h1>
        <p className="about-page__subtitle">Rastreo, Ubicación, Esperanza. Tecnología e IA al servicio de la justicia.</p>
      </div>

      <div className="about-page__content">

        {/* Mission */}
        <div className="about-page__section">
          <SectionHeader label="Misión" title="¿Qué es REUNITE?" accent/>
          <p className="about-page__body about-page__body--spaced">
            REUNITE es una plataforma tecnológica basada en inteligencia artificial diseñada para mejorar los procesos de búsqueda y localización de personas desaparecidas en México. Integra datos de diversas fuentes —incluyendo bases públicas y reportes de colectivos de búsqueda— para construir un sistema centralizado, accesible y eficiente.
          </p>
          <p className="about-page__body">
            Su enfoque humanístico garantiza el pleno respeto a la dignidad, privacidad y derechos humanos de las víctimas y sus familias, conforme a la normatividad nacional e internacional vigente, incluyendo la Ley General en Materia de Desaparición Forzada y la Ley General de Protección de Datos Personales.
          </p>
        </div>

        {/* Stats */}
        <div className="about-page__stats">
          {[
            { n:"125,232", label:"Casos Registrados en RNPDNO", color:C.wine },
            { n:"3 años",  label:"Horizonte del Proyecto",       color:C.teal },
            { n:"89",      label:"Organizaciones Aliadas",        color:C.gold },
          ].map((s,i) => (
            <div key={i} className="about-page__stat" style={{ "--stat-color": s.color }}>
              <div className="about-page__stat-value">{s.n}</div>
              <div className="about-page__stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Roadmap */}
        <div className="about-page__section">
          <SectionHeader label="Hoja de ruta" title="Plan de Desarrollo"/>
          {[
            { year:"2025", phase:"Diseño y Prototipado", desc:"Construcción de la arquitectura tecnológica, diseño de interfaces y desarrollo del módulo de IA para reconocimiento de imágenes.", color:C.teal },
            { year:"2026", phase:"Optimización y Pruebas", desc:"Pruebas de rendimiento con datos reales, integración con bases de datos nacionales y ajuste de algoritmos de búsqueda.", color:C.gold },
            { year:"2027", phase:"Despliegue Piloto", desc:"Implementación en colaboración con la Comisión Nacional de Búsqueda y asociaciones civiles en 5 estados prioritarios.", color:C.wine },
          ].map((r,i) => (
            <div key={i} className="about-page__roadmap-item" style={{ "--roadmap-color": r.color }}>
              <div className="about-page__roadmap-year">
                <Tag color={r.color}>{r.year}</Tag>
              </div>
              <div>
                <div className="about-page__roadmap-phase">{r.phase}</div>
                <div className="about-page__roadmap-desc">{r.desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Research */}
        <div className="about-page__research">
          <div className="about-page__research-label">PROYECTO DE INVESTIGACIÓN</div>
          <div className="about-page__research-body">
            <strong>Clave:</strong> IH-2025-I-346<br/>
            <strong>Investigadora responsable:</strong> Norma Natalia Rubin Ramírez<br/>
            <strong>Institución:</strong> Tecnológico de Monterrey — MIA<br/>
            <strong>Período:</strong> 2025–2027
          </div>
        </div>

        <div className="about-page__actions">
          <GovBtn onClick={()=>setPage("home")}>← Volver al Inicio</GovBtn>
          <GovBtn variant="ghost" onClick={()=>setPage("statistics")}>Ver Estadísticas</GovBtn>
        </div>
      </div>
    </div>
  </div>
);

export default About;
