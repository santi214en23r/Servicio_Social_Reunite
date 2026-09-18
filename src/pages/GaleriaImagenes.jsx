import { useState, useEffect } from "react";
import { C, font, fontSans, fontMono } from "../shared/theme";
import { GovBtn, SectionHeader, GovCard, Tag, InfoBox } from "../shared/components";
import { supabase } from "../supabaseClient";
import { Image, MapPin, Calendar, Search, Filter, ChevronRight, X, Download, Maximize2 } from "lucide-react";
import "../styles/pages/GaleriaImagenes.css";

const GaleriaImagenes = ({ setPage }) => {
  const [imagenesDron, setImagenesDron] = useState([]);
  const [imagenesSubidas, setImagenesSubidas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tab, setTab] = useState("dron"); // "dron" o "subida"
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedImagen, setSelectedImagen] = useState(null);
  const [filtroUbicacion, setFiltroUbicacion] = useState("todas");
  const [filtroOrganizacion, setFiltroOrganizacion] = useState("todas");

  // Función para construir URL válida
  const obtenerURLImagen = (urlImagen) => {
    if (!urlImagen) return "/img/placeholder.png";
    // Si es URL completa, devolver tal cual
    if (urlImagen.startsWith("http")) return urlImagen;
    // Si es ruta absoluta, devolver tal cual
    if (urlImagen.startsWith("/")) return urlImagen;
    // Si es ruta relativa, prepender /
    return "/" + urlImagen;
  };

  // Cargar imágenes de dron
  useEffect(() => {
    const cargarImagenesDron = async () => {
      try {
        setLoading(true);
        const { data, error: err } = await supabase
          .from("imagenes_dron")
          .select("*")
          .order("fecha_tomada", { ascending: false });

        if (err) throw err;
        console.log("Imágenes de dron cargadas:", data);
        setImagenesDron(data || []);
        setError(null);
      } catch (err) {
        console.error("Error cargando imágenes de dron:", err);
        setError("Error al cargar las imágenes. Por favor intenta más tarde.");
      } finally {
        setLoading(false);
      }
    };

    if (tab === "dron") {
      cargarImagenesDron();
    }
  }, [tab]);

  // Cargar imágenes subidas
  useEffect(() => {
    const cargarImagenesSubidas = async () => {
      try {
        setLoading(true);
        const { data, error: err } = await supabase
          .from("imagenes_subidas")
          .select("*")
          .order("fecha_tomada", { ascending: false });

        if (err) throw err;
        console.log("Imágenes subidas cargadas:", data);
        setImagenesSubidas(data || []);
        setError(null);
      } catch (err) {
        console.error("Error cargando imágenes subidas:", err);
        setError("Error al cargar las imágenes subidas. Por favor intenta más tarde.");
      } finally {
        setLoading(false);
      }
    };

    if (tab === "subida") {
      cargarImagenesSubidas();
    }
  }, [tab]);

  // Seleccionar imágenes según tab
  const imagenes = tab === "dron" ? imagenesDron : imagenesSubidas;

  // Obtener ubicaciones únicas
  const ubicaciones = ["todas", ...new Set(imagenes.map(img => img.lugar).filter(Boolean))];
  const organizaciones = ["todas", ...new Set(imagenesSubidas.map(img => img.organizacion).filter(Boolean))];

  // Filtrar imágenes
  const imagenesFiltradas = imagenes
    .filter(img => {
      const matchSearch = !searchTerm || (img.descripcion && img.descripcion.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchUbicacion = filtroUbicacion === "todas" || img.lugar === filtroUbicacion;
      const matchOrganizacion = tab === "dron" || filtroOrganizacion === "todas" || img.organizacion === filtroOrganizacion;
      return matchSearch && matchUbicacion && matchOrganizacion;
    });

  const estadisticas = {
    total: imagenes.length,
    por_ubicacion: imagenes.reduce((acc, img) => {
      if (img.lugar) {
        acc[img.lugar] = (acc[img.lugar] || 0) + 1;
      }
      return acc;
    }, {}),
  };

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString("es-MX", { 
      year: "numeric", 
      month: "long", 
      day: "numeric" 
    });
  };

  return (
    <div className="gallery-page">
      {/* Breadcrumb */}
      <div className="gallery-breadcrumb">
        <button onClick={() => setPage("home")} className="gallery-breadcrumb-link">Inicio</button>
        <span>›</span>
        <span>Imágenes</span>
      </div>

      {/* Header */}
      <div className="gallery-hero">
        <div className="gallery-container">
          <div className="gallery-eyebrow">
            ARCHIVO VISUAL
          </div>
          <h1 className="gallery-title">
            Imágenes
          </h1>
          <p className="gallery-intro">
            Imágenes de zonas de búsqueda y evidencia. Capturadas por dron y otras fuentes.
          </p>
        </div>
      </div>

      <div className="gallery-container gallery-content">
        {/* Tabs */}
        <div className="gallery-tabs">
          {[
            { id: "dron", label: "📷 Imágenes de Dron", count: imagenesDron.length },
            { id: "subida", label: "📤 Imágenes Subidas", count: imagenesSubidas.length },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`gallery-tab ${tab === t.id ? "is-active" : ""}`}
            >
              {t.label}
              <span className="gallery-tab-count">
                {t.count}
              </span>
            </button>
          ))}
        </div>

        {/* Contenido Tab Dron */}
        {tab === "dron" && (
          <>
            {/* Estadísticas */}
            <div className="gallery-stats">
              <div className="gallery-stat gallery-stat-teal">
                <div className="gallery-stat-label">
                  Total de Imágenes
                </div>
                <div className="gallery-stat-value gallery-stat-value-teal">
                  {estadisticas.total}
                </div>
              </div>
              <div className="gallery-stat gallery-stat-wine">
                <div className="gallery-stat-label">
                  Ubicaciones
                </div>
                <div className="gallery-stat-value gallery-stat-value-wine">
                  {ubicaciones.length - 1}
                </div>
              </div>
            </div>

            {/* Buscador y Filtros */}
            <div className="gallery-filters">
              <div className="gallery-filter-grid gallery-filter-grid-dron">
                {/* Búsqueda */}
                <div>
                  <label className="gallery-filter-label">
                    Buscar por Descripción
                  </label>
                  <div className="gallery-search-wrap">
                    <Search size={16} className="gallery-search-icon" />
                    <input
                      type="text"
                      placeholder="Ingresa búsqueda..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="gallery-field gallery-search-field"
                    />
                  </div>
                </div>

                {/* Filtro por Ubicación */}
                <div>
                  <label className="gallery-filter-label">
                    Ubicación
                  </label>
                  <select
                    value={filtroUbicacion}
                    onChange={(e) => setFiltroUbicacion(e.target.value)}
                    className="gallery-field"
                  >
                    {ubicaciones.map(ub => (
                      <option key={ub} value={ub}>
                        {ub === "todas" ? "Todas las ubicaciones" : ub}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Botón Limpiar */}
                <div className="gallery-filter-action gallery-filter-action-right">
                  <GovBtn
                    variant="secondary"
                    onClick={() => {
                      setSearchTerm("");
                      setFiltroUbicacion("todas");
                      setFiltroOrganizacion("todas");
                    }}
                  >
                    Limpiar
                  </GovBtn>
                </div>
              </div>

              {/* Resultados */}
              <div className="gallery-results">
                Se encontraron <strong>{imagenesFiltradas.length}</strong> de <strong>{imagenes.length}</strong> imágenes
              </div>
            </div>

            {/* Galería */}
            {loading ? (
              <div className="gallery-status gallery-loading">
                <div className="gallery-loading-wrap">
                  <div className="gallery-spinner" />
                </div>
                <p className="gallery-status-text">Cargando imágenes...</p>
              </div>
            ) : error ? (
              <InfoBox type="danger">{error}</InfoBox>
            ) : imagenesFiltradas.length === 0 ? (
              <div className="gallery-status gallery-empty">
                <Image size={48} className="gallery-empty-icon" />
                <p className="gallery-empty-title">No se encontraron imágenes</p>
                <p className="gallery-empty-text">Intenta ajustar tus criterios de búsqueda o filtros</p>
              </div>
            ) : (
              <div className="gallery-grid">
                {imagenesFiltradas.map((imagen) => (
                  <TarjetaImagen
                    key={imagen.url_imagen}
                    imagen={imagen}
                    onSelect={() => setSelectedImagen(imagen)}
                    formatearFecha={formatearFecha}
                    obtenerURLImagen={obtenerURLImagen}
                    tipo="dron"
                  />
                ))}
              </div>
            )}
          </>
        )}

        {/* Contenido Tab Subidas */}
        {tab === "subida" && (
          <>
            {/* Estadísticas */}
            <div className="gallery-stats">
              <div className="gallery-stat gallery-stat-teal">
                <div className="gallery-stat-label">
                  Total de Imágenes
                </div>
                <div className="gallery-stat-value gallery-stat-value-teal">
                  {estadisticas.total}
                </div>
              </div>
              <div className="gallery-stat gallery-stat-wine">
                <div className="gallery-stat-label">
                  Ubicaciones
                </div>
                <div className="gallery-stat-value gallery-stat-value-wine">
                  {ubicaciones.length - 1}
                </div>
              </div>
            </div>

            {/* Buscador y Filtros */}
            <div className="gallery-filters">
              <div className="gallery-filter-grid gallery-filter-grid-uploaded">
                <div>
                  <label className="gallery-filter-label">
                    Buscar por Descripción
                  </label>
                  <div className="gallery-search-wrap">
                    <Search size={16} className="gallery-search-icon" />
                    <input
                      type="text"
                      placeholder="Ingresa búsqueda..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="gallery-field gallery-search-field"
                    />
                  </div>
                </div>
                <div>
                  <label className="gallery-filter-label">
                    Lugar
                  </label>
                  <select
                    value={filtroUbicacion}
                    onChange={(e) => setFiltroUbicacion(e.target.value)}
                    className="gallery-field"
                  >
                    {ubicaciones.map(ub => (
                      <option key={ub} value={ub}>
                        {ub === "todas" ? "Todos los lugares" : ub}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="gallery-filter-label">
                    Organización
                  </label>
                  <select
                    value={filtroOrganizacion}
                    onChange={(e) => setFiltroOrganizacion(e.target.value)}
                    className="gallery-field"
                  >
                    {organizaciones.map((organizacion) => (
                      <option key={organizacion} value={organizacion}>
                        {organizacion === "todas" ? "Todas las organizaciones" : organizacion}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="gallery-filter-action gallery-filter-action-right">
                  <GovBtn
                    variant="secondary"
                    onClick={() => {
                      setSearchTerm("");
                      setFiltroUbicacion("todas");
                      setFiltroOrganizacion("todas");
                    }}
                  >
                    Limpiar
                  </GovBtn>
                </div>
              </div>
              <div className="gallery-results">
                Se encontraron <strong>{imagenesFiltradas.length}</strong> de <strong>{imagenes.length}</strong> imágenes subidas
              </div>
            </div>

            {/* Galería */}
            {loading ? (
              <div className="gallery-status gallery-loading">
                <div className="gallery-loading-wrap">
                  <div className="gallery-spinner" />
                </div>
                <p className="gallery-status-text">Cargando imágenes subidas...</p>
              </div>
            ) : error ? (
              <InfoBox type="danger">{error}</InfoBox>
            ) : imagenesFiltradas.length === 0 ? (
              <div className="gallery-status gallery-empty">
                <Image size={48} className="gallery-empty-icon" />
                <p className="gallery-empty-title">No se encontraron imágenes</p>
                <p className="gallery-empty-text">Intenta ajustar tus criterios de búsqueda o filtros</p>
              </div>
            ) : (
              <div className="gallery-grid">
                {imagenesFiltradas.map((imagen) => (
                  <TarjetaImagen
                    key={imagen.url_imagen}
                    imagen={imagen}
                    onSelect={() => setSelectedImagen(imagen)}
                    formatearFecha={formatearFecha}
                    obtenerURLImagen={obtenerURLImagen}
                    tipo="subida"
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal de Imagen */}
      {selectedImagen && (
        <ModalImagen
          imagen={selectedImagen}
          onClose={() => setSelectedImagen(null)}
          formatearFecha={formatearFecha}
          obtenerURLImagen={obtenerURLImagen}
          tipo={tab}
        />
      )}
    </div>
  );
};

// Componente Tarjeta de Imagen
const TarjetaImagen = ({ imagen, onSelect, formatearFecha, obtenerURLImagen, tipo = "dron" }) => {
  const [hover, setHover] = useState(false);

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={onSelect}
      className={`gallery-card ${hover ? "is-hovered" : ""}`}
    >
      {/* Imagen */}
      <div className="gallery-card-image" style={{ "--image-url": `url('${obtenerURLImagen(imagen.url_imagen)}')` }}>
        <div className="gallery-image-badge">
          {tipo === "dron" ? "📷 Dron" : "📤 Subida"}
        </div>
        {hover && (
          <div className="gallery-card-overlay">
            <div className="gallery-card-overlay-icon">
              <Maximize2 size={18} />
            </div>
          </div>
        )}
      </div>

      {/* Contenido */}
      <div className="gallery-card-content">
        {/* Nombre/URL */}
        <h3 className="gallery-card-title">
          {tipo === "dron" ? "Imagen de Dron" : "Imagen Subida"}
        </h3>

        {/* Descripción */}
        {imagen.descripcion && (
          <p className="gallery-card-description">
            {imagen.descripcion}
          </p>
        )}

        {/* Ubicación */}
        {imagen.lugar && (
          <div className="gallery-card-location">
            <MapPin size={12} className="gallery-card-location-icon" />
            <span>{imagen.lugar}</span>
          </div>
        )}

        {/* Fecha */}
        <div className="gallery-card-date">
          {formatearFecha(imagen.fecha_tomada)}
        </div>

        {/* Botón Ver */}
        <button
          onClick={(e) => {
            e.stopPropagation();
          }}
          className="gallery-card-button"
        >
          Ver en Grande
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
};

// Componente Modal
const ModalImagen = ({ imagen, onClose, formatearFecha, obtenerURLImagen, tipo = "dron" }) => {
  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        className="gallery-modal-overlay"
      />

      {/* Modal */}
      <div
        className="gallery-modal"
      >
        {/* Header */}
        <div className="gallery-modal-header">
          <h2 className="gallery-modal-title">
            Imagen de Dron
          </h2>
          <button
            onClick={onClose}
            className="gallery-modal-close"
          >
            ×
          </button>
        </div>

        {/* Contenido */}
        <div className="gallery-modal-content">
          {/* Imagen Principal */}
          <div className="gallery-modal-image" style={{ "--image-url": `url('${obtenerURLImagen(imagen.url_imagen)}')` }} />

          {/* Información */}
          <div className="gallery-modal-details">
            <h4 className="gallery-section-title">
              Detalles
            </h4>

            <div className="gallery-details-grid">
              <div>
                <div className="gallery-detail-label">Tipo</div>
                <Tag color={C.wine}>Imagen de Dron</Tag>
              </div>
              {imagen.lugar && (
                <div>
                  <div className="gallery-detail-label">Lugar</div>
                  <div className="gallery-detail-value">
                    {imagen.lugar}
                  </div>
                </div>
              )}
              <div>
                <div className="gallery-detail-label">Fecha de Captura</div>
                <div className="gallery-detail-value">
                  {imagen.fecha_tomada ? formatearFecha(imagen.fecha_tomada) : "No especificada"}
                </div>
              </div>
              {tipo === "dron" && imagen.usuario && (
                <div>
                  <div className="gallery-detail-label">Capturada por</div>
                  <div className="gallery-detail-value">
                    {imagen.usuario}
                  </div>
                </div>
              )}
              {tipo === "subida" && imagen.organizacion && (
                <div>
                  <div className="gallery-detail-label">Organización</div>
                  <div className="gallery-detail-value">
                    {imagen.organizacion}
                  </div>
                </div>
              )}
            </div>

            {/* Descripción */}
            {imagen.descripcion && (
              <div className="gallery-description-block">
                <div className="gallery-detail-label">Descripción</div>
                <div className="gallery-description">
                  {imagen.descripcion}
                </div>
              </div>
            )}

            {/* Descarga */}
            <div className="gallery-download-block">
              <a
                href={obtenerURLImagen(imagen.url_imagen)}
                download
                className="gallery-download"
              >
                <Download size={14} />
                Descargar Imagen
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default GaleriaImagenes;
