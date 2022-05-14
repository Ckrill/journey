import { BrowserRouter, Route, Routes } from 'react-router-dom';

// Screens
import Screen from './screens/Home';
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
        <Route path="/" element={<Screen />} />
        <Route path="/workout" element={<Workout />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
