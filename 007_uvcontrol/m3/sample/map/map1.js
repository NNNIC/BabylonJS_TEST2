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
//# sourceMappingURL=map1.js.map