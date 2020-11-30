import React, { useEffect, useState, useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {Container, Row, Col, Image } from 'react-bootstrap'
import {AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ScatterChart, Legend, Scatter, ComposedChart, Line, Bar } from 'recharts';
import firebase from '../../Utils/Firebase';
import "bootstrap/dist/css/bootstrap.min.css";
import { useDataLayerValue } from '../../DataLayer';
import moment from "moment";
import { Link } from 'react-router-dom';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles((theme) => ({
  Main: {
    backgroundColor: "rgb(33, 160, 224)",
    color: "white",
    minHeight: "100vh"
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
    paddingBottom: "50px"
  },
  chartTitle: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: "30px",
    color: "black"
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
}));





const Charts = ({ classes }) => {
  const [{ID}] = useDataLayerValue();
  //Charts data
  const [temp, setTemp] = useState([]);
  const [tempSens, setTempSens] = useState([]);
  const [humedad, setHumedad] = useState([]);
  const [sonido, setSonido] = useState([]);
  const [CO2, setCO2] = useState([]);
  const [luz, setLuz] = useState([]);
  const [dataCSHL, setDataCSHL] = useState([]); // CO2, sonido, humedad, luz
  const [dataTTH, setDataTTH] = useState([]); // tempSens, temp, humedad

  const [isDark, setIsDark] = useState(false);
  const [size, setSize] = useState(0);
  const [size2, setSize2] = useState(0);

  const checkDate = (date) => {
    var d = new Date();
    var d2 = d.toString().split(" ");
    var date2 = date.toString().split(" ");
    return (d2[1] === date2[1] && d2[2] === date2[2] && d2[3] === date2[3]);
  }

  function useInterval(callback, delay) {
    const savedCallback = useRef();

    // Remember the latest callback.
    useEffect(() => {
      savedCallback.current = callback;
    }, [callback]);

    // Set up the interval.
    useEffect(() => {
      function tick() {
        savedCallback.current();
      }
      if (delay !== null) {
        let id = setInterval(tick, delay);
        return () => clearInterval(id);
      }
    }, [delay]);
  }

  useInterval(() => {
    function fetchData(){
      const query = firebase.database().ref("Nodes").once('value').then(function(snapshot) {
        var data = snapshot.child(ID).val();
        console.log("passing1...")
        console.log("size1: ", size);
        if(data.Data && size != Object.keys(data.Data).length){
            console.log("passing...")
            console.log(data.Data)
            setSize(Object.keys(data.Data).length);
            console.log("size: ", size);
            Object.keys(data.Data).map((item, i) => {
              var d = new Date(0);
              d.setUTCSeconds(item);
              
              if(!checkDate(d)){
                  //temperatura
                  if(data.Data[item].Temperatura){
                    Object.keys(data.Data[item].Temperatura).map((item2, j) => {
                      var newTemp = {
                        date: item, value: data.Data[item].Temperatura[item2].toFixed(1)
                      };
                      setTemp(prevTemp => [...prevTemp, newTemp]);
                    })
                  }

                  //Humedad
                  if(data.Data[item].Humedad){
                    Object.keys(data.Data[item].Humedad).map((item2, j) => {
                      var newHumedad = {
                        date: item, value: data.Data[item].Humedad[item2]
                      };
                      setHumedad(prevHumedad => [...prevHumedad, newHumedad]);
                    })
                  }

                  //Sonido
                  if(data.Data[item].Sonido){
                    Object.keys(data.Data[item].Sonido).map((item2, j) => {
                      var newSonido = {
                        date: item, value: data.Data[item].Sonido[item2]
                      };
                      setSonido(prevSonido => [...prevSonido, newSonido]);
                    })
                  } 

                  //CO2
                  if(data.Data[item].ADC_MQ){
                    Object.keys(data.Data[item].ADC_MQ).map((item2, j) => {
                      var newCO2 = {
                        date: item, value: data.Data[item].ADC_MQ[item2]
                      };
                      setCO2(prevCO2 => [...prevCO2, newCO2]);
                    })
                  }
                  
                  //Luz
                  if(data.Data[item].Luz){
                    Object.keys(data.Data[item].Luz).map((item2, j) => {
                      var newLuz = {
                        date: item, value: data.Data[item].Luz[item2]
                      };
                      setLuz(prevLuz => [...prevLuz, newLuz]);
                    })
                  }

                  //sensacion termica
                  if(data.Data[item].SensacionTermica){
                    Object.keys(data.Data[item].SensacionTermica).map((item2, j) => {
                      var newTempSens = {
                        date: item, value: data.Data[item].SensacionTermica[item2].toFixed(1)
                      };
                      setTempSens(prevTempSens=> [...prevTempSens, newTempSens]);
                    })
                  }
                }
              })
            }
      });
    }
    function fetchMixed(){
      ////Data CSHL
      if(size2 !== CO2.length){
        setSize2(CO2.length);
        for(var i = 0; i < CO2.length; i++){
          if(CO2 && sonido && humedad && luz){
            var newData = {
              date: CO2[i].date,
              CO2: CO2[i].value,
              sonido: sonido[i].value,
              humedad: humedad[i].value,
              luz: luz[i].value
            }
            setDataCSHL(prevData => [...prevData, newData]);
            console.log("CSHL",dataCSHL);
          }
        }
        for(var i = 0; i < temp.length; i++){
          if(tempSens && temp && humedad){
            console.log("tempSens",tempSens);
            var newData = {
              date: temp[i].date,
              tempSens: tempSens[i].value,
              temp: temp[i].value,
              humedad: humedad[i].value
            }
            setDataTTH(prevData => [...prevData, newData]);
          }
        }
      }
    }

    fetchData();
    fetchMixed();
  }, 5000) 
  
  classes = useStyles();
  useEffect(() => {
      //get time
      const hours = new Date().getHours();
      //setIsDark(hours < 6 && hours > 20); // check for daytime
      setIsDark(hours > 6 && hours < 20); // check for night time
  },[ID]);

  let data = [
    {
      name: 'Page A', uv: 4000, pv: 2400, amt: 2400,
    },
    {
      name: 'Page B', uv: 3000, pv: 1398, amt: 2210,
    },
    {
      name: 'Page C', uv: 2000, pv: 9800, amt: 2290,
    },
    {
      name: 'Page D', uv: 2780, pv: 3908, amt: 2000,
    },
    {
      name: 'Page E', uv: 1890, pv: 4800, amt: 2181,
    },
    {
      name: 'Page F', uv: 2390, pv: 3800, amt: 2500,
    },
    {
      name: 'Page G', uv: 3490, pv: 4300, amt: 2100,
    },
  ];

  const formatXAxis = tickItem => {
    var d = new Date(0);
    d.setUTCSeconds(tickItem);
    return moment(d).format('HH:mm:ss');
  }

  return (
    <div className={classes.Main} style={{backgroundColor: isDark && "rgb(4, 8, 28)"}}>
      <div className={classes.imageTopContainer}>
          <Link
            to="/"
          >
            <Image src="./img/DaWeather.png" className={classes.imageTop} fluid/>
          </Link>
      </div>
    <Container>
      <Row>
         {temp.length > 0  ? ( 
          <Col sm className={classes.chartContainer}>
            <h2 className={classes.chartTitle} style={{color: isDark && "white"}}>Temperatura</h2>
            <ScatterChart width={300} height={250}
              margin={{ top: 20, right: 20, bottom: 10, left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date"  type="number" domain={['dataMin', 'dataMax']} tickFormatter={formatXAxis} />
              <YAxis dataKey="value" name="temperature" unit="C" />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} />
              <Legend />
              <Scatter name={`Node ${ID}`} data={temp} fill="rgb(247,255,255)" />
            </ScatterChart>
          </Col>
        ) : (
          <Col sm className={classes.chartContainer}>
            <h2 className={classes.chartTitle} style={{color: isDark && "white"}}>Temperatura</h2>
            <div style={{textAlign: "center", minHeight: "150px"}}>
              <CircularProgress style={{color: isDark ? "white" : "black"}}/>
            </div>
          </Col>
        )}
        {humedad.length > 0 ? (
          <Col sm className={classes.chartContainer}>
            <h2 className={classes.chartTitle} style={{color: isDark && "white"}}>Humedad</h2>
            <AreaChart
              width={300}
              height={250}
              data={humedad}
              margin={{
                 top: 20, right: 20, bottom: 10, left: 10 ,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date"  type="number" domain={['dataMin', 'dataMax']} tickFormatter={formatXAxis} />
              <YAxis dataKey="value" name="humedad" unit="%" />
              <Tooltip />
              <Area connectNulls type="monotone" dataKey="value" stroke="black" fill="rgb(247,255,255)" />
            </AreaChart>
          </Col>
        ): (
          <Col sm className={classes.chartContainer}>
            <h2 className={classes.chartTitle} style={{color: isDark && "white"}}>Humedad</h2>
            <div style={{textAlign: "center", minHeight: "150px"}}>
              <CircularProgress style={{color: isDark ? "white" : "black"}}/>
            </div>
          </Col>
        )}
        
        {sonido.length > 0 ? ( 
          <Col sm className={classes.chartContainer}>
            <h2 className={classes.chartTitle} style={{color: isDark && "white"}}>Sonido</h2>
            <ScatterChart width={300} height={250}
              margin={{ top: 20, right: 20, bottom: 10, left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date"  type="number" domain={['dataMin', 'dataMax']} tickFormatter={formatXAxis} />
              <YAxis dataKey="value" name="Sonido" unit="db" />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} />
              <Legend />
              <Scatter name={`Node ${ID}`} data={sonido} fill="rgb(247,255,255)" />
            </ScatterChart>
          </Col>
        ) : (
          <Col sm className={classes.chartContainer}>
            <h2 className={classes.chartTitle} style={{color: isDark && "white"}}>Sonido</h2>
            <div style={{textAlign: "center", minHeight: "150px"}}>
              <CircularProgress style={{color: isDark ? "white" : "black"}}/>
            </div>
          </Col>
        )}
      </Row>
      <Row>
        {CO2.length > 0 ? (
          <Col sm className={classes.chartContainer}>
            <h2 className={classes.chartTitle} style={{color: isDark && "white"}}>CO2</h2>
            <AreaChart
              width={300}
              height={250}
              data={CO2}
              margin={{
                 top: 20, right: 20, bottom: 40, left: 10 ,
              }}
              name={`Node ${ID}`} 
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date"  type="number" domain={['dataMin', 'dataMax']} tickFormatter={formatXAxis} margin={{top: 30}}/>
              <YAxis dataKey="value" name="CO2" unit="mg/L" />
              <Tooltip />
              <Area connectNulls type="monotone" dataKey="value" stroke="rgb(247,255,255)" fill="rgb(247,255,255)" />
            </AreaChart>
          </Col>
        ) : (
          <Col sm className={classes.chartContainer}>
            <h2 className={classes.chartTitle} style={{color: isDark && "white"}}>CO2</h2>
            <div style={{textAlign: "center", minHeight: "150px"}}>
              <CircularProgress style={{color: isDark ? "white" : "black"}}/>
            </div>
          </Col>
        )}
        {luz.length > 0 ? (
          <Col sm className={classes.chartContainer}>
            <h2 className={classes.chartTitle} style={{color: isDark && "white"}}>Luz</h2>
            <AreaChart
              width={300}
              height={250}
              data={luz}
              margin={{
                 top: 20, right: 20, bottom: 40, left: 10 ,
              }}
              name={`Node ${ID}`} 
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date"  type="number" domain={['dataMin', 'dataMax']} tickFormatter={formatXAxis} margin={{top: 30}}/>
              <YAxis dataKey="value" name="Luz" unit="lm" />
              <Tooltip />
              <Area connectNulls type="monotone" dataKey="value" stroke="rgb(247,255,255)" fill="rgb(247,255,255)" />
            </AreaChart>
          </Col>
        ) : (
          <Col sm className={classes.chartContainer}>
            <h2 className={classes.chartTitle} style={{color: isDark && "white"}}>Luz</h2>
            <div style={{textAlign: "center", minHeight: "150px"}}>
              <CircularProgress style={{color: isDark ? "white" : "black"}}/>
            </div>
          </Col>
        )}
        {dataCSHL.length > 0 ? (
          <Col sm className={classes.chartContainer}>
            <h2 className={classes.chartTitle} style={{color: isDark && "white"}}>Varios</h2>
            <ComposedChart
              width={300}
              height={250}
              data={dataCSHL}
              margin={{
                 top: 20, right: 20, bottom: 40, left: 10 ,
              }}
              name={`Node ${ID}`} 
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date"  type="number" domain={['dataMin', 'dataMax']} tickFormatter={formatXAxis} margin={{top: 30}}/>
              <YAxis />
              <Tooltip />
              <Legend/>
              <Line type='monotone' dataKey='CO2' stroke='#ff7300'/>
              <Line type='monotone' dataKey='sonido' stroke='#ff7300'/>
              <Line type='monotone' dataKey='humedad' stroke='#ff7300'/>
              <Line type='monotone' dataKey='luz' stroke='#ff7300'/>
            </ComposedChart>
          </Col>
        ) : (
          <Col sm className={classes.chartContainer}>
            <h2 className={classes.chartTitle} style={{color: isDark && "white"}}>Luz</h2>
            <div style={{textAlign: "center", minHeight: "150px"}}>
              <CircularProgress style={{color: isDark ? "white" : "black"}}/>
            </div>
          </Col>
        )}
      </Row>
      <Row>
        {dataTTH.length > 0 ? (
          <Col sm className={classes.chartContainer}>
            <h2 className={classes.chartTitle} style={{color: isDark && "white"}}>Varios2</h2>
            <ComposedChart
              width={300}
              height={250}
              data={dataTTH}
              margin={{
                 top: 20, right: 20, bottom: 40, left: 10 ,
              }}
              name={`Node ${ID}`} 
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date"  type="number" domain={['dataMin', 'dataMax']} tickFormatter={formatXAxis} margin={{top: 30}}/>
              <YAxis />
              <Tooltip />
              <Legend/>
              <Line type='monotone' dataKey='humedad' stroke='#ff7300'/>
              <Bar dataKey='tempSens' barSize={20} fill='#413ea0'/>
              <Bar dataKey='temp' barSize={20} fill='#413ea0'/>
            </ComposedChart>
          </Col>
        ) : (
          <Col sm className={classes.chartContainer}>
            <h2 className={classes.chartTitle} style={{color: isDark && "white"}}>Varios2</h2>
            <div style={{textAlign: "center", minHeight: "150px"}}>
              <CircularProgress style={{color: isDark ? "white" : "black"}}/>
            </div>
          </Col>
        )}
        <Col sm>
          <AreaChart
            width={300}
            height={200}
            data={data}
            margin={{
              top: 10, right: 30, left: 0, bottom: 0,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Area connectNulls type="monotone" dataKey="uv" stroke="#8884d8" fill="#8884d8" />
          </AreaChart>
        </Col>
        <Col sm>
          <AreaChart
            width={300}
            height={200}
            data={data}
            margin={{
              top: 10, right: 30, left: 0, bottom: 0,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Area connectNulls type="monotone" dataKey="uv" stroke="#8884d8" fill="#8884d8" />
          </AreaChart>
        </Col>
      </Row>
    </Container>
    </div>
  );
};

export default Charts;
