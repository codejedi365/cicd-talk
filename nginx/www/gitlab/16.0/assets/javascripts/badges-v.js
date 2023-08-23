(function() {
  const classes = ['core-only', 'core', 'starter-only', 'premium-only', 'ultimate-only', 'starter', 'premium', 'ultimate', 'free-only' , 'bronze-only', 'silver-only', 'gold-only', 'free', 'free-saas', 'free-self', 'premium-saas', 'premium-self', 'ultimate-saas', 'ultimate-self', 'contribute'];

  const BADGES_TITLES = {
    // Free
    free: 'On GitLab self-managed and GitLab SaaS, available in all tiers.',
    'free-self':
      'On GitLab self-managed, available in all tiers. Not available on GitLab SaaS.',
    'free-only':
      'On GitLab SaaS, available in all tiers. Not available on self-managed.',
    'free-saas':
      'On GitLab SaaS, available in all tiers. Not available on self-managed.',
    // Premium
    premium: 'On GitLab self-managed and GitLab SaaS, available in Premium and Ultimate.',
    'premium-saas':
      'On GitLab SaaS, available in Premium and Ultimate. Not available on self-managed.',
    'silver-only':
      'On GitLab SaaS, available in Premium and Ultimate. Not available on self-managed.',
    'premium-only':
      'On GitLab self-managed, available in Premium and Ultimate. Not available on GitLab SaaS.',
    'premium-self':
      'On GitLab self-managed, available in Premium and Ultimate. Not available on GitLab SaaS.',
    // Ultimate
    ultimate: 'On GitLab self-managed and GitLab SaaS, available in Ultimate.',
    'ultimate-only':
      'On GitLab self-managed, available in Ultimate. Not available on GitLab SaaS.',
    'ultimate-self':
      'On GitLab self-managed, available in Ultimate. Not available on GitLab SaaS.',
    'ultimate-saas':
      'On GitLab SaaS, available in Ultimate. Not available on self-managed.',
    'gold-only':
      'On GitLab SaaS, available in Ultimate. Not available on self-managed.',
    // Deprecated badges
    core: 'On GitLab self-managed and GitLab SaaS, available in all tiers.',
    'core-only':
      'On GitLab self-managed, available in all tiers. Not available on GitLab SaaS.',
    starter: 'Available on GitLab Starter, GitLab.com Bronze, and higher tiers.',
    'starter-only':
      'Available on GitLab Starter and higher tiers. Not available on GitLab.com.',
    'bronze-only':
      'Available on GitLab Bronze and higher tiers. Not available on self-managed.',
    // Contributor page badge
    'contribute':
      'Use this content to contribute to GitLab development.'
  };

  const BADGES_MAPPING = {
    // Free
    core: ['all tiers'],
    free: ['all tiers'],
    'core-only': ['all tiers', 'self-managed'],
    'free-self': ['all tiers', 'self-managed'],
    'free-only': ['all tiers', 'saas'],
    'free-saas': ['all tiers', 'saas'],
    // Premium
    premium: ['premium'],
    'silver-only': ['premium', 'saas'],
    'premium-only': ['premium', 'self-managed'],
    'premium-self': ['premium', 'self-managed'],
    'premium-saas': ['premium', 'saas'],
    // Ultimate
    ultimate: ['ultimate'],
    'ultimate-only': ['ultimate', 'self-managed'],
    'gold-only': ['ultimate', 'saas'],
    'ultimate-self': ['ultimate', 'self-managed'],
    'ultimate-saas': ['ultimate', 'saas'],
    // Deprecated badges
    starter: ['starter', 'bronze'],
    'starter-only': ['starter'],
    'bronze-only': ['bronze'],
    // Contributor badge
    contribute: ['contribute']
  };

  const BADGES_CLASS = {
    // Tier class
    core: 'tier',
    starter: 'tier',
    premium: 'tier',
    ultimate: 'tier',
    'all tiers': 'tier',
    // Contributors
    'contribute': 'contribute',
    // GitLab SaaS
    bronze: 'saas',
    silver: 'saas',
    gold: 'saas',
    saas: 'saas',
    // GitLab self-managed
    'self-managed': 'self-managed',
  };

  // Check if the currently-viewed page is GitLab contributor documentation.
  const isContributorDocs = () => {
    const paths = ['/ee/development/', '/omnibus/development/', '/runner/development/', '/charts/development/'];
    return paths.some(substr => window.location.pathname.startsWith(substr))
  }

  function init() {
    // Insert markup for the "Contribute" badge if this is a contributor doc page.
    if (isContributorDocs()) {
      $('<span class="badge-trigger contribute"></span>').insertBefore('h1 a');
    }

    var $badges = $('.badge-trigger');

    $badges.each(function() {
      convertBadge($(this));
    });

    $('[data-toggle="tooltip"]').tooltip();
  }

  function convertBadge($badge) {
    var small = isSmall($badge);
    var badgeType = retrieveBadgeType($badge);

    var smallBadgeTag = function(title) {
      return $('<span>', {
        class: 'badge-small',
        html: '<svg role="img" aria-label="note" class="gl-icon ml-1 mr-1 s14"><use href="/gitlab/16.0/assets/images/icons.svg#information-o" /> <title> note </title> </svg>',
        'data-title': title,
      });
    };

    var largeBadgeTag = function(badge, badgeClass) {
      return $('<div>', {
        class: 'badge-display badge-' + badgeClass,
        text: badge,
      });
    };

    var template = function(title, badges) {
      let container = $('<a>', {
        class: 'badges-drop',
        'data-toggle': 'tooltip',
        'data-placement': 'top',
        'target': '_blank',
        title: title,
        href: 'https://about.gitlab.com/pricing/?glm_source=docs.gitlab.com&glm_content=badges-docs'
      });
      if (isContributorDocs()) {
        container.attr({href: "https://docs.gitlab.com/ee/development/"})
      }
      container.append($('<span>').append(badges));
      return container;
    };

    var tags = [];

    if (small) {
      tags.push(smallBadgeTag(BADGES_MAPPING[badgeType].join(' | ')));
    } else {
      $.each(BADGES_MAPPING[badgeType], function(i, badge) {
        tags.push(largeBadgeTag(badge, BADGES_CLASS[badge]));
      });
    }

    $badge.append($(template(BADGES_TITLES[badgeType], tags)));
  }

  // Get the badge type from a specific list of expected values in element class
  function retrieveBadgeType($badge) {
    const classType = $badge.attr('class').split(' ');
    const match = classes.filter(matchingClass => classType.includes(matchingClass));
    if (match) {
      return match.pop();
    }
  }

  // When badge is not in a HTML header, we use the small version
  function isSmall($badge) {
    return !$badge
      .parent()
      .prop('tagName')
      .match(/H1|H2|H3|H4|H5/);
  }

  $(function() {
    init();
  });
})();
