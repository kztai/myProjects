<template>
	<div>
		<BaseInputText 
			v-model="newTodoText"
			placeholder="New todo"
			@keydown.enter="addTodo"
		/>
		<ul v-if="todoListData.length">
			<TodoListItem
				v-for="todo in todoListData"
				:key="todo.id"
				:todo="todo"
				@remove="removeTodo"
			/>
		</ul>
		<p v-else>
			Nothing left in the list. Add a new todo in the input above.
		</p>
	</div>
</template>

<script>
import BaseInputText from './BaseInputText.vue'
import TodoListItem from './TodoListItem.vue'

let nextTodoId = 1

export default {
	components: {
		BaseInputText, TodoListItem
	},
	props: {
		todoListData: {
			type: Array,
			default: []
		}
	},
  data () {
    return {
			newTodoText: ''
    }
  },
	methods: {
		addTodo () {
			const trimmedText = this.newTodoText.trim()
			if (trimmedText) {
				this.$emit('addTodo', trimmedText)
				this.newTodoText = ''
			}
		},
		removeTodo (idToRemove) {
			this.$emit('removeTodo', idToRemove)
		}
	}
}
</script>