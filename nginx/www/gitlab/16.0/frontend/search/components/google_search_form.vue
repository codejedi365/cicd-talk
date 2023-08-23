<script>
import {
  GlSearchBoxByType,
  GlLink,
  GlSafeHtmlDirective as SafeHtml,
  GlTooltipDirective as GlTooltip,
} from '@gitlab/ui';
import { debounce } from 'lodash';
import { directive as clickOutside } from 'v-click-outside';
import { fetchResults, MAX_RESULTS_PER_PAGE } from '../../services/google_search_api';

export default {
  components: {
    GlSearchBoxByType,
    GlLink,
  },
  directives: {
    clickOutside,
    SafeHtml,
    GlTooltip,
  },
  props: {
    borderless: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      isLoading: false,
      moreResultsPath: '',
      results: [],
      searchQuery: '',
      showResultPanel: false,
      submitted: false,
      totalCount: 0,
      activeLink: -1,
      showTooltip: true,
    };
  },
  computed: {
    hasMoreResults() {
      return this.results.length >= MAX_RESULTS_PER_PAGE;
    },
    hasNoResults() {
      return !this.results.length && this.submitted && this.searchQuery;
    },
  },
  watch: {
    searchQuery() {
      this.showTooltip = this.searchQuery.length === 0;
      this.submitted = false;
      this.moreResultsPath = `/search/?q=${encodeURI(this.searchQuery)}`;
      this.debouncedGetResults();
    },
  },
  created() {
    this.debouncedGetResults = debounce(this.getResults, 500);
  },
  methods: {
    async getResults() {
      this.showResultPanel = false;
      this.isLoading = true;
      const response = await fetchResults(this.searchQuery, [], 1, 10);
      this.isLoading = false;

      this.totalCount =
        response.searchInformation && response.searchInformation.totalCount
          ? response.searchInformation.totalCount
          : 0;
      this.results = response.items ? response.items : [];
      this.submitted = true;
      this.showResultPanel = true;
    },
    showAllResults() {
      // Sends the user to the advanced search page if they hit Enter.
      if (this.searchQuery) {
        window.location.href = this.moreResultsPath;
      }
    },
    keyboardNav(e) {
      const isArrowUp = e.key === 'ArrowUp';
      const isArrowDown = e.key === 'ArrowDown';
      const searchBox = document.querySelector('input[type=search]');

      if (isArrowUp || isArrowDown) {
        const activeIndex = this.activeLink + (isArrowUp ? -1 : 1);

        // If we're at the top or bottom of the list, go back to the search box.
        if (activeIndex < 0 || activeIndex > this.results.length) {
          this.activeLink = -1;
          searchBox.focus();
          // Reset the value after focus so that the cursor is at the end of the text.
          searchBox.value = this.searchQuery;
          return;
        }
        // Otherwise, select the previous or next link.
        this.setActiveResult(document.querySelector(`[data-link-index="${activeIndex}"]`));
      }
    },
    setActiveResult(result) {
      result.focus();
      this.activeLink = Number(result.dataset.linkIndex);
    },
    deactivate() {
      this.showResultPanel = false;
      this.activeLink = -1;
      this.showTooltip = this.searchQuery.length === 0;
    },
  },
};
</script>

<template>
  <div
    v-click-outside="() => deactivate()"
    class="gs-wrapper gl-m-auto gl-my-3 gl-md-mt-0 gl-md-mb-0"
    @keydown.arrow-down.prevent="keyboardNav"
    @keydown.arrow-up.prevent="keyboardNav"
    @keydown.escape="deactivate()"
  >
    <form class="gl-relative">
      <gl-search-box-by-type
        v-model="searchQuery"
        :is-loading="isLoading"
        :borderless="borderless"
        placeholder=""
        autocomplete="off"
        aria-label="Search"
        @focus="showResultPanel = true"
        @keydown.enter.prevent="showAllResults()"
      />
      <kbd
        v-show="showTooltip && !isLoading"
        v-gl-tooltip.bottom.hover.html
        class="gl-absolute gl-z-index-1 gl-bg-gray-100 gl-text-gray-700"
        title="Use the shortcut keys<br><kbd>/</kbd> or <kbd>s</kbd> to start a search"
        >/</kbd
      >
    </form>

    <div
      v-show="showResultPanel && submitted"
      class="gs-results gl-absolute gl-z-index-200 gl-bg-white gl-rounded gl-px-3 gl-shadow"
    >
      <ul v-show="results.length" data-testid="search-results" class="gl-pl-0 gl-mb-3 gl-pt-3">
        <li v-for="(result, index) in results" :key="result.cacheId" class="gl-list-style-none">
          <gl-link
            v-safe-html="result.formattedTitle"
            :href="result.relativeLink"
            :data-link-index="index"
            class="gl-text-gray-700 gl-py-3 gl-px-2 gl-display-block gl-text-left"
          />
        </li>
        <li v-if="hasMoreResults" class="gl-list-style-none gl-border-t gl-my-2 gl-py-2">
          <gl-link
            :data-link-index="results.length"
            data-testid="more-results"
            :href="moreResultsPath"
            class="gl-text-gray-700 gl-py-3 gl-pb-2 gl-px-2 gl-display-block gl-text-left"
          >
            See all results
          </gl-link>
        </li>
      </ul>
      <p v-if="hasNoResults" data-testid="no-results" class="gl-text-left gl-pt-3 gl-my-2 gl-pb-2">
        No results found.
      </p>
    </div>
  </div>
</template>
