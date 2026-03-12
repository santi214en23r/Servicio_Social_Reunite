import { C, font, fontSans } from "../shared/theme";
import { SectionHeader, GovBtn, Tag } from "../shared/components";

const About = ({ setPage }) => (
  <div style={{ minHeight:"80vh", background:C.gray50, padding:"32px 24px" }}>
    <div style={{ maxWidth:"900px", margin:"0 auto" }}>

      {/* Breadcrumb */}
      <div style={{ marginBottom:"16px", display:"flex", gap:"6px", fontFamily:fontSans, fontSize:"12px", color:C.gray600 }}>
        <button onClick={()=>setPage("home")} style={{ background:"none", border:"none", color:C.teal, cursor:"pointer", fontFamily:fontSans, fontSize:"12px" }}>Inicio</button>
        <span>›</span><span>Acerca de</span>
      </div>

      {/* Header */}
      <div style={{ background:C.wine, padding:"24px 28px", marginBottom:"0" }}>
        <div style={{ fontFamily:fontSans, fontSize:"11px", fontWeight:700, color:C.gold, letterSpacing:".1em", textTransform:"uppercase", marginBottom:"6px" }}>ACERCA DE LA PLATAFORMA</div>
        <h1 style={{ fontFamily:font, fontSize:"26px", fontWeight:700, color:C.white, marginBottom:"4px" }}>REUNITE — Plataforma Nacional de Búsqueda</h1>
        <p style={{ fontFamily:fontSans, fontSize:"13px", color:"rgba(255,255,255,.75)" }}>Rastreo, Ubicación, Esperanza. Tecnología e IA al servicio de la justicia.</p>
      </div>

      <div style={{ background:"#fff", border:`1px solid ${C.gray200}`, borderTop:"none", padding:"32px 28px" }}>

        {/* Mission */}
        <div style={{ marginBottom:"32px" }}>
          <SectionHeader label="Misión" title="¿Qué es REUNITE?" accent/>
          <p style={{ fontFamily:fontSans, fontSize:"14px", color:C.gray700, lineHeight:1.9, marginBottom:"14px" }}>
            REUNITE es una plataforma tecnológica basada en inteligencia artificial diseñada para mejorar los procesos de búsqueda y localización de personas desaparecidas en México. Integra datos de diversas fuentes —incluyendo bases públicas y reportes de colectivos de búsqueda— para construir un sistema centralizado, accesible y eficiente.
          </p>
          <p style={{ fontFamily:fontSans, fontSize:"14px", color:C.gray700, lineHeight:1.9 }}>
            Su enfoque humanístico garantiza el pleno respeto a la dignidad, privacidad y derechos humanos de las víctimas y sus familias, conforme a la normatividad nacional e internacional vigente, incluyendo la Ley General en Materia de Desaparición Forzada y la Ley General de Protección de Datos Personales.
          </p>
        </div>

        {/* Stats */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"16px", marginBottom:"32px" }}>
          {[
            { n:"125,232", label:"Casos Registrados en RNPDNO", color:C.wine },
            { n:"3 años",  label:"Horizonte del Proyecto",       color:C.teal },
            { n:"89",      label:"Organizaciones Aliadas",        color:C.gold },
          ].map((s,i) => (
            <div key={i} style={{ background:C.gray50, border:`1px solid ${C.gray200}`, borderTop:`3px solid ${s.color}`, padding:"20px", textAlign:"center" }}>
              <div style={{ fontFamily:font, fontSize:"28px", fontWeight:900, color:s.color }}>{s.n}</div>
              <div style={{ fontFamily:fontSans, fontSize:"12px", color:C.gray600, marginTop:"6px", textTransform:"uppercase", letterSpacing:".04em" }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Roadmap */}
        <div style={{ marginBottom:"32px" }}>
          <SectionHeader label="Hoja de ruta" title="Plan de Desarrollo"/>
          {[
            { year:"2025", phase:"Diseño y Prototipado", desc:"Construcción de la arquitectura tecnológica, diseño de interfaces y desarrollo del módulo de IA para reconocimiento de imágenes.", color:C.teal },
            { year:"2026", phase:"Optimización y Pruebas", desc:"Pruebas de rendimiento con datos reales, integración con bases de datos nacionales y ajuste de algoritmos de búsqueda.", color:C.gold },
            { year:"2027", phase:"Despliegue Piloto", desc:"Implementación en colaboración con la Comisión Nacional de Búsqueda y asociaciones civiles en 5 estados prioritarios.", color:C.wine },
          ].map((r,i) => (
            <div key={i} style={{ display:"flex", gap:"20px", marginBottom:"16px", padding:"16px", background:C.gray50, border:`1px solid ${C.gray200}`, borderLeft:`4px solid ${r.color}` }}>
              <div style={{ flexShrink:0 }}>
                <Tag color={r.color}>{r.year}</Tag>
              </div>
              <div>
                <div style={{ fontFamily:fontSans, fontSize:"13px", fontWeight:700, color:C.gray900, marginBottom:"4px" }}>{r.phase}</div>
                <div style={{ fontFamily:fontSans, fontSize:"13px", color:C.gray600, lineHeight:1.6 }}>{r.desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Research */}
        <div style={{ background:C.tealBg, border:`1px solid ${C.teal}33`, padding:"20px", marginBottom:"24px" }}>
          <div style={{ fontFamily:fontSans, fontSize:"11px", fontWeight:700, color:C.teal, letterSpacing:".08em", textTransform:"uppercase", marginBottom:"10px" }}>PROYECTO DE INVESTIGACIÓN</div>
          <div style={{ fontFamily:fontSans, fontSize:"13px", color:C.gray700, lineHeight:1.7 }}>
            <strong>Clave:</strong> IH-2025-I-346<br/>
            <strong>Investigadora responsable:</strong> Norma Natalia Rubin Ramírez<br/>
            <strong>Institución:</strong> Tecnológico de Monterrey — MIA<br/>
            <strong>Período:</strong> 2025–2027
          </div>
        </div>

        <div style={{ display:"flex", gap:"10px" }}>
          <GovBtn onClick={()=>setPage("home")}>← Volver al Inicio</GovBtn>
          <GovBtn variant="ghost" onClick={()=>setPage("statistics")}>Ver Estadísticas</GovBtn>
        </div>
      </div>
    </div>
  </div>
);

export default About;
