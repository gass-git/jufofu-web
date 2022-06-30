var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import Piece from '../piece.js';
var Block = /** @class */ (function (_super) {
    __extends(Block, _super);
    function Block(color, blockImages) {
        var _this = _super.call(this, 'block', color, blockImages[color], [3], [0]) || this;
        _this.isRearranging = false;
        _this.prevRowPos = null;
        return _this;
    }
    return Block;
}(Piece));
export default Block;
