import { useState } from "react";
import { C, font, fontSans } from "../shared/theme";
import { GovBtn, GovInput, GovSelect, InfoBox, Modal } from "../shared/components";

const SecDivider = ({ num, title }) => (
  <div style={{ fontFamily:fontSans, fontSize:"11px", fontWeight:700, color:C.wine, letterSpacing:".08em", textTransform:"uppercase", marginBottom:"14px", padding:"8px 0", borderBottom:`2px solid ${C.wine}` }}>
    {num}. {title}
  </div>
);

const AddPerson = ({ setPage }) => {
  const [preview, setPreview]     = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [form, setForm] = useState({
    edadDesaparicion:"", edadActual:"", sexo:"", lenguaIndigena:"",
    discapacidad:"", lugarNacimiento:"", hablaEspanol:"",
    fechaHechos:"", fechaPercato:"", lugarHechos:"",
    caracteristicasFisicas:"", senasParticulares:"", prendasVestir:"",
  });
  const set = (k,v) => setForm(f => ({...f, [k]:v}));

  return (
    <div style={{ minHeight:"80vh", background:C.gray50, padding:"32px 24px" }}>
      <div style={{ maxWidth:"900px", margin:"0 auto" }}>

        {/* Breadcrumb */}
        <div style={{ marginBottom:"16px", display:"flex", gap:"6px", fontFamily:fontSans, fontSize:"12px", color:C.gray600 }}>
          <button onClick={()=>setPage("home")} style={{ background:"none", border:"none", color:C.teal, cursor:"pointer", fontFamily:fontSans, fontSize:"12px" }}>Inicio</button>
          <span>›</span><span>Reporte de Persona Desaparecida</span>
        </div>

        {/* Page header */}
        <div style={{ background:C.wine, padding:"20px 24px", display:"flex", alignItems:"center", gap:"16px" }}>
          <div style={{ width:"40px", height:"40px", background:"rgba(255,255,255,.1)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"20px" }}>{/* icon removed */}</div>
          <div>
            <div style={{ fontFamily:fontSans, fontSize:"11px", fontWeight:700, color:C.gold, letterSpacing:".1em", textTransform:"uppercase", marginBottom:"2px" }}>REGISTRO OFICIAL</div>
            <h1 style={{ fontFamily:font, fontSize:"20px", fontWeight:700, color:C.white }}>Reporte de Persona Desaparecida o No Localizada</h1>
          </div>
        </div>

        <div style={{ background:C.white, border:`1px solid ${C.gray200}`, borderTop:"none", padding:"28px 24px" }}>
          <InfoBox type="warn">
            <strong>Aviso legal:</strong> La información proporcionada será utilizada exclusivamente para la búsqueda y localización de la persona. Todos los datos serán tratados con estricta confidencialidad conforme a la Ley General de Protección de Datos Personales. Proporcionar información falsa constituye un delito.
          </InfoBox>

          {/* I. Fotografía */}
          <div style={{ marginBottom:"28px" }}>
            <SecDivider num="I" title="FOTOGRAFÍA DE LA PERSONA"/>
            <label htmlFor="photo-up" style={{ display:"block", border:`2px dashed ${C.gray200}`, padding:"28px", textAlign:"center", cursor:"pointer", background:C.gray50 }}
              onMouseEnter={e=>e.currentTarget.style.borderColor=C.teal} onMouseLeave={e=>e.currentTarget.style.borderColor=C.gray200}>
              {preview
                ? <img src={preview} style={{ width:"100px", height:"100px", objectFit:"cover", border:`2px solid ${C.teal}` }} alt="preview"/>
                : <div><div style={{ fontSize:"32px", marginBottom:"8px" }}>{/* icon removed */}</div><div style={{ fontFamily:fontSans, fontSize:"13px", fontWeight:700, color:C.teal }}>Seleccionar Fotografía</div><div style={{ fontFamily:fontSans, fontSize:"11px", color:C.gray400, marginTop:"4px" }}>JPG, PNG, GIF — Máx. 5 MB</div></div>
              }
              <input id="photo-up" type="file" accept="image/*" style={{ display:"none" }} onChange={e=>{ const f=e.target.files[0]; if(f) setPreview(URL.createObjectURL(f)); }}/>
            </label>
          </div>

          {/* II. Información personal */}
          <div style={{ marginBottom:"28px" }}>
            <SecDivider num="II" title="INFORMACIÓN PERSONAL"/>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"16px" }}>
              <GovInput label="Edad al momento de la desaparición" type="number" min={0} required value={form.edadDesaparicion} onChange={e=>set("edadDesaparicion",e.target.value)}/>
              <GovInput label="Edad actual estimada"               type="number" min={0} required value={form.edadActual}        onChange={e=>set("edadActual",e.target.value)}/>
              <GovSelect label="Sexo" required value={form.sexo} onChange={e=>set("sexo",e.target.value)}>
                <option value="">Selecciona</option><option>Femenino</option><option>Masculino</option><option>Otro</option>
              </GovSelect>
              <GovInput label="Idioma o lengua indígena" placeholder="Ej: Náhuatl, Maya…" value={form.lenguaIndigena} onChange={e=>set("lenguaIndigena",e.target.value)}/>
              <GovInput label="Lugar de nacimiento" required placeholder="Ciudad, Estado, País" value={form.lugarNacimiento} onChange={e=>set("lugarNacimiento",e.target.value)}/>
              <GovSelect label="¿Habla español?" required value={form.hablaEspanol} onChange={e=>set("hablaEspanol",e.target.value)}>
                <option value="">Selecciona</option><option>Sí</option><option>No</option>
              </GovSelect>
              <GovInput label="Discapacidad" placeholder="Ej: Visual, auditiva, motriz…" value={form.discapacidad} onChange={e=>set("discapacidad",e.target.value)}/>
            </div>
          </div>

          {/* III. Fechas y lugar */}
          <div style={{ marginBottom:"28px" }}>
            <SecDivider num="III" title="FECHAS Y LUGAR DE LOS HECHOS"/>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"16px" }}>
              <GovInput label="Fecha de los hechos"           type="date" required value={form.fechaHechos}  onChange={e=>set("fechaHechos",e.target.value)}/>
              <GovInput label="Fecha de pérdida de contacto" type="date" required value={form.fechaPercato} onChange={e=>set("fechaPercato",e.target.value)}/>
            </div>
            <GovInput label="Lugar de los hechos" hint="Dirección completa donde ocurrieron los hechos." required placeholder="Calle, Colonia, Municipio, Estado, CP" value={form.lugarHechos} onChange={e=>set("lugarHechos",e.target.value)}/>
            {/* Map placeholder */}
            <div style={{ background:C.gray100, height:"140px", display:"flex", alignItems:"center", justifyContent:"center", color:C.gray400, fontFamily:fontSans, fontSize:"13px", border:`1px solid ${C.gray200}` }}>
               Mapa interactivo — Marque la ubicación
            </div>
          </div>

          {/* IV. Características */}
          <div style={{ marginBottom:"28px" }}>
            <SecDivider num="IV" title="CARACTERÍSTICAS FÍSICAS Y SEÑAS PARTICULARES"/>
            <GovInput textarea label="Características físicas" hint="Estatura, complexión, color de piel, cabello, ojos, peso aproximado…" required rows={3} value={form.caracteristicasFisicas} onChange={e=>set("caracteristicasFisicas",e.target.value)}/>
            <GovInput textarea label="Señas particulares"      hint="Tatuajes, cicatrices, lunares, marcas, piercings…"                           rows={3} value={form.senasParticulares}      onChange={e=>set("senasParticulares",e.target.value)}/>
            <GovInput textarea label="Prendas de vestir al momento de la desaparición" hint="Colores, tipo de prendas, zapatos, accesorios…"      rows={3} value={form.prendasVestir}          onChange={e=>set("prendasVestir",e.target.value)}/>
          </div>

          <div style={{ display:"flex", gap:"12px", justifyContent:"flex-end" }}>
            <GovBtn variant="secondary" onClick={()=>setPage("home")}>Cancelar</GovBtn>
            <GovBtn onClick={()=>setShowSuccess(true)}>Guardar Ficha Oficial →</GovBtn>
          </div>
        </div>
      </div>

      <Modal show={showSuccess} onClose={()=>{setShowSuccess(false);setPage("home");}} title="Ficha Registrada Correctamente">
        <InfoBox type="success">La ficha ha sido incorporada al sistema nacional de búsqueda.</InfoBox>
        <p style={{ fontFamily:fontSans, fontSize:"13px", color:C.gray700, marginBottom:"20px", lineHeight:1.7 }}>La información ha sido registrada y está disponible para los colectivos de búsqueda y autoridades competentes.</p>
        <GovBtn onClick={()=>{setShowSuccess(false);setPage("home");}} full>Volver al Inicio →</GovBtn>
      </Modal>
    </div>
  );
};

export default AddPerson;
