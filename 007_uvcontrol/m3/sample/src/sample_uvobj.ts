/// <reference path="../scripts/babylon.d.ts"/>
/// <reference path="util"/>
/// <reference path="util_gui.ts"/>
/// <reference path="util_gameObject.ts"/>


module Sample {

    export class UVObj extends Util.Manebehaviour_wStateControl {

        constructor() {
            super();
            this.Goto(this.S_START);
        }

        public Update(): void {
            super.Update();
        }

        private S_START(bFirst: boolean): void {
            if (bFirst) {
                return;
            }
            let m = <BABYLON.Mesh>this.gameObject.node;
            let mat = <BABYLON.StandardMaterial>m.material;
            let tex = <BABYLON.Texture>mat.diffuseTexture;

            tex.vOffset = tex.vOffset + 0.05;
            mat.diffuseTexture = tex;
            m.material = mat;
        }
    }
}