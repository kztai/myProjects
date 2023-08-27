'use strict';

(function () {

    var util = {
        css: function css(elem, obj) {
            for (var i in obj) {
                elem.style[i] = obj[i];
            }
        },
        hasClass: function hasClass(elem, classN) {
            var className = elem.getAttribute("class");
            return className.indexOf(classN) != -1;
        }
    };

    function Colorpicker(opt) {
        if (this === window) throw 'Colorpicker: Can\'t call a function directly';
        this.init(opt);
    }

    Colorpicker.prototype = {
        init: function init(opt) {
            // 初始化变量：
            var _this = this;
            var el = opt.el,
                _opt$color = opt.color,
                color = _opt$color === undefined ? '#FF96AD' : _opt$color;

            this.Opt = {
                rootDom: opt.rootDom,
                change: opt.change,
                el: el,
                color: color
            };

            this.bindElem = this.Opt.rootDom.getElementById(el); // 绑定的元素
            if (!(this.bindElem && this.bindElem.nodeType && this.bindElem.nodeType === 1)) {
                throw 'Colorpicker: not found  ID:' + el + '  HTMLElement,not ' + {}.toString.call(el);
            }

            // 初始化颜色数据：
            this.rgba = this.hexToRgba(color);
            this.hsb = this.hexToHsb(color);

            // 获取dom：
            var div = this.Opt.rootDom.querySelector(".color-picker-main");
            this.elem_icon = this.Opt.rootDom.querySelector(".color-picker-icon");
            this.elem_wrap = div; // 最外层容器
            this.fixedBg = div.children[0]; // 拾色器后面固定定位的透明div 用于点击隐藏拾色器
            this.elem_colorPalette = div.getElementsByClassName("color-palette")[0];

            // 初始化颜色按钮：
            this.elem_colorPalette.innerHTML = this.getPaletteColorsItem();
            // 初始化弹出框大小：
            this.pancel_width = this.elem_colorPalette.offsetWidth;
            this.pancel_height = this.elem_colorPalette.offsetHeight;
            // 弹出框隐藏
            util.css(div, {"display": 'none'});

            this.bindElem.addEventListener("click", function () {
                _this.show();
            }, false);

            this.fixedBg.addEventListener("click", function (e) {
                _this.hide();
            }, false);

            this.elem_colorPalette.addEventListener("click", function (e) {
                if (e.target.tagName.toLocaleLowerCase() === "p") {
                    let colorStr = e.target.style.background;
                    let rgb = colorStr.slice(4, -1).split(",");
                    let rgba = {
                        r: parseInt(rgb[0]),
                        g: parseInt(rgb[1]),
                        b: parseInt(rgb[2]),
                    };

                    var hex = "#" + _this.rgbToHex(rgba);

                    _this.setColorByInput(hex);
                    _this.hide();
                }
            }, false);

            color != '' && this.setColorByInput(color);
        },

        getPaletteColorsItem: function () {
            let str = '';
            let palette = [
                "#FF96AD", "#FFADB6", "#FFCAA8", "#FFE0A6", "#FFEF8A", "#DDFF8F",
                "#FF3A72", "#FF5257", "#FF854D", "#FFB44A", "#FFD52E", "#99D92B",
                "#D10049", "#D1130D", "#D63C09", "#D67206", "#D49B00", "#589C00",
                "#800035", "#800D00", "#851800", "#853C00", "#825700", "#254A00",
                "#D4A8FF", "#99CCFF", "#B3D5FF", "#A1ECFF", "#A1F5E8", "#A1E6B5",
                "#9A4DFF", "#3987ED", "#5797FF", "#45CDFF", "#3DCCC0", "#40BD6E",
                "#4E08C7", "#0041B0", "#104CCC", "#0287C9", "#008F8C", "#0A803D",
                "#230075", "#001C5E", "#001F7A", "#004878", "#003A3D", "#002E17"
            ];
            palette.forEach(item => str += `<p style='background:${item};'></p>`);
            return str;
        },

        setColorByInput: function setColorByInput(value) {
            this.hsb = this.hexToHsb(value);
            this.rgba = this.hexToRgba(value);

            // 改变颜色选择器弹出按钮的颜色：
            var hex = '#' + this.rgbToHex(this.HSBToRGB(this.hsb));
            this.Opt.change(this.bindElem, hex);
        },

        show: function show() {
            var elem = this.bindElem;
            var top = elem.offsetTop;
            var left = elem.offsetLeft;
            while (elem.offsetParent) {
                top += elem.offsetParent.offsetTop;
                left += elem.offsetParent.offsetLeft;
                elem = elem.offsetParent;
            }

            this.pancelLeft = left;
            this.pancelTop = top + this.bindElem.offsetHeight + 2;

            if(this.pancel_width + this.pancelLeft > document.documentElement.clientWidth) this.pancelLeft = document.documentElement.clientWidth-this.pancel_width;
            if(this.pancel_height + this.pancelTop > document.documentElement.clientHeight) this.pancelTop = top-this.pancel_height-2;

            // 固定弹出框位置
            util.css(this.elem_wrap, {
                "display": "block",
                "left": this.pancelLeft + "px",
                "top": this.pancelTop + "px"
            });
            // 箭头180度旋转
            util.css(this.elem_icon, {
                "transform": "rotate(180deg)"
            });

            // 改变颜色选择器弹出按钮的颜色：
            var hex = '#' + this.rgbToHex(this.HSBToRGB(this.hsb));
            this.Opt.change(this.bindElem, hex);
        },
        hide: function hide() {
            // 箭头180度旋转
            util.css(this.elem_icon, {
                "transform": "rotate(0)"
            });
            // 弹出框隐藏
            util.css(this.elem_wrap, {
                "display": "none"
            });
        },
        HSBToRGB: function HSBToRGB(hsb) {
            var rgb = {};
            var h = Math.round(hsb.h);
            var s = Math.round(hsb.s * 255 / 100);
            var v = Math.round(hsb.b * 255 / 100);

            if (s == 0) {
                rgb.r = rgb.g = rgb.b = v;
            } else {
                var t1 = v;
                var t2 = (255 - s) * v / 255;
                var t3 = (t1 - t2) * (h % 60) / 60;

                if (h == 360) h = 0;

                if (h < 60) {
                    rgb.r = t1;
                    rgb.b = t2;
                    rgb.g = t2 + t3;
                } else if (h < 120) {
                    rgb.g = t1;
                    rgb.b = t2;
                    rgb.r = t1 - t3;
                } else if (h < 180) {
                    rgb.g = t1;
                    rgb.r = t2;
                    rgb.b = t2 + t3;
                } else if (h < 240) {
                    rgb.b = t1;
                    rgb.r = t2;
                    rgb.g = t1 - t3;
                } else if (h < 300) {
                    rgb.b = t1;
                    rgb.g = t2;
                    rgb.r = t2 + t3;
                } else if (h < 360) {
                    rgb.r = t1;
                    rgb.g = t2;
                    rgb.b = t1 - t3;
                } else {
                    rgb.r = 0;
                    rgb.g = 0;
                    rgb.b = 0;
                }
            }

            return { r: Math.round(rgb.r), g: Math.round(rgb.g), b: Math.round(rgb.b)};
        },
        rgbToHex: function rgbToHex(rgb) {
            var hex = [rgb.r.toString(16), rgb.g.toString(16), rgb.b.toString(16)];
            hex.map(function (str, i) {
                if (str.length == 1) {
                    hex[i] = '0' + str;
                }
            });

            return hex.join('');
        },
        hexToRgba: function hexToRgba(hex) {
            return {
                r: parseInt(hex.slice(1, 3), 16),
                g: parseInt(hex.slice(3, 5), 16),
                b: parseInt(hex.slice(5, 7), 16),
                a: hex.length === 9 ? parseInt(hex.slice(-2), 16) / 255 : 1
            };
        },
        hexToHsb: function hexToHsb(hex) {
            return this.rgbToHsb(this.hexToRgba(hex));
        },
        rgbToHsb: function rgbToHsb(rgb) {
            var hsb = { h: 0, s: 0, b: 0 };
            var min = Math.min(rgb.r, rgb.g, rgb.b);
            var max = Math.max(rgb.r, rgb.g, rgb.b);
            var delta = max - min;
            hsb.b = max;
            hsb.s = max != 0 ? 255 * delta / max : 0;
            if (hsb.s != 0) {
                if (rgb.r == max) hsb.h = (rgb.g - rgb.b) / delta;else if (rgb.g == max) hsb.h = 2 + (rgb.b - rgb.r) / delta;else hsb.h = 4 + (rgb.r - rgb.g) / delta;
            } else hsb.h = -1;
            hsb.h *= 60;
            if (hsb.h < 0) hsb.h += 360;
            hsb.s *= 100 / 255;
            hsb.b *= 100 / 255;
            return hsb;
        }
    };

    Colorpicker.create = function (opt) {
        return new Colorpicker(opt);
    };

    window.Colorpicker = Colorpicker;
})();