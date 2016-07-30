var Util;
(function (Util) {
    var StateControl = (function () {
        function StateControl() {
        }
        StateControl.prototype.Goto = function (state) {
            this.m_nextstate = state;
        };
        StateControl.prototype.Update = function () {
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
        };
        return StateControl;
    }());
    Util.StateControl = StateControl;
    var StateItem = (function () {
        function StateItem() {
        }
        return StateItem;
    }());
    Util.StateItem = StateItem;
    var StateSequencer = (function () {
        function StateSequencer() {
            this.m_list = new Array();
            this.m_elapsed = 0;
            this.m_cur = null;
            this.m_next = null;
        }
        StateSequencer.prototype.Command = function (state, p1, p2, p3, p4) {
            if (p1 === void 0) { p1 = null; }
            if (p2 === void 0) { p2 = null; }
            if (p3 === void 0) { p3 = null; }
            if (p4 === void 0) { p4 = null; }
            var i = new StateItem();
            i.self = this;
            i.state = state;
            i.p1 = p1;
            i.p2 = p2;
            i.p3 = p3;
            i.p4 = p4;
            this.m_list.push(i);
        };
        StateSequencer.prototype.Update = function (dt) {
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
        };
        StateSequencer.prototype.Done = function () {
            this.m_cur = null;
        };
        return StateSequencer;
    }());
    Util.StateSequencer = StateSequencer;
    //--- manebehaviour ---
    var Manebehaviour = (function () {
        function Manebehaviour() {
            this.uuid = Manebehaviour.MAXID + 1;
            this.alive = this.enable = true;
            Manebehaviour.MAXID += 1;
            Manebehaviour.m_component_list.push(this);
        }
        // インスタンス削除
        Manebehaviour.Delete = function (m) {
            for (var i = 0; i < Manebehaviour.m_component_list.length; i++) {
                var c = Manebehaviour.m_component_list[i];
                if (c != null && c.uuid == m.uuid) {
                    m.OnDestroy();
                    Manebehaviour.m_component_list = Manebehaviour.m_component_list.splice(i, 1);
                    return;
                }
            }
        };
        // Manebeheviourの更新
        Manebehaviour.Update = function () {
            for (var i = 0; i < Manebehaviour.m_component_list.length; i++) {
                var c = Manebehaviour.m_component_list[i];
                if (c != null) {
                    var m = c;
                    if (m != null && m.alive && m.enable) {
                        m.Update();
                    }
                }
            }
        };
        Manebehaviour.prototype.Update = function () {
        };
        Manebehaviour.prototype.OnDestroy = function () { };
        // 自クラスからのインスタンスを持つ。
        Manebehaviour.m_component_list = new Array();
        Manebehaviour.MAXID = 0;
        return Manebehaviour;
    }());
    Util.Manebehaviour = Manebehaviour;
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
    var GuiLabelData = (function () {
        function GuiLabelData() {
        }
        return GuiLabelData;
    }());
    Util.GuiLabelData = GuiLabelData;
    var Gui = (function () {
        function Gui() {
        }
        Gui.GetCamera = function () { return Gui.m_camera; };
        Gui.Init = function (canvas, engine, scene) {
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
        };
        Gui.CreateButton = function (name, file, width, height) {
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
        };
        Gui.CreateLablel = function (name, width, height, text, color, bgcolor) {
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
            var mat = d.mesh.material;
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
        };
        Gui.ChangeText = function (labeldata, text) {
            labeldata.texture.drawText(text, null, 70, labeldata.font, labeldata.color, labeldata.bgcolor);
        };
        // The origin of the Screen is Top Left.  
        Gui.GetScreenToWorld = function (x, y, z) {
            if (z === void 0) { z = 0; }
            var nx = Gui.m_camera.orthoLeft + x;
            var ny = Gui.m_camera.orthoTop - y;
            return new BABYLON.Vector3(nx, ny, z);
        };
        Gui.ScreenMaxX = function () { return Gui.m_canvas.width; };
        Gui.ScreenMaxY = function () { return Gui.m_canvas.height; };
        Gui.LAYER = 0x1000;
        Gui.FONT0 = "bold 70px verdana";
        Gui.LABELTEXTURESIZE = 256;
        return Gui;
    }());
    Util.Gui = Gui;
    var Node = (function () {
        function Node() {
        }
        Node.Traverse = function (root, func) {
            if (root == null)
                return;
            func(root);
            Node._trav(root, func);
        };
        Node._trav = function (node, func) {
            if (node == null)
                return;
            var children = node.getChildren();
            if (children != null) {
                for (var i = 0; i < children.length; i++) {
                    var n = children[i];
                    func(n);
                    Node._trav(n, func);
                }
            }
        };
        return Node;
    }());
    Util.Node = Node;
})(Util || (Util = {}));
//# sourceMappingURL=util.js.map