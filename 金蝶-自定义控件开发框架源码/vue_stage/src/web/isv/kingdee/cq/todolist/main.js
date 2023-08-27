// 在main.js上通过import引入Vue库和自己写的Vue组件库
import Vue from 'vue';
import TodoList from './components/TodoList.vue';

(function (KDApi) {
  function MyComponent (model) {
    this._setModel(model)
  }

  MyComponent.prototype = {
    _setModel: function (model) {
      this.model = model
    },
    init: function (props) {
      console.log('-----init', this.model.style, props)
      setHtml(this.model, props)
    },
    update: function (props) {
      console.log('-----update', this.model, props)
      // updateHtml(this.model, props)
    },
    destoryed: function () {
      console.log('-----destoryed', this.model)
    }
  }

  const setHtml = (model, props) => {
    const todoListData = props.data ? props.data.todoListData : []
    KDApi.loadFile('./css/index.css', model, () => {
      new Vue({
        el: model.dom,
        template: '<TodoList :todoListData="todoListData" v-on:addTodo="addTodo" v-on:removeTodo="removeTodo" />',
        components: {
          TodoList
        },
        data: {
          nextTodoId: 4,
          todoListData: todoListData || [
            {
              id: 1,
              text: 'Learn Vue'
            },
            {
              id: 2,
              text: 'Learn about single-file components'
            },
            {
              id: 3,
              text: 'Fall in love'
            }
          ]
        },
        destoryed () {
          console.log('Vue destory')
        },
        methods: {
          invoke: function (eventName, args) {
            invoke(eventName, args)
          },
          addTodo: function (trimmedText) {
            if (trimmedText) {
              this.todoListData.push({
                id: this.nextTodoId++,
                text: trimmedText
              })
            }
          },
          removeTodo: function (idToRemove) {
            this.todoListData = this.todoListData.filter(todo => {
              return todo.id !== idToRemove
            })
          }
        }
      })
    })
  }

  // 注册自定义组件
  KDApi.register('Todolist', MyComponent)
})(window.KDApi)
