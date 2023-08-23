<script>
import { getVersions, getArchiveImages } from '../services/fetch_versions';
import HeaderPermalink from '../shared/components/header_permalink.vue';

export default {
  components: {
    HeaderPermalink,
  },
  data() {
    return {
      versions: {},
      onlineVersions: [],
      offlineVersions: [],
    };
  },
  async created() {
    this.versions = await getVersions();
    this.onlineVersions = [...this.versions.last_minor, ...this.versions.last_major];

    const archiveImages = await getArchiveImages();
    this.offlineVersions = archiveImages.filter(
      (archiveVersion) =>
        archiveVersion.name !== this.versions.current &&
        !this.onlineVersions.includes(archiveVersion.name),
    );
  },
};
</script>

<template>
  <div>
    <header-permalink text="Latest released version" />
    <p>
      The latest released stable version is
      <a :href="`https://docs.gitlab.com/${versions.current}`">{{ versions.current }}</a
      >.
    </p>

    <header-permalink text="Previously released versions" />
    <p>The following versions are available online:</p>
    <ul>
      <li v-for="v in onlineVersions" :key="v" :data-testid="`online-version-${v}`">
        <a :href="`https://docs.gitlab.com/${v}`">{{ v }}</a>
      </li>
    </ul>

    <div v-if="offlineVersions.length">
      <header-permalink text="Offline archives" />
      <p>
        The following archives are available and can be browsed offline. You'll need to have
        <a href="https://docs.docker.com/get-docker/">Docker</a>
        installed to access them.
      </p>

      <div v-for="o in offlineVersions" :key="o.name" :data-testid="`offline-version-${o.name}`">
        <h3>{{ o.name }}</h3>
        <div class="highlight">
          <pre class="highlight shell">
            <code>docker run <span class="nt">-it</span> <span class="nt">--rm</span> <span class="nt">-p</span> 4000:4000 {{ o.location }}</code>
          </pre>
        </div>
      </div>
    </div>
  </div>
</template>
