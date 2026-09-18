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
import "../styles/pages/App.css";

export default function App() {
  const [page, setPage]       = useState("home");
  const [isAssoc, setIsAssoc] = useState(false);
  const handleLogin  = () => { setIsAssoc(true);  setPage("dash-assoc"); };
  const handleLogout = () => { setIsAssoc(false); setPage("home"); };

  return (
    <>
      <div className="app-shell">
        <Navbar page={page} setPage={setPage} isAssoc={isAssoc} onLogout={handleLogout}/>
        <main className="app-main">
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
