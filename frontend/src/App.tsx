import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Screenshots from './pages/Screenshots';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="screenshots" element={<Screenshots />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
