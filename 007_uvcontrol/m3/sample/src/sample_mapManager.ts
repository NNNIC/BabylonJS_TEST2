/// <reference path="util_gui.ts"/>

module Sample {

    export class MapManager extends Util.Manebehaviour_wStateControl {

        constructor() {
            super();
            this.Goto(this.S_START);
        }

        public Update(): void {
            super.Update();
        }

        private S_START(bFirst: boolean) {

        }
    }
}