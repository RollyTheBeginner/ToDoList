import { useEffect, useState } from "react";
import NavBar from "./components/NavBar";
import Sidebar from "./components/Sidebar";
import ToDoList from "./pages/ToDoList";
import { Route, Routes } from "react-router-dom";
import TodayList from "./pages/TodayListPage";
import UpcomingList from "./pages/UpcomingListPage";
import Completed from "./pages/CompletedPage";
import ProjectPage from "./pages/ProjectPage";

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    handleResize();
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
            <Route path="/" element={<ToDoList />} />
            <Route path="/todaylist" element={<TodayList />} />
            <Route path="/upcominglist" element={<UpcomingList />} />
            <Route path="/completed" element={<Completed />} />
            <Route path="/projects" element={<ProjectPage />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;
