import { useState } from "react";
import { C, font, fontSans } from "../shared/theme";
import { GovBtn, GovInput, GovSelect, InfoBox, Modal } from "../shared/components";

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
    <div style={{ minHeight:"80vh", background:C.gray50, padding:"40px 24px" }}>
      <div style={{ maxWidth:"720px", margin:"0 auto" }}>

        {/* Breadcrumb */}
        <div style={{ marginBottom:"20px", display:"flex", gap:"6px", fontFamily:fontSans, fontSize:"12px", color:C.gray600 }}>
          <button onClick={()=>setPage("home")} style={{ background:"none", border:"none", color:C.teal, cursor:"pointer", fontFamily:fontSans, fontSize:"12px" }}>Inicio</button>
          <span>›</span><span>Acceso Asociaciones</span>
        </div>

        {/* Page header */}
        <div style={{ background:C.wine, padding:"24px 28px" }}>
          <div style={{ fontFamily:fontSans, fontSize:"11px", fontWeight:700, color:C.gold, letterSpacing:".1em", textTransform:"uppercase", marginBottom:"6px" }}>SISTEMA DE ACCESO</div>
          <h1 style={{ fontFamily:font, fontSize:"24px", fontWeight:700, color:C.white, marginBottom:"4px" }}>Acceso para Asociaciones y Organizaciones</h1>
          <p style={{ fontFamily:fontSans, fontSize:"13px", color:"rgba(255,255,255,.75)" }}>Panel especializado para colectivos de búsqueda, asociaciones civiles y autoridades participantes.</p>
        </div>

        <div style={{ background:C.white, border:`1px solid ${C.gray200}`, borderTop:"none" }}>
          {/* Tabs */}
          <div style={{ display:"flex", borderBottom:`1px solid ${C.gray200}`, background:C.gray50 }}>
            {[["login","Acceso al Sistema"],["register","Registro de Nueva Asociación"]].map(([t,lbl]) => (
              <button key={t} onClick={()=>setTab(t)} style={{ flex:1, padding:"14px", fontFamily:fontSans, fontSize:"12px", fontWeight:700, letterSpacing:".04em", textTransform:"uppercase", background:tab===t?C.white:"transparent", color:tab===t?C.wine:C.gray600, border:"none", borderBottom:tab===t?`3px solid ${C.wine}`:"3px solid transparent", cursor:"pointer", transition:"all .2s" }}>{lbl}</button>
            ))}
          </div>

          <div style={{ padding:"32px 28px" }}>
            {/* ── LOGIN ── */}
            {tab==="login" && (
              <form onSubmit={handleLogin}>
                <InfoBox type="info">Ingrese las credenciales otorgadas por la Comisión Nacional de Búsqueda para acceder al sistema.</InfoBox>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"16px" }}>
                  <GovInput label="Correo Electrónico Oficial" type="email" placeholder="usuario@gobierno.gob.mx" required value={login.email} onChange={e=>setLogin({...login,email:e.target.value})}/>
                  <GovInput label="Contraseña de Acceso" type="password" placeholder="••••••••••••" required value={login.password} onChange={e=>setLogin({...login,password:e.target.value})}/>
                </div>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"20px" }}>
                  <label style={{ display:"flex", alignItems:"center", gap:"6px", cursor:"pointer", fontFamily:fontSans, fontSize:"13px", color:C.gray700 }}>
                    <input type="checkbox" style={{ accentColor:C.teal }}/> Mantener sesión activa
                  </label>
                  <button type="button" style={{ background:"none", border:"none", color:C.teal, cursor:"pointer", fontFamily:fontSans, fontSize:"13px" }}>Recuperar contraseña</button>
                </div>
                <GovBtn type="submit" full>Ingresar al Sistema →</GovBtn>
              </form>
            )}

            {/* ── REGISTER ── */}
            {tab==="register" && (
              <form onSubmit={handleReg}>
                <InfoBox type="warn"><strong>Aviso:</strong> El registro será revisado por la Comisión Nacional de Búsqueda. El proceso puede tomar hasta 30 días hábiles.</InfoBox>

                {/* I. Datos asociación */}
                <div style={{ marginBottom:"20px" }}>
                  <div style={{ fontFamily:fontSans, fontSize:"11px", fontWeight:700, color:C.wine, letterSpacing:".08em", textTransform:"uppercase", marginBottom:"12px", padding:"8px 0", borderBottom:`1px solid ${C.gray200}` }}>I. DATOS DE LA ASOCIACIÓN</div>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"16px" }}>
                    <GovInput label="Nombre de la Asociación" required placeholder="Nombre completo" value={reg.asociacion} onChange={e=>setReg({...reg,asociacion:e.target.value})}/>
                    <GovInput label="Domicilio" required placeholder="Dirección completa" value={reg.domicilio} onChange={e=>setReg({...reg,domicilio:e.target.value})}/>
                    <GovInput label="Correo Electrónico" type="email" required placeholder="contacto@asociacion.org" value={reg.email} onChange={e=>setReg({...reg,email:e.target.value})}/>
                    <GovInput label="Ciudad de Origen" required placeholder="Ciudad, Estado" value={reg.ciudad} onChange={e=>setReg({...reg,ciudad:e.target.value})}/>
                    <GovInput label="Teléfono" type="tel" required placeholder="+52 55 1234 5678" value={reg.telefono} onChange={e=>setReg({...reg,telefono:e.target.value})}/>
                  </div>
                </div>

                {/* II. Representante */}
                <div style={{ marginBottom:"20px" }}>
                  <div style={{ fontFamily:fontSans, fontSize:"11px", fontWeight:700, color:C.wine, letterSpacing:".08em", textTransform:"uppercase", marginBottom:"12px", padding:"8px 0", borderBottom:`1px solid ${C.gray200}` }}>II. REPRESENTANTE LEGAL</div>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"16px" }}>
                    <GovInput label="Nombre del Representante Legal" required placeholder="Nombre completo" value={reg.representante} onChange={e=>setReg({...reg,representante:e.target.value})}/>
                    <GovInput label="Número de Integrantes" type="number" min="1" required placeholder="Cantidad" value={reg.integrantes} onChange={e=>setReg({...reg,integrantes:e.target.value})}/>
                  </div>
                </div>

                {/* III. Documentación */}
                <div style={{ marginBottom:"20px" }}>
                  <div style={{ fontFamily:fontSans, fontSize:"11px", fontWeight:700, color:C.wine, letterSpacing:".08em", textTransform:"uppercase", marginBottom:"12px", padding:"8px 0", borderBottom:`1px solid ${C.gray200}` }}>III. DOCUMENTACIÓN REQUERIDA</div>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"16px" }}>
                    {[["docAsociacion","Acta Constitutiva o Documento de Asociación"],["ine","Identificación Oficial del Representante"]].map(([key,lbl]) => (
                      <div key={key}>
                        <div style={{ fontFamily:fontSans, fontSize:"12px", fontWeight:700, color:C.gray700, letterSpacing:".04em", textTransform:"uppercase", marginBottom:"6px" }}>{lbl} <span style={{color:"#CC0000"}}>*</span></div>
                        <label style={{ display:"flex", alignItems:"center", gap:"8px", cursor:"pointer", border:`1px dashed ${C.gray200}`, padding:"10px 14px", background:C.gray50, transition:"all .2s" }}
                          onMouseEnter={e=>e.currentTarget.style.borderColor=C.teal} onMouseLeave={e=>e.currentTarget.style.borderColor=C.gray200}>
                          <span style={{ fontSize:"18px" }}>{/* icon removed */}</span>
                          <span style={{ fontFamily:fontSans, fontSize:"12px", color:reg[key]?C.teal:C.gray600 }}>{reg[key]?reg[key].name:"Seleccionar archivo (PDF, imagen)"}</span>
                          <input type="file" accept=".pdf,image/*" style={{ display:"none" }} onChange={e=>setReg({...reg,[key]:e.target.files[0]})} required/>
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

        <div style={{ textAlign:"center", marginTop:"16px" }}>
          <button onClick={()=>setPage("home")} style={{ background:"none", border:"none", fontFamily:fontSans, fontSize:"12px", color:C.gray600, cursor:"pointer" }}>← Volver al Inicio</button>
        </div>
      </div>

      <Modal show={regSuccess} onClose={()=>{setRegSuccess(false);setTab("login");}} title="Solicitud Enviada Correctamente">
        <InfoBox type="success">Tu solicitud ha sido recibida y será revisada por las autoridades competentes.</InfoBox>
        <p style={{ fontFamily:fontSans, fontSize:"13px", color:C.gray700, marginBottom:"16px", lineHeight:1.7 }}>Recibirás una notificación en el correo registrado. <strong>Tiempo estimado: 30 días hábiles.</strong></p>
        <GovBtn onClick={()=>{setRegSuccess(false);setTab("login");}} full>Ir al Acceso al Sistema →</GovBtn>
      </Modal>
    </div>
  );
};

export default RegisterAsociation;
