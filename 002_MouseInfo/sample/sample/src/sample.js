var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Sample;
(function (Sample) {
    var MainClass = (function (_super) {
        __extends(MainClass, _super);
        function MainClass(canvas) {
            _super.call(this);
            this.m_canvas = canvas;
            this.m_engine = new BABYLON.Engine(canvas, true);
            this.m_scene = new BABYLON.Scene(this.m_engine);
            this.m_scene.clearColor = new BABYLON.Color3(56 / 256, 87 / 256, 145 / 256);
            this.m_camera1 = new BABYLON.ArcRotateCamera("camera1", 0, 0.8, 100, BABYLON.Vector3.Zero(), this.m_scene);
            this.m_camera1.attachControl(canvas);
            var mesh = BABYLON.Mesh.CreateBox("box01", 50, this.m_scene);
            var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), this.m_scene);
            this.Goto(this.S_IDLE);
        }
        MainClass.prototype.runRenderLoop = function () {
            var _this = this;
            this.m_engine.runRenderLoop(function () {
                _this.Update();
                _this.m_scene.render();
            });
        };
        MainClass.prototype.S_IDLE = function (bFirst) {
            console.log(this.m_scene.pointerX + "," + this.m_scene.pointerY);
        };
        return MainClass;
    }(Util.StateControl));
    Sample.MainClass = MainClass;
})(Sample || (Sample = {}));
//# sourceMappingURL=sample.js.map