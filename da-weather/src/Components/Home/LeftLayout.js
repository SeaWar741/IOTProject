import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {Image,Card } from 'react-bootstrap'
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import {LocationMarker} from '@styled-icons/heroicons-solid/LocationMarker';
import {Calendar} from '@styled-icons/boxicons-regular/Calendar';
import axios from "axios";
import firebase from '../../Utils/Firebase';

import "bootstrap/dist/css/bootstrap.min.css";

const useStyles = makeStyles((theme) => ({
  Main:{
    backgroundColor:"#264057",
    backgroundImage:"url('./img/background/Good.jpg')",
    
    backgroundRepeat:"no-repeat",
    backgroundPosition:"center",

    width:"100%",
    minHeight:"100vh",
    maxHeight:"100vh",
    color:"white"
  },
  imageTopContainer:{
    display: "block",
    marginLeft: "auto",
    marginRight: "auto",
    textAlign:"center"
  },
  imageTop:{
    maxHeight:"100px",
  },
  iconWeather:{
    minHeight:"110px"
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: "white",
    /* Parent background + Gaussian blur */
    backdropFilter: "blur(10px)",
    webkitBackdropFilter: "blur(10px)",
  
    /* Exclusion blend */
    backgroundBlendMode: "exclusion",
  
    /* Color/tint overlay + Opacity */
    background: "rgba(255, 255, 255, .6)",
  
    /* Tiled noise texture */
    backgroundImage: "url(data:image/png;base64,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)",
  },
  cardContainer:{
      padding:"1rem"
  },
  cardBody:{
      paddingTop:"1rem",
  },
  cardTitle:{
      fontWeight:"600",
      fontSize:"4rem !important"
  },
  cardTitleMini:{
    fontWeight:"600",
    fontSize:"1.2rem !important"
  },
  relativeTContainer:{
    background:"white",
    borderRadius:"100px",
  },
  relativeT:{
      color:"black",
      fontWeight:"500",
      paddingTop:"10px",
      paddingBottom:"10px",
  },
  headerText:{
      fontWeight:"bold",
      fontSize:"18px"
  }
}));


const LeftLayout = ({ classes }) => {
  classes = useStyles();

  //const data = useData();
  
  const [data,setData] = useState({});
  const [icon,setIcon] = useState("./img/iconsWeather/MostlySunny.png");
  const [background,setBackground] = useState("./img/background/Good.jpg");
  const [cityLocation, setCityLocation] = useState("Monterrey, Mx");
  
  
  useEffect (()=>{
    const dataReference = firebase.database().ref(1);
    
    const fetchData = async()=>{
        firebase.database().ref(1).on("value",resp=>{
            //console.log(snapshot.val().Temperatura);
            let datas = {
                ADC_MQ: resp.val().ADC_MQ,
                Concentracion: resp.val().Concentracion,
                Humedad: resp.val().Humedad,
                Lluvia:resp.val().Lluvia,
                Luz:resp.val().Luz,
                Potenciometro:resp.val().Potenciometro,
                Rs:resp.val().Rs,
                SensorID: 1,
                Sonido:resp.val().Sonido,
                Temperatura:resp.val().Temperatura,
                X:resp.val().X,
                Y:resp.val().Y,
                Z:resp.val().Z,
                Latitude: resp.val().GPS.Latitude,
                Longitude: resp.val().GPS.Longitude,
            };

            const hours = new Date().getHours();
            const isDayTime = hours > 6 && hours < 20;

            //const fetchUrl = "https://maps.googleapis.com/maps/api/geocode/json?latlng="+datas.Latitude+","+datas.Longitude+"&key="+process.env.REACT_APP_APIKEY_GEOCODING;
            //const newRequest = await axios.get(fetchUrl);
            //console.log(newRequest);
            //setCityLocation(newRequest.data.results);
            

            if(datas.Temperatura >= 25 && datas.Luz <= 5 && datas.Humedad >=40){
                setIcon("./img/iconsWeather/Haze.png");
                isDayTime ? setBackground("./img/background/Cloudy.jpg") : setBackground("./img/background/Night.jpg");
            }
            else if(datas.Temperatura <= 0 && datas.Humedad >=40 ){
                setIcon("./img/iconsWeather/Blizzard.png");
                isDayTime ? setBackground("./img/background/Cold.jpg") : setBackground("./img/background/Night.jpg");
            }
            else if(datas.Lluvia === "Raining" && datas.Humedad >= 80 && datas.Lluvia === "Raining"){
                setIcon("./img/iconsWeather/Drizzle.png");
                isDayTime ? setBackground("./img/background/Rainy.jpg") : setBackground("./img/background/Night.jpg");
            }
            else if(datas.Luz <= 5 && datas.Humedad >=70 && datas.Lluvia === "Not Raining"){
                setIcon("./img/iconsWeather/Fog.png");
                isDayTime ? setBackground("./img/background/Rainy.jpg") : setBackground("./img/background/Night.jpg");
            }
            else if(datas.Lluvia === "Flood" && datas.X >= 10 && datas.Sonido >=10){
                setIcon("./img/iconsWeather/SevereThunderstorm.png");
                isDayTime ? setBackground("./img/background/ThunderStorm.jpg") : setBackground("./img/background/Night.jpg");
            }
            else if(datas.Lluvia === "Flood" && datas.X >= 10 && datas.Sonido >=10){
                setIcon("./img/iconsWeather/HeavyRain.png");
                isDayTime ? setBackground("./img/background/TunderStorm.jpg") : setBackground("./img/background/Night.jpg");
            }
            else if(datas.Temperatura >=25 && datas.Luz >= 5){
                setIcon("./img/iconsWeather/MostlySunny.png");
                isDayTime ? setBackground("./img/background/Sunny.jpg") : setBackground("./img/background/Night.jpg");
            }
            else if(datas.Luz >=5 && datas.Temperatura >= 20 && datas.Temperatura <=25){
                setIcon("./img/iconsWeather/MostlySunny.png");
                isDayTime ? setBackground("./img/background/Good.jpg") : setBackground("./img/background/Night.jpg");
            }
            else if(datas.Lluvia === "Raining"){
                setIcon("./img/iconsWeather/Rain.png");
                isDayTime ? setBackground("./img/background/Rainy.jpg") : setBackground("./img/background/Night.jpg");
            }
            else{
                setIcon("./img/iconsWeather/PartyCloudy.png");
                isDayTime ? setBackground("./img/background/Cloudy.jpg") : setBackground("./img/background/Night.jpg");
            }
            
            setData(datas);
            

        });
    }
    fetchData();
  },[]);  

  

  //Temporal
  let specialSensor =20;
  let relativeTemperature = data.Temperatura+2;
  let location = "Monterrey, Mx";

  var meses = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
  var diasSemana = ["Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado"];
  var f=new Date();
  let currentDate = diasSemana[f.getDay()] + ", " + f.getDate() + " de " + meses[f.getMonth()] + " de " + f.getFullYear();
  
  console.log("url('"+icon+"')");
    
  return (
        <div className={classes.Main}   style={{backgroundImage :"url('"+background+"')"}}>
            <div className={classes.imageTopContainer}>
                <Image src="./img/DaWeather.png" className={classes.imageTop} fluid/>
            </div>
            <div className={classes.cardContainer}>
                <Grid container spacing={3}>
                    <Grid item xs={6}>
                        <Paper className={classes.paper}>
                            <p className={classes.headerText}><LocationMarker size="40"/> {cityLocation}</p>
                        </Paper>
                    </Grid>
                    <Grid item xs={6}>
                        <Paper className={classes.paper}>
                            <p className={classes.headerText}><Calendar size="40"/> {currentDate}</p>
                        </Paper>
                    </Grid>
                    <Grid item xs={6}>
                        <Paper className={classes.paper}>
                            <Image src={icon} className={classes.iconWeather} fluid/>
                            <Card.Body className={classes.cardBody}>
                                <Card.Title className={classes.cardTitle}>{data.Temperatura}°C</Card.Title>
                                <div className={classes.relativeTContainer}>
                                    <Card.Text className={classes.relativeT}>
                                        Sensación térmica: {relativeTemperature}°C
                                    </Card.Text>
                                </div>
                            </Card.Body>
                        </Paper>
                    </Grid>
                    <Grid item xs={6}>
                        <Paper className={classes.paper}>
                            <Image src="./img/iconsWeather/generic.png" className={classes.iconWeather} fluid/>
                            <Card.Body className={classes.cardBody}>
                                <Card.Title className={classes.cardTitle}>{specialSensor} Autos</Card.Title>
                                <div className={classes.relativeTContainer}>
                                    <Card.Text className={classes.relativeT}>
                                        ID Estación: {data.SensorID}
                                    </Card.Text>
                                </div>
                            </Card.Body>
                        </Paper>
                    </Grid>
                    <Grid item xs={3}>
                        <Paper className={classes.paper}>
                            <Card.Body className={classes.cardBody}>
                                <Card.Title className={classes.cardTitleMini}>Humedad</Card.Title>
                                <Card.Text>
                                    {data.Humedad}
                                </Card.Text>
                            </Card.Body>
                        </Paper>
                    </Grid>
                    <Grid item xs={3}>
                        <Paper className={classes.paper}>
                            <Card.Body className={classes.cardBody}>
                                <Card.Title className={classes.cardTitleMini}>Luz</Card.Title>
                                <Card.Text>
                                    {data.Luz}
                                </Card.Text>
                            </Card.Body>
                        </Paper>
                    </Grid>
                    <Grid item xs={3}>
                        <Paper className={classes.paper}>
                            <Card.Body className={classes.cardBody}>
                                <Card.Title className={classes.cardTitleMini}>Sonido</Card.Title>
                                <Card.Text>
                                    {data.Sonido}
                                </Card.Text>
                            </Card.Body>
                        </Paper>
                    </Grid>
                    <Grid item xs={3}>
                        <Paper className={classes.paper}>
                            <Card.Body className={classes.cardBody}>
                                <Card.Title className={classes.cardTitleMini}>Temperatura</Card.Title>
                                <Card.Text>
                                    {data.Temperatura}
                                </Card.Text>
                            </Card.Body>
                        </Paper>
                    </Grid>
                    <Grid item xs={3}>
                        <Paper className={classes.paper}>
                            <Card.Body className={classes.cardBody}>
                                <Card.Title className={classes.cardTitleMini}>CO2</Card.Title>
                                <Card.Text>
                                    {data.Concentracion}
                                </Card.Text>
                            </Card.Body>
                        </Paper>
                    </Grid>
                    <Grid item xs={3}>
                        <Paper className={classes.paper}>
                            <Card.Body className={classes.cardBody}>
                                <Card.Title className={classes.cardTitleMini}>Lluvia</Card.Title>
                                <Card.Text>
                                    {data.Lluvia}
                                </Card.Text>
                            </Card.Body>
                        </Paper>
                    </Grid>
                    <Grid item xs={3}>
                        <Paper className={classes.paper}>
                            <Card.Body className={classes.cardBody}>
                                <Card.Title className={classes.cardTitleMini}>Viento</Card.Title>
                                <Card.Text>
                                    {data.X}
                                </Card.Text>
                            </Card.Body>
                        </Paper>
                    </Grid>
                    <Grid item xs={3}>
                        <Paper className={classes.paper}>
                            <Card.Body className={classes.cardBody}>
                                <Card.Title className={classes.cardTitleMini}>RS</Card.Title>
                                <Card.Text>
                                    {data.Rs}
                                </Card.Text>
                            </Card.Body>
                        </Paper>
                    </Grid>
                </Grid>
            </div>
        </div>
  );
};

export default LeftLayout;
