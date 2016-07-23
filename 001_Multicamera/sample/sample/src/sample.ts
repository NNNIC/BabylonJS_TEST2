module Sample {
    export class MainClass {
        public engine: BABYLON.Engine;
        public scene: BABYLON.Scene;
        public camera: BABYLON.TargetCamera;

        constructor(canvas: HTMLCanvasElement) {

            this.engine = new BABYLON.Engine(canvas, true);

            this.scene = new BABYLON.Scene(this.engine);

            this.scene.clearColor = new BABYLON.Color3(56 / 256, 87 / 256, 145 / 256);

            this.camera = new BABYLON.ArcRotateCamera("camera1", 0, 0.8, 100, BABYLON.Vector3.Zero(), this.scene);
            this.camera.attachControl(canvas);

            var mesh = BABYLON.Mesh.CreateBox("box01", 50, this.scene);

            var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), this.scene);

        }
        public runRenderLoop(): void {
            this.engine.runRenderLoop(() => {
                this.scene.render();
            });
        }
    }
}