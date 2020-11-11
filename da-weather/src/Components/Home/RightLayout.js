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
  const [markersStatus, setMarkersStatus] = useState(false);
  
  
  useEffect (()=>{
    const dataReference = firebase.database();

    let dataArry = [];
    //console.log("dataArry: ", dataArry);
    /* const fetchData = () =>{
      for (var i = 1; i <= 2; i++) {
        firebase.database().ref(i).on("value",resp=>{
            //console.log(snapshot.val().Temperatura);
            let datas = {
                Latitude: resp.val().GPS.Latitude,
                Longitude: resp.val().GPS.Longitude,
            };
            console.log("markers: ",datas);
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
    } */

    async function fetchData(){
      //console.log("fetching  data..");
      for (var i = 1; i <= 2; i++) {

        const locations = await firebase.database().ref(i)
        //console.log("locations",locations);
        locations.on("value", resp => {
          let datas = {
            Latitude: resp.val().GPS.Latitude,
            Longitude: resp.val().GPS.Longitude,
          };
          //console.log("datas",datas);
          dataArry.push(datas);
          setMarkersStatus(true);
        })
      }

      let markerLists = [];
      if(markersStatus){
        //console.log("dataArry 2: ", dataArry);
        dataArry.forEach((marker,index)=>{
          //console.log("marker: ", marker);
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
      
      
    }
    fetchData();
    

    

  },[markersStatus]);  
  
  
  
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
