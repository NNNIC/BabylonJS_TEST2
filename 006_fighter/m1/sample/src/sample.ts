﻿module Sample {
    export class MainClass extends Util.StateControl {
        public m_engine: BABYLON.Engine;
        public m_scene: BABYLON.Scene;
        public m_camera1: BABYLON.TargetCamera;
        //public m_mesh2: BABYLON.Mesh;

        //public m_lab1: Util.GuiLabelData;

        //public m_piked: any;

        constructor(canvas: HTMLCanvasElement) {

            super();

            this.m_engine = new BABYLON.Engine(canvas, true);

            this.m_scene = new BABYLON.Scene(this.m_engine);

            this.m_scene.clearColor = new BABYLON.Color3(56 / 256, 87 / 256, 145 / 256);

            this.m_camera1 = new BABYLON.ArcRotateCamera("camera1", 0, 0.8, 100, BABYLON.Vector3.Zero(), this.m_scene);
            this.m_camera1.attachControl(canvas);
            this.m_camera1.layerMask = ~Util.Gui.LAYER;

            Util.Gui.Init(canvas, this.m_engine, this.m_scene);


            //var mesh = BABYLON.Mesh.CreateBox("box01", 20, this.m_scene);
            //mesh.layerMask = 1;
            //mesh.translate(new BABYLON.Vector3(0, 0, 1), 20);
            //mesh.actionManager = new BABYLON.ActionManager(this.m_scene);
            //mesh.actionManager.registerAction(new BABYLON.SetValueAction(BABYLON.ActionManager.OnPickTrigger, this, "m_piked", "1"));

            //this.m_mesh2 = BABYLON.Mesh.CreateSphere("sphere", 10, 20, this.m_scene);
            //this.m_mesh2.layerMask = 0x1000;
            //this.m_mesh2.translate(new BABYLON.Vector3(0, 0, -1), 20);

            //this.m_mesh2.actionManager = new BABYLON.ActionManager(this.m_scene);
            //this.m_mesh2.actionManager.registerAction(new BABYLON.SetValueAction(BABYLON.ActionManager.OnLeftPickTrigger, this, "m_piked", "2"));

            //// GUI
            //var but1 = Util.Gui.CreateButton("but1", "data/start.png", 200, 75);
            //but1.position = Util.Gui.GetScreenToWorld(100, 75 / 2,0);

            //var but2 = Util.Gui.CreateButton("but2", "data/start.png", 200, 75);
            //but2.position = Util.Gui.GetScreenToWorld(100, 75 / 2 + 75, 0);

            //var but3 = Util.Gui.CreateButton("but3", "data/start.png", 200, 75);
            //but3.position = Util.Gui.GetScreenToWorld(100, 75 / 2 + 75 * 2, 0);

            //this.m_lab1 = Util.Gui.CreateLablel("lab1", 200, 75, "TEST1", "white", "black");
            //this.m_lab1.mesh.position = Util.Gui.GetScreenToWorld(100, 75 / 2 + 75 * 3, 0);

            //var lab2 = Util.Gui.CreateLablel("lab2", 200, 75, "TEST2", "white", "black");
            //lab2.mesh.position = Util.Gui.GetScreenToWorld(100, 75 / 2 + 75 * 4, 0);

            this.m_scene.activeCameras.push(this.m_camera1);
            this.m_scene.activeCameras.push(Util.Gui.GetCamera());

            this.m_scene.cameraToUseForPointers = Util.Gui.GetCamera(); // カメラがポイント指定に使うカメラ

            var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), this.m_scene);

            this.Goto(this.S_LOAD);
        }
        public runRenderLoop(): void {
            this.m_engine.runRenderLoop(() => {
                Util.Manebehaviour.Update();
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
                this.Goto(this.S_END);
            }
        }
        private S_END(bFirst: boolean): void {
            if (bFirst) {
                this.m_scene.debugLayer.show(true);
            }

        }
    }
}