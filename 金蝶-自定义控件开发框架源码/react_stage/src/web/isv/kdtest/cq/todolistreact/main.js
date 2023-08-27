import React from 'react'
import ReactDOM from 'react-dom'
import TodoList from './components/TodoList'
import eventBus from '../../../../../../util/eventBus'

/**
 * 在setHtml中声明Root类，使用ReactDOM.render将其渲染在model.dom中
 * 在Root类的componentDidMount里，声明一个订阅，用于接收后端更新发过来的消息，从而去更新组件
 * 在update里，发布一个消息，当后端插件给自定义控件传递新数据时，就能将消息发布给Root
 * 在Root类的componentWillUnmount里，取消订阅
 * 在destoryed里，使用ReactDOM.unmountComponentAtNode卸载Root
 * 注意loadFile中index.css的引入路径，因为webpack打包后将其放在了css文件夹里，所以路径是./css/index.css
 */
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
      eventBus.pub(this.model, 'update', props)
    },
    commond: function(args) {

    },
    destoryed: function () {
      console.log('-----destoryed', this.model)
      ReactDOM.unmountComponentAtNode(this.model.dom)
    }
  }

  var setHtml = function (model, primaryProps) {
    KDApi.loadFile('./css/index.css', model, () => {
      class Root extends React.Component {
        constructor(props) {
          super(props)
          this.state = {
            customProps: props.customProps,
            model: props.model
          }
        }
        componentDidMount () {
          const { model } = this.state
          this.updateSub = eventBus.sub(model, 'update', (updateProps) => {
            this.setState({ customProps: updateProps})
          })
        }
        shouldComponentUpdate () {

        }
        componentWillUnmount () {
          eventBus.unsub(this.updateSub)
        }
        render () {
          const { customProps, model } = this.state
          return (
            <TodoList model={model} customProps={customProps} />
          )
        }
      }
      ReactDOM.render(<Root model={model} customProps={primaryProps} />, model.dom)
    })
  }

  // 注册自定义组件
  KDApi.register('todolistreact', MyComponent)
})(window.KDApi)
