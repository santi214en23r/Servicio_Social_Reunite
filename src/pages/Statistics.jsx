import { useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, PieChart, Pie, Cell, AreaChart, Area, Legend
} from "recharts";
import { C, font, fontSans } from "../shared/theme";
import { GovBtn, Tag } from "../shared/components";

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
    { n:"234",     label:"Búsquedas Activas\nEn Proceso",       icon:"", trend:"±0%",  up:null,  color:"#2563EB" },
    { n:"7",       label:"Estados con Mayor\nIncidencia",        icon:"", trend:"+1",   up:true,  color:"#7C3AED" },
  ];
  const trends = ["baja","alta","alta","baja","alta","baja","estable"];

  const tooltipStyle = { fontFamily:fontSans, fontSize:"12px", border:`1px solid ${C.gray200}`, borderRadius:"0" };
  const axisTickStyle = { fontFamily:fontSans, fontSize:11, fill:C.gray600 };

  return (
    <div style={{ minHeight:"80vh", background:C.gray50, padding:"32px 24px" }}>
      <div style={{ maxWidth:"1200px", margin:"0 auto" }}>

        {/* Page header */}
        <div style={{ background:C.wine, padding:"20px 24px", marginBottom:"20px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div>
            <div style={{ fontFamily:fontSans, fontSize:"11px", fontWeight:700, color:C.gold, letterSpacing:".1em", textTransform:"uppercase", marginBottom:"2px" }}>ESTADÍSTICAS NACIONALES</div>
            <h1 style={{ fontFamily:font, fontSize:"20px", fontWeight:700, color:C.white }}>Sistema de Monitoreo — Personas Desaparecidas en México</h1>
          </div>
          <div style={{ display:"flex", gap:"8px", alignItems:"center" }}>
            <span style={{ fontFamily:fontSans, fontSize:"11px", color:"rgba(255,255,255,.6)" }}>Última actualización: 03/11/2025</span>
            <button onClick={()=>{setLoading(true);setTimeout(()=>setLoading(false),1200);}}
              style={{ background:"transparent", border:"1px solid rgba(255,255,255,.4)", color:C.white, padding:"7px 14px", borderRadius:"3px", fontFamily:fontSans, fontSize:"12px", fontWeight:700, cursor:"pointer" }}>
              {loading?"Actualizando…":"↻ Actualizar"}
            </button>
          </div>
        </div>

        {/* ── Metric cards ── */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"14px", marginBottom:"20px" }}>
          {metricCards.map((m,i) => (
            <div key={i} style={{ background:C.white, border:`1px solid ${C.gray200}`, borderTop:`4px solid ${m.color}`, padding:"16px" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"10px" }}>
                <span style={{ fontSize:"20px" }}>{m.icon}</span>
                <span style={{ fontFamily:fontSans, fontSize:"11px", fontWeight:700, color:m.up===true?"#CC0000":m.up===false?C.teal:"#2563EB" }}>{m.trend}</span>
              </div>
              <div style={{ fontFamily:font, fontSize:"26px", fontWeight:900, color:m.color, lineHeight:1 }}>{m.n}</div>
              <div style={{ fontFamily:fontSans, fontSize:"11px", color:C.gray600, marginTop:"4px", lineHeight:1.4, whiteSpace:"pre-line" }}>{m.label}</div>
            </div>
          ))}
        </div>

        {/* ── Row 1: Trend + Pie ── */}
        <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr", gap:"16px", marginBottom:"16px" }}>
          <div style={{ background:C.white, border:`1px solid ${C.gray200}`, padding:"20px" }}>
            <div style={{ fontFamily:fontSans, fontSize:"11px", fontWeight:700, color:C.gray600, letterSpacing:".06em", textTransform:"uppercase", marginBottom:"4px" }}>TENDENCIA MENSUAL</div>
            <div style={{ fontFamily:font, fontSize:"17px", fontWeight:700, color:C.gray900, marginBottom:"16px" }}>Casos registrados — 2025</div>
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

          <div style={{ background:C.white, border:`1px solid ${C.gray200}`, padding:"20px" }}>
            <div style={{ fontFamily:fontSans, fontSize:"11px", fontWeight:700, color:C.gray600, letterSpacing:".06em", textTransform:"uppercase", marginBottom:"4px" }}>DISTRIBUCIÓN</div>
            <div style={{ fontFamily:font, fontSize:"17px", fontWeight:700, color:C.gray900, marginBottom:"16px" }}>Por sexo</div>
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie data={sexo} dataKey="value" cx="50%" cy="50%" innerRadius={48} outerRadius={70}>
                  {sexo.map((_,i) => <Cell key={i} fill={COLORS[i]}/>)}
                </Pie>
                <Tooltip contentStyle={tooltipStyle}/>
              </PieChart>
            </ResponsiveContainer>
            <div style={{ display:"flex", gap:"12px", justifyContent:"center" }}>
              {sexo.map((s,i) => (
                <div key={i} style={{ display:"flex", alignItems:"center", gap:"6px" }}>
                  <div style={{ width:"10px", height:"10px", background:COLORS[i] }}/>
                  <span style={{ fontFamily:fontSans, fontSize:"11px", color:C.gray700 }}>{s.name}</span>
                  <span style={{ fontFamily:fontSans, fontSize:"11px", fontWeight:700, color:COLORS[i] }}>{((s.value/112345)*100).toFixed(0)}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Row 2: Age + State bars ── */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"16px", marginBottom:"20px" }}>
          <div style={{ background:C.white, border:`1px solid ${C.gray200}`, padding:"20px" }}>
            <div style={{ fontFamily:fontSans, fontSize:"11px", fontWeight:700, color:C.gray600, letterSpacing:".06em", textTransform:"uppercase", marginBottom:"4px" }}>DISTRIBUCIÓN</div>
            <div style={{ fontFamily:font, fontSize:"17px", fontWeight:700, color:C.gray900, marginBottom:"16px" }}>Por grupo de edad</div>
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

          <div style={{ background:C.white, border:`1px solid ${C.gray200}`, padding:"20px" }}>
            <div style={{ fontFamily:fontSans, fontSize:"11px", fontWeight:700, color:C.gray600, letterSpacing:".06em", textTransform:"uppercase", marginBottom:"4px" }}>COMPARATIVO</div>
            <div style={{ fontFamily:font, fontSize:"17px", fontWeight:700, color:C.gray900, marginBottom:"16px" }}>Por estado</div>
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
        <div style={{ background:C.white, border:`1px solid ${C.gray200}`, marginBottom:"20px" }}>
          <div style={{ background:C.gray50, padding:"12px 16px", borderBottom:`1px solid ${C.gray200}`, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <div style={{ fontFamily:fontSans, fontSize:"11px", fontWeight:700, color:C.gray700, letterSpacing:".06em", textTransform:"uppercase" }}>DESGLOSE POR ESTADO</div>
            <GovBtn variant="ghost">⬇ Exportar</GovBtn>
          </div>
          <table style={{ width:"100%", borderCollapse:"collapse" }}>
            <thead>
              <tr style={{ background:C.gray50, borderBottom:`2px solid ${C.gray200}` }}>
                {["Estado","Desaparecidas","Localizadas","Efectividad (%)","Tendencia"].map(h => (
                  <th key={h} style={{ padding:"10px 16px", fontFamily:fontSans, fontSize:"11px", fontWeight:700, color:C.gray600, letterSpacing:".06em", textTransform:"uppercase", textAlign:"left" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {byState.map((r,i) => {
                const pct = ((r.l/r.d)*100).toFixed(1);
                const t   = trends[i];
                return (
                  <tr key={i} style={{ borderBottom:`1px solid ${C.gray100}`, background:i%2===0?C.white:C.gray50 }}>
                    <td style={{ padding:"10px 16px", fontFamily:fontSans, fontSize:"13px", fontWeight:700, color:C.gray900 }}>{r.estado}</td>
                    <td style={{ padding:"10px 16px", fontFamily:fontSans, fontSize:"13px", fontWeight:600, color:C.wine  }}>{r.d.toLocaleString()}</td>
                    <td style={{ padding:"10px 16px", fontFamily:fontSans, fontSize:"13px", fontWeight:600, color:C.teal  }}>{r.l.toLocaleString()}</td>
                    <td style={{ padding:"10px 16px" }}>
                      <div style={{ display:"flex", alignItems:"center", gap:"8px" }}>
                        <div style={{ width:"60px", height:"5px", background:C.gray200 }}>
                          <div style={{ width:`${pct}%`, height:"100%", background:C.teal }}/>
                        </div>
                        <span style={{ fontFamily:fontSans, fontSize:"12px", fontWeight:700, color:C.teal }}>{pct}%</span>
                      </div>
                    </td>
                    <td style={{ padding:"10px 16px" }}>
                      <span style={{ fontFamily:fontSans, fontSize:"11px", fontWeight:700, padding:"2px 8px", display:"inline-block", background:t==="alta"?"#FEF2F2":t==="baja"?C.tealBg:"#EFF6FF", color:t==="alta"?"#CC0000":t==="baja"?C.teal:"#2563EB", letterSpacing:".04em", textTransform:"uppercase" }}>
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
