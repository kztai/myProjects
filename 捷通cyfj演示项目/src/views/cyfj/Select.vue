<template>
  <div class="select-wrap" @click="showSelectOptions">
    <a class="select-wrap-text" :class="{ 'select-disabled': props.disabled }" href="#" @blur="hideSelectOptions"
      @click.prevent>
      <div class="selected-value">
        <i class="el-icon-arrow-down"></i>
        <div class="selected-text">
          <span class="yellow-color" v-show="CheckedIndex !== optionIndex.correct">原文</span>
          <span class="theme-color" v-show="CheckedIndex === optionIndex.originalAndCorrect">+</span>
          <span class="green-color" v-show="CheckedIndex !== optionIndex.original">规整</span>
        </div>
      </div>

      <ul class="select-options" v-show="showSelect">
        <li class="select-options-item" :class="{ 'checked-option': CheckedIndex === index }"
          v-for="(item, index) in optionsList" :key="index" @click.stop="changeOption(index)">
          <i :class="[CheckedIndex === index ? 'el-icon-circle-check' : 'no-check']"></i>
          <div v-if="(typeof item.value === 'string')" class="item-text" :class="item.class">{{ item.value }}</div>
          <div v-else class="item-text">
            <span v-for="(value, index1) in item.value" :key="index1" :class="item.class[index1]">{{ value }}</span>
          </div>
        </li>
      </ul>
    </a>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

import { type options, optionIndex } from './type'

const CheckedIndex = ref<number>(2)
const showSelect = ref<boolean>(false)

const emit = defineEmits(['optionChange'])
const props = defineProps(['disabled'])

const optionsList: options[] = [
  { value: '原文', class: 'yellow-color' },
  { value: '规整', class: 'green-color' },
  { value: ['原文', '+', '规整'], class: ['yellow-color', 'theme-color', 'green-color'] },
]

function changeOption(index: number) {
  CheckedIndex.value = index
  emit('optionChange', index)
  hideSelectOptions()
}

function showSelectOptions() {
  if (props.disabled) return
  showSelect.value = !showSelect.value
}
function hideSelectOptions() {
  showSelect.value = false
}
</script>

<style scoped lang="scss">
.select-wrap {
  position: relative;
  display: inline-block;
  font-size: 16px;
  text-align: left;
  background-image: url('../../assets/images/Group\ 44.png');
  background-size: 100% 100%;
  padding: 8px 24px;
  width: 146px;
}

.select-wrap:hover {
  border-color: red;
}

.select-wrap .select-wrap-text {
  display: inline-block;
  width: 100%;
  cursor: pointer;
  font-family: PingFang SC-Medium, PingFang SC;
  font-weight: 500;
  color: #00F0FF;

  .selected-value {
    display: flex;

    .el-icon-arrow-down {
      margin-top: 6px;
    }

    .selected-text {
      flex: 1;
      text-align: center;
    }
  }
}

.select-disabled {
  .selected-value {
    opacity: 0.4;
    cursor: not-allowed;
  }
}

.select-options {
  position: absolute;
  top: 46px;
  left: 0;
  width: 146px;
  z-index: 2;
  font-weight: 400;
  cursor: default;
  background: #01153f;
  box-shadow: 0px 0px 8px 0px rgba(0, 240, 255, 0.4);
  border-radius: 8px;
  opacity: 1;
  border: 1px solid #4BB3FF;
  padding: 4px;

  .select-options-item {
    display: flex;
    padding: 6px 10px;
    border-radius: 8px;

    i {
      position: relative;
      margin-top: 4px;
      margin-right: 6px;
      font-size: 22px;
      width: 20px;
      height: 20px;
      border-radius: 50%;
    }

    .item-text {
      font-size: 16px;
      margin-left: 6px;
    }

    .el-icon-circle-check {
      &::before {
        position: absolute;
        top: 0px;
        left: -1px;
      }
    }

    .no-check {
      border: 2px solid #00F0FF;
    }
  }

  .checked-option {
    background-color: #071F52;
  }
}</style>
