var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/// <reference path="util_gui.ts"/>
/// <reference path="util_gameObject.ts"/>
var Util;
(function (Util) {
    var Framework = (function () {
        function Framework() {
        }
        Framework.Init = function () {
            Util.GameObject.Init();
        };
        Framework.Update = function () {
            ManeObj.Update();
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
    var ManeObj = (function () {
        function ManeObj() {
            this.uuid = ManeObj.MAXID + 1;
            this.alive = this.enable = true;
            ManeObj.MAXID += 1;
            ManeObj.m_list.push(this);
            this.gameObject = undefined;
        }
        ManeObj.Delete = function (m) {
            for (var i = 0; i < ManeObj.m_list.length; i++) {
                var c = ManeObj.m_list[i];
                if (c != null && c.uuid == m.uuid) {
                    m.OnDestroy();
                    ManeObj.m_list = ManeObj.m_list.splice(i, 1);
                    return;
                }
            }
        };
        ManeObj.Update = function () {
            for (var i = 0; i < ManeObj.m_list.length; i++) {
                var c = ManeObj.m_list[i];
                if (c != null) {
                    var m = c;
                    if (m != null && m.alive && m.enable) {
                        m.Update();
                    }
                }
            }
        };
        ManeObj.prototype.Update = function () {
        };
        ManeObj.prototype.OnDestroy = function () { };
        ManeObj.m_list = new Array(); // 自クラスからのインスタンスを持つ。
        ManeObj.MAXID = 0;
        return ManeObj;
    }());
    Util.ManeObj = ManeObj;
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
    }(ManeObj));
    Util.Manebehaviour_wStateControl = Manebehaviour_wStateControl;
})(Util || (Util = {}));
//# sourceMappingURL=util.js.map