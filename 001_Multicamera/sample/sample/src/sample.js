var Sample;
(function (Sample) {
    var MainClass = (function () {
        function MainClass(canvas) {
            this.engine = new BABYLON.Engine(canvas, true);
            this.scene = new BABYLON.Scene(this.engine);
            this.scene.clearColor = new BABYLON.Color3(56 / 256, 87 / 256, 145 / 256);
            this.camera = new BABYLON.ArcRotateCamera("camera1", 0, 0.8, 100, BABYLON.Vector3.Zero(), this.scene);
            this.camera.attachControl(canvas);
            var mesh = BABYLON.Mesh.CreateBox("box01", 50, this.scene);
            var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), this.scene);
        }
        MainClass.prototype.runRenderLoop = function () {
            var _this = this;
            this.engine.runRenderLoop(function () {
                _this.scene.render();
            });
        };
        return MainClass;
    }());
    Sample.MainClass = MainClass;
})(Sample || (Sample = {}));
//# sourceMappingURL=sample.js.map