module Sample {
    export class MainClass extends Util.StateControl {
        public m_engine: BABYLON.Engine;
        public m_scene: BABYLON.Scene;
        public m_camera1: BABYLON.TargetCamera;
        public m_guiCamera: BABYLON.TargetCamera;
        public m_mesh2: BABYLON.Mesh;

        public m_piked: any;

        constructor(canvas: HTMLCanvasElement) {

            super();

            this.m_engine = new BABYLON.Engine(canvas, true);

            this.m_scene = new BABYLON.Scene(this.m_engine);

            this.m_scene.clearColor = new BABYLON.Color3(56 / 256, 87 / 256, 145 / 256);

            this.m_camera1 = new BABYLON.ArcRotateCamera("camera1", 0, 0.8, 100, BABYLON.Vector3.Zero(), this.m_scene);
            this.m_camera1.attachControl(canvas);
            this.m_camera1.layerMask = ~0x1000;

            this.m_guiCamera = new BABYLON.FreeCamera("gui", new BABYLON.Vector3(0, 0, -100), this.m_scene);
            this.m_guiCamera.layerMask = 0x1000;
            this.m_guiCamera.mode = 1;

            //ortho define
            this.m_guiCamera.orthoLeft = -canvas.width / 2;
            this.m_guiCamera.orthoRight = canvas.width / 2;
            this.m_guiCamera.orthoTop = canvas.height / 2;
            this.m_guiCamera.orthoBottom = -canvas.height / 2;
            this.m_guiCamera.minZ = 0;
            this.m_guiCamera.maxZ = 1000;
            //
            


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

            Util.Gui.CreateButton("p1", "data/start.png", 200, 75, this.m_scene);
            
            this.m_scene.activeCameras.push(this.m_camera1);
            this.m_scene.activeCameras.push(this.m_guiCamera);

            this.m_scene.cameraToUseForPointers = this.m_guiCamera; // カメラがポイント指定に使うカメラ
            

            var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), this.m_scene);

            this.Goto(this.S_IDLE);
        }
        public runRenderLoop(): void {
            this.m_engine.runRenderLoop(() => {
                this.Update();
                this.m_scene.render();
            });
        }

        private S_IDLE(bFirst: boolean): void {
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

        }
    }
}