import React, { useState,useEffect} from "react";
import { makeStyles } from "@material-ui/core/styles";


import MapGL, { GeolocateControl,NavigationControl,Image ,Source,Layer,TrafficControl } from '@urbica/react-map-gl';
import firebase from '../../Utils/Firebase';

import 'mapbox-gl/dist/mapbox-gl.css';
import "bootstrap/dist/css/bootstrap.min.css";
import '@mapbox/mapbox-gl-traffic/mapbox-gl-traffic.css';

import { useDataLayerValue } from '../../DataLayer';


const useStyles = makeStyles((theme) => ({
  Main:{
    backgroundColor:"#E3E5E3",
    width:"100%",
    minHeight:"100vh",
    color:"white"
  },
  imageMarker:{
      height:"16vh"
  },
  mapPoint:{
    cursor: "pointer"
  }
}));


const RightLayout = ({ classes }) => {
  classes = useStyles();
  const [{ID}, dispatch] = useDataLayerValue();
  
  const [points, setPoints] = useState({
    type : "FeatureCollection",
    features : []
  });
  
  const [showTraffic, setShowTraffic] = useState(false);
  const [showTrafficButton, setShowTrafficButton] = useState(true);
  const [themeMap,setThemeMap] = useState('mapbox://styles/mapbox/light-v9')


  //const toggleTraffic = () => setShowTraffic(showTraffic);
  //const toggleButton = () => setShowTrafficButton(showTrafficButton);

  const hours = new Date().getHours();
  const isDayTime = hours > 6 && hours < 20;

  const [viewport, setViewport] = useState({
    latitude: 25.6714,
    longitude: -100.309,
    zoom: 10.5
  });

  const markerOnClick = (event) => {
    //console.log(event.features[0].properties.ID);
    //setSelectedStation(event.features[0].properties.ID);
    dispatch({
      type:"SET_ID",
      ID:event.features[0].properties.ID
    });
  };

    
  useEffect(async ()=>{
    let stationPoints = {
      type : "FeatureCollection",
      features : []
    };

    const query = await firebase.database().ref("Nodes").orderByKey().once("value").then(function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
          // keys
          //var key = childSnapshot.key;
          // childData will be the actual contents of the child
          var childData = childSnapshot.val();
          //console.log(childData);
          var newPoint1 = {
            type : "FeatureCollection",
            features: {
                type: "Feature",
                geometry: {
                  type: "Point",
                  coordinates: [childData.GPS.Longitude, childData.GPS.Latitude]
                },
                properties: {
                  ID: childData.SensorID
                }
            }
          };
          const newFeatures = stationPoints.features.concat(newPoint1.features);
          const newstationPoints = { ...stationPoints, features: newFeatures };
          stationPoints = newstationPoints;
          setPoints(stationPoints);
      });
    });

    if(isDayTime){
      setThemeMap('mapbox://styles/mapbox/light-v9');
    }
    else{
      setThemeMap('mapbox://styles/mapbox/dark-v9');
    }

  },[ID])


  return (
    <div className={classes.Main}>
        <MapGL
            style={{ width: '100%', minHeight: '100vh' }}
            mapStyle={themeMap}
            accessToken= {process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}
            latitude={viewport.latitude}
            longitude={viewport.longitude}
            zoom={viewport.zoom}
            onViewportChange={setViewport}
            
        >
            <GeolocateControl position='top-right' />
            <NavigationControl showCompass showZoom position='top-right' />
            <TrafficControl showTraffic={showTraffic} showTrafficButton={showTrafficButton} />
            <Source id='points' type='geojson' data={points} />
            <Image id='my-image' image={"./img/mapPointer.png"} className={classes.mapPoint} />
            <Layer
              id='points'
              type='circle'
              source='points'
              paint={{
                'circle-radius': 6,
                'circle-color': '#1978c8'
              }}
            />
            <Layer
              id='pointss'
              type='symbol'
              source='points'
              layout={{
                'icon-image': 'my-image',
                'icon-size': 0.25
              }}
              onClick={markerOnClick}
            />
        </MapGL>
    </div>
  );
};

export default RightLayout;