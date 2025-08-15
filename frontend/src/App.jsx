import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import AddPerson from './pages/AddPerson';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
          <Navigation />
          <main className="w-full">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/add-person" element={<AddPerson />} />
              <Route path="*" element={
                <div className="min-h-screen flex items-center justify-center bg-gray-100">
                  <div className="text-center">
                    <h1 className="text-6xl font-bold text-gray-400 mb-4">404</h1>
                    <p className="text-xl text-gray-600 mb-8">Page not found</p>
                    <a href="/" className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition-colors">
                      Go Home
                    </a>
                  </div>
                </div>
              } />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;