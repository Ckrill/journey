import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

// Screens
import Screen from './screens/Home';
import Workout from './screens/Workout';
import Progress from './screens/Journey';
import Settings from './screens/Settings';

// Components
import Header from './components/Header/Header';

// styles
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Switch>
        <Route exact path="/" component={Screen} />
        <Route exact path="/workout" component={Workout} />
        <Route exact path="/progress" component={Progress} />
        <Route exact path="/settings" component={Settings} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
