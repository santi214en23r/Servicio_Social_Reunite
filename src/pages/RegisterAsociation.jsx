import { useState } from "react";
import { C, font, fontSans } from "../shared/theme";
import { GovBtn, GovInput, GovSelect, InfoBox, Modal } from "../shared/components";
import "../styles/pages/RegisterAsociation.css";

const RegisterAsociation = ({ setPage, onLoginSuccess }) => {
  const [tab, setTab] = useState("login");
  const [login, setLogin] = useState({ email:"", password:"" });
  const [reg, setReg] = useState({ asociacion:"", domicilio:"", email:"", ciudad:"", telefono:"", representante:"", integrantes:"", comentarios:"", docAsociacion:null, ine:null });
  const [regSuccess, setRegSuccess] = useState(false);
  const [regError, setRegError] = useState("");

  const handleLogin = e => { e.preventDefault(); onLoginSuccess(); };
  const handleReg = e => {
    e.preventDefault();
    for (const k of ["asociacion","domicilio","email","ciudad","telefono","representante","integrantes"]) {
      if (!reg[k]) { setRegError("Por favor, completa todos los campos requeridos (*)."); return; }
    }
    setRegError(""); setRegSuccess(true);
  };

  return (
    <div className="register-association-page">
      <div className="register-association-container">

        {/* Breadcrumb */}
        <div className="register-association-breadcrumb">
          <button onClick={()=>setPage("home")} className="register-association-breadcrumb-link">Inicio</button>
          <span>›</span><span>Acceso Asociaciones</span>
        </div>

        {/* Page header */}
        <div className="register-association-header">
          <div className="register-association-eyebrow">SISTEMA DE ACCESO</div>
          <h1 className="register-association-title">Acceso para Asociaciones y Organizaciones</h1>
          <p className="register-association-intro">Panel especializado para colectivos de búsqueda, asociaciones civiles y autoridades participantes.</p>
        </div>

        <div className="register-association-panel">
          {/* Tabs */}
          <div className="register-association-tabs">
            {[["login","Acceso al Sistema"],["register","Registro de Nueva Asociación"]].map(([t,lbl]) => (
              <button key={t} onClick={()=>setTab(t)} className={`register-association-tab ${tab===t ? "is-active" : ""}`}>{lbl}</button>
            ))}
          </div>

          <div className="register-association-body">
            {/* ── LOGIN ── */}
            {tab==="login" && (
              <form onSubmit={handleLogin}>
                <InfoBox type="info">Ingrese las credenciales otorgadas por la Comisión Nacional de Búsqueda para acceder al sistema.</InfoBox>
                <div className="register-association-grid">
                  <GovInput label="Correo Electrónico Oficial" type="email" placeholder="usuario@gobierno.gob.mx" required value={login.email} onChange={e=>setLogin({...login,email:e.target.value})}/>
                  <GovInput label="Contraseña de Acceso" type="password" placeholder="••••••••••••" required value={login.password} onChange={e=>setLogin({...login,password:e.target.value})}/>
                </div>
                <div className="register-association-login-options">
                  <label className="register-association-checkbox">
                    <input type="checkbox"/> Mantener sesión activa
                  </label>
                  <button type="button" className="register-association-link-button">Recuperar contraseña</button>
                </div>
                <GovBtn type="submit" full>Ingresar al Sistema →</GovBtn>
              </form>
            )}

            {/* ── REGISTER ── */}
            {tab==="register" && (
              <form onSubmit={handleReg}>
                <InfoBox type="warn"><strong>Aviso:</strong> El registro será revisado por la Comisión Nacional de Búsqueda. El proceso puede tomar hasta 30 días hábiles.</InfoBox>

                {/* I. Datos asociación */}
                <div className="register-association-section">
                  <div className="register-association-section-heading">I. DATOS DE LA ASOCIACIÓN</div>
                  <div className="register-association-grid">
                    <GovInput label="Nombre de la Asociación" required placeholder="Nombre completo" value={reg.asociacion} onChange={e=>setReg({...reg,asociacion:e.target.value})}/>
                    <GovInput label="Domicilio" required placeholder="Dirección completa" value={reg.domicilio} onChange={e=>setReg({...reg,domicilio:e.target.value})}/>
                    <GovInput label="Correo Electrónico" type="email" required placeholder="contacto@asociacion.org" value={reg.email} onChange={e=>setReg({...reg,email:e.target.value})}/>
                    <GovInput label="Ciudad de Origen" required placeholder="Ciudad, Estado" value={reg.ciudad} onChange={e=>setReg({...reg,ciudad:e.target.value})}/>
                    <GovInput label="Teléfono" type="tel" required placeholder="+52 55 1234 5678" value={reg.telefono} onChange={e=>setReg({...reg,telefono:e.target.value})}/>
                  </div>
                </div>

                {/* II. Representante */}
                <div className="register-association-section">
                  <div className="register-association-section-heading">II. REPRESENTANTE LEGAL</div>
                  <div className="register-association-grid">
                    <GovInput label="Nombre del Representante Legal" required placeholder="Nombre completo" value={reg.representante} onChange={e=>setReg({...reg,representante:e.target.value})}/>
                    <GovInput label="Número de Integrantes" type="number" min="1" required placeholder="Cantidad" value={reg.integrantes} onChange={e=>setReg({...reg,integrantes:e.target.value})}/>
                  </div>
                </div>

                {/* III. Documentación */}
                <div className="register-association-section">
                  <div className="register-association-section-heading">III. DOCUMENTACIÓN REQUERIDA</div>
                  <div className="register-association-grid">
                    {[["docAsociacion","Acta Constitutiva o Documento de Asociación"],["ine","Identificación Oficial del Representante"]].map(([key,lbl]) => (
                      <div key={key}>
                        <div className="register-association-file-label">{lbl} <span>*</span></div>
                        <label className="register-association-file-input">
                          <span className="register-association-file-icon">{/* icon removed */}</span>
                          <span className={reg[key] ? "has-file" : ""}>{reg[key]?reg[key].name:"Seleccionar archivo (PDF, imagen)"}</span>
                          <input type="file" accept=".pdf,image/*" onChange={e=>setReg({...reg,[key]:e.target.files[0]})} required/>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <GovInput textarea label="Comentarios Adicionales" placeholder="Describa los objetivos y actividades de la asociación…" rows={3} value={reg.comentarios} onChange={e=>setReg({...reg,comentarios:e.target.value})}/>
                {regError && <InfoBox type="danger">{regError}</InfoBox>}
                <GovBtn type="submit" full>Enviar Solicitud de Registro →</GovBtn>
              </form>
            )}
          </div>
        </div>

        <div className="register-association-back">
          <button onClick={()=>setPage("home")} className="register-association-back-button">← Volver al Inicio</button>
        </div>
      </div>

      <Modal show={regSuccess} onClose={()=>{setRegSuccess(false);setTab("login");}} title="Solicitud Enviada Correctamente">
        <InfoBox type="success">Tu solicitud ha sido recibida y será revisada por las autoridades competentes.</InfoBox>
        <p className="register-association-modal-text">Recibirás una notificación en el correo registrado. <strong>Tiempo estimado: 30 días hábiles.</strong></p>
        <GovBtn onClick={()=>{setRegSuccess(false);setTab("login");}} full>Ir al Acceso al Sistema →</GovBtn>
      </Modal>
    </div>
  );
};

export default RegisterAsociation;
