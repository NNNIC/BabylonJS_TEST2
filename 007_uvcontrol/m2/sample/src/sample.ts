module Sample {
    export class MainClass extends Util.StateControl {
        public m_engine: BABYLON.Engine;
        public m_scene: BABYLON.Scene;
        public m_camera1: BABYLON.TargetCamera;

        constructor(canvas: HTMLCanvasElement) {

            super();

            Util.Framework.Init();

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
        public runRenderLoop(): void {
            this.m_engine.runRenderLoop(() => {
                Util.Framework.Update();
                this.Update();
                this.m_scene.render();
            });
        }

        private m_t: number;
        private S_IDLE(bFirst: boolean): void {
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
        }
        private m_bDone: boolean;
        private S_LOAD(bFirst: boolean): void {
            if (bFirst) {
                this.m_bDone = false;
            }
            var self = this;
            if (bFirst) {
                BABYLON.SceneLoader.Append("./", "data/ma1.babylon", this.m_scene, (s) => { self.m_bDone = true; }, () => { }, (s) => { self.m_bDone = true; });
            }
            if (this.m_bDone) {
                let node: BABYLON.Node = this.m_scene.getNodeByName("ma1");
                let self = this;
                Util.Node.Traverse(node, (n: BABYLON.Node) => {
                    console.log(n.name);
                    let cm: BABYLON.AbstractMesh[] = n.getChildMeshes();
                    if (cm != null) {
                        for (let i = 0; i < cm.length; i++) {
                            let m: BABYLON.Mesh = <BABYLON.Mesh>cm[i];
                            if (m != null) m.layerMask = 1;
                        }
                    }
                });
                console.log("Done!");
                this.Goto(this.S_CREATE_PLANE);
            }
        }

        private S_CREATE_PLANE(bFirst: boolean): void {
            if (bFirst) {
                var mesh: BABYLON.Mesh = BABYLON.MeshBuilder.CreatePlane("plane", { size: 1, width: 50, height: 50, updatable: true }, this.m_scene);
                mesh.layerMask = 1;
                mesh.position = new BABYLON.Vector3(0, -10, 0);
                mesh.rotate(new BABYLON.Vector3(1, 0, 0), Math.PI * (90 / 180));

                var tex: BABYLON.Texture = new BABYLON.Texture("data/arrow.png", this.m_scene);
                var mat: BABYLON.StandardMaterial = new BABYLON.StandardMaterial("mat_plane", this.m_scene);
                mat.diffuseTexture = tex;

                mesh.material = mat;

                let go = Util.GameObject.Add(mesh);
                let uvobj = new Sample.UVObj();
                go.AddManebehaviour(uvobj);

                this.Goto(this.S_GUI);
            }
        }

        //
        private m_debugOn: boolean;
        private m_debugBtn: Util.GuiLabelData;
        private S_GUI(bFirst: boolean): void {
            if (bFirst) {
                this.m_debugOn = false;
                this.m_debugBtn = Util.Gui.CreateLablel("debug", 100, 50, "debug", "white", "black");
                this.m_debugBtn.mesh.position = Util.Gui.GetScreenToWorld(Util.Gui.ScreenMaxX() - 50, 25);
            }
            else {
                if (Util.Gui.PICKED != null) {
                    let picked = Util.Gui.PICKED;
                    Util.Gui.PICKED = null;

                    if (picked == "debug") {
                        this.m_debugOn = !this.m_debugOn;
                    }

                    if (this.m_debugOn) {
                        this.m_scene.debugLayer.show(true);
                    } else {
                        this.m_scene.debugLayer.hide();
                    }
                   
                }
            }
        }
        private S_END(bFirst: boolean): void {
            if (bFirst) {
                //this.m_scene.debugLayer.show(true);
            }
        }
    }
}