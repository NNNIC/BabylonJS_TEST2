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
            this.m_engine = new BABYLON.Engine(canvas, true);
            this.m_scene = new BABYLON.Scene(this.m_engine);
            this.m_scene.clearColor = new BABYLON.Color3(56 / 256, 87 / 256, 145 / 256);
            this.m_camera1 = new BABYLON.ArcRotateCamera("camera1", 0, 0.8, 100, BABYLON.Vector3.Zero(), this.m_scene);
            this.m_camera1.attachControl(canvas);
            this.m_camera1.layerMask = ~0x1000;
            Util.Gui.Init(canvas, this.m_engine, this.m_scene);
            //this.m_guiCamera = new BABYLON.FreeCamera("gui", new BABYLON.Vector3(0, 0, -100), this.m_scene);
            //this.m_guiCamera.layerMask = 0x1000;
            //this.m_guiCamera.mode = 1;
            ////ortho define
            //this.m_guiCamera.orthoLeft = -canvas.width / 2;
            //this.m_guiCamera.orthoRight = canvas.width / 2;
            //this.m_guiCamera.orthoTop = canvas.height / 2;
            //this.m_guiCamera.orthoBottom = -canvas.height / 2;
            //this.m_guiCamera.minZ = 0;
            //this.m_guiCamera.maxZ = 1000;
            ////
            var mesh = BABYLON.Mesh.CreateBox("box01", 20, this.m_scene);
            mesh.layerMask = 1;
            mesh.translate(new BABYLON.Vector3(0, 0, 1), 20);
            mesh.actionManager = new BABYLON.ActionManager(this.m_scene);
            mesh.actionManager.registerAction(new BABYLON.SetValueAction(BABYLON.ActionManager.OnPickTrigger, this, "m_piked", "1"));
            this.m_mesh2 = BABYLON.Mesh.CreateSphere("sphere", 10, 20, this.m_scene);
            this.m_mesh2.layerMask = 0x1000;
            this.m_mesh2.translate(new BABYLON.Vector3(0, 0, -1), 20);
            this.m_mesh2.actionManager = new BABYLON.ActionManager(this.m_scene);
            this.m_mesh2.actionManager.registerAction(new BABYLON.SetValueAction(BABYLON.ActionManager.OnLeftPickTrigger, this, "m_piked", "2"));
            //var mesh3 = BABYLON.MeshBuilder.CreatePlane("p1", { size: 1, width: 200, height: 75 }, this.m_scene);
            //mesh3.layerMask = Util.Gui.LAYER;
            //var mat = new BABYLON.StandardMaterial("planeMaterial", this.m_scene);
            //mat.fogEnabled = false;
            //var tex = new BABYLON.Texture("data/start.png", this.m_scene);
            //mat.diffuseTexture = tex;
            //mesh3.material = mat;
            var but1 = Util.Gui.CreateButton("but1", "data/start.png", 200, 75);
            but1.position = Util.Gui.GetScreenToWorld(100, 75 / 2, 0);
            var but2 = Util.Gui.CreateButton("but2", "data/start.png", 200, 75);
            but2.position = Util.Gui.GetScreenToWorld(100, 75 / 2 + 75, 0);
            var but3 = Util.Gui.CreateButton("but3", "data/start.png", 200, 75);
            but3.position = Util.Gui.GetScreenToWorld(100, 75 / 2 + 75 * 2, 0);
            this.m_scene.activeCameras.push(this.m_camera1);
            this.m_scene.activeCameras.push(Util.Gui.GetCamera());
            this.m_scene.cameraToUseForPointers = Util.Gui.GetCamera(); // カメラがポイント指定に使うカメラ
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
            //if (bFirst) {
            //    var cam = this.m_camera1;
            //    this.m_scene.onPointerDown = function (e, inf) {
            //        if (cam.mode == 0) {
            //            cam.mode = 1;
            //        }
            //        else {
            //            cam.mode = 0;
            //        }
            //    };
            //}
            //if (this.m_scene.pointerDownPredicate != null && this.m_scene.pointerDownPredicate(this.m_mesh2)) {
            //    this.m_scene.pointerDownPredicate = null;
            //    var cam = this.m_camera1;
            //    if (cam.mode == 0) {
            //        cam.mode = 1;
            //    }
            //    else {
            //        cam.mode = 0;
            //    }
            //}
            if (this.m_piked != null) {
                console.log(this.m_piked);
                this.m_piked = null;
            }
            if (Util.Gui.PICKED != null) {
                console.log(Util.Gui.PICKED);
                Util.Gui.PICKED = null;
                var cam = this.m_camera1;
                if (cam.mode == 0) {
                    cam.mode = 1;
                }
                else {
                    cam.mode = 0;
                }
            }
        };
        return MainClass;
    }(Util.StateControl));
    Sample.MainClass = MainClass;
})(Sample || (Sample = {}));
//# sourceMappingURL=sample.js.map