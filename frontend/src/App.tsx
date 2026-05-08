//src/App.tsx

import {Route, BrowserRouter, Routes} from "react-router-dom";
import Home from "./pages/Home";
import Admin from "./pages/Admin";
import FontSize from "./pages/Settings/FontSize";
import Settings from "./pages/Settings";
import TTS from "./pages/Settings/TTS";
import Header from "./components/Header";

function App() {

  return (
    <BrowserRouter>
    <Header />
      <Routes>
        <Route path='/' element={<Home />}/>
        <Route path='/admin' element={<Admin />}/>
        <Route path='/fontsize' element={<FontSize />}/>
        <Route path="Settings" element={<Settings />}/>
        <Route path ='/TTS' element={<TTS />}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App;