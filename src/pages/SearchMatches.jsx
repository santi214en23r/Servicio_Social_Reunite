import { useState } from "react";
import { C, font, fontMono, fontSans } from "../shared/theme";
import { GovBtn, GovInput, GovSelect, InfoBox, Tag } from "../shared/components";
import "../styles/pages/SearchMatches.css";

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
    <div className="search-matches-page">
      <div className="search-matches-container">

        {/* Breadcrumb */}
        <div className="search-matches-breadcrumb">
          <button onClick={()=>setPage("home")} className="search-matches-breadcrumb-link">Inicio</button>
          <span>›</span><span>Búsqueda de Coincidencias</span>
        </div>

        {/* Page header */}
        <div className="search-matches-header">
          <div className="search-matches-eyebrow">SISTEMA DE BÚSQUEDA INTELIGENTE</div>
          <h1 className="search-matches-title">Búsqueda de Coincidencias de Evidencia</h1>
        </div>

        {/* Search form */}
        <div className="search-matches-form-panel">
          <InfoBox type="info">El sistema utiliza reconocimiento de imágenes y análisis de patrones para identificar prendas, objetos y personas registradas en la base de datos nacional.</InfoBox>

          <form onSubmit={handleSearch}>
            <div className="search-matches-form-grid">
              {/* Image */}
              <div>
                <div className="search-matches-section-heading">I. IMAGEN DE EVIDENCIA</div>
                <label htmlFor="ev-up" className="search-matches-upload">
                  {preview
                    ? <img src={preview} className="search-matches-preview" alt="preview"/>
                    : <div><div className="search-matches-upload-icon">{/* icon removed */}</div><div className="search-matches-upload-title">{file?file.name:"Subir imagen de prenda u objeto"}</div><div className="search-matches-upload-help">JPG, PNG — Máx. 5 MB</div></div>
                  }
                  <input id="ev-up" type="file" accept="image/*" onChange={handleFile}/>
                </label>
              </div>

              {/* Description */}
              <div>
                <div className="search-matches-section-heading">II. DESCRIPCIÓN DE LA EVIDENCIA</div>
                <GovInput label="Descripción detallada" placeholder="Ej: camisa azul, zapato rojo deportivo, gorra negra…" value={query} onChange={e=>setQuery(e.target.value)}/>
                <GovSelect label="Tipo de evidencia">
                  <option value="">Todos los tipos</option>
                  <option>Prenda de vestir</option><option>Calzado</option><option>Accesorio</option><option>Objeto personal</option><option>Joyería</option>
                </GovSelect>
              </div>
            </div>

            <div className="search-matches-form-actions">
              <GovBtn variant="secondary" type="button" onClick={handleClear}>Limpiar</GovBtn>
              <GovBtn type="submit" disabled={loading}>{loading?"Procesando…":"Ejecutar Búsqueda"}</GovBtn>
            </div>
          </form>
        </div>

        {/* ── Results ── */}
        {searched && (
          <div className="search-matches-results">
            <div className="search-matches-results-summary">
              <div className="search-matches-results-count">{results.length} resultado(s) encontrado(s)</div>
              <GovBtn variant="ghost" onClick={handleClear}>Nueva Búsqueda</GovBtn>
            </div>

            {results.length === 0 ? (
              <InfoBox type="warn">No se encontraron registros que coincidan con los criterios de búsqueda.</InfoBox>
            ) : (
              <div className="search-matches-table-panel">
                <table className="search-matches-table">
                  <thead>
                    <tr className="search-matches-table-heading">
                      {["Folio","Descripción","Tipo","Lugar","Fecha","Similitud"].map(h => (
                        <th key={h}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((ev,i) => (
                      <tr key={ev.id} className={`search-matches-table-row ${i%2===0 ? "is-even" : ""}`}>
                        <td className="search-matches-folio">{ev.folio}</td>
                        <td className="search-matches-description">{ev.titulo}</td>
                        <td><Tag>{ev.tipo}</Tag></td>
                        <td className="search-matches-muted">{ev.lugar}</td>
                        <td className="search-matches-muted">{ev.fecha}</td>
                        <td>
                          <div className="search-matches-score">
                            <div className={`search-matches-score-bar ${ev.match>80 ? "is-high" : ev.match>60 ? "is-medium" : "is-low"}`} style={{ "--match-width": `${ev.match}%` }}>
                              <div />
                            </div>
                            <span className={`search-matches-score-label ${ev.match>80 ? "is-high" : ev.match>60 ? "is-medium" : "is-low"}`}>{ev.match}%</span>
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
