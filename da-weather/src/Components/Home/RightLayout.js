import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {Image } from 'react-bootstrap'

import MapGL, { GeolocateControl,NavigationControl,Marker  } from '@urbica/react-map-gl';


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

  const [viewport, setViewport] = useState({
    latitude: 25.6714,
    longitude: -100.309,
    zoom: 11
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
            <Marker
                longitude={position.longitude}
                latitude={position.latitude}
                onClick={onMarkerClick}
            >
                <Image src="./img/mapPointer.png" fluid className={classes.imageMarker}/>
            </Marker>
        </MapGL>
        
    </div>
  );
};

export default RightLayout;
