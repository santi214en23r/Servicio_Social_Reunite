import { C, font, fontSans } from "./theme";
import { GovLogo } from "./components";

export const Footer = ({ setPage }) => (
  <footer>
    <div style={{ background:C.teal, height:"4px" }}/>
    <div style={{ background:C.wineD, padding:"40px 24px 20px" }}>
      <div style={{ maxWidth:"1200px", margin:"0 auto" }}>
        <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr 1fr", gap:"40px", marginBottom:"32px" }}>
          {/* Brand */}
          <div>
            <GovLogo size={38} light/>
            <p style={{ fontFamily:fontSans, fontSize:"13px", color:"rgba(255,255,255,.6)", lineHeight:1.7, marginTop:"14px", maxWidth:"280px" }}>
              Rastreo, Ubicación, Esperanza. Plataforma especializada en la búsqueda de personas desaparecidas en México.
            </p>
          </div>
          {/* Columns */}
          {[
            { title:"Plataforma", items:[["Inicio","home"],["Búsqueda","search-matches"],["Estadísticas","statistics"],["Acceso Asociaciones","register-assoc"]] },
            { title:"Marco Legal", items:[["LGPDPPSO",null],["Ley General",null],["Normatividad",null],["Transparencia",null]] },
            { title:"Emergencias", items:[["911 — Emergencias",null],["800-REUNITE",null],["ayuda@reunite.gob.mx",null],["Disponible 24/7",null]] },
          ].map(col => (
            <div key={col.title}>
              <div style={{ fontFamily:fontSans, fontSize:"11px", fontWeight:700, color:C.gold, letterSpacing:".1em", textTransform:"uppercase", marginBottom:"12px", paddingBottom:"6px", borderBottom:`1px solid rgba(255,255,255,.1)` }}>{col.title}</div>
              <ul style={{ listStyle:"none" }}>
                {col.items.map(([label, id]) => (
                  <li key={label} style={{ marginBottom:"8px" }}>
                    <button onClick={()=>id&&setPage(id)} style={{ background:"none", border:"none", padding:0, fontFamily:fontSans, fontSize:"13px", color:"rgba(255,255,255,.65)", cursor:id?"pointer":"default", textAlign:"left" }}
                      onMouseEnter={e=>id&&(e.target.style.color=C.white)} onMouseLeave={e=>id&&(e.target.style.color="rgba(255,255,255,.65)")}>
                      {label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        {/* Bottom bar */}
        <div style={{ borderTop:"1px solid rgba(255,255,255,.1)", paddingTop:"16px", display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:"8px" }}>
          <span style={{ fontFamily:fontSans, fontSize:"12px", color:"rgba(255,255,255,.4)" }}>
            © 2025 REUNITE — Gobierno de México. Todos los derechos reservados.
          </span>
          <div style={{ display:"flex", gap:"16px" }}>
            {["Privacidad","Términos","Accesibilidad","Mapa del Sitio"].map(l => (
              <span key={l} style={{ fontFamily:fontSans, fontSize:"12px", color:"rgba(255,255,255,.4)", cursor:"pointer" }}
                onMouseEnter={e=>e.target.style.color="rgba(255,255,255,.8)"} onMouseLeave={e=>e.target.style.color="rgba(255,255,255,.4)"}>
                {l}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
