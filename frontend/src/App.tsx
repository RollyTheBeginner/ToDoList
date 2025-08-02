import NavBar from "./components/NavBar";
import Sidebar from "./components/Sidebar";
import ToDoList from "./pages/ToDoList";

function App() {
  return (
    <div className="flex h-screen">
      {/* Sidebar (left) */}
      <aside className="w-70 h-screen p-4 bg-[#fcfaf8]">
        <Sidebar />
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-col flex-1">
        {/* Top Navigation */}
        <header className=" p-4">
          <NavBar />
        </header>

        {/* Main Body (To-Do List Page) */}
        <main className="flex-1 overflow-auto p-5 ">
          <ToDoList />
        </main>
      </div>
    </div>
  );
}

export default App;
