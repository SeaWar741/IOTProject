import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";


/* Home */
import Home from "./Components/Home";

/*Charts*/
import Charts from "./Components/Charts";

/*Machine Learning*/
import MachineLearning from "./Components/MachineLearning";

const Router = () => {
  return (
    <BrowserRouter basename={process.env.PUBLIC_URL}>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/historico" component={Charts} />
        <Route exact path="/machine-learning" component={MachineLearning} />
      </Switch>
    </BrowserRouter>
  );
};

export default Router;
