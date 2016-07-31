var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Sample;
(function (Sample) {
    var MainClass = (function (_super) {
        __extends(MainClass, _super);
        //public m_mesh2: BABYLON.Mesh;
        //public m_lab1: Util.GuiLabelData;
        //public m_piked: any;
        function MainClass(canvas) {
            _super.call(this);
            this.m_engine = new BABYLON.Engine(canvas, true);
            this.m_scene = new BABYLON.Scene(this.m_engine);
            this.m_scene.clearColor = new BABYLON.Color3(56 / 256, 87 / 256, 145 / 256);
            this.m_camera1 = new BABYLON.ArcRotateCamera("camera1", 0, 0.8, 100, BABYLON.Vector3.Zero(), this.m_scene);
            this.m_camera1.attachControl(canvas);
            this.m_camera1.layerMask = ~Util.Gui.LAYER;
            Util.Gui.Init(canvas, this.m_engine, this.m_scene);
            this.m_scene.activeCameras.push(this.m_camera1);
            this.m_scene.activeCameras.push(Util.Gui.GetCamera());
            this.m_scene.cameraToUseForPointers = Util.Gui.GetCamera(); // カメラがポイント指定に使うカメラ
            var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), this.m_scene);
            this.Goto(this.S_LOAD);
        }
        MainClass.prototype.runRenderLoop = function () {
            var _this = this;
            this.m_engine.runRenderLoop(function () {
                Util.Manebehaviour.Update();
                _this.Update();
                _this.m_scene.render();
            });
        };
        MainClass.prototype.S_IDLE = function (bFirst) {
            if (bFirst) {
                this.m_t = 0;
                return;
            }
            this.m_t += this.m_engine.getDeltaTime();
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
        MainClass.prototype.S_LOAD = function (bFirst) {
            if (bFirst) {
                this.m_bDone = false;
            }
            var self = this;
            if (bFirst) {
                BABYLON.SceneLoader.Append("./", "data/ma1.babylon", this.m_scene, function (s) { self.m_bDone = true; }, function () { }, function (s) { self.m_bDone = true; });
            }
            if (this.m_bDone) {
                var node = this.m_scene.getNodeByName("ma1");
                var self_1 = this;
                Util.Node.Traverse(node, function (n) {
                    console.log(n.name);
                    var cm = n.getChildMeshes();
                    if (cm != null) {
                        for (var i = 0; i < cm.length; i++) {
                            var m = cm[i];
                            if (m != null)
                                m.layerMask = 1;
                        }
                    }
                });
                console.log("Done!");
                this.Goto(this.S_CREATE_PLANE);
            }
        };
        MainClass.prototype.S_CREATE_PLANE = function (bFirst) {
            if (bFirst) {
                var mesh = BABYLON.MeshBuilder.CreatePlane("plane", { size: 1, width: 50, height: 50, updatable: true }, this.m_scene);
                mesh.layerMask = 1;
                mesh.position = new BABYLON.Vector3(0, -10, 0);
                mesh.rotate(new BABYLON.Vector3(1, 0, 0), Math.PI * (90 / 180));
                var tex = new BABYLON.Texture("data/arrow.png", this.m_scene);
                var mat = new BABYLON.StandardMaterial("mat_plane", this.m_scene);
                mat.diffuseTexture = tex;
                mesh.material = mat;
                this.Goto(this.S_GUI);
            }
        };
        MainClass.prototype.S_GUI = function (bFirst) {
            if (bFirst) {
                this.m_debugOn = false;
                this.m_debugBtn = Util.Gui.CreateLablel("debug", 100, 50, "debug", "white", "black");
                this.m_debugBtn.mesh.position = Util.Gui.GetScreenToWorld(Util.Gui.ScreenMaxX() - 50, 25);
            }
            else {
                if (Util.Gui.PICKED != null) {
                    var picked = Util.Gui.PICKED;
                    Util.Gui.PICKED = null;
                    if (picked == "debug") {
                        this.m_debugOn = !this.m_debugOn;
                    }
                    if (this.m_debugOn) {
                        this.m_scene.debugLayer.show(true);
                    }
                    else {
                        this.m_scene.debugLayer.hide();
                    }
                }
            }
        };
        MainClass.prototype.S_END = function (bFirst) {
            if (bFirst) {
            }
        };
        return MainClass;
    }(Util.StateControl));
    Sample.MainClass = MainClass;
})(Sample || (Sample = {}));
//# sourceMappingURL=sample.js.map