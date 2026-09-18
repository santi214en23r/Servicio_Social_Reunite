import { useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, PieChart, Pie, Cell, AreaChart, Area, Legend
} from "recharts";
import { C, font, fontSans } from "../shared/theme";
import { GovBtn, Tag } from "../shared/components";
import "../styles/pages/Statistics.css";

const Statistics = ({ setPage }) => {
  const [loading, setLoading] = useState(false);

  // ── Data ─────────────────────────────────
  const monthly = [
    {mes:"Ene",d:9500,l:4200},{mes:"Feb",d:10200,l:4800},{mes:"Mar",d:11000,l:5200},
    {mes:"Abr",d:9800,l:5100},{mes:"May",d:10500,l:4900},{mes:"Jun",d:11200,l:5300},
    {mes:"Jul",d:10800,l:5200},{mes:"Ago",d:11500,l:5500},{mes:"Sep",d:12000,l:5800},
    {mes:"Oct",d:11800,l:5700},{mes:"Nov",d:12500,l:6000},{mes:"Dic",d:11200,l:5400},
  ];
  const byState = [
    {estado:"Edo. Mex.",d:18000,l:9000},{estado:"Jalisco",d:15000,l:7000},
    {estado:"Guanajuato",d:11000,l:5200},{estado:"CDMX",d:12000,l:6000},
    {estado:"N. León",d:9000,l:4000},{estado:"Veracruz",d:8000,l:3500},
    {estado:"Puebla",d:6500,l:3200},
  ];
  const sexo  = [{name:"Mujeres",value:65000},{name:"Hombres",value:47400}];
  const COLORS = [C.wine, C.teal];
  const edad  = [{r:"0–17",v:8000},{r:"18–30",v:25000},{r:"31–50",v:40000},{r:"51–70",v:30000},{r:"71+",v:9345}];
  const metricCards = [
    { n:"112,345", label:"Personas Desaparecidas\nRegistradas", icon:"", trend:"+2.3%", up:true,  color:C.wine },
    { n:"54,321",  label:"Personas Localizadas",                icon:"", trend:"-0.5%", up:false, color:C.teal },
    { n:"234",     label:"Búsquedas Activas\nEn Proceso",       icon:"", trend:"±0%",  up:null,  color:C.tealL },
    { n:"7",       label:"Estados con Mayor\nIncidencia",        icon:"", trend:"+1",   up:true,  color:C.gold },
  ];
  const trends = ["baja","alta","alta","baja","alta","baja","estable"];

  const tooltipStyle = { fontFamily:fontSans, fontSize:"12px", border:`1px solid ${C.gray200}`, borderRadius:"0" };
  const axisTickStyle = { fontFamily:fontSans, fontSize:11, fill:C.gray600 };

  return (
    <div className="statistics-page">
      <div className="statistics-container">

        {/* Page header */}
        <div className="statistics-header">
          <div>
            <div className="statistics-eyebrow">ESTADÍSTICAS NACIONALES</div>
            <h1 className="statistics-title">Sistema de Monitoreo — Personas Desaparecidas en México</h1>
          </div>
          <div className="statistics-header-actions">
            <span className="statistics-updated">Última actualización: 03/11/2025</span>
            <button onClick={()=>{setLoading(true);setTimeout(()=>setLoading(false),1200);}}
              className="statistics-refresh-button">
              {loading?"Actualizando…":"↻ Actualizar"}
            </button>
          </div>
        </div>

        {/* ── Metric cards ── */}
        <div className="statistics-metric-grid">
          {metricCards.map((m,i) => (
            <div key={i} className="statistics-metric-card" style={{ "--metric-color": m.color }}>
              <div className="statistics-metric-top">
                <span className="statistics-metric-icon">{m.icon}</span>
                <span className={`statistics-metric-trend ${m.up===true ? "is-up" : m.up===false ? "is-down" : "is-stable"}`}>{m.trend}</span>
              </div>
              <div className="statistics-metric-value">{m.n}</div>
              <div className="statistics-metric-label">{m.label}</div>
            </div>
          ))}
        </div>

        {/* ── Row 1: Trend + Pie ── */}
        <div className="statistics-chart-grid statistics-chart-grid-primary">
          <div className="statistics-chart-panel">
            <div className="statistics-chart-eyebrow">TENDENCIA MENSUAL</div>
            <div className="statistics-chart-title">Casos registrados — 2025</div>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={monthly}>
                <defs>
                  <linearGradient id="gD" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={C.wine} stopOpacity={.25}/><stop offset="95%" stopColor={C.wine} stopOpacity={0}/></linearGradient>
                  <linearGradient id="gL" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={C.teal} stopOpacity={.25}/><stop offset="95%" stopColor={C.teal} stopOpacity={0}/></linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={C.gray100} vertical={false}/>
                <XAxis dataKey="mes" axisLine={false} tickLine={false} tick={axisTickStyle}/>
                <YAxis axisLine={false} tickLine={false} tick={axisTickStyle}/>
                <Tooltip contentStyle={tooltipStyle}/>
                <Legend wrapperStyle={{ fontFamily:fontSans, fontSize:"11px", paddingTop:"8px" }}/>
                <Area type="monotone" dataKey="d" stroke={C.wine} strokeWidth={2} fill="url(#gD)" name="Desaparecidas"/>
                <Area type="monotone" dataKey="l" stroke={C.teal} strokeWidth={2} fill="url(#gL)" name="Localizadas"/>
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="statistics-chart-panel">
            <div className="statistics-chart-eyebrow">DISTRIBUCIÓN</div>
            <div className="statistics-chart-title">Por sexo</div>
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie data={sexo} dataKey="value" cx="50%" cy="50%" innerRadius={48} outerRadius={70}>
                  {sexo.map((_,i) => <Cell key={i} fill={COLORS[i]}/>)}
                </Pie>
                <Tooltip contentStyle={tooltipStyle}/>
              </PieChart>
            </ResponsiveContainer>
            <div className="statistics-legend">
              {sexo.map((s,i) => (
                <div key={i} className="statistics-legend-item" style={{ "--legend-color": COLORS[i] }}>
                  <div className="statistics-legend-swatch"/>
                  <span>{s.name}</span>
                  <span className="statistics-legend-value">{((s.value/112345)*100).toFixed(0)}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Row 2: Age + State bars ── */}
        <div className="statistics-chart-grid statistics-chart-grid-secondary">
          <div className="statistics-chart-panel">
            <div className="statistics-chart-eyebrow">DISTRIBUCIÓN</div>
            <div className="statistics-chart-title">Por grupo de edad</div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={edad}>
                <CartesianGrid strokeDasharray="3 3" stroke={C.gray100} vertical={false}/>
                <XAxis dataKey="r" axisLine={false} tickLine={false} tick={axisTickStyle}/>
                <YAxis axisLine={false} tickLine={false} tick={axisTickStyle}/>
                <Tooltip contentStyle={tooltipStyle}/>
                <Bar dataKey="v" name="Personas" fill={C.teal}/>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="statistics-chart-panel">
            <div className="statistics-chart-eyebrow">COMPARATIVO</div>
            <div className="statistics-chart-title">Por estado</div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={byState} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke={C.gray100} horizontal={false}/>
                <XAxis type="number" axisLine={false} tickLine={false} tick={{ ...axisTickStyle, fontSize:10 }}/>
                <YAxis type="category" dataKey="estado" axisLine={false} tickLine={false} tick={{ ...axisTickStyle, fontSize:10 }} width={65}/>
                <Tooltip contentStyle={tooltipStyle}/>
                <Bar dataKey="d" name="Desaparecidas" fill={C.wine}/>
                <Bar dataKey="l" name="Localizadas"   fill={C.teal}/>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ── State table ── */}
        <div className="statistics-table-panel">
          <div className="statistics-table-header">
            <div className="statistics-chart-eyebrow statistics-table-heading">DESGLOSE POR ESTADO</div>
            <GovBtn variant="ghost">⬇ Exportar</GovBtn>
          </div>
          <table className="statistics-table">
            <thead>
              <tr className="statistics-table-heading-row">
                {["Estado","Desaparecidas","Localizadas","Efectividad (%)","Tendencia"].map(h => (
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {byState.map((r,i) => {
                const pct = ((r.l/r.d)*100).toFixed(1);
                const t   = trends[i];
                return (
                  <tr key={i} className={`statistics-table-row ${i%2===0 ? "is-even" : ""}`}>
                    <td className="statistics-state-name">{r.estado}</td>
                    <td className="statistics-state-disappeared">{r.d.toLocaleString()}</td>
                    <td className="statistics-state-located">{r.l.toLocaleString()}</td>
                    <td>
                      <div className="statistics-effectiveness">
                        <div className="statistics-effectiveness-bar" style={{ "--effectiveness-width": `${pct}%` }}><div /></div>
                        <span className="statistics-effectiveness-value">{pct}%</span>
                      </div>
                    </td>
                    <td>
                      <span className={`statistics-trend ${t}`}>
                        {t==="alta"?"↑":t==="baja"?"↓":"→"} {t}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};

export default Statistics;
