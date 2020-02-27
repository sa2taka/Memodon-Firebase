<template>
  <v-row class="mt-1 mb-2">
    <v-col>
      <v-chip :color="label.color" class="user-label" label>
        <span :class="[isCloseToBlack ? 'white--text' : 'black--text']">
          {{ label.text }}
        </span>

        <v-dialog
          v-model="dialog"
          :fullscreen="isSmartphoneWidth"
          max-width="480px"
        >
          <template v-slot:activator="{ on }">
            <v-btn text icon class="ml-auto mr-0" v-on="on">
              <v-icon :color="isCloseToBlack ? 'white' : 'black'" small
                >fa-pen</v-icon
              >
            </v-btn>
          </template>
          <label-editor
            :label="label"
            :isSmartphoneWidth="isSmartphoneWidth"
            @close="dialog = false"
          ></label-editor>
        </v-dialog>
      </v-chip>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import LabelEditor from '@/components/Setting/LabelEditor.vue';
import { MinSmallWidth } from '@/libs/globalConstVariables';
import { Label as ILabel } from '@/types/label';

@Component({
  components: {
    LabelEditor,
  },
})
export default class Label extends Vue {
  @Prop({ required: true })
  public label!: ILabel;

  public isSmartphoneWidth = false;
  public dialog = false;

  public created() {
    this.detectDevice();
    this.subscribeResizeWindow();
  }

  private BoundaryWidth = MinSmallWidth;

  private get isCloseToBlack() {
    const colorMatch = this.label.color.match(
      /#([0-9a-f-A-F]{2})([0-9a-f-A-F]{2})([0-9a-f-A-F]{2})/
    );

    if (!colorMatch) {
      return false;
    }

    const [_, ...color] = colorMatch;
    return color.reduce((a, b) => a + parseInt(b, 16), 0) / 3 < 128;
  }

  private detectDevice() {
    if (window.innerWidth > this.BoundaryWidth) {
      this.isSmartphoneWidth = false;
    } else {
      this.isSmartphoneWidth = true;
    }
  }

  private subscribeResizeWindow() {
    window.addEventListener('resize', () => {
      this.detectDevice();
    });
  }
}
</script>

<style lang="scss">
.user-label {
  min-width: 18em;
  // HACK
  & > .v-chip__content {
    width: 100%;
  }
}
</style>
