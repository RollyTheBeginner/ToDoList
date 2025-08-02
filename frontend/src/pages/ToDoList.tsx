export default function ToDoList() {
  return (
    <section className="p-4">
      {/* Category Filter */}
      <nav aria-label="To-Do Filters" className="mb-4 flex gap-2">
        <button className="px-2 py-1 rounded-sm bg-blue-300 hover:bg-blue-400">
          ALL
        </button>
        <button className="px-2 py-1 rounded-sm bg-green-300 hover:bg-green-400">
          PERSONAL
        </button>
        <button className="px-2 py-1 rounded-sm bg-yellow-300 hover:bg-yellow-400">
          PROJECT
        </button>
        <button className="px-2 py-1 rounded-sm bg-pink-300 hover:bg-pink-400">
          CUSTOM NAME
        </button>
      </nav>

      {/* To-Do Items (Example placeholder) */}
      <ul className="space-y-2">
        <li className="p-2 bg-white rounded shadow">Sample Task 1</li>
        <li className="p-2 bg-white rounded shadow">Sample Task 2</li>
      </ul>
    </section>
  );
}
