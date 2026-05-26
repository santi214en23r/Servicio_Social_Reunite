import { useState, useEffect } from "react";
import { C, font, fontSans, fontMono } from "../shared/theme";
import { GovBtn, SectionHeader, GovCard, Tag, InfoBox } from "../shared/components";
import { supabase } from "../supabaseClient";
import { Image, MapPin, Calendar, Search, Filter, ChevronRight, X, Download, Maximize2 } from "lucide-react";

const GaleriaImagenes = ({ setPage }) => {
  const [imagenesDron, setImagenesDron] = useState([]);
  const [imagenesSubidas, setImagenesSubidas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tab, setTab] = useState("dron"); // "dron" o "subida"
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedImagen, setSelectedImagen] = useState(null);
  const [filtroUbicacion, setFiltroUbicacion] = useState("todas");

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

  // Filtrar imágenes
  const imagenesFiltradas = imagenes
    .filter(img => {
      const matchSearch = !searchTerm || (img.descripcion && img.descripcion.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchUbicacion = filtroUbicacion === "todas" || img.lugar === filtroUbicacion;
      return matchSearch && matchUbicacion;
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
    <div style={{ minHeight: "100vh", background: C.gray50, paddingBottom: "40px" }}>
      {/* Breadcrumb */}
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "16px 24px", display: "flex", gap: "6px", fontFamily: fontSans, fontSize: "12px", color: C.gray600 }}>
        <button onClick={() => setPage("home")} style={{ background: "none", border: "none", color: C.teal, cursor: "pointer", fontFamily: fontSans, fontSize: "12px" }}>Inicio</button>
        <span>›</span>
        <span>Imágenes</span>
      </div>

      {/* Header */}
      <div style={{ background: C.wine, padding: "28px 24px", marginBottom: "32px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ fontFamily: fontSans, fontSize: "11px", fontWeight: 700, color: C.gold, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: "2px" }}>
            ARCHIVO VISUAL
          </div>
          <h1 style={{ fontFamily: font, fontSize: "32px", fontWeight: 700, color: C.white, marginBottom: "8px" }}>
            Imágenes
          </h1>
          <p style={{ fontFamily: fontSans, fontSize: "14px", color: "rgba(255,255,255,.85)", maxWidth: "500px", lineHeight: 1.5 }}>
            Imágenes de zonas de búsqueda y evidencia. Capturadas por dron y otras fuentes.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}>
        {/* Tabs */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "32px", borderBottom: `1px solid ${C.gray200}` }}>
          {[
            { id: "dron", label: "📷 Imágenes de Dron", count: imagenesDron.length },
            { id: "subida", label: "📤 Imágenes Subidas", count: imagenesSubidas.length },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                background: tab === t.id ? C.teal : "transparent",
                color: tab === t.id ? C.white : C.gray600,
                border: "none",
                padding: "12px 16px",
                fontFamily: fontSans,
                fontSize: "13px",
                fontWeight: tab === t.id ? 700 : 600,
                cursor: "pointer",
                borderBottom: tab === t.id ? `3px solid ${C.white}` : "3px solid transparent",
                transition: "all .2s",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                textTransform: "uppercase",
                letterSpacing: ".03em",
              }}
            >
              {t.label}
              <span style={{
                background: C.white,
                color: tab === t.id ? C.teal : C.gray600,
                padding: "2px 6px",
                borderRadius: "12px",
                fontSize: "11px",
                fontWeight: 700,
              }}>
                {t.count}
              </span>
            </button>
          ))}
        </div>

        {/* Contenido Tab Dron */}
        {tab === "dron" && (
          <>
            {/* Estadísticas */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "32px" }}>
              <div style={{ background: C.white, border: `1px solid ${C.gray200}`, borderTop: `3px solid ${C.teal}`, padding: "20px", borderRadius: "2px" }}>
                <div style={{ fontSize: "13px", color: C.gray600, fontFamily: fontSans, fontWeight: 600, marginBottom: "8px", textTransform: "uppercase", letterSpacing: ".03em" }}>
                  Total de Imágenes
                </div>
                <div style={{ fontSize: "28px", fontWeight: 700, color: C.teal, fontFamily: fontMono }}>
                  {estadisticas.total}
                </div>
              </div>
              <div style={{ background: C.white, border: `1px solid ${C.gray200}`, borderTop: `3px solid ${C.wine}`, padding: "20px", borderRadius: "2px" }}>
                <div style={{ fontSize: "13px", color: C.gray600, fontFamily: fontSans, fontWeight: 600, marginBottom: "8px", textTransform: "uppercase", letterSpacing: ".03em" }}>
                  Ubicaciones
                </div>
                <div style={{ fontSize: "28px", fontWeight: 700, color: C.wine, fontFamily: fontMono }}>
                  {ubicaciones.length - 1}
                </div>
              </div>
            </div>

            {/* Buscador y Filtros */}
            <div style={{ background: C.white, border: `1px solid ${C.gray200}`, padding: "24px", marginBottom: "32px", borderRadius: "2px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: "16px", alignItems: "flex-end" }}>
                {/* Búsqueda */}
                <div>
                  <label style={{ display: "block", fontFamily: fontSans, fontSize: "12px", fontWeight: 700, marginBottom: "8px", color: C.gray700, textTransform: "uppercase", letterSpacing: ".03em" }}>
                    Buscar por Descripción
                  </label>
                  <div style={{ position: "relative" }}>
                    <Search size={16} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: C.gray400 }} />
                    <input
                      type="text"
                      placeholder="Ingresa búsqueda..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "10px 12px 10px 36px",
                        border: `1px solid ${C.gray200}`,
                        borderRadius: "2px",
                        fontFamily: fontSans,
                        fontSize: "13px",
                        outline: "none",
                        background: C.white,
                        color: C.gray800,
                      }}
                      onFocus={(e) => e.target.style.borderColor = C.teal}
                      onBlur={(e) => e.target.style.borderColor = C.gray200}
                    />
                  </div>
                </div>

                {/* Filtro por Ubicación */}
                <div>
                  <label style={{ display: "block", fontFamily: fontSans, fontSize: "12px", fontWeight: 700, marginBottom: "8px", color: C.gray700, textTransform: "uppercase", letterSpacing: ".03em" }}>
                    Ubicación
                  </label>
                  <select
                    value={filtroUbicacion}
                    onChange={(e) => setFiltroUbicacion(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "10px",
                      border: `1px solid ${C.gray200}`,
                      borderRadius: "2px",
                      fontFamily: fontSans,
                      fontSize: "13px",
                      background: C.white,
                      color: C.gray800,
                      outline: "none",
                      cursor: "pointer",
                    }}
                  >
                    {ubicaciones.map(ub => (
                      <option key={ub} value={ub}>
                        {ub === "todas" ? "Todas las ubicaciones" : ub}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Botón Limpiar */}
                <div style={{ textAlign: "right" }}>
                  <GovBtn
                    variant="secondary"
                    onClick={() => {
                      setSearchTerm("");
                      setFiltroUbicacion("todas");
                    }}
                  >
                    Limpiar
                  </GovBtn>
                </div>
              </div>

              {/* Resultados */}
              <div style={{ marginTop: "16px", fontSize: "13px", color: C.gray600, fontFamily: fontSans }}>
                Se encontraron <strong>{imagenesFiltradas.length}</strong> de <strong>{imagenes.length}</strong> imágenes
              </div>
            </div>

            {/* Galería */}
            {loading ? (
              <div style={{ textAlign: "center", padding: "60px 20px" }}>
                <div style={{ marginBottom: "16px" }}>
                  <div style={{ width: "40px", height: "40px", border: `3px solid ${C.gray200}`, borderTop: `3px solid ${C.teal}`, borderRadius: "50%", margin: "0 auto", animation: "spin 1s linear infinite" }} />
                </div>
                <p style={{ fontFamily: fontSans, color: C.gray600 }}>Cargando imágenes...</p>
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
              </div>
            ) : error ? (
              <InfoBox type="danger">{error}</InfoBox>
            ) : imagenesFiltradas.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px 20px", background: C.white, border: `1px solid ${C.gray200}`, borderRadius: "2px" }}>
                <Image size={48} style={{ margin: "0 auto 16px", color: C.gray300 }} />
                <p style={{ fontFamily: fontSans, fontSize: "16px", color: C.gray600, marginBottom: "8px" }}>No se encontraron imágenes</p>
                <p style={{ fontFamily: fontSans, fontSize: "13px", color: C.gray500 }}>Intenta ajustar tus criterios de búsqueda o filtros</p>
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px" }}>
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
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "32px" }}>
              <div style={{ background: C.white, border: `1px solid ${C.gray200}`, borderTop: `3px solid ${C.teal}`, padding: "20px", borderRadius: "2px" }}>
                <div style={{ fontSize: "13px", color: C.gray600, fontFamily: fontSans, fontWeight: 600, marginBottom: "8px", textTransform: "uppercase", letterSpacing: ".03em" }}>
                  Total de Imágenes
                </div>
                <div style={{ fontSize: "28px", fontWeight: 700, color: C.teal, fontFamily: fontMono }}>
                  {estadisticas.total}
                </div>
              </div>
              <div style={{ background: C.white, border: `1px solid ${C.gray200}`, borderTop: `3px solid ${C.wine}`, padding: "20px", borderRadius: "2px" }}>
                <div style={{ fontSize: "13px", color: C.gray600, fontFamily: fontSans, fontWeight: 600, marginBottom: "8px", textTransform: "uppercase", letterSpacing: ".03em" }}>
                  Ubicaciones
                </div>
                <div style={{ fontSize: "28px", fontWeight: 700, color: C.wine, fontFamily: fontMono }}>
                  {ubicaciones.length - 1}
                </div>
              </div>
            </div>

            {/* Buscador y Filtros */}
            <div style={{ background: C.white, border: `1px solid ${C.gray200}`, padding: "24px", marginBottom: "32px", borderRadius: "2px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: "16px", alignItems: "flex-end" }}>
                <div>
                  <label style={{ display: "block", fontFamily: fontSans, fontSize: "12px", fontWeight: 700, marginBottom: "8px", color: C.gray700, textTransform: "uppercase", letterSpacing: ".03em" }}>
                    Buscar por Descripción
                  </label>
                  <div style={{ position: "relative" }}>
                    <Search size={16} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: C.gray400 }} />
                    <input
                      type="text"
                      placeholder="Ingresa búsqueda..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "10px 12px 10px 36px",
                        border: `1px solid ${C.gray200}`,
                        borderRadius: "2px",
                        fontFamily: fontSans,
                        fontSize: "13px",
                        outline: "none",
                        background: C.white,
                        color: C.gray800,
                      }}
                      onFocus={(e) => e.target.style.borderColor = C.teal}
                      onBlur={(e) => e.target.style.borderColor = C.gray200}
                    />
                  </div>
                </div>
                <div>
                  <label style={{ display: "block", fontFamily: fontSans, fontSize: "12px", fontWeight: 700, marginBottom: "8px", color: C.gray700, textTransform: "uppercase", letterSpacing: ".03em" }}>
                    Lugar
                  </label>
                  <select
                    value={filtroUbicacion}
                    onChange={(e) => setFiltroUbicacion(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "10px",
                      border: `1px solid ${C.gray200}`,
                      borderRadius: "2px",
                      fontFamily: fontSans,
                      fontSize: "13px",
                      background: C.white,
                      color: C.gray800,
                      outline: "none",
                      cursor: "pointer",
                    }}
                  >
                    {ubicaciones.map(ub => (
                      <option key={ub} value={ub}>
                        {ub === "todas" ? "Todos los lugares" : ub}
                      </option>
                    ))}
                  </select>
                </div>
                <div style={{ textAlign: "right" }}>
                  <GovBtn
                    variant="secondary"
                    onClick={() => {
                      setSearchTerm("");
                      setFiltroUbicacion("todas");
                    }}
                  >
                    Limpiar
                  </GovBtn>
                </div>
              </div>
              <div style={{ marginTop: "16px", fontSize: "13px", color: C.gray600, fontFamily: fontSans }}>
                Se encontraron <strong>{imagenesFiltradas.length}</strong> de <strong>{imagenes.length}</strong> imágenes subidas
              </div>
            </div>

            {/* Galería */}
            {loading ? (
              <div style={{ textAlign: "center", padding: "60px 20px" }}>
                <div style={{ marginBottom: "16px" }}>
                  <div style={{ width: "40px", height: "40px", border: `3px solid ${C.gray200}`, borderTop: `3px solid ${C.teal}`, borderRadius: "50%", margin: "0 auto", animation: "spin 1s linear infinite" }} />
                </div>
                <p style={{ fontFamily: fontSans, color: C.gray600 }}>Cargando imágenes subidas...</p>
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
              </div>
            ) : error ? (
              <InfoBox type="danger">{error}</InfoBox>
            ) : imagenesFiltradas.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px 20px", background: C.white, border: `1px solid ${C.gray200}`, borderRadius: "2px" }}>
                <Image size={48} style={{ margin: "0 auto 16px", color: C.gray300 }} />
                <p style={{ fontFamily: fontSans, fontSize: "16px", color: C.gray600, marginBottom: "8px" }}>No se encontraron imágenes</p>
                <p style={{ fontFamily: fontSans, fontSize: "13px", color: C.gray500 }}>Intenta ajustar tus criterios de búsqueda o filtros</p>
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px" }}>
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
      style={{
        background: C.white,
        border: `1px solid ${hover ? C.teal + "55" : C.gray200}`,
        borderTop: `3px solid ${hover ? C.teal : C.gray200}`,
        boxShadow: hover ? "0 4px 20px rgba(0,132,127,.1)" : "0 1px 4px rgba(0,0,0,.06)",
        transition: "all .25s",
        cursor: "pointer",
        borderRadius: "2px",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Imagen */}
      <div style={{
        width: "100%",
        height: "220px",
        background: `url('${obtenerURLImagen(imagen.url_imagen)}')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        position: "relative",
        borderBottom: `1px solid ${C.gray200}`,
      }}>
        <div style={{
          position: "absolute",
          top: "8px",
          right: "8px",
          background: C.wine,
          color: C.white,
          padding: "4px 8px",
          fontSize: "10px",
          fontFamily: fontSans,
          fontWeight: 700,
          borderRadius: "2px",
          textTransform: "uppercase",
        }}>
          {tipo === "dron" ? "📷 Dron" : "📤 Subida"}
        </div>
        {hover && (
          <div style={{
            position: "absolute",
            inset: 0,
            background: "rgba(0,0,0,.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "12px",
          }}>
            <div style={{ background: C.teal, color: C.white, width: "40px", height: "40px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
              <Maximize2 size={18} />
            </div>
          </div>
        )}
      </div>

      {/* Contenido */}
      <div style={{ padding: "16px", flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Nombre/URL */}
        <h3 style={{ fontFamily: font, fontSize: "14px", fontWeight: 700, color: C.gray900, marginBottom: "8px", lineHeight: 1.3, textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>
          {tipo === "dron" ? "Imagen de Dron" : "Imagen Subida"}
        </h3>

        {/* Descripción */}
        {imagen.descripcion && (
          <p style={{ fontSize: "12px", color: C.gray600, fontFamily: fontSans, marginBottom: "8px", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
            {imagen.descripcion}
          </p>
        )}

        {/* Ubicación */}
        {imagen.lugar && (
          <div style={{ display: "flex", gap: "6px", alignItems: "flex-start", marginBottom: "8px", fontSize: "11px", color: C.gray600, fontFamily: fontSans }}>
            <MapPin size={12} style={{ marginTop: "2px", flexShrink: 0 }} />
            <span>{imagen.lugar}</span>
          </div>
        )}

        {/* Fecha */}
        <div style={{ fontSize: "10px", color: C.gray500, fontFamily: fontMono, marginBottom: "12px", borderTop: `1px solid ${C.gray200}`, paddingTop: "8px" }}>
          {formatearFecha(imagen.fecha_tomada)}
        </div>

        {/* Botón Ver */}
        <button
          onClick={(e) => {
            e.stopPropagation();
          }}
          style={{
            width: "100%",
            background: hover ? C.teal : C.gray100,
            color: hover ? C.white : C.teal,
            border: `1px solid ${C.teal}`,
            padding: "8px",
            fontSize: "11px",
            fontFamily: fontSans,
            fontWeight: 700,
            textTransform: "uppercase",
            cursor: "pointer",
            transition: "all .2s",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "6px",
            letterSpacing: ".03em",
          }}
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
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0,0,0,.7)",
          zIndex: 1000,
          animation: "fadeIn .2s ease",
        }}
      />

      {/* Modal */}
      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          background: C.white,
          maxWidth: "850px",
          maxHeight: "90vh",
          overflowY: "auto",
          zIndex: 1001,
          borderRadius: "2px",
          boxShadow: "0 25px 50px rgba(0,0,0,.3)",
          animation: "slideUp .3s ease",
        }}
      >
        <style>{`
          @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
          @keyframes slideUp { from { opacity: 0; transform: translate(-50%, calc(-50% + 20px)); } to { opacity: 1; transform: translate(-50%, -50%); } }
        `}</style>

        {/* Header */}
        <div style={{ background: C.wine, color: C.white, padding: "20px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ fontFamily: font, fontSize: "20px", fontWeight: 700 }}>
            Imagen de Dron
          </h2>
          <button
            onClick={onClose}
            style={{
              background: "rgba(255,255,255,.2)",
              border: "none",
              color: C.white,
              fontSize: "24px",
              cursor: "pointer",
              width: "32px",
              height: "32px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ×
          </button>
        </div>

        {/* Contenido */}
        <div style={{ padding: "24px" }}>
          {/* Imagen Principal */}
          <div style={{
            width: "100%",
            height: "500px",
            background: `url('${obtenerURLImagen(imagen.url_imagen)}')`,
            backgroundSize: "contain",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            borderRadius: "2px",
            border: `1px solid ${C.gray200}`,
            marginBottom: "24px",
          }} />

          {/* Información */}
          <div style={{ borderTop: `1px solid ${C.gray200}`, paddingTop: "20px" }}>
            <h4 style={{ fontFamily: fontSans, fontSize: "13px", fontWeight: 700, color: C.gray700, textTransform: "uppercase", marginBottom: "16px", letterSpacing: ".03em" }}>
              Detalles
            </h4>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "20px" }}>
              <div>
                <div style={{ fontSize: "11px", color: C.gray600, fontFamily: fontSans, fontWeight: 700, textTransform: "uppercase", marginBottom: "4px" }}>Tipo</div>
                <Tag color={C.wine}>Imagen de Dron</Tag>
              </div>
              {imagen.lugar && (
                <div>
                  <div style={{ fontSize: "11px", color: C.gray600, fontFamily: fontSans, fontWeight: 700, textTransform: "uppercase", marginBottom: "4px" }}>Lugar</div>
                  <div style={{ fontSize: "13px", color: C.gray800, fontFamily: fontSans }}>
                    {imagen.lugar}
                  </div>
                </div>
              )}
              <div>
                <div style={{ fontSize: "11px", color: C.gray600, fontFamily: fontSans, fontWeight: 700, textTransform: "uppercase", marginBottom: "4px" }}>Fecha de Captura</div>
                <div style={{ fontSize: "13px", color: C.gray800, fontFamily: fontSans }}>
                  {imagen.fecha_tomada ? formatearFecha(imagen.fecha_tomada) : "No especificada"}
                </div>
              </div>
              {tipo === "dron" && imagen.usuario && (
                <div>
                  <div style={{ fontSize: "11px", color: C.gray600, fontFamily: fontSans, fontWeight: 700, textTransform: "uppercase", marginBottom: "4px" }}>Capturada por</div>
                  <div style={{ fontSize: "13px", color: C.gray800, fontFamily: fontSans }}>
                    {imagen.usuario}
                  </div>
                </div>
              )}
              {tipo === "subida" && imagen.organizacion && (
                <div>
                  <div style={{ fontSize: "11px", color: C.gray600, fontFamily: fontSans, fontWeight: 700, textTransform: "uppercase", marginBottom: "4px" }}>Organización</div>
                  <div style={{ fontSize: "13px", color: C.gray800, fontFamily: fontSans }}>
                    {imagen.organizacion}
                  </div>
                </div>
              )}
            </div>

            {/* Descripción */}
            {imagen.descripcion && (
              <div style={{ marginBottom: "20px" }}>
                <div style={{ fontSize: "11px", color: C.gray600, fontFamily: fontSans, fontWeight: 700, textTransform: "uppercase", marginBottom: "8px" }}>Descripción</div>
                <div style={{ background: C.gray50, padding: "12px", borderRadius: "2px", fontSize: "13px", color: C.gray800, fontFamily: fontSans, whiteSpace: "pre-wrap", lineHeight: 1.6, borderLeft: `3px solid ${C.teal}` }}>
                  {imagen.descripcion}
                </div>
              </div>
            )}

            {/* Descarga */}
            <div style={{ borderTop: `1px solid ${C.gray200}`, paddingTop: "16px" }}>
              <a
                href={obtenerURLImagen(imagen.url_imagen)}
                download
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  background: C.teal,
                  color: C.white,
                  padding: "10px 16px",
                  border: "none",
                  borderRadius: "2px",
                  fontFamily: fontSans,
                  fontSize: "12px",
                  fontWeight: 700,
                  cursor: "pointer",
                  textDecoration: "none",
                  textTransform: "uppercase",
                  letterSpacing: ".03em",
                }}
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
