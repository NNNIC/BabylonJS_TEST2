module Sample {
    export class MainClass extends Util.StateControl {
        public m_engine: BABYLON.Engine;
        public m_scene: BABYLON.Scene;
        public m_camera1: BABYLON.TargetCamera;

        constructor(canvas: HTMLCanvasElement) {

            super();

            this.m_engine = new BABYLON.Engine(canvas, true);

            this.m_scene = new BABYLON.Scene(this.m_engine);

            this.m_scene.clearColor = new BABYLON.Color3(56 / 256, 87 / 256, 145 / 256);

            this.m_camera1 = new BABYLON.ArcRotateCamera("camera1", 0, 0.8, 100, BABYLON.Vector3.Zero(), this.m_scene);
            this.m_camera1.attachControl(canvas);

            var mesh = BABYLON.Mesh.CreateBox("box01", 50, this.m_scene);

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