import { useState } from "react";
import { C, font, fontSans } from "../shared/theme";
import { GovBtn, GovInput, GovSelect, InfoBox, Modal } from "../shared/components";

const SecDivider = ({ num, title }) => (
  <div style={{ fontFamily:fontSans, fontSize:"11px", fontWeight:700, color:C.wine, letterSpacing:".08em", textTransform:"uppercase", marginBottom:"12px", padding:"8px 0", borderBottom:`2px solid ${C.wine}` }}>
    {num}. {title}
  </div>
);

const SearchPlace = ({ setPage }) => {
  const [form, setForm] = useState({
    direccion:"", fechaInicio:"", fechaFin:"",
    tipoEvidencia:"", condicion:"", equipo:"", visibilidad:"", descripcion:""
  });
  const [imagenes, setImagenes] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const set = (k,v) => setForm(f => ({...f, [k]:v}));

  return (
    <div style={{ minHeight:"80vh", background:C.gray50, padding:"32px 24px" }}>
      <div style={{ maxWidth:"900px", margin:"0 auto" }}>

        {/* Breadcrumb */}
        <div style={{ marginBottom:"16px", display:"flex", gap:"6px", fontFamily:fontSans, fontSize:"12px", color:C.gray600 }}>
          <button onClick={()=>setPage("dash-assoc")} style={{ background:"none", border:"none", color:C.teal, cursor:"pointer", fontFamily:fontSans, fontSize:"12px" }}>Panel</button>
          <span>›</span><span>Registro de Lugar de Búsqueda</span>
        </div>

        {/* Page header */}
        <div style={{ background:C.wine, padding:"20px 24px" }}>
          <div style={{ fontFamily:fontSans, fontSize:"11px", fontWeight:700, color:C.gold, letterSpacing:".1em", textTransform:"uppercase", marginBottom:"2px" }}>OPERATIVO DE CAMPO</div>
          <h1 style={{ fontFamily:font, fontSize:"20px", fontWeight:700, color:C.white }}>Registro de Lugar de Búsqueda y Datos Encontrados</h1>
        </div>

        <form onSubmit={e=>{e.preventDefault();setShowSuccess(true);}}
          style={{ background:C.white, border:`1px solid ${C.gray200}`, borderTop:"none", padding:"24px" }}>

          <InfoBox type="info">Toda la información documentada será incorporada al expediente del caso y estará disponible para los equipos de investigación.</InfoBox>

          {/* I. Ubicación */}
          <div style={{ marginBottom:"24px" }}>
            <SecDivider num="I" title="UBICACIÓN Y TEMPORALIDAD"/>
            <GovInput label="Dirección exacta del lugar de búsqueda" required placeholder="Calle, Colonia, Municipio, Estado, CP" value={form.direccion} onChange={e=>set("direccion",e.target.value)}/>
            {/* Map placeholder */}
            <div style={{ background:C.gray100, height:"160px", display:"flex", alignItems:"center", justifyContent:"center", color:C.gray400, fontFamily:fontSans, fontSize:"13px", border:`1px solid ${C.gray200}`, marginBottom:"16px" }}>
              Mapa interactivo — Haga clic para marcar la ubicación
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"16px" }}>
              <GovInput label="Fecha de inicio de búsqueda"  type="date" required value={form.fechaInicio} onChange={e=>set("fechaInicio",e.target.value)}/>
              <GovInput label="Fecha de finalización"        type="date" required value={form.fechaFin}    onChange={e=>set("fechaFin",e.target.value)}/>
            </div>
          </div>

          {/* II. Detalles operación */}
          <div style={{ marginBottom:"24px" }}>
            <SecDivider num="II" title="DETALLES DE LA OPERACIÓN"/>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"16px" }}>
              <GovSelect label="Tipo de evidencia encontrada" value={form.tipoEvidencia} onChange={e=>set("tipoEvidencia",e.target.value)}>
                <option value="">Seleccionar</option>
                <option>Objetos Personales</option><option>Ropa o Calzado</option><option>Documentos</option><option>Indicios biológicos</option>
              </GovSelect>
              <GovInput label="Equipo de búsqueda responsable" placeholder="Nombre del equipo o institución" value={form.equipo} onChange={e=>set("equipo",e.target.value)}/>
              <GovSelect label="Condición climática" value={form.condicion} onChange={e=>set("condicion",e.target.value)}>
                <option value="">Seleccionar</option><option>Soleado</option><option>Nublado</option><option>Lluvia</option><option>Viento fuerte</option>
              </GovSelect>
              <GovSelect label="Visibilidad en el área" value={form.visibilidad} onChange={e=>set("visibilidad",e.target.value)}>
                <option value="">Seleccionar</option><option>Buena</option><option>Regular</option><option>Mala</option>
              </GovSelect>
            </div>
          </div>

          {/* III. Evidencia fotográfica */}
          <div style={{ marginBottom:"24px" }}>
            <SecDivider num="III" title="EVIDENCIA FOTOGRÁFICA"/>
            <label style={{ display:"block", border:`2px dashed ${C.gray200}`, padding:"20px", textAlign:"center", cursor:"pointer", background:C.gray50, marginBottom:"12px" }}
              onMouseEnter={e=>e.currentTarget.style.borderColor=C.teal} onMouseLeave={e=>e.currentTarget.style.borderColor=C.gray200}>
              <div style={{ fontSize:"24px", marginBottom:"6px" }}>{/* icon removed */}</div>
              <div style={{ fontFamily:fontSans, fontSize:"12px", fontWeight:700, color:C.teal }}>Subir imágenes de evidencia (máx. 10)</div>
              <div style={{ fontFamily:fontSans, fontSize:"11px", color:C.gray400, marginTop:"3px" }}>Arrastra o haz clic para seleccionar</div>
              <input type="file" accept="image/*" multiple style={{ display:"none" }}
                onChange={e=>setImagenes(Array.from(e.target.files).slice(0,10))} disabled={imagenes.length>=10}/>
            </label>
            {imagenes.length > 0 && (
              <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:"8px" }}>
                {imagenes.map((img,i) => (
                  <div key={i} style={{ position:"relative" }}>
                    <img src={URL.createObjectURL(img)} style={{ width:"100%", height:"60px", objectFit:"cover", border:`1px solid ${C.gray200}` }} alt=""/>
                    <button type="button" onClick={()=>setImagenes(imagenes.filter((_,j)=>j!==i))} style={{ position:"absolute", top:"2px", right:"2px", width:"16px", height:"16px", background:"#CC0000", color:C.white, border:"none", cursor:"pointer", fontSize:"10px" }}>✕</button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* IV. Descripción */}
          <div style={{ marginBottom:"24px" }}>
            <SecDivider num="IV" title="DESCRIPCIÓN DETALLADA DEL OPERATIVO"/>
            <GovInput textarea label="Descripción completa del lugar y hallazgos" required rows={5}
              placeholder="Describe detalladamente el área de búsqueda, condiciones del terreno, métodos utilizados, evidencia encontrada y cualquier información relevante para la investigación…"
              value={form.descripcion} onChange={e=>set("descripcion",e.target.value)}/>
          </div>

          <InfoBox type="warn"><strong>Aviso legal:</strong> Es responsabilidad del usuario verificar que cuenta con los permisos necesarios para fotografiar y reportar en las áreas mencionadas.</InfoBox>

          <div style={{ display:"flex", gap:"10px", justifyContent:"flex-end" }}>
            <GovBtn variant="secondary" onClick={()=>setPage("dash-assoc")}>Cancelar</GovBtn>
            <GovBtn type="submit">Guardar Registro de Operativo →</GovBtn>
          </div>
        </form>
      </div>

      <Modal show={showSuccess} onClose={()=>{setShowSuccess(false);setPage("dash-assoc");}} title="Registro Guardado Correctamente">
        <InfoBox type="success">El operativo de búsqueda ha sido registrado en el sistema.</InfoBox>
        <p style={{ fontFamily:fontSans, fontSize:"13px", color:C.gray700, marginBottom:"20px", lineHeight:1.7 }}>La información ha sido incorporada al expediente y está disponible para los equipos de investigación.</p>
        <GovBtn onClick={()=>{setShowSuccess(false);setPage("dash-assoc");}} full>Volver al Panel →</GovBtn>
      </Modal>
    </div>
  );
};

export default SearchPlace;
