import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";


/* Home */
import Home from "./Components/Home";

/*Charts*/
import Charts from "./Components/Charts";

const Router = () => {
  return (
    <BrowserRouter basename={process.env.PUBLIC_URL}>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/historico" component={Charts} />
      </Switch>
    </BrowserRouter>
  );
};

export default Router;
