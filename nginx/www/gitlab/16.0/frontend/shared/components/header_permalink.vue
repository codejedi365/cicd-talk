<script>
export default {
  name: 'HeaderPermalink',
  props: {
    text: {
      type: String,
      required: true,
    },
  },
  computed: {
    htmlID() {
      return this.text.replaceAll(' ', '-').toLowerCase();
    },
  },
};
</script>

<template>
  <h2 :id="htmlID">{{ text }}<a :href="`#${htmlID}`" title="Permalink" class="anchor"></a></h2>
</template>
