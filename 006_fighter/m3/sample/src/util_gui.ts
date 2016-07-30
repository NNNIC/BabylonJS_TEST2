/*
    Util.Gui

    Initilaize
        Uti.Gui.Init(canvas,engine,scene);

    Camera
        gui.GetCamera()  --- Use it for camera conttrol.  As far I'm not sure how to control camera nicely.

    Set button
        var mesh = gui.CreateButton(name, texturefile, width  ,height);
        mesh.position = gui.screen_to_world(width/2, height/2);

    Hide/Show
        mesh.SetEnable(true or false)

    Gui Screen

 (0,0)   ->       |<- canvas.width
    +-------------+ 
  | |             |
  v |             |
    |             |
    |             |
    |             |
  - +-------------+
  ^
  |
  canvas.height

*/
module Util2 {
    export class Gui {
        public static LAYER: number = 0x1000;
        public static PICKED: string;

        private static m_canvas: HTMLCanvasElement;
        private static m_engine: BABYLON.Engine;
        private static m_scene: BABYLON.Scene;

        private static m_camera: BABYLON.Camera;
        public static GetCamera(): BABYLON.Camera { return Gui.m_camera; }

        public static Init(canvas: HTMLCanvasElement, engine: BABYLON.Engine, scene: BABYLON.Scene): void {
            Gui.m_canvas = canvas;
            Gui.m_engine = engine;
            Gui.m_scene = scene;

            Gui.m_camera = new BABYLON.FreeCamera("Gui.Camera", new BABYLON.Vector3(0, 0, -100), Gui.m_scene);
            Gui.m_camera.layerMask = Gui.LAYER;
            Gui.m_camera.mode = 1;

            //ortho define
            Gui.m_camera.orthoLeft = -canvas.width / 2;
            Gui.m_camera.orthoRight = canvas.width / 2;
            Gui.m_camera.orthoTop = canvas.height / 2;
            Gui.m_camera.orthoBottom = -canvas.height / 2;
            Gui.m_camera.minZ = 0;
            Gui.m_camera.maxZ = 1000;
            //
        }

        public static CreateButton(name: string, file: string, width: number, height: number): BABYLON.Mesh {
            var mesh = BABYLON.MeshBuilder.CreatePlane(name, { size: 1, width: 200, height: 75 }, Gui.m_scene);
            mesh.layerMask = Gui.LAYER;

            var mat = new BABYLON.StandardMaterial("mat_" + name, Gui.m_scene);
            mat.fogEnabled = false;
            var tex = new BABYLON.Texture(file, Gui.m_scene);
            mat.diffuseTexture = tex;

            mesh.material = mat;

            //Action
            mesh.actionManager = new BABYLON.ActionManager(Gui.m_scene);
            mesh.actionManager.registerAction(new BABYLON.SetValueAction(BABYLON.ActionManager.OnPickTrigger, Gui, "PICKED", mesh.name));

            return mesh;
        }

        // The origin of the Screen is Top Left.  
        public static GetScreenToWorld(x: number, y: number, z: number): BABYLON.Vector3 {
            var nx = Gui.m_camera.orthoLeft + x;
            var ny = Gui.m_camera.orthoTop - y;

            return new BABYLON.Vector3(nx, ny, z);
        }
    }
}