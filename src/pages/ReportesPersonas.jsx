import { useState, useEffect } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, PieChart, Pie, Cell, Legend,
} from "recharts";
import { C, font, fontSans, fontMono } from "../shared/theme";
import { GovBtn, SectionHeader, GovCard, Tag, InfoBox } from "../shared/components";
import { supabase } from "../supabaseClient";
import { Heart, MapPin, Users, Calendar, Search, Filter, ChevronRight, LayoutGrid, List } from "lucide-react";
import "../styles/pages/ReportesPersonas.css";

const ReportesPersonas = ({ setPage }) => {
  const [reportes, setReportes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedReporte, setSelectedReporte] = useState(null);
  const [filtroSexo, setFiltroSexo] = useState("todos");
  const [filtroEdadDesaparicion, setFiltroEdadDesaparicion] = useState("");
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");
  const [ordenamiento, setOrdenamiento] = useState("reciente");
  const [activeTab, setActiveTab] = useState("reportes");
  const [vista, setVista] = useState("tarjetas");

  const convertirFecha = (valor) => {
    const coincidencia = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(valor);
    if (!coincidencia) return "";

    const [, dia, mes, año] = coincidencia;
    const fecha = new Date(Date.UTC(Number(año), Number(mes) - 1, Number(dia)));
    if (
      fecha.getUTCFullYear() !== Number(año) ||
      fecha.getUTCMonth() !== Number(mes) - 1 ||
      fecha.getUTCDate() !== Number(dia)
    ) return "";

    return `${año}-${mes}-${dia}`;
  };

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
      const matchEdad = filtroEdadDesaparicion === "" || Number(r.edad_desaparicion) === Number(filtroEdadDesaparicion);
      const fechaRegistro = r.fecha_registro?.slice(0, 10) || "";
      const fechaDesdeISO = convertirFecha(fechaDesde);
      const fechaHastaISO = convertirFecha(fechaHasta);
      const matchFechaDesde = fechaDesde === "" || (fechaDesdeISO !== "" && fechaRegistro >= fechaDesdeISO);
      const matchFechaHasta = fechaHasta === "" || (fechaHastaISO !== "" && fechaRegistro <= fechaHastaISO);
      return matchSearch && matchSexo && matchEdad && matchFechaDesde && matchFechaHasta;
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
    <div className="reports-page">
      {/* Breadcrumb */}
      <div className="reports-breadcrumb">
        <button onClick={() => setPage("home")} className="reports-breadcrumb-link">Inicio</button>
        <span>›</span>
        <span>Reportes de Personas Desaparecidas</span>
      </div>

      {/* Header */}
      <div className="reports-hero">
        <div className="reports-container">
          <div className="reports-eyebrow">
            BANCO NACIONAL DE DATOS
          </div>
          <h1 className="reports-title">
            Reportes de Personas Desaparecidas
          </h1>
          <p className="reports-intro">
            Base de datos nacional de personas desaparecidas. Utiliza las herramientas de búsqueda y filtrado para encontrar información.
          </p>
        </div>
      </div>

      <div className="reports-container reports-content">
        {/* Pestañas de contenido */}
        <div className="reports-tabs">
          {[
            { id: "reportes", label: "Listado de reportes" },
            { id: "estadisticas", label: "Estadísticas" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`reports-tab ${activeTab === tab.id ? "is-active" : ""}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "estadisticas" ? (
          <ReportesStatistics reportes={reportes} loading={loading} />
        ) : (
          <>
        {/* Estadísticas rápidas */}
        <div className="reports-stats">
          {[
            { label: "Total de Reportes", valor: estadisticas.total, icon: Users, color: C.teal },
            { label: "Hombres", valor: estadisticas.hombres, icon: "♂", color: C.tealL },
            { label: "Mujeres", valor: estadisticas.mujeres, icon: "♀", color: C.wine },
            { label: "Edad Promedio", valor: `${estadisticas.promedio_edad} años`, icon: Calendar, color: C.gold },
          ].map((stat, i) => (
            <div key={i} className="reports-stat" style={{ "--stat-color": stat.color }}>
              <div className="reports-stat-label">
                {stat.label}
              </div>
              <div className="reports-stat-value">
                {stat.valor}
              </div>
            </div>
          ))}
        </div>

        {/* Buscador y Filtros */}
        <div role="group" aria-label="Cambiar vista" className="reports-view-toggle">
              {[
                { id: "tarjetas", label: "Vista de tarjetas", Icon: LayoutGrid },
                { id: "lista", label: "Vista de listado", Icon: List },
              ].map(({ id, label, Icon }) => (
                <button
                  key={id}
                  type="button"
                  aria-label={label}
                  aria-pressed={vista === id}
                  onClick={() => setVista(id)}
                  className={`reports-view-button ${vista === id ? "is-active" : ""}`}
                >
                  <Icon size={16} />
                </button>
              ))}
            </div>
        <div className="reports-filters">
          <div className="reunite-reportes-filters">
            {/* Búsqueda */}
            <div>
              <label className="reports-filter-label">
                Buscar por Nombre o Lugar
              </label>
              <div className="reports-search-wrap">
                <Search size={16} className="reports-search-icon" />
                <input
                  type="text"
                  placeholder="Ingresa nombre, lugar..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="reports-field reports-search-field"
                />
              </div>
            </div>

            {/* Rango de fechas de registro */}
            <div>
              <label className="reports-filter-label">
                Fecha desde
              </label>
              <input
                type="text"
                inputMode="numeric"
                value={fechaDesde}
                onChange={(e) => setFechaDesde(e.target.value)}
                placeholder="dd/mm/aaaa"
                maxLength={10}
                className="reports-field"
              />
            </div>

            <div>
              <label className="reports-filter-label">
                Fecha hasta
              </label>
              <input
                type="text"
                inputMode="numeric"
                value={fechaHasta}
                onChange={(e) => setFechaHasta(e.target.value)}
                placeholder="dd/mm/aaaa"
                maxLength={10}
                className="reports-field"
              />
            </div>

            {/* Filtro por edad al desaparecer */}
            <div>
              <label className="reports-filter-label">
                Edad al desaparecer
              </label>
              <input
                type="number"
                min="0"
                max="120"
                placeholder="Ej. 25"
                value={filtroEdadDesaparicion}
                onChange={(e) => setFiltroEdadDesaparicion(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") e.currentTarget.blur();
                }}
                className="reports-field"
              />
            </div>

            {/* Filtro por Sexo */}
            <div>
              <label className="reports-filter-label">
                Sexo
              </label>
              <select
                value={filtroSexo}
                onChange={(e) => setFiltroSexo(e.target.value)}
                className="reports-field"
              >
                <option value="todos">Todos</option>
                <option value="HOMBRE">Hombre</option>
                <option value="MUJER">Mujer</option>
                <option value="OTRO">Otro</option>
              </select>
            </div>

            {/* Ordenamiento */}
            <div>
              <label className="reports-filter-label">
                Ordenar por
              </label>
              <select
                value={ordenamiento}
                onChange={(e) => setOrdenamiento(e.target.value)}
                className="reports-field"
              >
                <option value="reciente">Más Reciente</option>
                <option value="antiguo">Más Antiguo</option>
                <option value="nombre">Por Nombre</option>
              </select>
            </div>

            {/* Botón Limpiar */}
            <div className="reports-filter-action">
              <GovBtn
                variant="secondary"
                onClick={() => {
                  setSearchTerm("");
                  setFiltroSexo("todos");
                  setFiltroEdadDesaparicion("");
                  setFechaDesde("");
                  setFechaHasta("");
                  setOrdenamiento("reciente");
                }}
              >
                Limpiar Filtros
              </GovBtn>
            </div>
          </div>

          {/* Resultados */}
          <div className="reports-results">
            Se encontraron <strong>{reportesFiltrados.length}</strong> de <strong>{reportes.length}</strong> reportes
          </div>
        </div>

        {/* Listado de Reportes */}
        {loading ? (
          <div className="reports-status reports-loading">
            <div className="reports-loading-wrap">
              <div className="reports-spinner" />
            </div>
            <p className="reports-status-text">Cargando reportes...</p>
          </div>
        ) : error ? (
          <InfoBox type="danger">{error}</InfoBox>
        ) : reportesFiltrados.length === 0 ? (
          <div className="reports-status reports-empty">
            <Search size={48} className="reports-empty-icon" />
            <p className="reports-empty-title">No se encontraron reportes</p>
            <p className="reports-empty-text">Intenta ajustar tus criterios de búsqueda o filtros</p>
          </div>
        ) : (
          <>
          <div className="reports-list-spacer"> </div>
          <div className={`reports-grid ${vista === "lista" ? "reunite-reportes-lista" : ""}`}>
            {reportesFiltrados.map((reporte) => (
              <ReporteCard
                key={reporte.id}
                reporte={reporte}
                vista={vista}
                onSelect={() => setSelectedReporte(reporte)}
                calcularDiasDesaparecido={calcularDiasDesaparecido}
                tieneImagen={tieneImagen}
              />
            ))}
          </div>
          </>
        )}
          </>
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

const ReportesStatistics = ({ reportes, loading }) => {
  const ageGroups = [
    { label: "0–17", min: 0, max: 17 },
    { label: "18–30", min: 18, max: 30 },
    { label: "31–50", min: 31, max: 50 },
    { label: "51–70", min: 51, max: 70 },
    { label: "71+", min: 71, max: Infinity },
  ];
  const ageData = ageGroups.map(({ label, min, max }) => ({
    grupo: label,
    reportes: reportes.filter((reporte) => {
      const age = Number(reporte.edad_actual);
      return Number.isFinite(age) && age >= min && age <= max;
    }).length,
  }));
  const sexData = [
    { name: "Hombres", value: reportes.filter((reporte) => reporte.sexo === "HOMBRE").length },
    { name: "Mujeres", value: reportes.filter((reporte) => reporte.sexo === "MUJER").length },
    { name: "Otro / No especificado", value: reportes.filter((reporte) => !["HOMBRE", "MUJER"].includes(reporte.sexo)).length },
  ].filter((item) => item.value > 0);
  const places = Object.entries(reportes.reduce((counts, reporte) => {
    const place = reporte.lugar_hechos?.trim() || "No especificado";
    counts[place] = (counts[place] || 0) + 1;
    return counts;
  }, {}))
    .sort(([, first], [, second]) => second - first)
    .slice(0, 6)
    .map(([lugar, total]) => ({ lugar, reportes: total }));
  const chartColors = [C.wine, C.teal, C.gold];
  const tooltipStyle = { fontFamily: fontSans, fontSize: "12px", border: `1px solid ${C.gray200}`, borderRadius: "0" };
  const axisStyle = { fontFamily: fontSans, fontSize: 11, fill: C.gray600 };

  if (loading) {
    return <div className="reports-statistics-loading">Cargando estadísticas...</div>;
  }

  return (
    <div>
      <div className="reports-statistics-heading">
        <SectionHeader
          label="Análisis de reportes"
          title="Distribución de personas reportadas"
          sub="Consulta los reportes registrados por grupo de edad, sexo y lugar de los hechos. Los datos se actualizan junto con el listado nacional."
        />
      </div>

      <div className="reunite-page-grid reports-chart-grid">
        <div className="reports-chart-panel">
          <div className="reports-chart-eyebrow">DISTRIBUCIÓN POR EDAD</div>
          <div className="reports-chart-title">Reportes por grupo de edad</div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={ageData}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.gray100} vertical={false} />
              <XAxis dataKey="grupo" axisLine={false} tickLine={false} tick={axisStyle} />
              <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={axisStyle} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="reportes" name="Reportes" fill={C.teal} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="reports-chart-panel">
          <div className="reports-chart-eyebrow">DISTRIBUCIÓN POR SEXO</div>
          <div className="reports-chart-title reports-chart-title-tight">Personas reportadas</div>
          {sexData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={210}>
                <PieChart>
                  <Pie data={sexData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={52} outerRadius={78}>
                    {sexData.map((item, index) => <Cell key={item.name} fill={chartColors[index % chartColors.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} />
                </PieChart>
              </ResponsiveContainer>
              <div className="reports-legend">
                {sexData.map((item, index) => (
                  <div key={item.name} className="reports-legend-item">
                    <span className="reports-legend-swatch" style={{ "--legend-color": chartColors[index % chartColors.length] }} />
                    {item.name}: <strong>{item.value}</strong>
                  </div>
                ))}
              </div>
            </>
          ) : <div className="reports-chart-empty reports-chart-empty-tall">Sin datos de sexo disponibles.</div>}
        </div>
      </div>

      <div className="reports-chart-panel reports-places-panel">
        <div className="reports-chart-eyebrow">LUGARES CON MÁS REPORTES</div>
        <div className="reports-chart-title">Distribución por lugar de los hechos</div>
        {places.length > 0 ? (
          <ResponsiveContainer width="100%" height={Math.max(220, places.length * 42)}>
            <BarChart data={places} layout="vertical" margin={{ left: 12, right: 12 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.gray100} horizontal={false} />
              <XAxis type="number" allowDecimals={false} axisLine={false} tickLine={false} tick={axisStyle} />
              <YAxis type="category" dataKey="lugar" width={150} axisLine={false} tickLine={false} tick={{ ...axisStyle, fontSize: 10 }} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="reportes" name="Reportes" fill={C.wine} />
            </BarChart>
          </ResponsiveContainer>
        ) : <div className="reports-chart-empty">Sin datos de ubicación disponibles.</div>}
      </div>
    </div>
  );
};

// Componente Tarjeta de Reporte
const ReporteCard = ({ reporte, vista, onSelect, calcularDiasDesaparecido, tieneImagen }) => {
  const [hover, setHover] = useState(false);

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={onSelect}
      className={`${vista === "lista" ? "reunite-reporte-item-lista" : "reports-card"} ${hover ? "is-hovered" : ""}`}
    >
      {/* Imagen */}
      <div className={`reports-card-image ${vista === "lista" ? "is-list" : "is-card"}`}>
        {tieneImagen(reporte.foto) ? (
          <img src={reporte.foto} className="reports-card-image-element" alt="" />
        ) : (
          <div className="reports-card-placeholder">
            <Heart size={40} />
          </div>
        )}
        <div className={`reports-sex-badge ${reporte.sexo === "MUJER" ? "is-woman" : "is-man"}`}>
          {reporte.sexo === "MUJER" ? "👩 Mujer" : "👨 Hombre"}
        </div>
      </div>

      {/* Contenido */}
      <div className="reports-card-content">
        {/* Nombre */}
        <h3 className="reports-card-title">
          {reporte.nombre_completo}
        </h3>

        {/* Información de edad */}
        <div className="reports-card-tags">
          <div className="reports-age-tag">
            {reporte.edad_actual} años
          </div>
          <div className="reports-time-tag">
            {calcularDiasDesaparecido(reporte.fecha_hechos)}
          </div>
        </div>

        {/* Lugar */}
        <div className="reports-card-location">
          <MapPin size={14} className="reports-card-location-icon" />
          <span>{reporte.lugar_hechos}</span>
        </div>

        {/* Fecha */}
        <div className="reports-card-date">
          Reportado: {new Date(reporte.fecha_registro).toLocaleDateString("es-MX")}
        </div>

        {/* Botón Ver Más */}
        <button
          onClick={(e) => {
            e.stopPropagation();
          }}
          className="reports-card-button"
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
        className="reports-modal-overlay"
      />

      {/* Modal */}
      <div
        className="reports-modal"
      >
        {/* Header */}
        <div className="reports-modal-header">
          <h2 className="reports-modal-title">
            Detalles del Reporte
          </h2>
          <button
            onClick={onClose}
            className="reports-modal-close"
          >
            ×
          </button>
        </div>

        {/* Contenido */}
        <div className="reports-modal-content">
          {/* Foto + Info Principal */}
          <div className="reports-modal-summary">
            {/* Foto */}
            <div className="reports-modal-photo">
              {tieneImagen(reporte.foto) ? <img src={reporte.foto} className="reports-modal-photo-element" alt="" /> : <Heart size={48} />}
            </div>

            {/* Info Principal */}
            <div>
              <h3 className="reports-modal-name">
                {reporte.nombre_completo}
              </h3>

              <div className="reports-modal-metrics">
                <div>
                  <div className="reports-detail-label">Edad Actual</div><div className="reports-metric-teal">{reporte.edad_actual} años</div>
                </div>
                <div>
                  <div className="reports-detail-label">Edad al Desaparecer</div><div className="reports-metric-wine">{reporte.edad_desaparicion} años</div>
                </div>
                <div>
                  <div className="reports-detail-label">Sexo</div>
                  <Tag color={reporte.sexo === "MUJER" ? C.wine : C.teal}>{reporte.sexo}</Tag>
                </div>
                <div>
                  <div className="reports-detail-label">Tiempo Desaparecido</div>
                  <Tag color={C.wine}>{calcularDiasDesaparecido(reporte.fecha_hechos)}</Tag>
                </div>
              </div>

              {/* Lugar de Hechos */}
              <div className="reports-place-highlight">
                <div className="reports-detail-label">Lugar de Hechos</div>
                <div className="reports-place-value">{reporte.lugar_hechos}</div>
              </div>
            </div>
          </div>

          {/* Información Detallada */}
          <div className="reports-modal-details">
            <h4 className="reports-section-title">
              Información Detallada
            </h4>

            <div className="reports-details-grid">
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
            <div className="reports-record-meta">
              <div className="reports-record-line">
                ID de Reporte: <strong>{reporte.id}</strong>
              </div>
              <div className="reports-record-line">
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
    <div className="reports-detail-label">
      {label}
    </div>
    <div className="reports-detail-value">
      {valor || "Sin información"}
    </div>
  </div>
);

const DetailSection = ({ title, children }) => (
  <div className="reports-detail-section">
    <h5 className="reports-detail-section-title">
      {title}
    </h5>
    <div className="reports-detail-section-content">
      {children}
    </div>
  </div>
);

export default ReportesPersonas;
