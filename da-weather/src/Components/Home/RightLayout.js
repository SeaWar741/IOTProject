import React, { useState,useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {Image } from 'react-bootstrap'

import MapGL, { GeolocateControl,NavigationControl,Marker,Popup,Source,Layer   } from '@urbica/react-map-gl';
import { randomPoint } from '@turf/random';
import firebase from '../../Utils/Firebase';

import 'mapbox-gl/dist/mapbox-gl.css';
import "bootstrap/dist/css/bootstrap.min.css";
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


  /** 
   *  
      "type" : "Feature", 
      "properties" : {  
        "capacity" : "10", 
        "type" : "U-Rack",
        "mount" : "Surface"
      }, 
      "geometry" : { 
        "type" : "Point", 
        "coordinates" : [ -71.073283, 42.417500 ] 
      }
  */
  
  useEffect (()=>{
    const dataReference = firebase.database();
    console.log("pass");
    let dataArry = [];
    async function fetchData(){
    
      for (var i = 3; i <= 4; i++) {

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

      //let markerLists = [];
      //let points = [];
      if(markersStatus){
        console.log("dataArry: ", dataArry);
        dataArry.forEach((marker,index)=>{
          console.log("marker: ", marker);
          
          /* var randomPoints = {
            type : "Feature", 
            properties : {  
              ID : marker.ID,
            }, 
            geometry : { 
              type : "Point", 
              coordinates : [ marker.Latitude, marker.Longitude] 
            }
          }; */
          /* var newPoint1 = {
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
          console.log("103", newPoint1);
          const newFeatures = points.features.concat(newPoint1.features);
          console.log("set features...", newFeatures);
          const newPoints = { ...points, features: newFeatures };
          console.log("108",newPoints);
          setPoints(newPoints);
          console.log("112",points); */
          /* console.log("91",randomPoints);
          console.log("92",points);
          const newFeatures = points.features.concat(randomPoints.features);
          console.log("set features..", newFeatures);
          const newPoints = { ...points, features: newFeatures };

          setPoints(newPoints);
          console.log("set points..");
          console.log("98",newPoints); */
          /* markerLists.push( 
            <Marker key={index+1}
              longitude={marker.Longitude}
              latitude={marker.Latitude}
              onClick={onMarkerClick}
            >
              <Image src="./img/mapPointer.png" fluid className={classes.imageMarker}/>
            </Marker>
          ) */
        })
        //setMarkerList(markerLists);
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
    console.log("103", newPoint1);
    const newFeatures = points.features.concat(newPoint1.features);
    console.log("set features...", newFeatures);
    const newPoints = { ...points, features: newFeatures };
    console.log("108",newPoints);
    setPoints(newPoints);
    console.log("112",points);
  }

  const markerOnClick = (event) => {
    //alert(event.children);
    //console.log({ longitude: lngLat.lng, latitude: lngLat.lat });
    console.log(event.children);
    
    //event.stopPropagation();
  };

  return (
    <div className={classes.Main}>
      {/* <button onClick={addPoints}>Add points</button> */}
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
            <Source id='points' type='geojson' data={points} />
            <Layer
              id='points'
              type='circle'
              source='points'
              paint={{
                'circle-radius': 6,
                'circle-color': '#1978c8'
              }}
              onClick={markerOnClick}
            />
        </MapGL>
    </div>
  );
};

export default RightLayout;
