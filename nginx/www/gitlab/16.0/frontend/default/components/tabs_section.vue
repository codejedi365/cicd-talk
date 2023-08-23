<script>
import { GlTabs, GlTab, GlSafeHtmlDirective as SafeHtml } from '@gitlab/ui';

export default {
  components: {
    GlTabs,
    GlTab,
  },
  directives: {
    SafeHtml,
  },
  props: {
    tabTitles: {
      type: Array,
      required: true,
    },
    tabContents: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      // Allows GitLab SVGs to render through v-safe-html
      // https://gitlab.com/groups/gitlab-org/-/epics/4273#svgs
      safe_html_config: { ADD_TAGS: ['use'] },
    };
  },
  computed: {
    // Validate that the tabset has an equal number of tab titles and tab content sections.
    // We won't render the content if this is false.
    hasValidContent() {
      return this.tabTitles.filter(Boolean).length === this.tabContents.filter(Boolean).length;
    },
  },
};
</script>

<template>
  <gl-tabs v-if="hasValidContent" :sync-active-tab-with-query-params="true">
    <gl-tab
      v-for="(title, key) in tabTitles"
      :key="key"
      v-safe-html:[safe_html_config]="tabContents[key]"
      :title="title"
      :query-param-value="title"
    />
  </gl-tabs>
</template>
