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

    */
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
        };
        // The origin of the Screen is Top Left.  
        Gui.GetScreenToWorld = function (x, y, z) {
            if (z === void 0) { z = 0; }
            var nx = Gui.m_camera.orthoLeft + x;
            var ny = Gui.m_camera.orthoTop - y;
            return new BABYLON.Vector3(nx, ny, z);
        };
        Gui.LAYER = 0x1000;
        return Gui;
    }());
    Util.Gui = Gui;
})(Util || (Util = {}));
//# sourceMappingURL=util.js.map