import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {Container,Row,Col } from 'react-bootstrap'

import LeftLayout from "./LeftLayout";
import RightLayout from "./RightLayout";

import "bootstrap/dist/css/bootstrap.min.css";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    height: 140,
    width: 100,
  },
  control: {
    padding: theme.spacing(2),
  },
  column:{
    paddingRight:"0 !important",
    paddingLeft:"0 !important"
  }
}));

const Home = ({ classes }) => {
  classes = useStyles();

  return (
    <div className={classes.Main}>
      <Container fluid>
        <Row>
          <Col sm={7} className={classes.column}>
            <LeftLayout/>
          </Col>
          <Col sm={5} className={classes.column}>
            <RightLayout/>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Home;
