import { useState, useEffect } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, PieChart, Pie, Cell, Legend,
} from "recharts";
import { C, font, fontSans, fontMono } from "../shared/theme";
import { GovBtn, SectionHeader, GovCard, Tag, InfoBox } from "../shared/components";
import { supabase } from "../supabaseClient";
import { Heart, MapPin, Users, Calendar, Search, Filter, ChevronRight, LayoutGrid, List } from "lucide-react";

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
        {/* Pestañas de contenido */}
        <div style={{ display: "flex", gap: "4px", borderBottom: `1px solid ${C.gray200}`, marginBottom: "24px" }}>
          {[
            { id: "reportes", label: "Listado de reportes" },
            { id: "estadisticas", label: "Estadísticas" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                background: activeTab === tab.id ? C.white : "transparent",
                color: activeTab === tab.id ? C.wine : C.gray600,
                border: "none",
                borderBottom: activeTab === tab.id ? `3px solid ${C.wine}` : "3px solid transparent",
                padding: "12px 18px",
                fontFamily: fontSans,
                fontSize: "12px",
                fontWeight: 700,
                letterSpacing: ".04em",
                textTransform: "uppercase",
                cursor: "pointer",
              }}
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
        <div role="group" aria-label="Cambiar vista" style={{ display: "flex", border: `1px solid ${C.gray200}`, background: C.white }}>
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
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "8px 10px",
                    border: "none",
                    borderRight: id === "tarjetas" ? `1px solid ${C.gray200}` : "none",
                    background: vista === id ? C.teal : C.white,
                    color: vista === id ? C.white : C.gray600,
                    cursor: "pointer",
                  }}
                >
                  <Icon size={16} />
                </button>
              ))}
            </div>
        <div style={{ background: C.white, border: `1px solid ${C.gray200}`, padding: "24px", marginBottom: "32px", borderRadius: "2px" }}>
          <style>{`
            @media (max-width: 900px) {
              .reunite-reportes-filters {
                grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
              }
            }
            @media (max-width: 520px) {
              .reunite-reportes-filters {
                grid-template-columns: 1fr !important;
              }
            }
          `}</style>
          <div className="reunite-reportes-filters" style={{ display: "grid", gridTemplateColumns: "2fr repeat(5, 1fr)", gap: "16px", alignItems: "flex-end" }}>
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

            {/* Rango de fechas de registro */}
            <div>
              <label style={{ display: "block", fontFamily: fontSans, fontSize: "12px", fontWeight: 700, marginBottom: "8px", color: C.gray700, textTransform: "uppercase", letterSpacing: ".03em" }}>
                Fecha desde
              </label>
              <input
                type="text"
                inputMode="numeric"
                value={fechaDesde}
                onChange={(e) => setFechaDesde(e.target.value)}
                placeholder="dd/mm/aaaa"
                maxLength={10}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  border: `1px solid ${C.gray200}`,
                  borderRadius: "2px",
                  fontFamily: fontSans,
                  fontSize: "13px",
                  outline: "none",
                  background: C.white,
                  color: C.gray800,
                }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontFamily: fontSans, fontSize: "12px", fontWeight: 700, marginBottom: "8px", color: C.gray700, textTransform: "uppercase", letterSpacing: ".03em" }}>
                Fecha hasta
              </label>
              <input
                type="text"
                inputMode="numeric"
                value={fechaHasta}
                onChange={(e) => setFechaHasta(e.target.value)}
                placeholder="dd/mm/aaaa"
                maxLength={10}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  border: `1px solid ${C.gray200}`,
                  borderRadius: "2px",
                  fontFamily: fontSans,
                  fontSize: "13px",
                  outline: "none",
                  background: C.white,
                  color: C.gray800,
                }}
              />
            </div>

            {/* Filtro por edad al desaparecer */}
            <div>
              <label style={{ display: "block", fontFamily: fontSans, fontSize: "12px", fontWeight: 700, marginBottom: "8px", color: C.gray700, textTransform: "uppercase", letterSpacing: ".03em" }}>
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
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  border: `1px solid ${C.gray200}`,
                  borderRadius: "2px",
                  fontFamily: fontSans,
                  fontSize: "13px",
                  outline: "none",
                  background: C.white,
                  color: C.gray800,
                }}
              />
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
            <div style={{ textAlign: "left" }}>
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
          <>
          <style>{`
            @media (max-width: 600px) {
              .reunite-reportes-lista .reunite-reporte-item-lista {
                grid-template-columns: 1fr !important;
              }
              .reunite-reportes-lista .reunite-reporte-item-lista > div:first-child {
                width: 100% !important;
                height: 180px !important;
                min-height: 0 !important;
                border-right: none !important;
                border-bottom: 1px solid ${C.gray200} !important;
              }
            }
          `}</style>
          <div style={{ display: "flex", justifyContent: "flex-start", marginBottom: "12px" }}> </div>
          <div className={vista === "lista" ? "reunite-reportes-lista" : undefined} style={{ display: "grid", gridTemplateColumns: vista === "tarjetas" ? "repeat(auto-fill, minmax(320px, 1fr))" : "1fr", gap: "20px" }}>
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
    return <div style={{ background: C.white, border: `1px solid ${C.gray200}`, padding: "60px 20px", textAlign: "center", color: C.gray600, fontFamily: fontSans }}>Cargando estadísticas...</div>;
  }

  return (
    <div>
      <div style={{ marginBottom: "24px" }}>
        <SectionHeader
          label="Análisis de reportes"
          title="Distribución de personas reportadas"
          sub="Consulta los reportes registrados por grupo de edad, sexo y lugar de los hechos. Los datos se actualizan junto con el listado nacional."
        />
      </div>

      <div className="reunite-page-grid" style={{ display: "grid", gridTemplateColumns: "1.35fr .85fr", gap: "16px", marginBottom: "16px" }}>
        <div style={{ background: C.white, border: `1px solid ${C.gray200}`, padding: "20px" }}>
          <div style={{ fontFamily: fontSans, fontSize: "11px", fontWeight: 700, color: C.gray600, letterSpacing: ".06em", textTransform: "uppercase", marginBottom: "4px" }}>DISTRIBUCIÓN POR EDAD</div>
          <div style={{ fontFamily: font, fontSize: "18px", fontWeight: 700, color: C.gray900, marginBottom: "16px" }}>Reportes por grupo de edad</div>
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

        <div style={{ background: C.white, border: `1px solid ${C.gray200}`, padding: "20px" }}>
          <div style={{ fontFamily: fontSans, fontSize: "11px", fontWeight: 700, color: C.gray600, letterSpacing: ".06em", textTransform: "uppercase", marginBottom: "4px" }}>DISTRIBUCIÓN POR SEXO</div>
          <div style={{ fontFamily: font, fontSize: "18px", fontWeight: 700, color: C.gray900, marginBottom: "4px" }}>Personas reportadas</div>
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
              <div style={{ display: "flex", justifyContent: "center", gap: "12px", flexWrap: "wrap" }}>
                {sexData.map((item, index) => (
                  <div key={item.name} style={{ display: "flex", alignItems: "center", gap: "5px", fontFamily: fontSans, fontSize: "11px", color: C.gray700 }}>
                    <span style={{ width: "9px", height: "9px", background: chartColors[index % chartColors.length] }} />
                    {item.name}: <strong>{item.value}</strong>
                  </div>
                ))}
              </div>
            </>
          ) : <div style={{ padding: "70px 10px", textAlign: "center", color: C.gray600, fontFamily: fontSans, fontSize: "13px" }}>Sin datos de sexo disponibles.</div>}
        </div>
      </div>

      <div style={{ background: C.white, border: `1px solid ${C.gray200}`, padding: "20px", marginBottom: "24px" }}>
        <div style={{ fontFamily: fontSans, fontSize: "11px", fontWeight: 700, color: C.gray600, letterSpacing: ".06em", textTransform: "uppercase", marginBottom: "4px" }}>LUGARES CON MÁS REPORTES</div>
        <div style={{ fontFamily: font, fontSize: "18px", fontWeight: 700, color: C.gray900, marginBottom: "16px" }}>Distribución por lugar de los hechos</div>
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
        ) : <div style={{ padding: "40px 10px", textAlign: "center", color: C.gray600, fontFamily: fontSans, fontSize: "13px" }}>Sin datos de ubicación disponibles.</div>}
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
      className={vista === "lista" ? "reunite-reporte-item-lista" : undefined}
      style={{
        background: C.white,
        border: `1px solid ${hover ? C.teal + "55" : C.gray200}`,
        borderTop: `3px solid ${hover ? C.teal : C.gray200}`,
        boxShadow: hover ? "0 4px 20px rgba(0,132,127,.1)" : "0 1px 4px rgba(0,0,0,.06)",
        transition: "all .25s",
        cursor: "pointer",
        borderRadius: "2px",
        overflow: "hidden",
        display: vista === "lista" ? "grid" : "flex",
        gridTemplateColumns: vista === "lista" ? "180px 1fr" : undefined,
        flexDirection: vista === "tarjetas" ? "column" : undefined,
      }}
    >
      {/* Imagen */}
      <div style={{
        width: vista === "lista" ? "180px" : "100%",
        height: vista === "lista" ? "100%" : "180px",
        minHeight: vista === "lista" ? "160px" : undefined,
        background: tieneImagen(reporte.foto) ? `url('${reporte.foto}')` : C.gray100,
        backgroundSize: "cover",
        backgroundPosition: "center",
        position: "relative",
        borderBottom: vista === "tarjetas" ? `1px solid ${C.gray200}` : "none",
        borderRight: vista === "lista" ? `1px solid ${C.gray200}` : "none",
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
