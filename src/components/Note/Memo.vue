<template>
  <v-col xs="12" md="6" lg="4">
    <v-card min-width="320px" class="ml-8 mt-8">
      <v-row>
        <v-col>
          <p>{{ text }}</p>
        </v-col>
      </v-row>
    </v-card>
  </v-col>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
@Component({
  components: {},
})
export default class Memo extends Vue {
  @Prop({ required: true })
  public text?: string;
}
</script>

<style lang="scss">
.memo-paper {
  background-image: linear-gradient(
    180deg,
    rgba(204, 204, 204, 0) 0%,
    rgba(204, 204, 204, 0) 98.5%,
    #444444 100%
  );
  background-repeat: repeat-y;
  background-size: 100% 2.4em;
  line-height: 2.4;
}
</style>
