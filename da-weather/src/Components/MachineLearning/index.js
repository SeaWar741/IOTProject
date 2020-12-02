///https://firebasestorage.googleapis.com/v0/b/iotproject-446e7.appspot.com/o/my_model2.h5?alt=media&token=68ff47b0-ea2d-4c01-9536-8f25d12e4dbf

import React, { useEffect, useState, useRef } from "react";

import { makeStyles, useTheme  } from "@material-ui/core/styles";
import {Container, Row, Col, Image } from 'react-bootstrap'

import "bootstrap/dist/css/bootstrap.min.css";
import { useDataLayerValue } from '../../DataLayer';

import { Link } from 'react-router-dom';

import SaveIcon from '@material-ui/icons/Save';
import Button from '@material-ui/core/Button';


import "react-datepicker/dist/react-datepicker.css";



const useStyles = makeStyles((theme) => ({
  Main: {
    backgroundColor: "#F5F4F8",
    color: "black",
    minHeight: "100vh",
    backgroundImage:"url('./img/background/ai.jpg')",
    backgroundRepeat:"no-repeat",
    backgroundPosition:"center",
    backgroundSize: "cover",
    paddingBottom: "100px",
  },
  imageTopContainer:{
    display: "block",
    marginLeft: "auto",
    marginRight: "auto",
    textAlign:"center",
    paddingTop: "20px"
  },
  imageTop:{
    maxHeight: "80px",
    marginBottom: "50px"
  },
  chartContainer: {
    paddingBottom: "50px",
    textAlign:"center",
    display: 'flex'
    
  },
  chartContainer2: {
    paddingBottom: "50px",
    textAlign:"center",
    
  },
  chartDiv:{
    backgroundColor:"#ECE8EC",
    borderRadius:"10px",
    boxShadow: "0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)",
    transition: "0.5s"
  },
  chartTitle: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: "30px",
    color: "black",
    paddingTop:"10px"
  },
  noData: {
    color: "black"
  },
  bottom: {
    color: theme.palette.grey[theme.palette.type === 'light' ? 200 : 700],
  },
  top: {
    color: '#1a90ff',
    animationDuration: '550ms',
    position: 'absolute',
    left: 0,
  },
  circle: {
    strokeLinecap: 'round',
  },
  dateDiv:{
    backgroundColor:"#ECE8EC",
    borderRadius:"10px",
    boxShadow: "0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)",
    transition: "0.5s",
    width:"215px",
    margin: "0 0 0 auto"
  },
  dateContainer:{
      padding:"10px",
  },
  dateContainerUpper:{
      paddingLeft:"1rem",
      paddingBottom:"2rem"
  },
  table: {
    minWidth: 500,
  },
  tableContainer:{
      paddingBottom:"2rem"
  },
  buttonD:{
      padding:"2rem",
  },
  bodyData:{
      padding:"2rem",
      textAlign: "justify",
      textJustify: "inter-word"
  },
  imageD:{
    width: "100%",
    height: "auto"
  }
}));



const MachineLearning = ({ classes }) => {
  const [{ID}] = useDataLayerValue();
  //Charts data
  classes = useStyles();

  const openInNewTab = (url) => {
        const newWindow = window.open(url, '_blank', 'noopener,noreferrer')
        if (newWindow) newWindow.opener = null
    }

  return (
    <div className={classes.Main}>
      <div className={classes.imageTopContainer}>
          <Link
            to="/"
          >
            <Image src="./img/DaWeather.png" className={classes.imageTop} fluid/>
          </Link>
      </div>
      <Container>
      <Row>
            <Col sm className={classes.chartContainer}>
                <div className={classes.chartDiv}>
                    <h2 className={classes.chartTitle}>Información</h2>
                    <div className={classes.bodyData}>
                        <p>
                            Este modelo es una red neuronal LSTM.
                            Utiliza una arquitectura de red neuronal artificial recurrente utilizada en el campo del aprendizaje profundo. A diferencia de las redes neuronales de alimentación directa estándar, LSTM tiene conexiones de retroalimentación.
                        </p>
                        <p>
                            El modelo creado cuenta con 1 capa densa con 4 neuronas, utilizando
                            como optimizador adam. El modelo se entrenó con 20 epochs de batch size 1.
                            Utilizando un dataset de temperatura en Monterrey desde 1929. El proceso
                            de entrenamiento fue de 60/40. Los resultados obtenidos dieron un error de mas menos 2 grados celcius
                        </p>
                        <p>
                            El modelo se entrenó por 2 horas hasta lograr un loss de 0.0318.
                            Evaluando el modelo ya entrenado se encontraron resultados satisfactorios permitiendo
                            crear un sistema capaz de predecir el clima de manera automática.
                        </p>
                        <p>
                            <strong>Requerimientos: </strong>
                            Tensorflow, sklearn, pandas, numpy, keras. 
                            <br/>Min. GPU Nvidia GTX 1060 6GB y 16 GB RAM
                        </p>
                    </div>
                </div>
            </Col>
            <Col sm className={classes.chartContainer}>
                <div className={classes.chartDiv}>
                    <h2 className={classes.chartTitle}>Resultados</h2>
                    <div className={classes.bodyData}>
                        <Container>
                            <img src={"./img/ChartML.png"} className={classes.imageD}/>
                            Gráfica generada a partir del modelo probando contra datos históricos reales
                        </Container>
                        <br/>
                            <strong>AZUL: </strong>Real
                            <br/>
                            <strong>Naranja: </strong>Predicción
                    </div>
                </div>
            </Col>
      </Row>
       <Row>
            <Col sm className={classes.chartContainer2}>
                <div className={classes.chartDiv}>
                    <h2 className={classes.chartTitle}>Descargar modelo</h2>
                    <div className={classes.buttonD}>
                        <Button
                            variant="contained"
                            color="secondary"
                            size="large"
                            className={classes.button}
                            startIcon={<SaveIcon />}
                            onClick={() => {openInNewTab('https://firebasestorage.googleapis.com/v0/b/iotproject-446e7.appspot.com/o/my_model2.h5?alt=media&token=68ff47b0-ea2d-4c01-9536-8f25d12e4dbf')}}
                        >
                            Download
                        </Button>
                    </div>
                </div>
            </Col>
      </Row>
    </Container>

    </div>
  );
};

export default MachineLearning;