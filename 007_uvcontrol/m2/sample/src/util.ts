/// <reference path="util_gui.ts"/>
/// <reference path="util_gameObject.ts"/>
module Util {
    export class Framework {
        public static Init():void {
            Util.GameObject.Init();
        }
        public static Update(): void {
            ManeObj.Update();
        }
    }


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
    export abstract class ManeObj {
        public static m_list: Array<any> = new Array<any>();// 自クラスからのインスタンスを持つ。
        public static Delete(m: any): void {        // インスタンス削除
            for (let i = 0; i < ManeObj.m_list.length; i++) {
                var c: ManeObj = ManeObj.m_list[i];
                if (c != null && c.uuid == m.uuid) {
                    m.OnDestroy();
                    ManeObj.m_list = ManeObj.m_list.splice(i, 1);
                    return;
                }
            }
        }
        public static Update() {
            for (let i = 0; i < ManeObj.m_list.length; i++) {
                let c = ManeObj.m_list[i];
                if (c != null) {
                    let m = <ManeObj>c;
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

        public gameObject: GameObject;

        public constructor() {
            this.uuid = ManeObj.MAXID + 1;
            this.alive = this.enable = true;
            ManeObj.MAXID += 1;
            ManeObj.m_list.push(this);

            this.gameObject = undefined;
        }
        public Update() {
        }
        public OnDestroy()
        {}
    }

    export abstract class Manebehaviour_wStateControl extends ManeObj {
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
}