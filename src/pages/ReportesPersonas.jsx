import { useState, useEffect } from "react";
import { C, font, fontSans, fontMono } from "../shared/theme";
import { GovBtn, SectionHeader, GovCard, Tag, InfoBox } from "../shared/components";
import { supabase } from "../supabaseClient";
import { Heart, MapPin, Users, Calendar, Search, Filter, ChevronRight } from "lucide-react";

const ReportesPersonas = ({ setPage }) => {
  const [reportes, setReportes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedReporte, setSelectedReporte] = useState(null);
  const [filtroSexo, setFiltroSexo] = useState("todos");
  const [ordenamiento, setOrdenamiento] = useState("reciente");

  // Cargar reportes desde Supabase
  useEffect(() => {
    const cargarReportes = async () => {
      try {
        setLoading(true);
        const { data, error: err } = await supabase
          .from("reporte_persona_desaparecida")
          .select("*")
          .order("fecha_registro", { ascending: false });

        if (err) throw err;
        setReportes(data || []);
        setError(null);
      } catch (err) {
        console.error("Error cargando reportes:", err);
        setError("Error al cargar los reportes. Por favor intenta más tarde.");
      } finally {
        setLoading(false);
      }
    };

    cargarReportes();
  }, []);

  // Filtrar y buscar reportes
  const reportesFiltrados = reportes
    .filter(r => {
      const matchSearch = r.nombre_completo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         r.lugar_nacimiento.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         r.lugar_hechos.toLowerCase().includes(searchTerm.toLowerCase());
      const matchSexo = filtroSexo === "todos" || r.sexo === filtroSexo;
      return matchSearch && matchSexo;
    })
    .sort((a, b) => {
      if (ordenamiento === "reciente") return new Date(b.fecha_registro) - new Date(a.fecha_registro);
      if (ordenamiento === "antiguo") return new Date(a.fecha_registro) - new Date(b.fecha_registro);
      if (ordenamiento === "nombre") return a.nombre_completo.localeCompare(b.nombre_completo);
      return 0;
    });

  const estadisticas = {
    total: reportes.length,
    hombres: reportes.filter(r => r.sexo === "HOMBRE").length,
    mujeres: reportes.filter(r => r.sexo === "MUJER").length,
    promedio_edad: reportes.length > 0 
      ? Math.round(reportes.reduce((sum, r) => sum + r.edad_actual, 0) / reportes.length)
      : 0,
  };

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString("es-MX", { 
      year: "numeric", 
      month: "long", 
      day: "numeric" 
    });
  };

  const calcularDiasDesaparecido = (fechaHechos) => {
    const hoy = new Date();
    const fecha = new Date(fechaHechos);
    const dias = Math.floor((hoy - fecha) / (1000 * 60 * 60 * 24));
    const meses = Math.floor(dias / 30);
    const años = Math.floor(dias / 365);

    if (años > 0) return `${años} año${años > 1 ? "s" : ""} ${meses % 12} mes${meses % 12 !== 1 ? "es" : ""}`;
    if (meses > 0) return `${meses} mes${meses > 1 ? "es" : ""} ${dias % 30} día${dias % 30 !== 1 ? "s" : ""}`;
    return `${dias} día${dias !== 1 ? "s" : ""}`;
  };

  const tieneImagen = (foto) => {
    return foto && foto !== "SIN FOTO" && foto !== "PENDIENTE";
  };

  return (
    <div style={{ minHeight: "100vh", background: C.gray50, paddingBottom: "40px" }}>
      {/* Breadcrumb */}
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "16px 24px", display: "flex", gap: "6px", fontFamily: fontSans, fontSize: "12px", color: C.gray600 }}>
        <button onClick={() => setPage("home")} style={{ background: "none", border: "none", color: C.teal, cursor: "pointer", fontFamily: fontSans, fontSize: "12px" }}>Inicio</button>
        <span>›</span>
        <span>Reportes de Personas Desaparecidas</span>
      </div>

      {/* Header */}
      <div style={{ background: C.wine, padding: "28px 24px", marginBottom: "32px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ fontFamily: fontSans, fontSize: "11px", fontWeight: 700, color: C.gold, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: "2px" }}>
            BANCO NACIONAL DE DATOS
          </div>
          <h1 style={{ fontFamily: font, fontSize: "32px", fontWeight: 700, color: C.white, marginBottom: "8px" }}>
            Reportes de Personas Desaparecidas
          </h1>
          <p style={{ fontFamily: fontSans, fontSize: "14px", color: "rgba(255,255,255,.85)", maxWidth: "500px", lineHeight: 1.5 }}>
            Base de datos nacional de personas desaparecidas. Utiliza las herramientas de búsqueda y filtrado para encontrar información.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}>
        {/* Estadísticas rápidas */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px", marginBottom: "32px" }}>
          {[
            { label: "Total de Reportes", valor: estadisticas.total, icon: Users, color: C.teal },
            { label: "Hombres", valor: estadisticas.hombres, icon: "♂", color: C.tealL },
            { label: "Mujeres", valor: estadisticas.mujeres, icon: "♀", color: C.wine },
            { label: "Edad Promedio", valor: `${estadisticas.promedio_edad} años`, icon: Calendar, color: C.gold },
          ].map((stat, i) => (
            <div key={i} style={{ background: C.white, border: `1px solid ${C.gray200}`, borderTop: `3px solid ${stat.color}`, padding: "20px", borderRadius: "2px" }}>
              <div style={{ fontSize: "13px", color: C.gray600, fontFamily: fontSans, fontWeight: 600, marginBottom: "8px", textTransform: "uppercase", letterSpacing: ".03em" }}>
                {stat.label}
              </div>
              <div style={{ fontSize: "28px", fontWeight: 700, color: stat.color, fontFamily: fontMono }}>
                {stat.valor}
              </div>
            </div>
          ))}
        </div>

        {/* Buscador y Filtros */}
        <div style={{ background: C.white, border: `1px solid ${C.gray200}`, padding: "24px", marginBottom: "32px", borderRadius: "2px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: "16px", alignItems: "flex-end" }}>
            {/* Búsqueda */}
            <div>
              <label style={{ display: "block", fontFamily: fontSans, fontSize: "12px", fontWeight: 700, marginBottom: "8px", color: C.gray700, textTransform: "uppercase", letterSpacing: ".03em" }}>
                Buscar por Nombre o Lugar
              </label>
              <div style={{ position: "relative" }}>
                <Search size={16} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: C.gray400 }} />
                <input
                  type="text"
                  placeholder="Ingresa nombre, lugar..."
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

            {/* Filtro por Sexo */}
            <div>
              <label style={{ display: "block", fontFamily: fontSans, fontSize: "12px", fontWeight: 700, marginBottom: "8px", color: C.gray700, textTransform: "uppercase", letterSpacing: ".03em" }}>
                Sexo
              </label>
              <select
                value={filtroSexo}
                onChange={(e) => setFiltroSexo(e.target.value)}
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
                <option value="todos">Todos</option>
                <option value="HOMBRE">Hombre</option>
                <option value="MUJER">Mujer</option>
                <option value="OTRO">Otro</option>
              </select>
            </div>

            {/* Ordenamiento */}
            <div>
              <label style={{ display: "block", fontFamily: fontSans, fontSize: "12px", fontWeight: 700, marginBottom: "8px", color: C.gray700, textTransform: "uppercase", letterSpacing: ".03em" }}>
                Ordenar por
              </label>
              <select
                value={ordenamiento}
                onChange={(e) => setOrdenamiento(e.target.value)}
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
                <option value="reciente">Más Reciente</option>
                <option value="antiguo">Más Antiguo</option>
                <option value="nombre">Por Nombre</option>
              </select>
            </div>

            {/* Botón Limpiar */}
            <div style={{ textAlign: "right" }}>
              <GovBtn
                variant="secondary"
                onClick={() => {
                  setSearchTerm("");
                  setFiltroSexo("todos");
                  setOrdenamiento("reciente");
                }}
              >
                Limpiar Filtros
              </GovBtn>
            </div>
          </div>

          {/* Resultados */}
          <div style={{ marginTop: "16px", fontSize: "13px", color: C.gray600, fontFamily: fontSans }}>
            Se encontraron <strong>{reportesFiltrados.length}</strong> de <strong>{reportes.length}</strong> reportes
          </div>
        </div>

        {/* Listado de Reportes */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "60px 20px" }}>
            <div style={{ marginBottom: "16px" }}>
              <div style={{ width: "40px", height: "40px", border: `3px solid ${C.gray200}`, borderTop: `3px solid ${C.teal}`, borderRadius: "50%", margin: "0 auto", animation: "spin 1s linear infinite" }} />
            </div>
            <p style={{ fontFamily: fontSans, color: C.gray600 }}>Cargando reportes...</p>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        ) : error ? (
          <InfoBox type="danger">{error}</InfoBox>
        ) : reportesFiltrados.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 20px", background: C.white, border: `1px solid ${C.gray200}`, borderRadius: "2px" }}>
            <Search size={48} style={{ margin: "0 auto 16px", color: C.gray300 }} />
            <p style={{ fontFamily: fontSans, fontSize: "16px", color: C.gray600, marginBottom: "8px" }}>No se encontraron reportes</p>
            <p style={{ fontFamily: fontSans, fontSize: "13px", color: C.gray500 }}>Intenta ajustar tus criterios de búsqueda o filtros</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "20px" }}>
            {reportesFiltrados.map((reporte) => (
              <ReporteCard
                key={reporte.id}
                reporte={reporte}
                onSelect={() => setSelectedReporte(reporte)}
                calcularDiasDesaparecido={calcularDiasDesaparecido}
                tieneImagen={tieneImagen}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modal de Detalle */}
      {selectedReporte && (
        <DetalleReporteModal
          reporte={selectedReporte}
          onClose={() => setSelectedReporte(null)}
          formatearFecha={formatearFecha}
          calcularDiasDesaparecido={calcularDiasDesaparecido}
          tieneImagen={tieneImagen}
        />
      )}
    </div>
  );
};

// Componente Tarjeta de Reporte
const ReporteCard = ({ reporte, onSelect, calcularDiasDesaparecido, tieneImagen }) => {
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
        height: "180px",
        background: tieneImagen(reporte.foto) ? `url('${reporte.foto}')` : C.gray100,
        backgroundSize: "cover",
        backgroundPosition: "center",
        position: "relative",
        borderBottom: `1px solid ${C.gray200}`,
      }}>
        {!tieneImagen(reporte.foto) && (
          <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: C.gray400 }}>
            <Heart size={40} />
          </div>
        )}
        <div style={{
          position: "absolute",
          top: "8px",
          right: "8px",
          background: reporte.sexo === "MUJER" ? C.wine : C.teal,
          color: C.white,
          padding: "4px 8px",
          fontSize: "10px",
          fontFamily: fontSans,
          fontWeight: 700,
          borderRadius: "2px",
          textTransform: "uppercase",
        }}>
          {reporte.sexo === "MUJER" ? "👩 Mujer" : "👨 Hombre"}
        </div>
      </div>

      {/* Contenido */}
      <div style={{ padding: "16px", flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Nombre */}
        <h3 style={{ fontFamily: font, fontSize: "15px", fontWeight: 700, color: C.gray900, marginBottom: "8px", lineHeight: 1.3 }}>
          {reporte.nombre_completo}
        </h3>

        {/* Información de edad */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "12px", fontSize: "12px" }}>
          <div style={{ background: C.tealBg, color: C.teal, padding: "3px 8px", borderRadius: "2px", fontFamily: fontMono, fontWeight: 600 }}>
            {reporte.edad_actual} años
          </div>
          <div style={{ background: "rgba(237,100,166,.1)", color: "#d42f62", padding: "3px 8px", borderRadius: "2px", fontFamily: fontSans, fontWeight: 600, fontSize: "11px" }}>
            {calcularDiasDesaparecido(reporte.fecha_hechos)}
          </div>
        </div>

        {/* Lugar */}
        <div style={{ display: "flex", gap: "8px", alignItems: "flex-start", marginBottom: "12px", fontSize: "12px", color: C.gray600, fontFamily: fontSans }}>
          <MapPin size={14} style={{ marginTop: "2px", flexShrink: 0, color: C.wine }} />
          <span>{reporte.lugar_hechos}</span>
        </div>

        {/* Fecha */}
        <div style={{ fontSize: "11px", color: C.gray500, fontFamily: fontMono, marginBottom: "12px", borderTop: `1px solid ${C.gray200}`, paddingTop: "8px" }}>
          Reportado: {new Date(reporte.fecha_registro).toLocaleDateString("es-MX")}
        </div>

        {/* Botón Ver Más */}
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
          Ver Detalles
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
};

// Componente Modal de Detalle
const DetalleReporteModal = ({ reporte, onClose, formatearFecha, calcularDiasDesaparecido, tieneImagen }) => {
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
          background: "rgba(0,0,0,.5)",
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
          maxWidth: "700px",
          maxHeight: "90vh",
          overflowY: "auto",
          zIndex: 1001,
          borderRadius: "2px",
          boxShadow: "0 25px 50px rgba(0,0,0,.2)",
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
            Detalles del Reporte
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
          {/* Foto + Info Principal */}
          <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: "24px", marginBottom: "24px" }}>
            {/* Foto */}
            <div style={{
              width: "200px",
              height: "240px",
              background: tieneImagen(reporte.foto) ? `url('${reporte.foto}')` : C.gray100,
              backgroundSize: "cover",
              backgroundPosition: "center",
              border: `1px solid ${C.gray200}`,
              borderRadius: "2px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: C.gray400,
            }}>
              {!tieneImagen(reporte.foto) && <Heart size={48} />}
            </div>

            {/* Info Principal */}
            <div>
              <h3 style={{ fontFamily: font, fontSize: "22px", fontWeight: 700, color: C.gray900, marginBottom: "12px" }}>
                {reporte.nombre_completo}
              </h3>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "20px" }}>
                <div>
                  <div style={{ fontSize: "11px", color: C.gray600, fontFamily: fontSans, fontWeight: 700, textTransform: "uppercase", marginBottom: "4px" }}>Edad Actual</div>
                  <div style={{ fontSize: "18px", fontWeight: 700, color: C.teal, fontFamily: fontMono }}>{reporte.edad_actual} años</div>
                </div>
                <div>
                  <div style={{ fontSize: "11px", color: C.gray600, fontFamily: fontSans, fontWeight: 700, textTransform: "uppercase", marginBottom: "4px" }}>Edad al Desaparecer</div>
                  <div style={{ fontSize: "18px", fontWeight: 700, color: C.wine, fontFamily: fontMono }}>{reporte.edad_desaparicion} años</div>
                </div>
                <div>
                  <div style={{ fontSize: "11px", color: C.gray600, fontFamily: fontSans, fontWeight: 700, textTransform: "uppercase", marginBottom: "4px" }}>Sexo</div>
                  <Tag color={reporte.sexo === "MUJER" ? C.wine : C.teal}>{reporte.sexo}</Tag>
                </div>
                <div>
                  <div style={{ fontSize: "11px", color: C.gray600, fontFamily: fontSans, fontWeight: 700, textTransform: "uppercase", marginBottom: "4px" }}>Tiempo Desaparecido</div>
                  <Tag color={C.wine}>{calcularDiasDesaparecido(reporte.fecha_hechos)}</Tag>
                </div>
              </div>

              {/* Lugar de Hechos */}
              <div style={{ background: C.gray50, padding: "12px", borderRadius: "2px", borderLeft: `3px solid ${C.wine}` }}>
                <div style={{ fontSize: "11px", color: C.gray600, fontFamily: fontSans, fontWeight: 700, textTransform: "uppercase", marginBottom: "4px" }}>Lugar de Hechos</div>
                <div style={{ fontSize: "14px", fontFamily: fontSans, color: C.gray900, fontWeight: 500 }}>{reporte.lugar_hechos}</div>
              </div>
            </div>
          </div>

          {/* Información Detallada */}
          <div style={{ borderTop: `1px solid ${C.gray200}`, paddingTop: "20px" }}>
            <h4 style={{ fontFamily: fontSans, fontSize: "13px", fontWeight: 700, color: C.gray700, textTransform: "uppercase", marginBottom: "16px", letterSpacing: ".03em" }}>
              Información Detallada
            </h4>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "20px" }}>
              <InfoItem label="Lugar de Nacimiento" valor={reporte.lugar_nacimiento} />
              <InfoItem label="Nacionalidad" valor={reporte.nacionalidad} />
              <InfoItem label="Fecha de Desaparición" valor={formatearFecha(reporte.fecha_hechos)} />
              <InfoItem label="Fecha de Reporte" valor={formatearFecha(reporte.fecha_percato)} />
              <InfoItem label="Habla Español" valor={reporte.habla_espanol ? "Sí" : "No"} />
              {reporte.lengua_indigena && <InfoItem label="Lengua Indígena" valor={reporte.lengua_indigena} />}
              {reporte.discapacidad && <InfoItem label="Discapacidad" valor={reporte.discapacidad} />}
            </div>

            {/* Características Físicas */}
            {reporte.caracteristicas_fisicas && (
              <DetailSection title="Características Físicas">
                {reporte.caracteristicas_fisicas}
              </DetailSection>
            )}

            {/* Señas Particulares */}
            {reporte.senas_particulares && (
              <DetailSection title="Señas Particulares">
                {reporte.senas_particulares}
              </DetailSection>
            )}

            {/* Prendas de Vestir */}
            {reporte.prendas_vestir && (
              <DetailSection title="Prendas de Vestir">
                {reporte.prendas_vestir}
              </DetailSection>
            )}

            {/* Información de Registro */}
            <div style={{ background: C.gray50, padding: "12px", borderRadius: "2px", marginTop: "16px" }}>
              <div style={{ fontSize: "11px", color: C.gray600, fontFamily: fontMono }}>
                ID de Reporte: <strong>{reporte.id}</strong>
              </div>
              <div style={{ fontSize: "11px", color: C.gray600, fontFamily: fontMono }}>
                Registrado: {formatearFecha(reporte.fecha_registro)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// Componentes auxiliares
const InfoItem = ({ label, valor }) => (
  <div>
    <div style={{ fontSize: "11px", color: C.gray600, fontFamily: fontSans, fontWeight: 700, textTransform: "uppercase", marginBottom: "4px", letterSpacing: ".03em" }}>
      {label}
    </div>
    <div style={{ fontSize: "13px", color: C.gray800, fontFamily: fontSans }}>
      {valor || "Sin información"}
    </div>
  </div>
);

const DetailSection = ({ title, children }) => (
  <div style={{ marginBottom: "16px" }}>
    <h5 style={{ fontFamily: fontSans, fontSize: "12px", fontWeight: 700, color: C.teal, textTransform: "uppercase", marginBottom: "8px", letterSpacing: ".03em" }}>
      {title}
    </h5>
    <div style={{
      background: C.gray50,
      padding: "12px",
      borderRadius: "2px",
      fontSize: "13px",
      color: C.gray800,
      fontFamily: fontSans,
      whiteSpace: "pre-wrap",
      lineHeight: 1.6,
      borderLeft: `3px solid ${C.teal}`,
    }}>
      {children}
    </div>
  </div>
);

export default ReportesPersonas;
