import React, { useState,useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {Image } from 'react-bootstrap'

import MapGL, { GeolocateControl,NavigationControl,Marker  } from '@urbica/react-map-gl';
import firebase from '../../Utils/Firebase';

import 'mapbox-gl/dist/mapbox-gl.css';
import "bootstrap/dist/css/bootstrap.min.css";

const useStyles = makeStyles((theme) => ({
  Main:{
    backgroundColor:"#E3E5E3",
    width:"100%",
    minHeight:"100vh",
    color:"white"
  },
  imageMarker:{
      height:"16vh"
  }
}));


const RightLayout = ({ classes }) => {
  classes = useStyles();

  const [data,setData] = useState();
  const [markerList,setMarkerList] = useState();
  
  
  useEffect (()=>{
    const dataReference = firebase.database();

    let dataArry = [];

    const fetchData = async()=>{
      for (var i = 1; i <= 2; i++) {
        firebase.database().ref(i).on("value",resp=>{
            //console.log(snapshot.val().Temperatura);
            let datas = {
                Latitude: resp.val().GPS.Latitude,
                Longitude: resp.val().GPS.Longitude,
            };
            dataArry.push(datas);
        });
      }
      
      let markerLists = [];
      dataArry.forEach((marker,index)=>{
        markerLists.push( 
          <Marker key={index+1}
            longitude={marker.Longitude}
            latitude={marker.Latitude}
            onClick={onMarkerClick}
          >
            <Image src="./img/mapPointer.png" fluid className={classes.imageMarker}/>
          </Marker>
        )
      })
      setMarkerList(markerLists);
    }

    fetchData();

  },[]);  
  
  
  
  const [viewport, setViewport] = useState({
    latitude: 25.6714,
    longitude: -100.309,
    zoom: 10
  });

  const [position, setPosition] = useState({
    longitude: -100.286697388,
    latitude: 25.63986969
  });
  
  const onMarkerClick = (event) => {
    alert('You clicked on a station');
    
    event.stopPropagation();
  };
  

  return (
    <div className={classes.Main}>
        <MapGL
            style={{ width: '100%', minHeight: '100vh' }}
            mapStyle='mapbox://styles/mapbox/light-v9'
            accessToken= {process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}
            latitude={viewport.latitude}
            longitude={viewport.longitude}
            zoom={viewport.zoom}
            onViewportChange={setViewport}
        >
            <GeolocateControl position='top-right' />
            <NavigationControl showCompass showZoom position='top-right'/>
            {markerList}
        </MapGL>
    </div>
  );
};

export default RightLayout;
