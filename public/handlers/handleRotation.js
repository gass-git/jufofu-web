import { updateTimeOut, matrix, maxColumn_index } from "../engine.js";
import Long from '../classes/pieces/long.js';
export default function handleRotation(AP) {
    Long.rotate(AP, matrix, maxColumn_index);
    updateTimeOut(true);
    setTimeout(function () { updateTimeOut(false); }, 120);
}
