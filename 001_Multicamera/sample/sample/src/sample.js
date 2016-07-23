var Sample;
(function (Sample) {
    var MainClass = (function () {
        function MainClass(canvas) {
            this.m_engine = new BABYLON.Engine(canvas, true);
            this.m_scene = new BABYLON.Scene(this.m_engine);
            this.m_scene.clearColor = new BABYLON.Color3(56 / 256, 87 / 256, 145 / 256);
            this.m_camera1 = new BABYLON.ArcRotateCamera("camera1", 0, 0.8, 100, BABYLON.Vector3.Zero(), this.m_scene);
            this.m_camera1.attachControl(canvas);
            var mesh = BABYLON.Mesh.CreateBox("box01", 50, this.m_scene);
            this.m_camera2 = new BABYLON.ArcRotateCamera("camera2", 0, 0.8, -100, new BABYLON.Vector3(-100, 0, 0), this.m_scene);
            this.m_camera2.attachControl(canvas);
            this.m_scene.activeCameras.push(this.m_camera1);
            this.m_scene.activeCameras.push(this.m_camera2);
            var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), this.m_scene);
        }
        MainClass.prototype.runRenderLoop = function () {
            var _this = this;
            this.m_engine.runRenderLoop(function () {
                _this.m_scene.render();
            });
        };
        return MainClass;
    }());
    Sample.MainClass = MainClass;
})(Sample || (Sample = {}));
