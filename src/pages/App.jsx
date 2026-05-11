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

const GlobalStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Source+Serif+4:wght@300;400;600;700;900&family=Source+Sans+3:wght@300;400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap');
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Source Sans 3', sans-serif; background: #F9FAFB; color: #1F2937; }
    ::selection { background: #00847F33; color: #00847F; }
    button { cursor: pointer; font-family: inherit; }
    input, select, textarea { font-family: inherit; }
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
    ::-webkit-scrollbar-thumb { background:#9CA3AF; border-radius:3px; }
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
          {page === "about"          && <About              setPage={setPage}/>}
        </main>
        <Footer setPage={setPage}/>
      </div>
    </>
  );
}
