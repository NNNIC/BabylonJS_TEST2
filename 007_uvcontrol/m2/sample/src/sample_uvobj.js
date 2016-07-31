/// <reference path="../scripts/babylon.d.ts"/>
/// <reference path="util"/>
/// <reference path="util_gui.ts"/>
/// <reference path="util_gameObject.ts"/>
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Sample;
(function (Sample) {
    var UVObj = (function (_super) {
        __extends(UVObj, _super);
        function UVObj() {
            _super.call(this);
            this.Goto(this.S_START);
        }
        UVObj.prototype.Update = function () {
            _super.prototype.Update.call(this);
        };
        UVObj.prototype.S_START = function (bFirst) {
            if (bFirst) {
                return;
            }
            var m = this.gameObject.node;
            m.position = new BABYLON.Vector3(m.position.x, m.position.y, m.position.z + 1);
        };
        return UVObj;
    }(Util.Manebehaviour_wStateControl));
    Sample.UVObj = UVObj;
})(Sample || (Sample = {}));
//# sourceMappingURL=sample_uvobj.js.map