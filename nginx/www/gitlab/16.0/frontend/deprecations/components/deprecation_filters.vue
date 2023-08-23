<script>
import { GlFormSelect, GlToggle } from '@gitlab/ui';

export default {
  components: {
    GlFormSelect,
    GlToggle,
  },
  props: {
    allMilestones: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      emptyText: 'No deprecations found.',
      showAllText: 'Show all',
      hiddenClass: 'gl-display-none',
      milestoneOptions: [],
      selected: {
        removal_milestone: '',
        breaking_only: false,
      },
      deprecations: [],
      selectedDeprecations: [],
      filtered: false,
    };
  },
  computed: {
    noResults() {
      return this.filtered && this.selectedDeprecations.length === 0;
    },
  },
  created() {
    // Populate the milestones list
    this.milestoneOptions = [this.showAllText].concat(this.allMilestones);
    this.selected.removal_milestone = this.showAllText;

    // Initialize with an array of all deprecations.
    document.querySelectorAll('.deprecation').forEach((el) => {
      this.deprecations.push(el.getAttribute('data-deprecation-id'));
    });

    // Pre-filter the page if the URL includes a parameter.
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.has('removal_milestone') || searchParams.has('breaking_only')) {
      this.selected.removal_milestone = searchParams.get('removal_milestone');
      this.selected.breaking_only = searchParams.get('breaking_only') === 'true';
    }

    this.filterList();
  },
  methods: {
    updateURLParams() {
      const url = new URL(window.location);
      const filterDefaults = [this.showAllText, false];
      // Add the URL param if a value besides the default is selected.
      Object.keys(this.selected).forEach((selectName) => {
        if (!filterDefaults.includes(this.selected[selectName])) {
          url.searchParams.set(selectName, this.selected[selectName]);
        } else {
          url.searchParams.delete(selectName);
        }
      });
      window.history.pushState(null, '', url.toString());
    },
    filterList() {
      // Run the deprecations list through both filters.
      this.selectedDeprecations = this.filterByBreaking(this.filterByVersion(this.deprecations));
      // Hide all headers initially.
      document.querySelectorAll('.milestone-wrapper').forEach((section) => {
        section.children[0].classList.add(this.hiddenClass);
      });

      // Show selected deprecations; hide the others.
      this.deprecations.forEach((depId) => {
        const element = document.querySelector(`[data-deprecation-id="${depId}"]`);
        if (this.selectedDeprecations.includes(depId)) {
          element.classList.remove(this.hiddenClass);
          // Ensure the section header is visible.
          element.parentElement.children[0].classList.remove(this.hiddenClass);
        } else {
          element.classList.add(this.hiddenClass);
        }
      });

      this.updateURLParams();
      this.filtered = true;
    },
    filterByVersion(deps) {
      let filteredDeps = deps;
      if (this.selected.removal_milestone !== this.showAllText) {
        filteredDeps = deps.filter(
          (depID) =>
            document.querySelector(`[data-deprecation-id="${depID}"]`).dataset.milestone ===
            this.selected.removal_milestone,
        );
      }
      return filteredDeps;
    },
    filterByBreaking(deps) {
      let filteredDeps = deps;
      if (this.selected.breaking_only === true) {
        filteredDeps = deps.filter((depID) =>
          document
            .querySelector(`[data-deprecation-id="${depID}"]`)
            .classList.contains('breaking-change'),
        );
      }
      return filteredDeps;
    },
  },
};
</script>

<template>
  <div>
    <div class="gl-mt-7 row">
      <div class="col gl-md-display-flex">
        <label
          for="removal_milestone"
          class="gl-font-weight-bold gl-mb-0 gl-mr-4 gl-display-flex gl-align-items-center"
          >Filter by removal version</label
        >
        <gl-form-select
          v-model="selected.removal_milestone"
          class="gl-md-max-w-15p gl-mr-6"
          name="removal_milestone"
          :options="milestoneOptions"
          data-testid="removal-milestone-filter"
          @change="filterList()"
        />

        <gl-toggle
          v-model="selected.breaking_only"
          label="Show only breaking changes"
          class="gl-mt-5 gl-md-mt-0"
          name="breaking_only"
          data-testid="breaking-filter"
          label-position="left"
          @change="filterList()"
        />
      </div>
    </div>
    <p v-if="noResults" class="gl-mt-5!">{{ emptyText }}</p>
  </div>
</template>
