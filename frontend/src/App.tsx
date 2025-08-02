import NavBar from "./components/NavBar";
import Sidebar from "./components/Sidebar";
import ToDoList from "./pages/ToDoList";

function App() {
  return (
    <div className="flex h-screen">
      {/* Sidebar (left) */}
      <aside className="w-72 h-screen border-r-2 border-red-300 p-4">
        <Sidebar />
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-col flex-1">
        {/* Top Navigation */}
        <header className="border-b-2 border-red-300 p-5">
          <NavBar />
        </header>

        {/* Main Body (To-Do List Page) */}
        <main className="flex-1 overflow-auto p-5 border-b-2 border-red-300">
          <ToDoList />
        </main>
      </div>
    </div>
  );
}

export default App;
