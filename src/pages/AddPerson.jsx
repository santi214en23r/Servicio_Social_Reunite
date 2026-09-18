import { useState } from "react";
import { C, font, fontSans } from "../shared/theme";
import { GovBtn, GovInput, GovSelect, InfoBox, Modal } from "../shared/components";
import "../styles/pages/AddPerson.css";

const SecDivider = ({ num, title }) => (
  <div className="add-person-page__section-title">
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
    <div className="add-person-page">
      <div className="add-person-page__container">

        {/* Breadcrumb */}
        <div className="add-person-page__breadcrumb">
          <button onClick={()=>setPage("home")} className="add-person-page__back-link">Inicio</button>
          <span>›</span><span>Reporte de Persona Desaparecida</span>
        </div>

        {/* Page header */}
        <div className="add-person-page__header">
          <div className="add-person-page__header-icon">{/* icon removed */}</div>
          <div>
            <div className="add-person-page__eyebrow">REGISTRO OFICIAL</div>
            <h1 className="add-person-page__title">Reporte de Persona Desaparecida o No Localizada</h1>
          </div>
        </div>

        <div className="add-person-page__content">
          <InfoBox type="warn">
            <strong>Aviso legal:</strong> La información proporcionada será utilizada exclusivamente para la búsqueda y localización de la persona. Todos los datos serán tratados con estricta confidencialidad conforme a la Ley General de Protección de Datos Personales. Proporcionar información falsa constituye un delito.
          </InfoBox>

          {/* I. Fotografía */}
          <div className="add-person-page__section">
            <SecDivider num="I" title="FOTOGRAFÍA DE LA PERSONA"/>
            <label htmlFor="photo-up" className="add-person-page__upload">
              {preview
                ? <img src={preview} className="add-person-page__preview" alt="preview"/>
                : <div><div className="add-person-page__upload-icon">{/* icon removed */}</div><div className="add-person-page__upload-title">Seleccionar Fotografía</div><div className="add-person-page__upload-help">JPG, PNG, GIF — Máx. 5 MB</div></div>
              }
              <input id="photo-up" type="file" accept="image/*" className="add-person-page__file-input" onChange={e=>{ const f=e.target.files[0]; if(f) setPreview(URL.createObjectURL(f)); }}/>
            </label>
          </div>

          {/* II. Información personal */}
          <div className="add-person-page__section">
            <SecDivider num="II" title="INFORMACIÓN PERSONAL"/>
            <div className="add-person-page__form-grid">
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
          <div className="add-person-page__section">
            <SecDivider num="III" title="FECHAS Y LUGAR DE LOS HECHOS"/>
            <div className="add-person-page__form-grid">
              <GovInput label="Fecha de los hechos"           type="date" required value={form.fechaHechos}  onChange={e=>set("fechaHechos",e.target.value)}/>
              <GovInput label="Fecha de pérdida de contacto" type="date" required value={form.fechaPercato} onChange={e=>set("fechaPercato",e.target.value)}/>
            </div>
            <GovInput label="Lugar de los hechos" hint="Dirección completa donde ocurrieron los hechos." required placeholder="Calle, Colonia, Municipio, Estado, CP" value={form.lugarHechos} onChange={e=>set("lugarHechos",e.target.value)}/>
            {/* Map placeholder */}
            <div className="add-person-page__map add-person-page__map--short">
               Mapa interactivo — Marque la ubicación
            </div>
          </div>

          {/* IV. Características */}
          <div className="add-person-page__section">
            <SecDivider num="IV" title="CARACTERÍSTICAS FÍSICAS Y SEÑAS PARTICULARES"/>
            <GovInput textarea label="Características físicas" hint="Estatura, complexión, color de piel, cabello, ojos, peso aproximado…" required rows={3} value={form.caracteristicasFisicas} onChange={e=>set("caracteristicasFisicas",e.target.value)}/>
            <GovInput textarea label="Señas particulares"      hint="Tatuajes, cicatrices, lunares, marcas, piercings…"                           rows={3} value={form.senasParticulares}      onChange={e=>set("senasParticulares",e.target.value)}/>
            <GovInput textarea label="Prendas de vestir al momento de la desaparición" hint="Colores, tipo de prendas, zapatos, accesorios…"      rows={3} value={form.prendasVestir}          onChange={e=>set("prendasVestir",e.target.value)}/>
          </div>

          <div className="add-person-page__actions">
            <GovBtn variant="secondary" onClick={()=>setPage("home")}>Cancelar</GovBtn>
            <GovBtn onClick={()=>setShowSuccess(true)}>Guardar Ficha Oficial →</GovBtn>
          </div>
        </div>
      </div>

      <Modal show={showSuccess} onClose={()=>{setShowSuccess(false);setPage("home");}} title="Ficha Registrada Correctamente">
        <InfoBox type="success">La ficha ha sido incorporada al sistema nacional de búsqueda.</InfoBox>
        <p className="add-person-page__modal-copy">La información ha sido registrada y está disponible para los colectivos de búsqueda y autoridades competentes.</p>
        <GovBtn onClick={()=>{setShowSuccess(false);setPage("home");}} full>Volver al Inicio →</GovBtn>
      </Modal>
    </div>
  );
};

export default AddPerson;
