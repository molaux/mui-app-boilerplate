const { Op } = require('sequelize')

function up ({ context: sequelize }) {
  return sequelize.models.Group.bulkCreate([
    { name: 'Admin' },
    { name: 'Extern' },
    { name: 'Dev' },
    { name: 'Normal' }
  ])
}

async function down ({ context: sequelize }) {
  return sequelize.models.Group.destroy({
    where: {
      name: {
        [Op.in]: [
          'Admin',
          'Extern',
          'Dev',
          'Normal'
        ]
      }
    }
  })
}

module.exports = { up, down }
