module Sample {
    export class MainClass extends Util.StateControl {
        public m_engine: BABYLON.Engine;
        public m_scene: BABYLON.Scene;
        public m_camera1: BABYLON.TargetCamera;
        public m_guiCamera: BABYLON.TargetCamera;

        constructor(canvas: HTMLCanvasElement) {

            super();

            this.m_engine = new BABYLON.Engine(canvas, true);

            this.m_scene = new BABYLON.Scene(this.m_engine);

            this.m_scene.clearColor = new BABYLON.Color3(56 / 256, 87 / 256, 145 / 256);

            this.m_camera1 = new BABYLON.ArcRotateCamera("camera1", 0, 0.8, 100, BABYLON.Vector3.Zero(), this.m_scene);
            this.m_camera1.attachControl(canvas);
            this.m_camera1.layerMask = ~0x1000;

            this.m_guiCamera = new BABYLON.FreeCamera("gui", new BABYLON.Vector3(0, 0, 100), this.m_scene);
            this.m_guiCamera.layerMask = 0x1000;
            this.m_guiCamera.mode = 1;


            var mesh = BABYLON.Mesh.CreateBox("box01", 20, this.m_scene);
            mesh.layerMask = 1;
            mesh.translate(new BABYLON.Vector3(0, 0, 1), 20);

            var mesh2 = BABYLON.Mesh.CreateSphere("sphere", 10, 20, this.m_scene);
            mesh2.layerMask = 0x1000;
            mesh2.translate(new BABYLON.Vector3(0, 0, -1), 20);


            this.m_scene.activeCameras.push(this.m_camera1);
            this.m_scene.activeCameras.push(this.m_guiCamera);

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
            if (bFirst) {
                var cam = this.m_camera1;
                this.m_scene.onPointerDown = function (e, inf) {
                    if (cam.mode == 0) {
                        cam.mode = 1;
                    }
                    else {
                        cam.mode = 0;
                    }
                };
            }

        }
    }
}