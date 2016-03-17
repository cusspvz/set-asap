export const setAsap = ( fn, maxTime = 500, minTime = 0 ) => {
  let time = Math.floor( Math.random() * maxTime )

  if ( time < minTime ) {
    time = minTime
  }

  return setTimeout( fn, time )
}

export const clearAsap = clearTimeout

export default setAsap
