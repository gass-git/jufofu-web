import { setSpeed, setColorsInPlay, setScoreMultiplier, colorsInPlay, totalFrameCount } from '../engine.js'

/**
* - Add speed and increase score reward as game evolves and 
* 
* - Add new colors to the game after a certain
* number of frames.
*/
export default function handleDifficulty() {
  switch (totalFrameCount) {
    case 1000:
      setColorsInPlay([...colorsInPlay, "pink"])
      break

    case 2000:
      setSpeed(35)
      setScoreMultiplier(2)
      setColorsInPlay([...colorsInPlay, "white"])
      break

    case 4000:
      setSpeed(30)
      setScoreMultiplier(3)
      break

    case 7000:
      setSpeed(25)
      setScoreMultiplier(4)
      setColorsInPlay([...colorsInPlay, "orange"])
      break

    case 10000:
      setSpeed(20)
      setScoreMultiplier(5)
      break

    default:
      break
  }
}