import React, { useState,useEffect} from "react";
import { makeStyles } from "@material-ui/core/styles";


import MapGL, { GeolocateControl,NavigationControl,Marker,Image ,Source,Layer,TrafficControl } from '@urbica/react-map-gl';
import { randomPoint } from '@turf/random';
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
  const [{ID}, dispatch] = useDataLayerValue();
  

  classes = useStyles();

  const [data,setData] = useState();
  const [markerList,setMarkerList] = useState();
  const [markersStatus, setMarkersStatus] = useState(false);
  const [points, setPoints] = useState({
    type : "FeatureCollection",
    features : []
  });
  
  const [showTraffic, setShowTraffic] = useState(true);
  const [showTrafficButton, setShowTrafficButton] = useState(true);
  const [themeMap,setThemeMap] = useState('mapbox://styles/mapbox/light-v9')
  const [hourStatus,setHourEnabled] = useState(false)

  const toggleTraffic = () => setShowTraffic(showTraffic);
  const toggleButton = () => setShowTrafficButton(showTrafficButton);


  useEffect (()=>{
    const dataReference = firebase.database();
    //console.log("pass");
    let dataArry = [];
    async function fetchData(){
    
      for (var i = 1; i <= 4; i++) {

        const locations = await firebase.database().ref(i)
        //console.log("locations",locations);
        locations.on("value", resp => {
          let datas = {
            Latitude: resp.val().GPS.Latitude,
            Longitude: resp.val().GPS.Longitude,
            ID: resp.val().SensorID
          };
          //console.log("datas",datas);
          dataArry.push(datas);
          addPoint(datas);
          setMarkersStatus(true);
        })
      }

      let markerLists = [];
      //let points = [];
      if(markersStatus){
        //console.log("dataArry: ", dataArry);
        dataArry.forEach((marker,index)=>{
          //console.log("marker: ", marker);


          markerLists.push( 
            <Marker key={index+1}
              longitude={marker.Longitude}
              latitude={marker.Latitude}
            >
              <Image src="./img/mapPointer.png" fluid className={classes.imageMarker}/>
            </Marker>
          )
        })
        setMarkerList(markerLists);
      }
      
      
    }
    fetchData();
  },[markersStatus]);  
  
  const [viewport, setViewport] = useState({
    latitude: 25.6714,
    longitude: -100.309,
    zoom: 10
  });

  const onMarkerClick = (event) => {
    //alert(event.children);
    //console.log({ longitude: lngLat.lng, latitude: lngLat.lat });
    console.log(event);
    
    event.stopPropagation();
  };
  
  const onDragEnd = (lngLat) => {
    //setPosition({ longitude: lngLat.lng, latitude: lngLat.lat });
    console.log({ longitude: lngLat.lng, latitude: lngLat.lat });
  };
  
  const addPoints = () => {
    const randomPoints = randomPoint(1);
    console.log("Punto generado");
    console.log(randomPoints);
    const newFeatures = points.features.concat(randomPoints.features);
    const newPoints = { ...points, features: newFeatures };
    console.log(newPoints);
    setPoints(newPoints);
  };

  const addPoint = (marker) => {
    var newPoint1 = {
      type : "FeatureCollection",
      features: {
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [marker.Longitude, marker.Latitude]
          },
          properties: {
            ID: marker.ID
          }
      }
    };
    //console.log("103", newPoint1);
    const newFeatures = points.features.concat(newPoint1.features);
    //console.log("set features...", newFeatures);
    const newPoints = { ...points, features: newFeatures };
    //console.log("108",newPoints);
    setPoints(newPoints);
    //console.log("112",points);
  }

  const markerOnClick = (event) => {
    //console.log(event.features[0].properties.ID);
    //setSelectedStation(event.features[0].properties.ID);
    dispatch({
      type:"SET_ID",
      ID:event.features[0].properties.ID
    });
  };

  const hours = new Date().getHours();
  const isDayTime = hours > 6 && hours < 20;

  useEffect(()=>{
    if(isDayTime){
      setThemeMap('mapbox://styles/mapbox/light-v9');
    }
    else{
      setThemeMap('mapbox://styles/mapbox/dark-v9');
    }
  },[ID,hourStatus]);

  console.log(points);

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
            <Source id='points' type='geojson' data={points} />
            <Image id='my-image' image={"./img/mapPointer.png"} className={classes.mapPoint}/>
            <Layer
              id='points'
              type='circle'
              source='points'
              paint={{
                'circle-radius': 6,
                'circle-color': '#1978c8'
              }}
              /*
              id='points'
              type='symbol'
              source='points'
              layout={{
                'icon-image': 'my-image',
                'icon-size': 0.25
              }}
              */
              onClick={markerOnClick}
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
            <TrafficControl showTraffic={showTraffic} showTrafficButton={showTrafficButton} />
        </MapGL>
    </div>
  );
};

export default RightLayout;
