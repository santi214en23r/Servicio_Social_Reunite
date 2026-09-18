import { useState } from "react";
import { C, font, fontSans } from "../shared/theme";
import { GovBtn, GovInput, GovSelect, InfoBox, Modal } from "../shared/components";
import "../styles/pages/SearchPlace.css";

const SecDivider = ({ num, title }) => (
  <div className="search-place-section-heading">
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
    <div className="search-place-page">
      <div className="search-place-container">

        {/* Breadcrumb */}
        <div className="search-place-breadcrumb">
          <button onClick={()=>setPage("dash-assoc")} className="search-place-breadcrumb-link">Panel</button>
          <span>›</span><span>Registro de Lugar de Búsqueda</span>
        </div>

        {/* Page header */}
        <div className="search-place-header">
          <div className="search-place-eyebrow">OPERATIVO DE CAMPO</div>
          <h1 className="search-place-title">Registro de Lugar de Búsqueda y Datos Encontrados</h1>
        </div>

        <form onSubmit={e=>{e.preventDefault();setShowSuccess(true);}}
          className="search-place-form">

          <InfoBox type="info">Toda la información documentada será incorporada al expediente del caso y estará disponible para los equipos de investigación.</InfoBox>

          {/* I. Ubicación */}
          <div className="search-place-section">
            <SecDivider num="I" title="UBICACIÓN Y TEMPORALIDAD"/>
            <GovInput label="Dirección exacta del lugar de búsqueda" required placeholder="Calle, Colonia, Municipio, Estado, CP" value={form.direccion} onChange={e=>set("direccion",e.target.value)}/>
            {/* Map placeholder */}
            <div className="search-place-map-placeholder">
              Mapa interactivo — Haga clic para marcar la ubicación
            </div>
            <div className="search-place-grid">
              <GovInput label="Fecha de inicio de búsqueda"  type="date" required value={form.fechaInicio} onChange={e=>set("fechaInicio",e.target.value)}/>
              <GovInput label="Fecha de finalización"        type="date" required value={form.fechaFin}    onChange={e=>set("fechaFin",e.target.value)}/>
            </div>
          </div>

          {/* II. Detalles operación */}
          <div className="search-place-section">
            <SecDivider num="II" title="DETALLES DE LA OPERACIÓN"/>
            <div className="search-place-grid">
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
          <div className="search-place-section">
            <SecDivider num="III" title="EVIDENCIA FOTOGRÁFICA"/>
            <label className="search-place-upload">
              <div className="search-place-upload-icon">{/* icon removed */}</div>
              <div className="search-place-upload-title">Subir imágenes de evidencia (máx. 10)</div>
              <div className="search-place-upload-help">Arrastra o haz clic para seleccionar</div>
              <input type="file" accept="image/*" multiple
                onChange={e=>setImagenes(Array.from(e.target.files).slice(0,10))} disabled={imagenes.length>=10}/>
            </label>
            {imagenes.length > 0 && (
              <div className="search-place-images">
                {imagenes.map((img,i) => (
                  <div key={i} className="search-place-image">
                    <img src={URL.createObjectURL(img)} alt=""/>
                    <button type="button" onClick={()=>setImagenes(imagenes.filter((_,j)=>j!==i))} className="search-place-image-remove">✕</button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* IV. Descripción */}
          <div className="search-place-section">
            <SecDivider num="IV" title="DESCRIPCIÓN DETALLADA DEL OPERATIVO"/>
            <GovInput textarea label="Descripción completa del lugar y hallazgos" required rows={5}
              placeholder="Describe detalladamente el área de búsqueda, condiciones del terreno, métodos utilizados, evidencia encontrada y cualquier información relevante para la investigación…"
              value={form.descripcion} onChange={e=>set("descripcion",e.target.value)}/>
          </div>

          <InfoBox type="warn"><strong>Aviso legal:</strong> Es responsabilidad del usuario verificar que cuenta con los permisos necesarios para fotografiar y reportar en las áreas mencionadas.</InfoBox>

          <div className="search-place-actions">
            <GovBtn variant="secondary" onClick={()=>setPage("dash-assoc")}>Cancelar</GovBtn>
            <GovBtn type="submit">Guardar Registro de Operativo →</GovBtn>
          </div>
        </form>
      </div>

      <Modal show={showSuccess} onClose={()=>{setShowSuccess(false);setPage("dash-assoc");}} title="Registro Guardado Correctamente">
        <InfoBox type="success">El operativo de búsqueda ha sido registrado en el sistema.</InfoBox>
        <p className="search-place-modal-text">La información ha sido incorporada al expediente y está disponible para los equipos de investigación.</p>
        <GovBtn onClick={()=>{setShowSuccess(false);setPage("dash-assoc");}} full>Volver al Panel →</GovBtn>
      </Modal>
    </div>
  );
};

export default SearchPlace;
