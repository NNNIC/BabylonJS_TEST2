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
    //--- for gui ---
    export class Gui {
        public static LAYER = 0x1000;
        public static PICKED: string;

        public static CreateButton(name: string, file: string, width: number, height: number, scene: BABYLON.Scene): BABYLON.Mesh {
            var mesh = BABYLON.MeshBuilder.CreatePlane(name, { size: 1, width: 200, height: 75 }, scene);
            mesh.layerMask = Gui.LAYER;

            var mat = new BABYLON.StandardMaterial("mat_" + name, scene);
            mat.fogEnabled = false;
            var tex = new BABYLON.Texture(file, scene);
            mat.diffuseTexture = tex;

            mesh.material = mat;            

            //Action
            mesh.actionManager = new BABYLON.ActionManager(scene);
            mesh.actionManager.registerAction(new BABYLON.SetValueAction(BABYLON.ActionManager.OnPickTrigger, Gui, "PICKED", mesh.name));

            return mesh;
        }
    }

}
