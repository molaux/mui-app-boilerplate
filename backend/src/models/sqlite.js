import equal from 'fast-deep-equal'

const modelConverter = sequelize => (baseDefinition) => {
  for (const attribute in baseDefinition) {
    if (equal(baseDefinition[attribute].defaultValue, sequelize.fn('NOW'))) {
      baseDefinition[attribute].defaultValue = sequelize.NOW
    }
  }
  return baseDefinition
}

export default modelConverter
