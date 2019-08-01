import {dToR, rToD} from "./common";

/**
 * Shows the max distance in the bottom of the radar, based on geo.maxDistance
 * In the middle of X axis and 95% of full Y axis
 * @param {CanvasRenderingContext2D} ctx
 * @param {Object} config Configuration status
 * @param {Number} max Range of the radar
 */
export const renderRange = (ctx, config, max) => {
  ctx.fillStyle = '#003D00';
  ctx.textAlign = 'center';
  ctx.fillText(max + 'M', config.radius, config.diameter * 0.95);
};

/**
 * Render details like north triangle and targets points
 * @param {CanvasRenderingContext2D} ctx
 * @param {Object} config
 * @param {Object} geo
 */
export const renderDetails = (ctx, config, geo) => {
  renderNorth(ctx, config.radius, geo['me'].heading);
  renderMarkers(ctx, config, geo);
  ctx.restore();
};

/**
 * Render the north triangle: a triangle and a N based on heading of device.
 * @param {CanvasRenderingContext2D} ctx
 * @param {Number} radius Radius of radar circle
 * @param {Number} heading Angle in degrees of difference between the top of the vertical axis and the true north.
 * @param {Boolean} restoreContext If true given, restore the original context of ctx
 */
const renderNorth = (ctx, radius, heading, restoreContext = false) => {

  //Rotate scene heading-180º to print N and restore context
  ctx.save();
  ctx.translate(radius, radius);
  ctx.rotate(dToR(heading - 180));
  ctx.fillStyle = '#009900';
  ctx.textAlign = 'center';
  ctx.fillText('N', 0, radius*0.88);
  ctx.restore();

  //Rotate scene heading-90 to print the triangle and NO restore context to print the targets point
  ctx.save();
  ctx.translate(radius, radius);
  ctx.rotate(dToR(heading - 90));
  ctx.beginPath();
  ctx.moveTo(radius,0);
  ctx.lineTo(radius-10,-5);
  ctx.lineTo(radius-10,+5);
  ctx.closePath();
  ctx.fillStyle = '#009900';
  ctx.fill();
  if(restoreContext) ctx.restore();
};

/**
 * Render the points of the targets on the radar
 * @param {CanvasRenderingContext2D} ctx
 * @param {Object} config
 * @param {Object} geo
 */
const renderMarkers = (ctx, config, geo)=>{
  geo['they'].forEach(item => {
    const point = _coordinatesToPoints(geo.me, item, config.radius, geo.maxDistance);
    if(point !== null) _renderMarker(ctx, point.x, point.y, point.angle, config.sweep.angle);
  });
};


/**
 * Returns the distance in meters between two GPS coordinates
 * @param {Number} lat1 Latitude of user position
 * @param {Number} lon1 Longitude of user position
 * @param {Number} lat2 Latitude of target position
 * @param {Number} lon2 Longitude of target position
 * @return {Number}
 * @private
 */
const _haversineDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371e3; // meters

  const x1 = lat2-lat1;
  const dLat = dToR(x1);
  const x2 = lon2-lon1;
  const dLon = dToR(x2);
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(dToR(lat1)) * Math.cos(dToR(lat2)) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

/**
 * From two coordinates (user and target), it returns the distance that separates them,
 * the XY point where to paint the target inside the radar and the angle it forms with the north.
 * If the target is further than the maximum distance allowed, it will return null.
 *
 * @param {Object} me Data which contains geo information about the current user
 * @param {Object} marker Data which contains geo information about one target
 * @param {Number} radius Radius of radar circle (to get the XY point based on distance and circle radar)
 * @param {Number} maxDistance If this argument is given and if distance is more than this, function will stop
 * @return {Object}
 * @private
 */
const _coordinatesToPoints = (me, marker, radius, maxDistance) => {
  //Absolute distance in X and Y axis
  let distanceX = _haversineDistance(me['lat'], me['lng'], marker['lat'], me['lng']);
  let distanceY = _haversineDistance(me['lat'], me['lng'], me['lat'], marker['lng']);
  if(distanceX > maxDistance || distanceY > maxDistance) return null;
  let distance = _haversineDistance(me['lat'], me['lng'], marker['lat'], marker['lng']);

  //Absolute distance with sign (+ for north and west; - for east and south)
  distanceX = (marker['lat'] - me['lat'] > 0) ? distanceX : -1 * distanceX;
  distanceY = (marker['lng'] - me['lng'] > 0) ? distanceY : -1 * distanceY;

  //Rule of three between maximum distance and radar radius
  const maxRadiusAvailable = radius*0.72;
  const pointX = distanceX * maxRadiusAvailable / maxDistance;
  const pointY = distanceY * maxRadiusAvailable / maxDistance;

  //Calculate angle in degrees from North and this point
  let angle = Math.atan2(pointY, pointX) * 180 / Math.PI;
  angle = (angle+360)%360;

  return {x: pointX, y: pointY, angle: angle, distance: distance, distance_x: distanceX, distance_y: distanceY};
};

/**
 * Render the XY point on the radar if the sweep line is above the point (based on the angle).
 * We will only paint the point in the range of angle difference [0,180].
 * @param {CanvasRenderingContext2D} ctx
 * @param {Number} x
 * @param {Number} y
 * @param {Number} angle
 * @param {Number} sweepAngle
 * @private
 */
const _renderMarker = (ctx, x, y, angle, sweepAngle) => {
  //The intensity depends on the angle formed with sweep. The angle provided is indicated with respect to the north.
  //The sweep will be 270 degrees when it's north. So we add 90º to make 0º mean to be north.
  const currentSweep = (sweepAngle+90)%360;

  //Now that the two angles are oriented to the same axis, we calculate the angle that separates both straight lines.
  //The function atan2(sin(x-y),cos(x-y)) returns the delta angle with sign in range [-179, 180].
  //Positive to the right and negative to the left.
  let diffAngle = dToR(currentSweep)-dToR(angle);
  diffAngle = Math.atan2(Math.sin(diffAngle), Math.cos(diffAngle));
  diffAngle = diffAngle * 180 / Math.PI;

  if(diffAngle > 0){
    const intensity = 10-(10*diffAngle/180);
    ctx.beginPath();
    ctx.arc(x, y, intensity, 0, 2*Math.PI);
    ctx.fillStyle = 'red';
    ctx.fill();
  }
};
