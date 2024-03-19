// Page 构造器适用于简单的页面。但对于复杂的页面， Page 构造器可能并不好用。此时，可以使用 Component 构造器来构造页面。
// Component 构造器的主要区别是：方法需要放在 methods: { } 里面。
// 这种创建方式非常类似于 自定义组件 ，可以像自定义组件一样使用 behaviors 等高级特性。

Component({

  options: {
    // 1、使外部可以控制组件内样式：
    // （1）可选项：isolated：开启样式隔离； apply-shared：页面会影响组件，但组件不会影响页面； shared：页面与组件相互影响，同时影响其他设置apply-shared、shared的组件。
    // （2）第二种方式：在.json文件中，添加 "styleIsolation": "isolated"
    styleIsolation: "isolated",
    ///2、指定所有以_开头的字段为纯数据字段：
    pureDataPattern: /^_/
  },

  /**
   * 组件的属性列表
   * 3、可读可写，与this.data是同一个对象
   */
  properties: {
    max: {
      type: Number,
      value: 10
    },
    min: Number
  },

  /**
   * 组件的初始数据
   * 3、与this.properties是同一个对象
   */
  data: {
    _inner: true,   // 纯数据字段
    name: 'kzt',
    num1: 0,
    num2: 0,
    sum: 0,
    obj: {
      aa: 1,
      bb: 2
    }
  },

  // 5、监听器，类似vue中的watch
  // 与vue中不一样的地方是：一个key可以同时监听多个属性，参数也是对应属性的新值。
  observers: {
    'num1, num2': function (newValue1, newValue2) {
      this.setData({
        sum: newValue1 + newValue2
      })
    },

    // 6、使用 对象.属性 的方式，监听对象属性的变化：
    'obj.a': function (newValue) {
      console.log(newValue);
    },

    // 7、使用 ** 表示监听对象内的所有属性：
    'obj.**': function (newObj) {
      console.log(newObj);
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    showInfo() {
      this.setData({
        min: 3344
      })
      // this.data.name = '2233'
      console.log(this.data);
      console.log(this.properties);
      console.log(this.data === this.properties);
    },
    num1Add() {
      this.setData({
        num1: this.data.num1 + 1
      })
    },
    num2Add() {
      this.setData({
        num2: this.data.num2 + 1
      })
    },
  }
})