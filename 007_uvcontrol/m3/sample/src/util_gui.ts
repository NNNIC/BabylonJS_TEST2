    //--- for gui ---
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

       ※問題※
       ラベルの表示について
        １．１ラベルにつき、256x256(LABELTEXTURESIZE)使用していて無駄が多すぎる
        ２．UVは (0,0)-(1,1)に固定されていて、文字が最適化されない。
        ３．DrawTextは中央に表示される。
    */
module Util {
    export class GuiLabelData {
        public width: number;
        public height: number;
        public text: string;
        public font: string;
        public color: string;
        public bgcolor: string;

        public mesh: BABYLON.Mesh;
        public texture: BABYLON.DynamicTexture;

    }

    export class Gui {
        public static LAYER: number = 0x1000;
        public static PICKED: string;
        public static FONT0: string = "bold 70px verdana";
        public static LABELTEXTURESIZE: number = 256;

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
            var mesh = BABYLON.MeshBuilder.CreatePlane(name, { size: 1, width: width, height: height }, Gui.m_scene);
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



        public static CreateLablel(name: string, width: number, height: number, text: string, color: string, bgcolor: string): GuiLabelData {
            var d = new GuiLabelData();
            d.width = width;
            d.height = height;
            d.text = text;
            d.font = Gui.FONT0;
            d.color = color;
            d.bgcolor = bgcolor;


            d.mesh = BABYLON.MeshBuilder.CreatePlane(name, { size: 1, width: width, height: height }, Gui.m_scene);
            d.mesh.material = new BABYLON.StandardMaterial("mat_" + name, Gui.m_scene);

            d.texture = new BABYLON.DynamicTexture("tex_" + name, Gui.LABELTEXTURESIZE, Gui.m_scene, true);

            var mat = <BABYLON.StandardMaterial>d.mesh.material;
            mat.diffuseTexture = d.texture;
            mat.specularColor = new BABYLON.Color3(0, 0, 0);
            mat.emissiveColor = new BABYLON.Color3(1, 1, 1);
            mat.backFaceCulling = false;




            d.mesh.material = mat;
            d.mesh.layerMask = Gui.LAYER;

            d.texture.drawText(text, null, 70, Gui.FONT0, color, bgcolor);

            //Action
            d.mesh.actionManager = new BABYLON.ActionManager(Gui.m_scene);
            d.mesh.actionManager.registerAction(new BABYLON.SetValueAction(BABYLON.ActionManager.OnPickTrigger, Gui, "PICKED", d.mesh.name));


            return d;
        }
        public static ChangeText(labeldata: GuiLabelData, text: string) {
            labeldata.texture.drawText(text, null, 70, labeldata.font, labeldata.color, labeldata.bgcolor);
        }

        // The origin of the Screen is Top Left.  
        public static GetScreenToWorld(x: number, y: number, z: number = 0): BABYLON.Vector3 {
            var nx = Gui.m_camera.orthoLeft + x;
            var ny = Gui.m_camera.orthoTop - y;


            return new BABYLON.Vector3(nx, ny, z);
        }
        public static ScreenMaxX(): number { return Gui.m_canvas.width; }
        public static ScreenMaxY(): number { return Gui.m_canvas.height; }
    }

    export class Node {
        public static Traverse(root: BABYLON.Node, func: any) {
            if (root == null) return;
            func(root);
            Node._trav(root, func);
        }
        private static _trav(node: BABYLON.Node, func: any) {
            if (node == null) return;
            let children: BABYLON.Node[] = node.getChildren();
            if (children != null) {
                for (let i = 0; i < children.length; i++) {
                    let n: BABYLON.Node = children[i];
                    func(n);
                    Node._trav(n, func);
                }
            }
        }
    }
}