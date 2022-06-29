var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
/**
* - Add speed and increase score reward as game evolves and
*
* - Add new colors to the game after a certain
* number of frames.
*/
export default function handleDifficulty(totalFrameCount, colorsInPlay, setColorsInPlay, setSpeed, setScoreMultiplier) {
    switch (totalFrameCount) {
        case 1000:
            setColorsInPlay(__spreadArray(__spreadArray([], colorsInPlay, true), ["pink"], false));
            break;
        case 2000:
            setSpeed(35);
            setScoreMultiplier(2);
            setColorsInPlay(__spreadArray(__spreadArray([], colorsInPlay, true), ["white"], false));
            break;
        case 4000:
            setSpeed(30);
            setScoreMultiplier(3);
            break;
        case 7000:
            setSpeed(25);
            setScoreMultiplier(4);
            setColorsInPlay(__spreadArray(__spreadArray([], colorsInPlay, true), ["orange"], false));
            break;
        case 10000:
            setSpeed(20);
            setScoreMultiplier(5);
            break;
        default:
            break;
    }
}
