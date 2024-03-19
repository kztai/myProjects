// 这是使用一个类继承多个类的方式实现的，不过有个缺点：eslint检测时，会找不到原型上的方法（但是实际可以运行）

import DBTable from "./db.table";
import DBCrud from "./db.crud";

function mixin(...mixins: any) {
    class Mix {
        constructor() {
            for (const mixin of mixins) {
                copyProperties(this, new mixin()); // 拷贝实例属性
            }
        }
    }

    for (const mixin of mixins) {
        copyProperties(Mix, mixin); // 拷贝静态属性
        copyProperties(Mix.prototype, mixin.prototype); // 拷贝原型属性

        // 拷贝原型链上的自定义属性：
        let mixinPrototype = mixin.prototype.__proto__;
        while (mixinPrototype && mixinPrototype.constructor !== Object) {
            copyProperties(Mix.prototype, mixinPrototype);
            mixinPrototype = mixinPrototype.__proto__;
        }
    }

    return Mix;
}

function copyProperties(target: any, source: any) {
    for (const key of Reflect.ownKeys(source)) {
        if (key !== "constructor"
            && key !== "prototype"
            && key !== "name"
        ) {
            const desc = Object.getOwnPropertyDescriptor(source, key);
            Object.defineProperty(target, key, desc);
        }
    }
}

class Database extends mixin(DBTable, DBCrud) {
    constructor() {
        super();
    }
}

class Test {
    constructor() { }
    tttt() { }
}

export default Test;

