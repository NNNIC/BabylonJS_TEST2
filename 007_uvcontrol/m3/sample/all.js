var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Map;
(function (Map) {
    //障害物データ
    //見やすさを優先して、最終行から始まる
    // 7列 x N　
    // マーク   なし---地面
    //           l  --- low box          L -- with cp(Check Point)
    //           m  --- medium box       M -- with cp
    //           h  --- hight  box       H -- with cp
    var test = (function () {
        function test() {
        }
        test.p = [
            //   c
            //0123456
            " h  h   ",
            " h  h   ",
            " h  h   ",
            " h  h   ",
            " h  h   ",
            " h  h   ",
            " h  h   ",
            " h  h   ",
            " h  h   ",
            " h  h   ",
            " h  h   ",
            " h  h   ",
            "    h   ",
            "   hhh h",
            "       h",
            "       h",
            " h     h",
            "    l   ",
            "    l   ",
            "    l   ",
            "l      l",
            "l      l",
            "l      l",
        ];
        return test;
    }());
    Map.test = test;
})(Map || (Map = {}));
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
var Util;
(function (Util) {
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
/// <reference path="util_gui.ts"/>
var Sample;
(function (Sample) {
    var MapManager = (function (_super) {
        __extends(MapManager, _super);
        function MapManager() {
            _super.call(this);
            this.Goto(this.S_START);
        }
        MapManager.prototype.Update = function () {
            _super.prototype.Update.call(this);
        };
        MapManager.prototype.S_START = function (bFirst) {
        };
        return MapManager;
    }(Util.Manebehaviour_wStateControl));
    Sample.MapManager = MapManager;
})(Sample || (Sample = {}));
/// <reference path="../scripts/babylon.d.ts"/>
/// <reference path="util.ts"/>
/// <reference path="util_gui.ts"/>
var Util;
(function (Util) {
    // Like Unity...
    var GameObject = (function (_super) {
        __extends(GameObject, _super);
        function GameObject(node) {
            _super.call(this);
            this.node = node;
        }
        GameObject.Init = function () {
            GameObject.m_gameObject_list = new Array();
        };
        GameObject.Add = function (node) {
            var go = new GameObject(node);
            GameObject.m_gameObject_list.push(go);
            return go;
        };
        GameObject.FindIndex = function (node) {
            var idx = -1;
            for (var i = 0; i < GameObject.m_gameObject_list.length; i++) {
                var go = GameObject.m_gameObject_list[i];
                if (go.node.uniqueId == node.uniqueId) {
                    idx = i;
                    break;
                }
            }
            return idx;
        };
        GameObject.Find = function (node) {
            var idx = GameObject.FindIndex(node);
            return idx >= 0 ? GameObject.m_gameObject_list[idx] : null;
        };
        GameObject.Delete = function (node) {
            var idx = GameObject.FindIndex(node);
            if (idx >= 0) {
                GameObject.m_gameObject_list = GameObject.m_gameObject_list.splice(idx, 1);
            }
        };
        GameObject.prototype.name = function () { return this.node.name; };
        GameObject.prototype.AddManebehaviour = function (mane) {
            if (this.maneobjs == null)
                this.maneobjs = new Array();
            var i = mane;
            i.gameObject = this;
            this.maneobjs.push(i);
        };
        GameObject.prototype.GetManebehaviour = function (classname) {
            for (var _i = 0, _a = this.maneobjs; _i < _a.length; _i++) {
                var i = _a[_i];
                if (typeof (i) == classname) {
                    return i;
                }
            }
            return null;
        };
        GameObject.prototype.manebehaviour = function () {
            if (this.maneobjs != null && this.maneobjs.length > 0) {
                return this.maneobjs[0];
            }
            return null;
        };
        return GameObject;
    }(Util.Obj));
    Util.GameObject = GameObject;
})(Util || (Util = {}));
/// <reference path="util_gui.ts"/>
/// <reference path="util_gameObject.ts"/>
var Util;
(function (Util) {
    var Framework = (function () {
        function Framework() {
        }
        Framework.Init = function (canvas, engine, scene) {
            Framework.canvas = canvas;
            Framework.engine = engine;
            Framework.scene = scene;
            Util.GameObject.Init();
            Util.Gui.Init(canvas, engine, scene);
        };
        Framework.Update = function () {
            Obj.Update();
        };
        return Framework;
    }());
    Util.Framework = Framework;
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
    var Obj = (function () {
        function Obj() {
            this.uuid = Obj.MAXID + 1;
            this.alive = this.enable = true;
            Obj.MAXID += 1;
            Obj.m_list.push(this);
            this.gameObject = undefined;
        }
        Obj.Delete = function (m) {
            for (var i = 0; i < Obj.m_list.length; i++) {
                var c = Obj.m_list[i];
                if (c != null && c.uuid == m.uuid) {
                    m.OnDestroy();
                    Obj.m_list = Obj.m_list.splice(i, 1);
                    return;
                }
            }
        };
        Obj.Update = function () {
            for (var i = 0; i < Obj.m_list.length; i++) {
                var c = Obj.m_list[i];
                if (c != null) {
                    var m = c;
                    if (m != null && m.alive && m.enable) {
                        m.Update();
                    }
                }
            }
        };
        Obj.prototype.Update = function () {
        };
        Obj.prototype.OnDestroy = function () { };
        Obj.m_list = new Array(); // 自クラスからのインスタンスを持つ。
        Obj.MAXID = 0;
        return Obj;
    }());
    Util.Obj = Obj;
    var Manebehaviour_wStateControl = (function (_super) {
        __extends(Manebehaviour_wStateControl, _super);
        function Manebehaviour_wStateControl() {
            _super.apply(this, arguments);
        }
        Manebehaviour_wStateControl.prototype.Goto = function (state) {
            this.m_nextstate = state;
        };
        Manebehaviour_wStateControl.prototype.Update = function () {
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
        return Manebehaviour_wStateControl;
    }(Obj));
    Util.Manebehaviour_wStateControl = Manebehaviour_wStateControl;
})(Util || (Util = {}));
/// <reference path="../scripts/babylon.d.ts"/>
/// <reference path="util"/>
/// <reference path="util_gui.ts"/>
/// <reference path="util_gameObject.ts"/>
var Sample;
(function (Sample) {
    var UVObj = (function (_super) {
        __extends(UVObj, _super);
        function UVObj() {
            _super.call(this);
            this.Goto(this.S_START);
        }
        UVObj.prototype.Update = function () {
            _super.prototype.Update.call(this);
        };
        UVObj.prototype.S_START = function (bFirst) {
            if (bFirst) {
                return;
            }
            var m = this.gameObject.node;
            var mat = m.material;
            var tex = mat.diffuseTexture;
            tex.vOffset = tex.vOffset + 0.01;
            mat.diffuseTexture = tex;
            m.material = mat;
        };
        return UVObj;
    }(Util.Manebehaviour_wStateControl));
    Sample.UVObj = UVObj;
})(Sample || (Sample = {}));
/// <reference path="sample_mapManager.ts"/>
/// <reference path="sample_uvobj.ts"/>
var Sample;
(function (Sample) {
    var MainClass = (function (_super) {
        __extends(MainClass, _super);
        function MainClass(canvas) {
            _super.call(this);
            this.m_engine = new BABYLON.Engine(canvas, true);
            this.m_scene = new BABYLON.Scene(this.m_engine);
            this.m_scene.clearColor = new BABYLON.Color3(56 / 256, 87 / 256, 145 / 256);
            this.m_camera1 = new BABYLON.ArcRotateCamera("camera1", 0, 0.8, 100, BABYLON.Vector3.Zero(), this.m_scene);
            this.m_camera1.attachControl(canvas);
            this.m_camera1.layerMask = ~Util.Gui.LAYER;
            Util.Framework.Init(canvas, this.m_engine, this.m_scene);
            this.m_scene.activeCameras.push(this.m_camera1);
            this.m_scene.activeCameras.push(Util.Gui.GetCamera());
            this.m_scene.cameraToUseForPointers = Util.Gui.GetCamera(); // カメラがポイント指定に使うカメラ
            var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), this.m_scene);
            this.Goto(this.S_LOAD);
        }
        MainClass.prototype.runRenderLoop = function () {
            var _this = this;
            this.m_engine.runRenderLoop(function () {
                Util.Framework.Update();
                _this.Update();
                _this.m_scene.render();
            });
        };
        MainClass.prototype.S_IDLE = function (bFirst) {
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
        };
        MainClass.prototype.S_LOAD = function (bFirst) {
            if (bFirst) {
                this.m_bDone = false;
            }
            var self = this;
            if (bFirst) {
                BABYLON.SceneLoader.Append("./", "data/ma1.babylon", this.m_scene, function (s) { self.m_bDone = true; }, function () { }, function (s) { self.m_bDone = true; });
            }
            if (this.m_bDone) {
                var node = this.m_scene.getNodeByName("ma1");
                var self_1 = this;
                Util.Node.Traverse(node, function (n) {
                    console.log(n.name);
                    var cm = n.getChildMeshes();
                    if (cm != null) {
                        for (var i = 0; i < cm.length; i++) {
                            var m = cm[i];
                            if (m != null)
                                m.layerMask = 1;
                        }
                    }
                });
                console.log("Done!");
                this.Goto(this.S_CREATE_PLANE);
            }
        };
        MainClass.prototype.S_CREATE_PLANE = function (bFirst) {
            if (bFirst) {
                var mesh = BABYLON.MeshBuilder.CreatePlane("plane", { size: 1, width: 500, height: 500, updatable: true }, this.m_scene);
                mesh.layerMask = 1;
                mesh.position = new BABYLON.Vector3(0, -10, 0);
                mesh.rotate(new BABYLON.Vector3(1, 0, 0), Math.PI * (90 / 180));
                var tex = new BABYLON.Texture("data/arrow.png", this.m_scene);
                tex.uScale = tex.vScale = 100;
                var mat = new BABYLON.StandardMaterial("mat_plane", this.m_scene);
                mat.diffuseTexture = tex;
                mesh.material = mat;
                var go = Util.GameObject.Add(mesh);
                var uvobj = new Sample.UVObj();
                go.AddManebehaviour(uvobj);
                this.Goto(this.S_CREATE_MAP_MANAGER);
            }
        };
        MainClass.prototype.S_CREATE_MAP_MANAGER = function (bFirst) {
            if (bFirst) {
                var node = new BABYLON.Node("map_manager", Util.Framework.scene);
                var go = Util.GameObject.Add(node);
                var man = new Sample.MapManager();
                go.AddManebehaviour(man);
                this.Goto(this.S_GUI);
            }
        };
        MainClass.prototype.S_GUI = function (bFirst) {
            if (bFirst) {
                this.m_debugOn = false;
                this.m_debugBtn = Util.Gui.CreateLablel("debug", 100, 50, "debug", "white", "black");
                this.m_debugBtn.mesh.position = Util.Gui.GetScreenToWorld(Util.Gui.ScreenMaxX() - 50, 25);
            }
            else {
                if (Util.Gui.PICKED != null) {
                    var picked = Util.Gui.PICKED;
                    Util.Gui.PICKED = null;
                    if (picked == "debug") {
                        this.m_debugOn = !this.m_debugOn;
                    }
                    if (this.m_debugOn) {
                        this.m_scene.debugLayer.show(true);
                    }
                    else {
                        this.m_scene.debugLayer.hide();
                    }
                }
            }
        };
        MainClass.prototype.S_END = function (bFirst) {
            if (bFirst) {
            }
        };
        return MainClass;
    }(Util.StateControl));
    Sample.MainClass = MainClass;
})(Sample || (Sample = {}));
//# sourceMappingURL=all.js.map