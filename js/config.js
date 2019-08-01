let config = {
  "diameter": 220,
  "padding": 14,
  "rings": 4,
  "sweep": {
    "angle": 270,
    "size": 0.8,
    "speed": 1.2
  },
  "color": {
    "hueStart": 120,
    "hueEnd": 170,
    "saturation": 50,
    "lightness": 40,
    "lineWidth": 2
  },
};

export function getConfig (){
  if(!config.hasOwnProperty('radius'))
    config['radius'] = config.diameter/2;
  if(!config.color.hasOwnProperty('hueDiff'))
    config.color['hueDiff'] = config.color.hueEnd - config.color.hueStart;
  return config;
}
