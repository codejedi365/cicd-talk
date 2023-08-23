<script>
import { GlButton } from '@gitlab/ui';

export default {
  components: {
    GlButton,
  },
  props: {
    text: {
      type: String,
      required: false,
      default: '',
    },
    show: {
      type: Boolean,
      required: false,
      default: true,
    },
  },
  data() {
    return {
      isVisible: this.show,
    };
  },
  mounted() {
    this.toggleBanner(this.isVisible);
  },
  methods: {
    toggleBanner(isVisible) {
      this.$emit('toggle', isVisible);
      this.isVisible = isVisible;
    },
  },
};
</script>

<template>
  <div
    v-if="isVisible"
    class="gl-z-index-3 gl-left-0 gl-bg-gray-50 gl-border-b-gray-200 gl-fixed gl-w-full gl-text-center"
  >
    <span v-if="text">{{ text }}</span>
    <slot></slot>
    <gl-button
      icon="close"
      class="gl-shadow-none! gl-bg-transparent!"
      @click="toggleBanner(false)"
    />
  </div>
</template>
