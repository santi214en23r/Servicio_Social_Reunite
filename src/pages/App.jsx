import { useState } from "react";
import { C, fontSans } from "../shared/theme";
import { Navbar }            from "../components/Navbar";
import { Footer }            from "../shared/Footer";
import DashUser              from "./DashUser";
import RegisterAsociation    from "./RegisterAsociation";
import DashAsociation        from "./DashAsociation";
import AddPerson             from "./AddPerson";
import SearchMatches         from "./SearchMatches";
import SearchPlace           from "./SearchPlace";
import Statistics            from "./Statistics";
import About                 from "./About";
import ReportesPersonas      from "./ReportesPersonas";
import GaleriaImagenes       from "./GaleriaImagenes";

const GlobalStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=Merriweather:wght@400;700;900&family=Open+Sans:wght@400;500;600;700&display=swap');
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Open Sans', sans-serif; background: #F7F9FB; color: #20364D; }
    ::selection { background: #005B9633; color: #0B3B6E; }
    button { cursor: pointer; font-family: inherit; }
    input, select, textarea { font-family: inherit; }
    input:focus, select:focus, textarea:focus { outline: 3px solid #005B9626; outline-offset: 1px; }
    ::placeholder { color: #8A98A6; }
    @media (max-width: 760px) {
      .reunite-nav-links { overflow-x: auto; width: 100%; }
      .reunite-nav-actions { display: none !important; }
      .reunite-header-search { display: none !important; }
      .reunite-page-grid { grid-template-columns: 1fr !important; }
      .reunite-stat-grid { grid-template-columns: repeat(2, 1fr) !important; }
    }
    @keyframes fadeUp  { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
    @keyframes slideIn { from { opacity:0; transform:translateX(-10px); } to { opacity:1; transform:translateX(0); } }
    @keyframes pulseDot { 0%,100% { opacity:1; } 50% { opacity:.4; } }
    .fade-up  { animation: fadeUp .4s ease both; }
    .slide-in { animation: slideIn .35s ease both; }
    .delay-1  { animation-delay:.08s; }
    .delay-2  { animation-delay:.16s; }
    .delay-3  { animation-delay:.24s; }
    .delay-4  { animation-delay:.32s; }
    ::-webkit-scrollbar { width:6px; }
    ::-webkit-scrollbar-track { background:#f1f1f1; }
    ::-webkit-scrollbar-thumb { background:#8A98A6; border-radius:3px; }
  `}</style>
);

export default function App() {
  const [page, setPage]       = useState("home");
  const [isAssoc, setIsAssoc] = useState(false);
  const handleLogin  = () => { setIsAssoc(true);  setPage("dash-assoc"); };
  const handleLogout = () => { setIsAssoc(false); setPage("home"); };

  return (
    <>
      <GlobalStyle/>
      <div style={{ minHeight:"100vh", display:"flex", flexDirection:"column" }}>
        <Navbar page={page} setPage={setPage} isAssoc={isAssoc} onLogout={handleLogout}/>
        <main style={{ flex:1 }}>
          {page === "home"           && <DashUser           setPage={setPage}/>}
          {page === "register-assoc" && <RegisterAsociation setPage={setPage} onLoginSuccess={handleLogin}/>}
          {page === "dash-assoc"     && <DashAsociation     setPage={setPage} onLogout={handleLogout}/>}
          {page === "add-person"     && <AddPerson          setPage={setPage}/>}
          {page === "search-matches" && <SearchMatches      setPage={setPage}/>}
          {page === "search-place"   && <SearchPlace        setPage={setPage}/>}
          {page === "statistics"     && <Statistics         setPage={setPage}/>}
          {page === "reportes"       && <ReportesPersonas   setPage={setPage}/>}
          {page === "galeria"        && <GaleriaImagenes    setPage={setPage}/>}
          {page === "about"          && <About              setPage={setPage}/>}
        </main>
        <Footer setPage={setPage}/>
      </div>
    </>
  );
}
