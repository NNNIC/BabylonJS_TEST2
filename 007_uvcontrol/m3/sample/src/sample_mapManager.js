/// <reference path="util_gui.ts"/>
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Sample;
(function (Sample) {
    var MapManager = (function (_super) {
        __extends(MapManager, _super);
        function MapManager() {
            _super.call(this);
            this.Goto(this.S_START);
        }
        MapManager.prototype.Update = function () {
            _super.prototype.Update.call(this);
        };
        MapManager.prototype.S_START = function (bFirst) {
        };
        return MapManager;
    }(Util.Manebehaviour_wStateControl));
    Sample.MapManager = MapManager;
})(Sample || (Sample = {}));
//# sourceMappingURL=sample_mapManager.js.map