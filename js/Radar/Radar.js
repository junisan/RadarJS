import "../vendor/sketch";
import {renderRings, renderGrid, renderSweep} from './common';
import {renderRange, renderDetails, renderNorth} from "./customRadar";

export default class Radar{

  init(element,config){
    element.style.marginLeft = element.style.marginTop = -config.diameter / 2 - config.padding + 'px';
    const ctx = new Sketch.create({
      container: element,
      fullscreen: false,
      width: config.diameter,
      height: config.diameter
    });

    const gradient = ctx.createLinearGradient(config.radius,0,0,0);
    gradient.addColorStop(0, 'hsla( ' + config.color.hueStart + ', ' + config.color.saturation + '%, ' + config.color.lightness + '%, 1 )');
    gradient.addColorStop(1, 'hsla( ' + config.color.hueEnd + ', ' + config.color.saturation + '%, ' + config.color.lightness + '%, 0.1 )');

    config['gradient'] = gradient;

    ctx.clear = function () {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.fillStyle = 'hsla( 0, 0%, 0%, 0.1 )';
      ctx.fillRect(0, 0, config.diameter, config.diameter);
    };

    ctx.update = function () {
      config.sweep.angle += (config.sweep.speed%360);
    };

    ctx.draw = ()=> this.draw(ctx, config);

    this._ctx = ctx;
    this._config = config;
  }

  constructor(element, config){
    this.init(element, config);
  }

  draw(ctx, config){
    ctx.globalCompositeOperation = 'lighten';
    renderRings(ctx, config);
    renderGrid(ctx, config);
    renderSweep(ctx, config);

    ctx.globalCompositeOperation = 'lighter';
    if(this.hasOwnProperty('_geo')){
      renderRange(ctx, config, this._geo.maxDistance);
      renderDetails(ctx, config, this._geo);
    }
  }

  setGeo(geo){
    this._geo = geo;
  }

};
