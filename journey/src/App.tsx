import React from 'react';
import { BrowserRouter, Switch, Redirect, Route } from 'react-router-dom';

// Screens
import Screen from './screens/Home';
import Workout from './screens/Workout';
import Progress from './screens/Journey';
import Settings from './screens/Settings';

// Components
import Header from './components/Header/Header';

// styles
import './App.scss';

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Switch>
        <Route exact path="/">
          <Screen />
        </Route>
        <Route exact path="/workout">
          <Workout />
        </Route>
        <Route exact path="/progress">
          <Progress />
        </Route>
        <Route exact path="/settings">
          <Settings />
        </Route>
        <Route exact path="*">
          <Redirect to={'/'} />
        </Route>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
