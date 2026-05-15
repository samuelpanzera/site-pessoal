import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Blog from './pages/Blog'
import BlogPost from './pages/BlogPost'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tech-details-pdi" element={<Blog />} />
        <Route path="/tech-details-pdi/:id" element={<BlogPost />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
