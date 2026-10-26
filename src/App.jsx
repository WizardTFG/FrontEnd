import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [datos, setDatos] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/test/')
      .then(response => {
        if (!response.ok) throw new Error('Error en la respuesta del servidor')
        return response.json()
      })
      .then(data => setDatos(data))
      .catch(err => setError(err.message))
  }, [])

  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif' }}>
      <h1>Mi Aplicación Frontend (React)</h1>
      <div style={{ marginTop: '20px', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
        <h3>Estado de la conexión con Django:</h3>
        {error && <p style={{ color: 'red' }}> Error: {error}</p>}
        {!datos && !error && <p> Conectando al backend...</p>}
        {datos && (
          <div>
            <p> Estatus: <strong>{datos.status}</strong></p>
            <p> Mensaje: "{datos.mensaje}"</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default App