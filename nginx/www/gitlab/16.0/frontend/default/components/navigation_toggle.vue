<script>
import GlButton from '@gitlab/ui/src/components/base/button/button.vue';

const mediaQuery = window.matchMedia(`(max-width: 1199px`);

export default {
  components: {
    GlButton,
  },
  props: {
    targetSelector: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      width: null,
      open: null,
    };
  },
  created() {
    this.width = window.innerWidth;
    mediaQuery.addEventListener('change', this.responsiveToggle);
  },
  beforeDestroy() {
    mediaQuery.addEventListener('change', this.responsiveToggle);
  },
  methods: {
    toggle(direction = '') {
      this.targetSelector.forEach((el) => {
        const target = document.querySelector(el);

        if (!target) {
          return;
        }

        switch (direction) {
          case 'open':
            target.classList.add('active');
            this.open = true;
            break;
          case 'close':
            target.classList.remove('active');
            this.open = false;
            break;
          default:
            target.classList.toggle('active');
            this.open = !this.open;
        }
      });
    },
    /**
     * Toggle the menu visibility based on a change event.
     *
     * @param {*} e
     *   A media query change event.
     *   In this method, we use the "matches" property to check
     *   if the media query returns true or false.
     */
    responsiveToggle(e) {
      const newWidth = window.innerWidth;

      // Browser is less wide than 1199px and has decreased in width.
      if (e.matches && newWidth < this.width) {
        this.toggle('close');
      }
      // Browser is wider than 1199px and has increased in width.
      if (!e.matches && newWidth > this.width) {
        this.toggle('open');
      }

      this.width = newWidth;
    },
  },
};
</script>

<template>
  <gl-button
    class="nav-toggle gl-border-none gl-pl-5!"
    icon="chevron-double-lg-right"
    @click="toggle"
  >
    <span class="label gl-ml-2">Collapse sidebar</span>
  </gl-button>
</template>
