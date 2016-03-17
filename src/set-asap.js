function setAsap ( fn, maxTime, minTime ) {
  maxTime = maxTime || 500
  minTime = minTime || 0

  var time = Math.floor( Math.random() * maxTime )

  if ( time < minTime ) {
    time = minTime
  }

  return setTimeout( fn, time )
}

setAsap.setAsap = setAsap
setAsap.clearAsap = clearTimeout

module.exports = setAsap
