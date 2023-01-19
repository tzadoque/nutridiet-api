module.exports = {
  ethnic_groups: ['branca', 'preta', 'amarela', 'parda', 'indígena'],

  isAnEthnicGroup(ethnic_group) {
    const ethnic_groups = ['branca', 'preta', 'amarela', 'parda', 'indígena'];

    if (ethnic_groups.includes(ethnic_group)) {
      return true;
    }

    return false;
  },
};
