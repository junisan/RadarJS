import "../css/reset.css";
import "../css/main.css";
import Radar from './Radar/Radar';
import {getConfig} from './config';

//This file would be loaded asynchronously from a server
import geo from './geo.json';

//Simulate load geo information from server.
function fetchGeo(){
  //fetch(...)
  setTimeout(()=>{radar.setGeo(geo)}, Math.random() * 5000);
}

/**
 * Simple Radar
 *
 * Based on works of https://codepen.io/jvsanshu/
 */
const config = getConfig();
const element = document.getElementById('radar');
const radar = new Radar(element, config);
fetchGeo();
