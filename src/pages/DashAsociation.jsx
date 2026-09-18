import { useState } from "react";
import { C, font, fontSans } from "../shared/theme";
import { SectionHeader, GovCard, Tag, GovBtn, Modal } from "../shared/components";
import "../styles/pages/DashAsociation.css";

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
    <div className="dash-association-page">
      {/* ── Header ── */}
      <div className="dash-association-header">
        <div className="dash-association-header-inner">
          <div>
            <div className="dash-association-eyebrow">PANEL DE CONTROL — ASOCIACIONES</div>
            <h1 className="dash-association-title">{assoc.nombre}</h1>
          </div>
          <div className="dash-association-header-actions">
            <Tag color={C.gold}>● Activa y Verificada</Tag>
            <button onClick={()=>setLogoutModal(true)} className="dash-association-logout">Cerrar Sesión</button>
          </div>
        </div>
        {/* Stats bar */}
        <div className="dash-association-stats">
          {statsLocal.map((s,i) => (
            <div key={i} className="dash-association-stat">
              <div className="dash-association-stat-value">{s.n}</div>
              <div className="dash-association-stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Body ── */}
      <div className="dash-association-content">
        <div className="dash-association-layout">

          {/* Left: Assoc info card */}
          <div>
            <div className="dash-association-info-card">
              <div className="dash-association-card-heading">DATOS DE LA ASOCIACIÓN</div>
              <div className="dash-association-card-body">
                {[
                  ["Ciudad de Origen",    assoc.ciudad],
                  ["Representante Legal", assoc.representante],
                  ["Teléfono",            assoc.telefono],
                  ["Correo Electrónico",  assoc.email],
                  ["Domicilio",           assoc.domicilio],
                  ["N.° de Integrantes",  assoc.integrantes],
                  ["Fecha de Registro",   assoc.registro],
                ].map(([k,v]) => (
                  <div key={k} className="dash-association-detail">
                    <div className="dash-association-detail-label">{k}</div>
                    <div className="dash-association-detail-value">{v}</div>
                  </div>
                ))}
                <div className="dash-association-edit"><GovBtn full>Editar Información</GovBtn></div>
              </div>
            </div>

            {/* Resources */}
            <div className="dash-association-resources">
              <div className="dash-association-resources-heading">RECURSOS</div>
              {["Manual de Usuario","Normatividad Vigente","Guía de Reportes","Soporte Técnico"].map(l => (
                <div key={l} className="dash-association-resource">
                  <button className="dash-association-resource-button">→ {l}</button>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Tool cards */}
          <div>
            <SectionHeader label="Herramientas" title="Panel de Gestión"/>
            <div className="dash-association-tools-grid">
              {tools.map((t,i) => (
                <GovCard key={i} className="dash-association-tool-card" onClick={()=>setPage(t.page)}>
                  <div className="dash-association-tool-top">
                    <div className="dash-association-tool-icon">{t.icon}</div>
                    <Tag>{t.tag}</Tag>
                  </div>
                  <h3 className="dash-association-tool-title">{t.title}</h3>
                  <p className="dash-association-tool-description">{t.desc}</p>
                  <GovBtn full onClick={e=>{e.stopPropagation();setPage(t.page);}}>Acceder →</GovBtn>
                </GovCard>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Logout modal */}
      <Modal show={logoutModal} onClose={()=>setLogoutModal(false)} title="Confirmar Cierre de Sesión">
        <p className="dash-association-modal-text">Estás a punto de cerrar tu sesión en el panel de asociaciones. ¿Deseas continuar?</p>
        <div className="dash-association-modal-actions">
          <GovBtn variant="secondary" onClick={()=>setLogoutModal(false)} full>Cancelar</GovBtn>
          <GovBtn variant="wine" onClick={onLogout} full>Sí, Cerrar Sesión</GovBtn>
        </div>
      </Modal>
    </div>
  );
};

export default DashAsociation;
