import { useState } from "react";
import { C, font, fontMono, fontSans } from "../shared/theme";
import { GovBtn, GovInput, GovSelect, InfoBox, Tag } from "../shared/components";

const SearchMatches = ({ setPage }) => {
  const [file, setFile]       = useState(null);
  const [preview, setPreview] = useState(null);
  const [query, setQuery]     = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const evidencias = [
    { id:1, folio:"EV-2024-001", titulo:"Camisa azul con rayas blancas",   tipo:"Prenda de vestir", lugar:"Parque Central, CDMX",             fecha:"10/06/2024", match:94 },
    { id:2, folio:"EV-2024-002", titulo:"Zapato deportivo rojo talla 27",  tipo:"Calzado",          lugar:"Zona Industrial, Jalisco",          fecha:"15/06/2024", match:87 },
    { id:3, folio:"EV-2024-003", titulo:"Gorra negra con logo deportivo",  tipo:"Accesorio",        lugar:"Río Santa Catarina, N.L.",          fecha:"01/07/2024", match:76 },
    { id:4, folio:"EV-2024-004", titulo:"Cartera de cuero color café",     tipo:"Objeto personal",  lugar:"Centro Histórico, Puebla",          fecha:"22/06/2024", match:65 },
    { id:5, folio:"EV-2024-005", titulo:"Playera blanca de algodón",       tipo:"Prenda de vestir", lugar:"Bosque de Chapultepec, CDMX",       fecha:"28/06/2024", match:58 },
    { id:6, folio:"EV-2024-006", titulo:"Reloj de pulsera color plateado", tipo:"Joyería",          lugar:"Plaza Comercial, Guadalajara",      fecha:"05/07/2024", match:51 },
  ];

  const handleFile = e => {
    const f = e.target.files[0]; setFile(f);
    if(f){ const r=new FileReader(); r.onloadend=()=>setPreview(r.result); r.readAsDataURL(f); }
  };

  const handleSearch = e => {
    e.preventDefault(); setLoading(true);
    setTimeout(() => {
      const filtered = query
        ? evidencias.filter(ev => ev.titulo.toLowerCase().includes(query.toLowerCase()) || ev.tipo.toLowerCase().includes(query.toLowerCase()))
        : evidencias;
      setResults(filtered); setLoading(false); setSearched(true);
    }, 1400);
  };

  const handleClear = () => { setSearched(false); setResults([]); setQuery(""); setFile(null); setPreview(null); };

  return (
    <div style={{ minHeight:"80vh", background:C.gray50, padding:"32px 24px" }}>
      <div style={{ maxWidth:"1000px", margin:"0 auto" }}>

        {/* Breadcrumb */}
        <div style={{ marginBottom:"16px", display:"flex", gap:"6px", fontFamily:fontSans, fontSize:"12px", color:C.gray600 }}>
          <button onClick={()=>setPage("home")} style={{ background:"none", border:"none", color:C.teal, cursor:"pointer", fontFamily:fontSans, fontSize:"12px" }}>Inicio</button>
          <span>›</span><span>Búsqueda de Coincidencias</span>
        </div>

        {/* Page header */}
        <div style={{ background:C.wine, padding:"20px 24px" }}>
          <div style={{ fontFamily:fontSans, fontSize:"11px", fontWeight:700, color:C.gold, letterSpacing:".1em", textTransform:"uppercase", marginBottom:"2px" }}>SISTEMA DE BÚSQUEDA INTELIGENTE</div>
          <h1 style={{ fontFamily:font, fontSize:"20px", fontWeight:700, color:C.white }}>Búsqueda de Coincidencias de Evidencia</h1>
        </div>

        {/* Search form */}
        <div style={{ background:C.white, border:`1px solid ${C.gray200}`, borderTop:"none", padding:"24px" }}>
          <InfoBox type="info">El sistema utiliza reconocimiento de imágenes y análisis de patrones para identificar prendas, objetos y personas registradas en la base de datos nacional.</InfoBox>

          <form onSubmit={handleSearch}>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"20px", marginBottom:"20px" }}>
              {/* Image */}
              <div>
                <div style={{ fontFamily:fontSans, fontSize:"11px", fontWeight:700, color:C.wine, letterSpacing:".08em", textTransform:"uppercase", marginBottom:"10px", padding:"6px 0", borderBottom:`2px solid ${C.wine}` }}>I. IMAGEN DE EVIDENCIA</div>
                <label htmlFor="ev-up" style={{ display:"block", border:`2px dashed ${C.gray200}`, padding:"20px", textAlign:"center", cursor:"pointer", background:C.gray50 }}
                  onMouseEnter={e=>e.currentTarget.style.borderColor=C.teal} onMouseLeave={e=>e.currentTarget.style.borderColor=C.gray200}>
                  {preview
                    ? <img src={preview} style={{ width:"80px", height:"80px", objectFit:"cover" }} alt="preview"/>
                    : <div><div style={{ fontSize:"28px", marginBottom:"6px" }}>{/* icon removed */}</div><div style={{ fontFamily:fontSans, fontSize:"12px", fontWeight:700, color:C.teal }}>{file?file.name:"Subir imagen de prenda u objeto"}</div><div style={{ fontFamily:fontSans, fontSize:"11px", color:C.gray400, marginTop:"3px" }}>JPG, PNG — Máx. 5 MB</div></div>
                  }
                  <input id="ev-up" type="file" accept="image/*" style={{ display:"none" }} onChange={handleFile}/>
                </label>
              </div>

              {/* Description */}
              <div>
                <div style={{ fontFamily:fontSans, fontSize:"11px", fontWeight:700, color:C.wine, letterSpacing:".08em", textTransform:"uppercase", marginBottom:"10px", padding:"6px 0", borderBottom:`2px solid ${C.wine}` }}>II. DESCRIPCIÓN DE LA EVIDENCIA</div>
                <GovInput label="Descripción detallada" placeholder="Ej: camisa azul, zapato rojo deportivo, gorra negra…" value={query} onChange={e=>setQuery(e.target.value)}/>
                <GovSelect label="Tipo de evidencia">
                  <option value="">Todos los tipos</option>
                  <option>Prenda de vestir</option><option>Calzado</option><option>Accesorio</option><option>Objeto personal</option><option>Joyería</option>
                </GovSelect>
              </div>
            </div>

            <div style={{ display:"flex", justifyContent:"flex-end", gap:"10px" }}>
              <GovBtn variant="secondary" type="button" onClick={handleClear}>Limpiar</GovBtn>
              <GovBtn type="submit" disabled={loading}>{loading?"Procesando…":"Ejecutar Búsqueda"}</GovBtn>
            </div>
          </form>
        </div>

        {/* ── Results ── */}
        {searched && (
          <div style={{ marginTop:"20px" }}>
            <div style={{ background:C.tealBg, border:`1px solid ${C.teal}44`, padding:"12px 16px", display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"12px" }}>
              <div style={{ fontFamily:fontSans, fontSize:"13px", fontWeight:700, color:C.teal }}>{results.length} resultado(s) encontrado(s)</div>
              <GovBtn variant="ghost" onClick={handleClear}>Nueva Búsqueda</GovBtn>
            </div>

            {results.length === 0 ? (
              <InfoBox type="warn">No se encontraron registros que coincidan con los criterios de búsqueda.</InfoBox>
            ) : (
              <div style={{ background:C.white, border:`1px solid ${C.gray200}` }}>
                <table style={{ width:"100%", borderCollapse:"collapse" }}>
                  <thead>
                    <tr style={{ background:C.gray50, borderBottom:`2px solid ${C.gray200}` }}>
                      {["Folio","Descripción","Tipo","Lugar","Fecha","Similitud"].map(h => (
                        <th key={h} style={{ padding:"10px 14px", fontFamily:fontSans, fontSize:"11px", fontWeight:700, color:C.gray600, letterSpacing:".06em", textTransform:"uppercase", textAlign:"left" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((ev,i) => (
                      <tr key={ev.id} style={{ borderBottom:`1px solid ${C.gray100}`, background:i%2===0?C.white:C.gray50 }}>
                        <td style={{ padding:"10px 14px", fontFamily:fontMono, fontSize:"12px", color:C.teal, fontWeight:600 }}>{ev.folio}</td>
                        <td style={{ padding:"10px 14px", fontFamily:fontSans, fontSize:"13px", color:C.gray800, fontWeight:600 }}>{ev.titulo}</td>
                        <td style={{ padding:"10px 14px" }}><Tag>{ev.tipo}</Tag></td>
                        <td style={{ padding:"10px 14px", fontFamily:fontSans, fontSize:"12px", color:C.gray600 }}>{ev.lugar}</td>
                        <td style={{ padding:"10px 14px", fontFamily:fontSans, fontSize:"12px", color:C.gray600 }}>{ev.fecha}</td>
                        <td style={{ padding:"10px 14px" }}>
                          <div style={{ display:"flex", alignItems:"center", gap:"6px" }}>
                            <div style={{ width:"50px", height:"5px", background:C.gray200 }}>
                              <div style={{ width:`${ev.match}%`, height:"100%", background:ev.match>80?C.teal:ev.match>60?C.gold:C.gray400 }}/>
                            </div>
                            <span style={{ fontFamily:fontSans, fontSize:"12px", fontWeight:700, color:ev.match>80?C.teal:ev.match>60?C.gold:C.gray600 }}>{ev.match}%</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchMatches;
