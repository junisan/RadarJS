/**
 * Render rings from center
 * @param {CanvasRenderingContext2D} ctx Canvas context
 * @param {Object} config Configuration status
 */
export const renderRings = (ctx, config)=>{
  for(let i = 0; i < config.rings; i++){
    ctx.beginPath();
    ctx.arc(config.radius, config.radius,
      (config.radius-config.color.lineWidth/2)/config.rings * (i+1),
      0, Math.PI*2, false);
    ctx.strokeStyle = 'hsla(' + (config.color.hueEnd - i * (config.color.hueDiff / config.rings)) + ', ' + config.color.saturation + '%, ' + config.color.lightness + '%, 0.1)';
    ctx.lineWidth = config.color.lineWidth;
    ctx.stroke();
  }
};

/**
 * Render cross in the middle of radar
 * @param {CanvasRenderingContext2D} ctx Canvas context
 * @param {Object} config Configuration status
 */
export const renderGrid = (ctx, config) => {
  const color = config.color; const avoidPHPStormWarning = color.lineWidth;
  ctx.beginPath();
  ctx.moveTo(config.radius - color.lineWidth / 2, avoidPHPStormWarning);
  ctx.lineTo(config.radius - color.lineWidth / 2, config.diameter - color.lineWidth);
  ctx.moveTo(color.lineWidth, config.radius - color.lineWidth / 2);
  ctx.lineTo(config.diameter - color.lineWidth, config.radius - color.lineWidth / 2);
  ctx.strokeStyle = 'hsla( ' + (color.hueStart + color.hueEnd) / 2 + ', ' + color.saturation + '%, ' + color.lightness + '%, .03 )';
  ctx.stroke();
};

/**
 * Render the sweep based on the angle, translating and rotating canvas.
 * @param {CanvasRenderingContext2D} ctx
 * @param {Object} config Configuration status
 */
export const renderSweep = (ctx, config) => {
  ctx.save();
  ctx.translate(config.radius, config.radius);
  ctx.rotate(dToR(config.sweep.angle));
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.arc(0, 0, config.radius, dToR(-config.sweep.size), dToR(config.sweep.size), false);
  ctx.closePath();
  ctx.fillStyle = config.gradient;
  ctx.fill();
  ctx.restore();
};

export const dToR = (degrees) => degrees * (Math.PI / 180);
export const rToD = (radians) => radians * 180 / Math.PI;
