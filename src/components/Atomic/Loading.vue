<template>
  <div class="spinner" :style="{ width: side + 'px', height: side + 'px' }">
    <transition name="loading">
      <svg
        :viewBox="`0 0 66 66`"
        xmlns="http://www.w3.org/2000/svg"
        class="icon"
      >
        <circle
          class="length"
          fill="none"
          :stroke="color"
          stroke-width="8"
          stroke-linecap="round"
          cx="33"
          cy="33"
          r="28"
        />
      </svg>
    </transition>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import theme from '@/store/modules/theme';
@Component
export default class Loading extends Vue {
  @Prop({ default: 66 })
  public side!: number;
  @Prop({ default: '#fff' })
  public color!: string;
}
</script>

<style lang="scss" scoped>
*,
*:before,
*:after {
  box-sizing: border-box;
  position: relative;
}

svg {
  display: block;
  margin: 0;
  padding: 0;
}

.spinner {
  animation: contanim 2.5s linear infinite;
}

.icon {
  transform-origin: center center;
}

svg {
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  position: absolute;
  circle {
    stroke-dasharray: 1, 200;
    stroke-dashoffset: 0;
    animation: strokeanim 2.5s 0.2s ease infinite;
  }
}

$d: 165.6449737548828;
@keyframes strokeanim {
  0% {
    stroke-dasharray: 1, 200;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 90, 200;
    stroke-dashoffset: -$d / 3;
  }
  100% {
    stroke-dasharray: 90, 200;
    stroke-dashoffset: -$d;
  }
}

@keyframes contanim {
  100% {
    transform: rotate(360deg);
  }
}

.loading {
  &-leave-active {
    transition: all 0.5s cubic-bezier(0.03, 1.04, 0.89, 1.31);
  }
  &-leave-active {
    transition-delay: -0.5s;
  }
  &-leave-to {
    transform: scale(0);
  }
  &-leave-to {
    opacity: 0;
  }
}
</style>
