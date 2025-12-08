import { RouterProvider } from 'react-router-dom'
import './App.css'
import { route } from './provider/route'

function App() {

  return (
    <div>
      <RouterProvider router={route}/>
    </div>
  )
}

export default App
