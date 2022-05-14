import { BrowserRouter, Route, Routes } from 'react-router-dom';

// Screens
import Home from './screens/Home';
import Workout from './screens/Workout';
import Settings from './screens/Settings';

// Components
import Header from './components/Header/Header';

// styles
import './App.scss';

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/journey" element={<Home />} />
        <Route path="/" element={<Workout />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
