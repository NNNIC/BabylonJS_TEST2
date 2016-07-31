/// <reference path="../scripts/babylon.d.ts"/>
/// <reference path="util.ts"/>
/// <reference path="util_gui.ts"/>
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
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
//# sourceMappingURL=util_gameObject.js.map