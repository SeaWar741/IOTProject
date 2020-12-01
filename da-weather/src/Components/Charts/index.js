import React, { useEffect, useState, useRef } from "react";
import PropTypes from 'prop-types';
import { makeStyles, useTheme  } from "@material-ui/core/styles";
import {Container, Row, Col, Image } from 'react-bootstrap'
import {AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ScatterChart, Legend, 
        Scatter, ComposedChart, Line, Bar, LineChart,ResponsiveContainer } from 'recharts';
import firebase from '../../Utils/Firebase';
import "bootstrap/dist/css/bootstrap.min.css";
import { useDataLayerValue } from '../../DataLayer';
import moment from "moment";
import { Link } from 'react-router-dom';
import CircularProgress from '@material-ui/core/CircularProgress';
import DatePicker from "react-datepicker";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableHead from '@material-ui/core/TableHead';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';

import TableEnd from "./table"

import "react-datepicker/dist/react-datepicker.css";

const useStyles1 = makeStyles((theme) => ({
    root: {
      flexShrink: 0,
      marginLeft: theme.spacing(2.5),
    },
  }));
  
function TablePaginationActions(props) {
    const classes = useStyles1();
    const theme = useTheme();
    const { count, page, rowsPerPage, onChangePage } = props;
  
    const handleFirstPageButtonClick = (event) => {
      onChangePage(event, 0);
    };
  
    const handleBackButtonClick = (event) => {
      onChangePage(event, page - 1);
    };
  
    const handleNextButtonClick = (event) => {
      onChangePage(event, page + 1);
    };
  
    const handleLastPageButtonClick = (event) => {
      onChangePage(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
    };
  
    return (
      <div className={classes.root}>
        <IconButton
          onClick={handleFirstPageButtonClick}
          disabled={page === 0}
          aria-label="first page"
        >
          {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
        </IconButton>
        <IconButton onClick={handleBackButtonClick} disabled={page === 0} aria-label="previous page">
          {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
        </IconButton>
        <IconButton
          onClick={handleNextButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="next page"
        >
          {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
        </IconButton>
        <IconButton
          onClick={handleLastPageButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="last page"
        >
          {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
        </IconButton>
      </div>
    );
  }
  
TablePaginationActions.propTypes = {
    count: PropTypes.number.isRequired,
    onChangePage: PropTypes.func.isRequired,
    page: PropTypes.number.isRequired,
    rowsPerPage: PropTypes.number.isRequired,
};
  
function createData(date,adcmq, concentracion,humedad,lluvia,luz,sensaciontermica,sonido,temperatura,velocidad) {
    return { date,adcmq, concentracion,humedad,lluvia,luz,sensaciontermica,sonido,temperatura,velocidad};
}

/*
const rows = [
    createData('Cupcake', 305, 3.7),
    createData('Donut', 452, 25.0),
    createData('Eclair', 262, 16.0),
    createData('Frozen yoghurt', 159, 6.0),
    createData('Gingerbread', 356, 16.0),
    createData('Honeycomb', 408, 3.2),
    createData('Ice cream sandwich', 237, 9.0),
    createData('Jelly Bean', 375, 0.0),
    createData('KitKat', 518, 26.0),
    createData('Lollipop', 392, 0.2),
    createData('Marshmallow', 318, 0),
    createData('Nougat', 360, 19.0),
    createData('Oreo', 437, 18.0),
  ].sort((a, b) => (a.date < b.date ? -1 : 1));
*/


const useStyles = makeStyles((theme) => ({
  Main: {
    backgroundColor: "#F5F4F8",
    color: "black",
    minHeight: "100vh",
    backgroundImage:"url('./img/background/charts.jpg')",
    backgroundRepeat:"no-repeat",
    backgroundPosition:"center",
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
  }
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
  
  const [adcmq, setAdcmq] = useState([]);
  const [lluvia, setLluvia] = useState([]);
  const [specialSensor, setSpecialSensor] = useState([]);
  const [velocidad, setVelocidad] = useState([]);


  const [rows,setRows] = useState([]);

  const [isDark, setIsDark] = useState(false);
  const [size, setSize] = useState(0);
  const [size2, setSize2] = useState(0);

  const [startDate, setStartDate] = useState(new Date());
  const [newDateSelected,setNewDateSelected] = useState(false);
  
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);
  
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  function resetValues(){
    setTemp([])
    setTempSens([])
    setHumedad([])
    setSonido([])
    setCO2([])
    setLuz([])
    setDataCSHL([])
    setDataTTH([])
  }

  const checkDate = (date) => {
    var d = startDate;
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
        if((data.Data && size != Object.keys(data.Data).length) || newDateSelected ){
            if(newDateSelected){
                resetValues()
            }
            console.log("passing...")
            console.log(data.Data)
            setSize(Object.keys(data.Data).length);
            setNewDateSelected(false);
            console.log("size: ", size);
            Object.keys(data.Data).map((item, i) => {
              var d = new Date(item* 1000);
              //d.setUTCSeconds(item);
              //if(!checkDate(d)){
                if(checkDate(d)){
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
                  if(data.Data[item].Concentracion){
                    Object.keys(data.Data[item].Concentracion).map((item2, j) => {
                      var newCO2 = {
                        date: item, value: data.Data[item].Concentracion[item2]
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

                  //adcmq
                  if(data.Data[item].ADC_MQ){
                    Object.keys(data.Data[item].ADC_MQ).map((item2, j) => {
                      var newAdcmq = {
                        date: item, value: data.Data[item].ADC_MQ[item2].toFixed(1)
                      };
                      setAdcmq(prevAdcmq=> [...prevAdcmq, newAdcmq]);
                    })
                  }

                  //lluvia
                  if(data.Data[item].Lluvia){
                    Object.keys(data.Data[item].Lluvia).map((item2, j) => {
                      var newLluvia = {
                        date: item, value: data.Data[item].Lluvia[item2]
                      };
                      setLluvia(prevLluvia=> [...prevLluvia, newLluvia]);
                    })
                  }


                  //velocidad
                  if(data.Data[item].Velocidad){
                    Object.keys(data.Data[item].Velocidad).map((item2, j) => {
                      var newVelocidad = {
                        date: item, value: data.Data[item].Velocidad[item2]
                      };
                      setVelocidad(prevVelocidad=> [...prevVelocidad, newVelocidad]);
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
        let rowsTemp = []
        for(var i = 0; i<CO2.length;i++){
            var d = new Date(CO2[i].date* 1000)

            rowsTemp.push(createData(moment(d).format('MMMM Do YYYY, h:mm:ss a'),adcmq[i].value, CO2[i].value,humedad[i].value,lluvia[i].value,luz[i].value,tempSens[i].value,sonido[i].value,temp[i].value,velocidad[i].value))
        }
        rowsTemp.sort((a, b) => (a.date < b.date ? -1 : 1));
        setRows(rowsTemp)
        console.log(rows)
      }
    }

    fetchData();
    fetchMixed();
  }, 1000) 
  
  classes = useStyles();

  useEffect(() => {
      //get time
      const hours = new Date().getHours();
      //setIsDark(hours < 6 && hours > 20); // check for daytime
      //setIsDark(hours > 6 && hours < 20); // check for night time
  },[ID]);

  useEffect(()=>{
    console.log("FechaRegistrada")
    console.log(startDate)
    setNewDateSelected(true)
  },[startDate])


  const formatXAxis = tickItem => {
    var d = new Date(0);
    d.setUTCSeconds(tickItem);
    return moment(d).format('LTS');
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
        <Row className={classes.dateContainerUpper}>
            <div className={classes.dateDiv}>
                <div className={classes.dateContainer}>
                    <DatePicker selected={startDate} onChange={date => setStartDate(date)} />
                </div>
            </div>
        </Row>
       <Row>
            {dataTTH.length > 0 ? (
            <Col sm className={classes.chartContainer}>
                <div className={classes.chartDiv}>
                    <h2 className={classes.chartTitle} style={{color: isDark && "white"}}>Clima</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <ComposedChart  data={dataTTH} margin={{top: 20, right: 20, bottom: 40, left: 10 ,}} name={`Node ${ID}`} >
                            <defs>
                                <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#4ADEDE" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#1AA7EC" stopOpacity={0.9}/>
                                </linearGradient>
                                <linearGradient id="colorUv2" x1="0" y1="0" x2="0" y2="1">
                                
                                <stop offset="5%" stopColor="#FBC34A" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#F04393" stopOpacity={0.9}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date"  type="number" domain={['auto', 'auto']} tickFormatter={formatXAxis} margin={{top: 30}}/>
                            <YAxis  yAxisId="Humedad" orientation="right" name="Humedad" unit="%" domain={['auto', 'auto']}/>
                            <YAxis  yAxisId="Temperatura" orientation="left" name="Temperatura" unit="°C" domain={['auto', 'auto']}/>
                            <Tooltip />
                            <Legend/>
                            <Bar yAxisId="Temperatura" dataKey='tempSens' barSize={20} fillOpacity={1} fill="url(#colorUv)"/>
                            <Bar yAxisId="Temperatura" dataKey='temp' barSize={20} fillOpacity={1} fill="url(#colorUv2)"/>
                            <Line yAxisId="Humedad" type='monotone' dataKey='humedad' stroke='#1E2F97'/>
                        </ComposedChart>
                    </ResponsiveContainer>
                </div>
            </Col>
            ) : (
            <Col sm className={classes.chartContainer}>
                <h2 className={classes.chartTitle} style={{color: isDark && "white"}}>Clima</h2>
                <div style={{textAlign: "center", minHeight: "150px"}}>
                <CircularProgress style={{color: isDark ? "white" : "black"}}/>
                </div>
            </Col>
            )}
      </Row>
      <Row>
         {temp.length > 0  ? ( 
          <Col sm className={classes.chartContainer}> 
            <div className={classes.chartDiv}>
                <h2 className={classes.chartTitle} style={{color: isDark && "white"}}>Temperatura</h2>
                <ResponsiveContainer width="100%" height={250}>
                    <AreaChart margin={{ top: 20, right: 20, bottom: 10, left: 10 }} data={temp}>
                        <defs>
                            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#4ADEDE" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#1AA7EC" stopOpacity={0.9}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date"  type="number" domain={['dataMin', 'dataMax']} tickFormatter={formatXAxis} />
                        <YAxis dataKey="value" name="temperature" unit="°C" domain={['auto', 'auto']} />
                        <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                        <Legend />
                        <Area name={`Node ${ID}`} dataKey="value" unit="°C" fillOpacity={1} fill="url(#colorUv)"/>
                    </AreaChart>
                </ResponsiveContainer>
            </div>
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
            <div className={classes.chartDiv}>
                <h2 className={classes.chartTitle} style={{color: isDark && "white"}}>Humedad</h2>
                <ResponsiveContainer width="100%" height={250}>
                    <AreaChart data={humedad} margin={{top: 20, right: 20, bottom: 10, left: 10 ,}}>
                        <defs>
                            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#4ADEDE" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#1AA7EC" stopOpacity={0.9}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date"  type="number" domain={['dataMin', 'dataMax']} tickFormatter={formatXAxis} />
                        <YAxis dataKey="value" name="humedad" unit="%" domain={['auto', 'auto']}/>
                        <Tooltip />
                        <Area connectNulls type="monotone" dataKey="value"  unit="%" fillOpacity={1} fill="url(#colorUv)"/>
                    </AreaChart>
                </ResponsiveContainer>
            </div>
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
            <div className={classes.chartDiv}>
                <h2 className={classes.chartTitle} style={{color: isDark && "white"}}>Sonido</h2>
                <ResponsiveContainer width="100%" height={250}>
                    <AreaChart margin={{ top: 20, right: 20, bottom: 10, left: 10 }}  data={sonido}>
                        <defs>
                            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#4ADEDE" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#1AA7EC" stopOpacity={0.9}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date"  type="number" domain={['dataMin', 'dataMax']} tickFormatter={formatXAxis} />
                        <YAxis dataKey="value" name="Sonido" unit="db" domain={['auto', 'auto']} />
                        <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                        <Legend />
                        <Area name={`Node ${ID}`}  dataKey="value" unit="db" fillOpacity={1} fill="url(#colorUv)"/>
                    </AreaChart>
                </ResponsiveContainer>
            </div>
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
            <div className={classes.chartDiv}>
                <h2 className={classes.chartTitle} style={{color: isDark && "white"}}>CO2</h2>
                <ResponsiveContainer width="100%" height={250}>
                    <AreaChart data={CO2} margin={{top: 20, right: 20, bottom: 40, left: 10 ,}} name={`Node ${ID}`}>
                        <defs>
                            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#4ADEDE" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#1AA7EC" stopOpacity={0.9}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date"  type="number" domain={['dataMin', 'dataMax']} tickFormatter={formatXAxis} margin={{top: 30}}/>
                        <YAxis dataKey="value" name="CO2" unit="mg/L" domain={['auto', 'auto']} />
                        <Tooltip />
                        <Area connectNulls type="monotone" dataKey="value" fillOpacity={1} fill="url(#colorUv)"/>
                    </AreaChart>
                </ResponsiveContainer>
            </div>
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
            <div className={classes.chartDiv}>
                <h2 className={classes.chartTitle} style={{color: isDark && "white"}}>Luz</h2>
                <ResponsiveContainer width="100%" height={250}>
                    <AreaChart data={luz} margin={{top: 20, right: 20, bottom: 40, left: 10 ,}} name={`Node ${ID}`} >
                        <defs>
                            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#4ADEDE" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#1AA7EC" stopOpacity={0.9}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date"  type="number" domain={['dataMin', 'dataMax']} tickFormatter={formatXAxis} margin={{top: 30}}/>
                        <YAxis dataKey="value" name="Luz" unit="lm" domain={['auto', 'auto']} />
                        <Tooltip />
                        <Area connectNulls type="monotone" dataKey="value" fillOpacity={1} fill="url(#colorUv)"/>
                    </AreaChart>
                </ResponsiveContainer>
            </div>
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
            <div className={classes.chartDiv}>
                <h2 className={classes.chartTitle} style={{color: isDark && "white"}}>Contaminación</h2>
                <ResponsiveContainer width="100%" height={250}>
                    <ComposedChart data={dataCSHL} margin={{top: 20, right: 20, bottom: 40, left: 10 ,}} name={`Node ${ID}`} >
                        <defs>
                            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#4ADEDE" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#1AA7EC" stopOpacity={0.9}/>
                            </linearGradient>
                            <linearGradient id="colorUv1" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#7CE495" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#55C595" stopOpacity={0.9}/>
                            </linearGradient>
                            <linearGradient id="colorUv2" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#EE4392" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#FF9DDA" stopOpacity={0.9}/>
                            </linearGradient>
                            <linearGradient id="colorUv3" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#F04393" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#FBC34A" stopOpacity={0.9}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date"  type="number" domain={['dataMin', 'dataMax']} tickFormatter={formatXAxis} margin={{top: 30}}/>
                        
                        <YAxis yAxisId="uno"/>
                        <YAxis yAxisId="dos" hide={true}/>
                        <YAxis yAxisId="tres" hide={true}/>
                        <YAxis yAxisId="cuatro" hide={true}/>

                        <Tooltip />
                        <Legend/>
                        <Line yAxisId="uno" type='monotone' dataKey='CO2' stroke='url(#colorUv)' dot={false}/>
                        <Line yAxisId="dos" type='monotone' dataKey='sonido' stroke='url(#colorUv1)' dot={false}/>
                        <Line yAxisId="tres" type='monotone' dataKey='humedad' stroke='url(#colorUv2)' dot={false}/>
                        <Line yAxisId="cuatro" type='monotone' dataKey='luz' stroke='url(#colorUv3)' dot={false}/>
                    </ComposedChart>
                </ResponsiveContainer>
            </div>
          </Col>
        ) : (
          <Col sm className={classes.chartContainer}>
            <h2 className={classes.chartTitle} style={{color: isDark && "white"}}>Contaminación</h2>
            <div style={{textAlign: "center", minHeight: "150px"}}>
              <CircularProgress style={{color: isDark ? "white" : "black"}}/>
            </div>
          </Col>
        )}
      </Row>
    </Container>
    <Container className={classes.tableContainer}>
        <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="custom pagination table">
                <TableHead>
                <TableRow>
                    <TableCell>Fecha</TableCell>
                    <TableCell>ADC MQ</TableCell>
                    <TableCell>Concentración</TableCell>
                    <TableCell>Humedad</TableCell>
                    <TableCell>Lluvia</TableCell>
                    <TableCell>Luz</TableCell>
                    <TableCell>Sensación Térmica</TableCell>
                    <TableCell>Sonido</TableCell>
                    <TableCell>Temperatura</TableCell>
                    <TableCell>Velocidad Viento</TableCell>
                </TableRow>
                </TableHead>

                <TableBody>
                {(rowsPerPage > 0
                    ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    : rows
                ).map((row) => (
                    <TableRow key={row.date}>
                    <TableCell component="th" scope="row">
                        {row.date}
                    </TableCell>
                    <TableCell component="th" scope="row">
                        {row.adcmq}
                    </TableCell>
                    <TableCell component="th" scope="row">
                        {row.concentracion}
                    </TableCell>
                    <TableCell component="th" scope="row">
                        {row.humedad}
                    </TableCell>
                    <TableCell component="th" scope="row">
                        {row.lluvia}
                    </TableCell>
                    <TableCell component="th" scope="row">
                        {row.luz}
                    </TableCell>
                    <TableCell component="th" scope="row">
                        {row.sensaciontermica}
                    </TableCell>
                    <TableCell component="th" scope="row">
                        {row.sonido}
                    </TableCell>
                    <TableCell component="th" scope="row">
                        {row.temperatura}
                    </TableCell>
                    <TableCell component="th" scope="row">
                        {row.velocidad}
                    </TableCell>
                    </TableRow>
                ))}

                {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                    <TableCell colSpan={6} />
                    </TableRow>
                )}
                </TableBody>
                <TableFooter>
                <TableRow>
                    <TablePagination
                    rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                    colSpan={11}
                    count={rows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    SelectProps={{
                        inputProps: { 'aria-label': 'rows per page' },
                        native: true,
                    }}
                    onChangePage={handleChangePage}
                    onChangeRowsPerPage={handleChangeRowsPerPage}
                    ActionsComponent={TablePaginationActions}
                    />
                </TableRow>
                </TableFooter>
            </Table>
        </TableContainer>
    </Container>
    </div>
  );
};

export default Charts;