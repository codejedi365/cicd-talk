<script>
import { GlDropdown, GlDropdownItem, GlDropdownDivider } from '@gitlab/ui';
import { getVersions } from '../../services/fetch_versions';
import { isGitLabHosted, isArchivesSite } from '../environment';

export default {
  components: {
    GlDropdown,
    GlDropdownItem,
    GlDropdownDivider,
  },
  data() {
    return {
      versions: {},
      activeVersion: '',
    };
  },
  computed: {
    // Do not render this menu on pages that aren't version-specific.
    showMenu() {
      const excludePaths = ['/archives/'];
      return !excludePaths.includes(window.location.pathname);
    },
  },
  async created() {
    // Only fetch version lists for the production site.
    // Archives and self-hosted docs will only include one version, so they don't need this.
    if (isGitLabHosted() && !isArchivesSite()) {
      try {
        this.versions = await getVersions();
      } catch (err) {
        console.error(`Failed to fetch versions.json: ${err}`); // eslint-disable-line no-console
      }
    }
    this.activeVersion = document.querySelector('meta[name="gitlab-docs-version"]').content;
  },
  methods: {
    getVersionPath(versionNumber) {
      let path = window.location.pathname;

      // If we're viewing an older version, drop its version prefix when creating links.
      if (this.activeVersion !== this.versions.next) {
        const pathArr = window.location.pathname.split('/').filter((n) => n);
        pathArr.shift();
        path = `/${pathArr.join('/')}`;
      }

      if (versionNumber) {
        path = `/${versionNumber}${path}`;
      }

      // If this is one of the older major releases, point to the Archives site.
      if (this.versions.last_major.includes(versionNumber)) {
        path = `https://archives.docs.gitlab.com${path}`;
      }

      return path;
    },
  },
};
</script>

<template>
  <gl-dropdown
    v-if="showMenu && activeVersion"
    :text="activeVersion"
    class="gl-mb-4 gl-md-mb-0 gl-md-mr-5 gl-md-ml-3 gl-display-flex"
    data-testid="versions-menu"
  >
    <template v-if="versions.next">
      <gl-dropdown-item :href="getVersionPath()">
        <span data-testid="next-version">{{ versions.next }}</span> (not yet released)
      </gl-dropdown-item>
      <gl-dropdown-divider />

      <gl-dropdown-item :href="getVersionPath(versions.current)" data-testid="versions-current">
        {{ versions.current }} (recently released)
      </gl-dropdown-item>
      <gl-dropdown-item v-for="v in versions.last_minor" :key="v" :href="getVersionPath(v)">
        {{ v }}
      </gl-dropdown-item>
      <gl-dropdown-divider />

      <gl-dropdown-item v-for="v in versions.last_major" :key="v" :href="getVersionPath(v)">
        {{ v }}
      </gl-dropdown-item>
      <gl-dropdown-divider />
    </template>

    <gl-dropdown-item href="/archives">Archives</gl-dropdown-item>
  </gl-dropdown>
</template>
