"use strict";

(function () {
    var util = {
        css: function (elem, obj) {
            for (var i in obj) {
                elem.style[i] = obj[i];
            }
        },
        hasClass: function (elem, classN) {
            var className = elem.getAttribute("class");
            return className.indexOf(classN) != -1;
        }
    };

    function Colorpicker(opt) {
        if (this === window) throw `Colorpicker: Can't call a function directly`;
        this.init(opt);
    }

    Colorpicker.prototype = {
        init(opt) {
            // 初始化变量：
            let _this = this;

            let {
                el,
                allMode = ['hex', 'rgb'],
                color = '#ff0000'
            } = opt;
            this.bindElem = document.getElementById(el); // 绑定的元素

            if (!(this.bindElem && this.bindElem.nodeType && this.bindElem.nodeType === 1)) {
                throw `Colorpicker: not found  ID:${el}  HTMLElement,not ${{}.toString.call(el)}`;
            }

            this.Opt = {
                ...opt,
                el,
                allMode,
                color
            };
            this.pancelLeft = 0;
            this.pancelTop = 0;
            this.downX = 0;
            this.downY = 0;
            this.moveX = 0;
            this.moveY = 0;
            this.pointLeft = 0;
            this.pointTop = 0;
            this.current_mode = 'hex'; // input框当前的模式
            // 初始化颜色数据：

            this.rgba = this.hexToRgba(color);
            this.hsb = this.hexToHsb(color); // 获取dom：

            let div = document.querySelector(".color-picker-main");
            this.elem_wrap = div; // 最外层容器

            this.fixedBg = div.children[0]; // 拾色器后面固定定位的透明div 用于点击隐藏拾色器

            this.elem_colorPancel = div.getElementsByClassName("color-pancel")[0]; // 色彩面板

            this.pancel_width = this.elem_colorPancel.offsetWidth;
            this.pancel_height = this.elem_colorPancel.offsetHeight;
            this.elem_picker = div.getElementsByClassName("pickerBtn")[0]; // 拾色器色块按钮
            // 颜色域滑动条部分：

            this.elem_showColor = div.getElementsByClassName("colorpicker-showColor")[0]; // 显示当前颜色

            this.elem_barPicker1 = div.getElementsByClassName("colorBar-color-picker")[0]; // 颜色条
            // 透明度滑动条部分：

            this.elem_barPicker2 = div.getElementsByClassName("colorBar-opacity-picker")[0]; // 透明度滑动条

            this.elem_hexInput = div.getElementsByClassName("colorpicker-hexInput")[0]; // 显示hex的表单

            this.elem_inputWrap = div.getElementsByClassName("colorpicker-inputWrap")[0]; // 输入框外层容器

            this.elem_colorGradient = div.getElementsByClassName("slider-bottom-color-gradient")[0]; // 透明度滑动条-渐变色部分

            this.elem_commitBtn = div.getElementsByClassName("color-picker-commit")[0]; // 提交按钮

            var elem = this.bindElem;
            var top = elem.offsetTop;
            var left = elem.offsetLeft;

            while (elem.offsetParent) {
                top += elem.offsetParent.offsetTop;
                left += elem.offsetParent.offsetLeft;
                elem = elem.offsetParent;
            }

            this.pancelLeft = left;
            this.pancelTop = top + this.bindElem.offsetHeight;
            util.css(div, {
                "position": "absolute",
                "z-index": 2,
                "display": 'none',
                "left": left + "px",
                "top": top + this.bindElem.offsetHeight + 10 + "px"
            }); // 初始化数据：

            util.css(this.elem_colorPancel, {
                'background': `rgb(${this.rgba.r}, ${this.rgba.g}, ${this.rgba.b})`
            });
            util.css(this.elem_showColor, {
                'background': `rgb(${this.rgba.r}, ${this.rgba.g}, ${this.rgba.b})`
            });
            var hex = "#" + this.rgbToHex(this.HSBToRGB(this.hsb));
            this.elem_hexInput.value = hex.slice(-2) === 'ff' ? hex.slice(0, -2) : hex; // 设置透明度滑动条的初始颜色

            this.setGradientColor(); // 绑定事件：

            this.bindMove(this.elem_colorPancel, this.setPosition, true);
            this.bindMove(this.elem_barPicker1.parentNode, this.setBar, false);
            this.bindMove(this.elem_barPicker2.parentNode, this.setBar, false);
            this.bindElem.addEventListener("click", function () {
                _this.show();
            }, false);
            this.fixedBg.addEventListener("click", function (e) {
                _this.hide();
            }, false);
            this.elem_commitBtn.addEventListener("click", function (e) {
                _this.hide();
            }, false);
            this.elem_wrap.addEventListener("input", function (e) {
                var target = e.target,
                    value = target.value;

                _this.setColorByInput(value);
            }, false);
            color != '' && this.setColorByInput(color);
        },

        setPosition(x, y) {
            var LEFT = parseInt(x - this.pancelLeft),
                TOP = parseInt(y - this.pancelTop);
            this.pointLeft = Math.max(0, Math.min(LEFT, this.pancel_width));
            this.pointTop = Math.max(0, Math.min(TOP, this.pancel_height));
            util.css(this.elem_picker, {
                left: this.pointLeft + "px",
                top: this.pointTop + "px"
            });
            this.hsb.s = parseInt(100 * this.pointLeft / this.pancel_width);
            this.hsb.b = parseInt(100 * (this.pancel_height - this.pointTop) / this.pancel_height);
            this.setShowColor(this.elem_showColor);
            this.setValue(this.rgba);
            this.setGradientColor();
        },

        setBar: function (elem, x) {
            var elem_bar = elem.getElementsByTagName("div")[0],
                rect = elem.getBoundingClientRect(),
                elem_width = elem.offsetWidth,
                X = Math.max(0, Math.min(x - rect.x, elem_width));

            if (elem_bar === this.elem_barPicker1) {
                util.css(elem_bar, {
                    left: X + "px"
                });
                this.hsb.h = parseInt(360 * X / elem_width);
                this.setPancelColor(this.hsb.h);
            } else {
                util.css(elem_bar, {
                    left: X + "px"
                });
                this.rgba.a = X / elem_width;
            }

            this.setShowColor(this.elem_showColor);
            this.setValue(this.rgba);
            this.setGradientColor();
        },
        setPancelColor: function (h) {
            var rgb = this.HSBToRGB({
                h: h,
                s: 100,
                b: 100
            });
            util.css(this.elem_colorPancel, {
                background: 'rgba(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ',' + this.rgba.a + ')'
            });
        },
        setShowColor: function (elem) {
            var rgb = this.HSBToRGB(this.hsb);
            this.rgba.r = rgb.r;
            this.rgba.g = rgb.g;
            this.rgba.b = rgb.b;
            util.css(elem, {
                background: 'rgba(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ',' + this.rgba.a + ')'
            });
        },
        setGradientColor: function () {
            util.css(this.elem_colorGradient, {
                "background": `linear-gradient(to right, rgba(${this.rgba.r}, ${this.rgba.g}, ${this.rgba.b}, 0), rgba(${this.rgba.r}, ${this.rgba.g}, ${this.rgba.b}, 1))`
            });
        },
        setValue: function (rgb) {
            var hex = "#" + this.rgbToHex(rgb);
            this.elem_hexInput.value = hex.slice(-2) === 'ff' ? hex.slice(0, -2) : hex; // this.elem_hexInput.value = "#" + this.rgbToHex(this.HSBToRGB(this.hsb));

            this.Opt.change(this.bindElem, hex);
        },
        setColorByInput: function (value) {
            if (value.length === 4) {
                value = value[0] + value[1] + value[1] + value[2] + value[2] + value[3] + value[3];
                this.hsb = this.hexToHsb(value);
                this.rgba = this.hexToRgba(value);
            } else if (value.length === 7) {
                this.hsb = this.hexToHsb(value);
                this.rgba = this.hexToRgba(value);
            } else if (value.length === 9) {
                this.hsb = this.hexToHsb(value);
                this.rgba = this.hexToRgba(value);
            }

            this.changeViewByHsb();
            this.changeTransparent();
        },
        changeViewByHsb: function () {
            // 改变拾色器色块按钮的位置
            this.pointLeft = parseInt(this.hsb.s * this.pancel_width / 100);
            this.pointTop = parseInt((100 - this.hsb.b) * this.pancel_height / 100);
            util.css(this.elem_picker, {
                left: this.pointLeft + "px",
                top: this.pointTop + "px"
            }); // 改变面板的颜色位置

            this.setPancelColor(this.hsb.h); // 改变圆形显示的颜色

            this.setShowColor(this.elem_showColor); // 改变滑动块按钮的位置：

            util.css(this.elem_barPicker1, {
                left: this.hsb.h / 360 * this.elem_barPicker1.parentNode.offsetWidth + "px"
            }); // 改变颜色选择器弹出按钮的颜色：

            var hex = '#' + this.rgbToHex(this.HSBToRGB(this.hsb));
            this.Opt.change(this.bindElem, hex);
        },
        changeTransparent: function () {
            // 改变圆形显示的颜色
            this.setShowColor(this.elem_showColor); // 改变滑动块按钮的位置

            util.css(this.elem_barPicker2, {
                left: this.rgba.a * this.elem_barPicker2.parentNode.offsetWidth + "px"
            }); // 改变颜色选择器弹出按钮的颜色：

            var hex = '#' + this.rgbToHex(this.HSBToRGB(this.hsb));
            this.Opt.change(this.bindElem, hex);
        },
        bindMove: function (elem, fn, bool) {
            var _this = this;

            elem.addEventListener("mousedown", function (e) {
                _this.downX = e.pageX;
                _this.downY = e.pageY;
                bool ? fn.call(_this, _this.downX, _this.downY) : fn.call(_this, elem, _this.downX, _this.downY);
                document.addEventListener("mousemove", mousemove, false);

                function mousemove(e) {
                    _this.moveX = e.pageX;
                    _this.moveY = e.pageY;
                    bool ? fn.call(_this, _this.moveX, _this.moveY) : fn.call(_this, elem, _this.moveX, _this.moveY);
                    e.preventDefault();
                }

                document.addEventListener("mouseup", mouseup, false);

                function mouseup(e) {
                    document.removeEventListener("mousemove", mousemove, false);
                    document.removeEventListener("mouseup", mouseup, false);
                }
            }, false);
        },
        show: function () {
            util.css(this.elem_wrap, {
                "display": "block"
            });
            this.changeViewByHsb();
            this.changeTransparent();
        },
        hide: function () {
            util.css(this.elem_wrap, {
                "display": "none"
            });
        },
        HSBToRGB: function (hsb) {
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

            return {
                r: Math.round(rgb.r),
                g: Math.round(rgb.g),
                b: Math.round(rgb.b),
                a: this.rgba.a
            };
        },
        rgbToHex: function (rgb) {
            var hex = [rgb.r.toString(16), rgb.g.toString(16), rgb.b.toString(16), parseInt(rgb.a * 255).toString(16)];
            hex.map(function (str, i) {
                if (str.length == 1) {
                    hex[i] = '0' + str;
                }
            });
            return hex.join('');
        },
        hexToRgba: function (hex) {
            return {
                r: parseInt(hex.slice(1, 3), 16),
                g: parseInt(hex.slice(3, 5), 16),
                b: parseInt(hex.slice(5, 7), 16),
                a: hex.length === 9 ? parseInt(hex.slice(-2), 16) / 255 : 1
            };
        },
        hexToHsb: function (hex) {
            return this.rgbToHsb(this.hexToRgba(hex));
        },
        rgbToHsb: function (rgb) {
            var hsb = {
                h: 0,
                s: 0,
                b: 0
            };
            var min = Math.min(rgb.r, rgb.g, rgb.b);
            var max = Math.max(rgb.r, rgb.g, rgb.b);
            var delta = max - min;
            hsb.b = max;
            hsb.s = max != 0 ? 255 * delta / max : 0;

            if (hsb.s != 0) {
                if (rgb.r == max) hsb.h = (rgb.g - rgb.b) / delta; else if (rgb.g == max) hsb.h = 2 + (rgb.b - rgb.r) / delta; else hsb.h = 4 + (rgb.r - rgb.g) / delta;
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