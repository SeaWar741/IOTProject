import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {Container,Row,Col } from 'react-bootstrap'

import MapGL, { GeolocateControl,NavigationControl  } from '@urbica/react-map-gl';

import 'mapbox-gl/dist/mapbox-gl.css';
import "bootstrap/dist/css/bootstrap.min.css";

const useStyles = makeStyles((theme) => ({
  Main:{
    backgroundColor:"#E3E5E3",
    width:"100%",
    minHeight:"100vh",
    color:"white"
  }
}));



const RightLayout = ({ classes }) => {
  classes = useStyles();

  const [viewport, setViewport] = useState({
    latitude: 25.6714,
    longitude: -100.309,
    zoom: 11
  });

  return (
    <div className={classes.Main}>
        <MapGL
            style={{ width: '100%', minHeight: '100vh' }}
            mapStyle='mapbox://styles/mapbox/light-v9'
            accessToken="pk.eyJ1Ijoic2Vhd2FyNzQxIiwiYSI6ImNraGE2anR4MDB6b3MycW80NzRwZGVodDYifQ.Ev-c28Y5TOk2-KGu094kSw"
            latitude={viewport.latitude}
            longitude={viewport.longitude}
            zoom={viewport.zoom}
            onViewportChange={setViewport}
        >
            <GeolocateControl position='top-right' />
            <NavigationControl showCompass showZoom position='top-right'/>
        </MapGL>
        
    </div>
  );
};

export default RightLayout;
