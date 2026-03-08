
import React from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import PriceList from './pages/PriceList';
import About from './pages/About';
import Gallery from './pages/Gallery';
import Contact from './pages/Contact';
import { AnimatePresence } from 'framer-motion';
import { MusicProvider } from './context/MusicContext';

// Scroll to top on route change
const ScrollToTop = () => {
    const { pathname } = useLocation();
    React.useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);
    return null;
}

const App: React.FC = () => {
  return (
    <MusicProvider>
      <HashRouter>
        <ScrollToTop />
        <div className="font-sans text-gray-900 bg-white min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-grow">
            <AnimatePresence mode="wait">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/prices" element={<PriceList />} />
                <Route path="/about" element={<About />} />
                <Route path="/gallery" element={<Gallery />} />
                <Route path="/contact" element={<Contact />} />
              </Routes>
            </AnimatePresence>
          </main>
          <Footer />
        </div>
      </HashRouter>
    </MusicProvider>
  );
};

export default App;
