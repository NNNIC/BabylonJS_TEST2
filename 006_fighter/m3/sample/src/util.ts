module Util {
    export class StateControl {
        m_curstate: any;
        m_nextstate: any;

        public Goto(state: any) {
            this.m_nextstate = state;
        }
        public Update() {
            if (this.m_nextstate != null) {
                this.m_curstate = this.m_nextstate;
                this.m_nextstate = null;
                this.m_curstate(true);
            }
            else {
                if (this.m_curstate != null) {
                    this.m_curstate(false);
                }
            }
        }
    }

    export class StateItem {
        self: any;  // ※this対策
        state: any;
        p1: any;
        p2: any;
        p3: any;
        p4: any;
    }
    export class StateSequencer {

        private m_list: Array<StateItem>;
        private m_elapsed: number;
        private m_cur: StateItem;
        private m_next: StateItem;

        constructor() {
            this.m_list = new Array<StateItem>();
            this.m_elapsed = 0;
            this.m_cur = null;
            this.m_next = null;
        }

        public Command(
            state: any,
            p1: any = null,
            p2: any = null,
            p3: any = null,
            p4: any = null
        ): void {
            var i = new StateItem();
            i.self = this;
            i.state = state;
            i.p1 = p1;
            i.p2 = p2;
            i.p3 = p3;
            i.p4 = p4;
            this.m_list.push(i);
        }

        public Update(dt: number) {
            this.m_elapsed += dt / 1000;

            if (this.m_cur == null) {
                if (this.m_list.length > 0) {
                    this.m_next = this.m_list.shift();
                }
            }
            if (this.m_next != null) {
                this.m_cur = this.m_next;
                this.m_next = null;
                this.m_elapsed = 0;
            }
            if (this.m_cur != null) {
                var i = this.m_cur;
                if (i.state != null) {
                    i.state(this.m_elapsed, i);
                }
            }
        }

        public Done(): void {
            this.m_cur = null;
        }
    }
    //--- manebehaviour ---
    export class Manebehaviour {
        // 自クラスからのインスタンスを持つ。
        public static m_component_list: Array<any> = new Array<any>();

        // インスタンス削除
        public static Delete(m: Manebehaviour): void {
            for (let i = 0; i < Manebehaviour.m_component_list.length; i++) {
                var c: Manebehaviour = Manebehaviour.m_component_list[i];
                if (c != null && c.uuid == m.uuid) {
                    m.OnDestroy();
                    Manebehaviour.m_component_list = Manebehaviour.m_component_list.splice(i, 1);
                    return;
                }
            }
        }

        // Manebeheviourの更新
        public static Update() {
            for (let i = 0; i < Manebehaviour.m_component_list.length; i++) {
                let c = Manebehaviour.m_component_list[i];
                if (c != null) {
                    let m = <Manebehaviour>c;
                    if (m != null && m.alive && m.enable) {
                        m.Update();
                    }
                }
            }
        }
        public static MAXID = 0;

        public uuid: number;
        public alive: boolean;
        public enable: boolean;

        public constructor() {
            this.uuid = Manebehaviour.MAXID + 1;
            this.alive = this.enable = true;
            Manebehaviour.MAXID += 1;
            Manebehaviour.m_component_list.push(this);
        }
        public Update() {
        }
        public OnDestroy()
        { }
       
    }
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
    export class GuiLabelData {
        public width: number;
        public height: number;
        public text: string;
        public font: string;
        public color: string;
        public bgcolor: string;

        public mesh: BABYLON.Mesh;
        public texture: BABYLON.DynamicTexture;

        public component: Manebehaviour; // component Function
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

            // debug
            //var b = d.mesh.geometry.getVertexBuffer("uv");  //[0,0,1,0,1,1,0,1]
            //var l = b.getData();
            //for (var i = 0; i < l.length; i++) console.log(l[i]);
            

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
            var ny = Gui.m_camera.orthoTop  - y;


            return new BABYLON.Vector3(nx, ny, z);
        }
        public static ScreenMaxX(): number { return Gui.m_canvas.width;  }
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
