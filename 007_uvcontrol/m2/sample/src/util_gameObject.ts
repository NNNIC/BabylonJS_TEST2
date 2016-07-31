/// <reference path="../scripts/babylon.d.ts"/>
/// <reference path="util.ts"/>

module Util {
    // Like Unity...
    export class GameObject extends ManeObj{

        public static m_gameObject_list: GameObject[];
        public static Init(): void {
            GameObject.m_gameObject_list = new Array();
        }
        public static Add(node: BABYLON.Node): GameObject {
            let go = new GameObject(node);
            GameObject.m_gameObject_list.push(go);
            return go;
        }
        public static FindIndex(node: BABYLON.Node): number {
            let idx: number = -1;
            for (let i = 0; i < GameObject.m_gameObject_list.length; i++) {
                var go = GameObject.m_gameObject_list[i];
                if (go.node.uniqueId == node.uniqueId) { idx = i; break; }
            }
            return idx;
        }
        public static Find(node: BABYLON.Node): GameObject {
            var idx: number = GameObject.FindIndex(node);
            return idx >= 0 ? GameObject.m_gameObject_list[idx] : null;
        }
        public static Delete(node: BABYLON.Node): void {
            let idx: number = GameObject.FindIndex(node);
            if (idx >= 0) {
                GameObject.m_gameObject_list = GameObject.m_gameObject_list.splice(idx, 1);
            }
        }

        constructor(node: BABYLON.Node) {
            super();
            this.node = node;
        }

        public name(): string { return this.node.name; }
        public node: BABYLON.Node;
        public maneobjs: Util.ManeObj[];
        public AddManebehaviour(mane: any): void {
            if (this.maneobjs == null) this.maneobjs = new Array();
            let i = <ManeObj>mane;
            i.gameObject = this;
            this.maneobjs.push(i);
        }
        public GetManebehaviour(classname: string): ManeObj {
            for (let i of this.maneobjs) {
                if (typeof (i) == classname) {
                    return i;
                }
            }
            return null;
        }
        public manebehaviour(): ManeObj {
            if (this.maneobjs != null && this.maneobjs.length > 0) {
                return this.maneobjs[0];
            }
            return null;
        } 
    }

}