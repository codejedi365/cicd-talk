<script>
import { GlFormCheckboxGroup } from '@gitlab/ui';

export default {
  name: 'SearchFilters',
  components: {
    GlFormCheckboxGroup,
  },
  data() {
    return {
      selected: [],
    };
  },
  created() {
    this.filters = [
      {
        title: 'Filter by',
        options: [
          {
            text: 'Installation docs',
            value: 'Install,Subscribe',
          },
          {
            text: 'Administration docs',
            value: 'Administer,Subscribe',
          },
          {
            text: 'User docs',
            value: 'Use GitLab,Tutorials,Subscribe',
          },
          {
            text: 'Developer (API) docs',
            value: 'Develop',
          },
          {
            text: 'Contributor docs',
            value: 'Contribute',
          },
        ],
      },
    ];
  },
};
</script>

<template>
  <div>
    <div v-for="filter in filters" :key="filter.title">
      <h2 class="gl-font-lg! gl-mt-0! gl-mb-3!">{{ filter.title }}</h2>
      <gl-form-checkbox-group
        v-model="selected"
        :label="filter.title"
        :options="filter.options"
        @input="$emit('filteredSearch', selected)"
      />
    </div>
  </div>
</template>
