<template>
  <div d-flex class="label-list">
    <v-chip
      :color="label.color"
      small
      v-for="label in labels"
      :key="label.id"
      class="ml-2"
      >{{ label.text }}</v-chip
    >
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class LabelList extends Vue {
  @Prop({ required: true })
  labels!: {
    id: string;
    color: string;
    text: string;
    tags: string[];
    appendDate: firebase.firestore.Timestamp;
  };
}
</script>

<style lang="scss">
.label-list {
  min-height: 26px;
}
</style>
