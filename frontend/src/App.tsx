import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import NavBar from "./components/NavBar";
import Sidebar from "./components/Sidebar";
import TodayListPage from "./pages/TodayListPage";
import UpcomingListPage from "./pages/UpcomingListPage";
import CompletedPage from "./pages/CompletedPage";
import ProjectPage from "./pages/ProjectPage";
import OverduePage from "./pages/OverduePage";

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      setIsSidebarOpen(window.innerWidth >= 768);
    };

    handleResize(); // initial check
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex h-screen">
      {isSidebarOpen && (
        <aside className="w-70 h-screen p-4 bg-[#fcfaf8] transition-all duration-300">
          <Sidebar onToggle={() => setIsSidebarOpen(false)} />
        </aside>
      )}

      <div className="flex flex-col flex-1">
        <header className="p-4">
          <NavBar onToggle={() => setIsSidebarOpen(true)} isSidebarOpen={isSidebarOpen} />
        </header>

        <main className="flex-1 overflow-auto px-4 sm:px-8 md:px-16 lg:px-32 xl:px-48 2xl:px-64 py-2">
          <Routes>
            <Route path="/" element={<TodayListPage />} />
            <Route path="/upcominglist" element={<UpcomingListPage />} />
            <Route path="/overdue" element={<OverduePage />} />
            <Route path="/completed" element={<CompletedPage />} />
            <Route path="/tasks/project/:projectId" element={<ProjectPage />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;
