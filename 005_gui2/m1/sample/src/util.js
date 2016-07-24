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
    var Gui = (function () {
        function Gui() {
        }
        Gui.CreateButton = function (name, file, width, height, scene) {
            var mesh = BABYLON.MeshBuilder.CreatePlane(name, { size: 1, width: 200, height: 75 }, scene);
            mesh.layerMask = Gui.LAYER;
            var mat = new BABYLON.StandardMaterial("mat_" + name, scene);
            mat.fogEnabled = false;
            var tex = new BABYLON.Texture(file, scene);
            mat.diffuseTexture = tex;
            mesh.material = mat;
            return mesh;
        };
        Gui.LAYER = 0x1000;
        return Gui;
    }());
    Util.Gui = Gui;
})(Util || (Util = {}));
//# sourceMappingURL=util.js.map