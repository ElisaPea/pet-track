
import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";
import { supabase } from './lib/supabaseCliente.ts'; // Importamos el cliente que creamos

function App() {
  const [count, setCount] = useState(0);
  const [visibleColors, setVisibleColors] = useState(false);
  const [items, setItems] = useState<any>([])

  // useEffect(() => {
  //   getItems()
  // }, [])

  async function getItems() {
    const { data, error } = await supabase
      .from('VeterinaryCenter') // Nombre de tu tabla en Supabase
      .select('*')
    
    if (error) console.error('Error:', error)
    else {setItems(data); console.log(data)} 
  }
 
  return (
    <>
      <button
        className="border p-2 rounded-xl bg-red-500 hover:bg-red-300 cursor-pointer text-white"
        onClick={() => getItems()}
      >
        {visibleColors ? "Hide colors" : "Show colors"}
      </button>
       <div>
     <h1>Datos de Supabase</h1>

     <ul>
         {items && items.length && (items as any).map((item: any) => (
        <li key={item.id}>{item.name}</li>
        ))}
      </ul>
    </div>

      {visibleColors && (
        <div className="flex flex-col gap-2">
          <div className="bg-red-500 text-white">red - tailwind</div>
          <div style={{ backgroundColor: "#ef4444", color: "#ffffff" }}>
            red - css
          </div>
          <div className="bg-blue-500 text-white">blue - tailwind</div>
          <div style={{ backgroundColor: "#3b82f6", color: "#ffffff" }}>
            blue - css
          </div>
          <div className="bg-green-500 text-white">green - tailwind</div>
          <div style={{ backgroundColor: "#16a34a", color: "#ffffff" }}>
            green - css
          </div>
          <div className="bg-yellow-400 text-black">yellow - tailwind</div>
          <div style={{ backgroundColor: "#f59e0b", color: "#ffffff" }}>
            yellow - css
          </div>
          <div className="bg-purple-500 text-white">purple - tailwind</div>
          <div style={{ backgroundColor: "#9333ea", color: "#ffffff" }}>
            purple - css
          </div>
          <div className="bg-gray-300 text-black">gray - tailwind</div>
          <div style={{ backgroundColor: "#9ca3af", color: "#ffffff" }}>
            gray - css
          </div>
        </div>
      )}

      <div className="items-center flex flex-col">
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>

        <h1 className="text-2xl font-bold">Vite + React</h1>
        <h2>PRUEBA OSCAR</h2>
        <div className="card">
          <button
            className="bg-blue-500 text-white p-2 rounded"
            onClick={() => setCount((count) => count + 1)}
          >
            count is {count}
          </button>
          <p className="text-lg">
            Edit <code>src/App.tsx</code> and save to test HMR
          </p>
        </div>
        <p className="text-sm">
          Pulsa aquí para ver más sobre los logos
        </p>
      </div>
    </>
  );
}

export default App;
