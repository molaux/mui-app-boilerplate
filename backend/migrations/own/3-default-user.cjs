async function up ({ context: sequelize }) {
  const admin = await sequelize.models.User.create({
    firstName: 'Admin',
    lastName: 'Istrator',
    login: 'admin',
    password: 'admin',
    email: 'admin@istrator.net',
    Address: {
      street: 'Street',
      zipCode: '0000',
      city: 'City',
      country: 'Country'
    }
  }, { include: sequelize.models.Address })

  await admin.addGroup(await sequelize.models.Group.findOne({ where: { name: 'Admin' } }))
}

async function down ({ context: sequelize }) {
  return sequelize.models.User.destroy({
    where: {
      login: 'admin'
    }
  })
}

module.exports = { up, down }
