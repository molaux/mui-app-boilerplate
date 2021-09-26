import bcrypt from 'bcrypt'
import { Mutex } from 'async-mutex'
import jwt from 'jsonwebtoken'
import apolloServerExpress from 'apollo-server-express'
import graphql from 'graphql'
import GraphQLSubscriptions from 'graphql-subscriptions'

import { log } from '../remoteLogger'

const ADMIN_GROUP_NAME = 'Admin'
// const NORMAL_USER_GROUP_NAME = 'Utilisateur normal'
const EXTERN_USER_GROUP_NAME = 'Extern'

const { AuthenticationError } = apolloServerExpress
const { GraphQLNonNull, GraphQLString } = graphql
const { withFilter } = GraphQLSubscriptions

export const queries = ({ modelsTypes }) => ({
  profile: {
    namespace: 'Authentication',
    type: new GraphQLNonNull(modelsTypes.User),
    resolve: async (_, __, { user: { model: user } }) => {
      return user
    }
  }
})

export const subscriptions = ({ modelsTypes }) => ({
  profileDeleted: {
    namespace: 'Authentication',
    type: new GraphQLNonNull(modelsTypes.User),
    subscribe: (payload, args, { pubSub, user: { model: user }, ...ctx }, ...rest) => withFilter(
      () => pubSub.asyncIterator(['modelsDeleted']),
      (payloads) => payloads.reduce(
        (keep, { model: { name: payloadModelName }, ids, instances, emitterContext }) => (keep ||
          (payloadModelName === 'User' && (
            ids?.includes(user.id) || instances?.map(({ id }) => id).includes(user.id)
          ))),
        false
      )
    )(payload, args, { pubSub, ...ctx }, ...rest),
    resolve: async (_, __, { user: { model: user } }) => {
      return user
    }
  },

  profileUpdated: {
    namespace: 'Authentication',
    type: new GraphQLNonNull(modelsTypes.User),
    subscribe: (payload, args, { pubSub, user: { model: user }, ...ctx }, ...rest) => withFilter(
      () => pubSub.asyncIterator(['modelsUpdated', 'modelsCreated']),
      (payloads) => payloads.reduce(
        async (keep, { model: { name: payloadModelName }, ids, instances, emitterContext }) => (await keep ||
          (payloadModelName === 'User' && (
            ids?.includes(user.id) || instances?.map(({ id }) => id).includes(user.id)
          )) ||
          (payloadModelName === 'Group' && (
            (await Promise.all(instances.map(async (instance) => await instance.hasUser(user)))).includes(true)
          ))),
        Promise.resolve(false)
      )
    )(payload, args, { pubSub, ...ctx }, ...rest),
    resolve: async (_, __, { user: { model: user } }) => {
      await user.reload()
      return user
    }
  }
})

const mutex = new Mutex()
async function getOrCreateGroup (db, groupName, ctx) {
  if (!getOrCreateGroup.groups) {
    getOrCreateGroup.groups = new Map()
  }

  let group = getOrCreateGroup.groups.get(groupName)

  if (!group) {
    group = await db.models.Group.findOne({ where: { name: groupName } })
    if (group) {
      getOrCreateGroup.groups.set(groupName, group)
    }
  }

  if (!group) {
    group = await db.models.Group.create({ name: groupName })
    ctx.pubSub.publish('modelsCreated', [{ model: db.models.Group, instances: [group], emitterContext: { ...ctx, user: null } }])
    getOrCreateGroup.groups.set(groupName, group)
  }
  return group
}

async function getOrCreatePermission (db, permissionName, ctx) {
  if (!getOrCreatePermission.permissions) {
    getOrCreatePermission.permissions = new Map()
  }

  let permission = getOrCreatePermission.permissions.get(permissionName)
  if (!permission) {
    permission = await db.models.Permission.findOne({ where: { name: permissionName } })
    if (permission) {
      getOrCreatePermission.permissions.set(permissionName, permission)
    }
  }

  if (!permission) {
    permission = (await db.models.Permission.create({ name: permissionName }))

    ctx.pubSub.publish('modelsCreated', [{ model: db.models.Permission, instances: [permission], emitterContext: ctx }])
    getOrCreatePermission.permissions.set(permissionName, permission)

    const adminGroup = await getOrCreateGroup(db, ADMIN_GROUP_NAME, ctx)
    await initGroupPermission(db, adminGroup, permission, ctx)
  }

  return permission
}

export const mutations = {
  login: {
    type: GraphQLString,
    args: {
      login: {
        type: new GraphQLNonNull(GraphQLString)
      },
      password: {
        type: new GraphQLNonNull(GraphQLString)
      }
    },
    resolve: async (_, { login: uid, password }, { ldapAuth, req, databases, pubSub, ...ctx }) => {
      log(`${req?.ip || 'unknown'} - Unauthenticated user - ${ctx.user?.uuid || 'unknown'} - Login attempt with login «${uid}»`)
      const user = await databases.own.models.User.findOne({ where: { login: uid } })
      if (!user) {
        log(`${req?.ip || 'unknown'} - Unauthenticated user - ${ctx.user?.uuid || 'unknown'} - Login attempt FAILED with login «${uid}»`)

        throw new AuthenticationError('Échec')
      }

      const authenticated = await bcrypt.compare(password, user.password)
      log(`${req?.ip || 'unknown'} - Unauthenticated user - ${ctx.user?.uuid || 'unknown'} - Login attempt SUCCEED for «${user.name}» as «${user.login}»`)
      if (user.enabled && authenticated) {
        return jwt.sign({
          uid: user.login,
          displayName: user.name
        }, process.env.JWT_SECRET /*, { expiresIn: '1y' } */)
      } else {
        throw new AuthenticationError('Échec')
      }
    }
  }
}

const initGroupPermission = async (db, group, permission, ctx) => {
  if (!(await group.hasPermission(permission))) {
    await group.addPermission(permission)
    ctx.pubSub.publish('modelsUpdated', [{ model: db.models.Permission, instances: [permission], emitterContext: ctx }])
    ctx.pubSub.publish('modelsUpdated', [{ model: db.models.Group, instances: [group], emitterContext: ctx }])
  }
}

const checkUserPermission = async (db, user, permission) =>
  (await user.hasPermission(permission)) ||
  (await user.getGroups({
    include: [{
      model: db.Permission,
      as: 'Permissions',
      required: true,
      where: {
        id: permission.id
      }
    }]
  })).length

export const checkPermission = async (db, user, ns, type, ctx) => {
  const permissionName = `${ns}/${type}`
  // Check existance
  const permission = await db.models.Permission.findOne({ where: { name: permissionName } }) || await mutex.runExclusive(async () => {
    await Promise.all(['query', 'mutation', 'subscription'].filter((altType) => altType !== type)
      .map((type) => `${ns}/${type}`)
      .map((permissionName) => getOrCreatePermission(db, permissionName, ctx)))

    return await getOrCreatePermission(db, permissionName, ctx)
  })
  return await checkUserPermission(db.models, user, permission)
}

export const securizeResolver = (resolverName, resolver, type, declaration) => async (parent, args, { req, user, databases, ...context }, ...rest) => {
  const db = databases.own
  if (!user?.model) {
    log(`${req?.ip || 'unknown'} - Unauthenticated user - ${user?.uuid || 'unknown'} - Access to ${declaration.namespace}/${type} NOT GRANTED`)
    throw new AuthenticationError()
  } else {
    // Check user source
    // log(`User has group admin : ${await user.model.hasGroup(await db.Group.findOne({ where: { name: ADMIN_GROUP_NAME } }))}`)
    if (await user.model.hasGroup(await db.models.Group.findOne({ where: { name: ADMIN_GROUP_NAME } })) ||
      await user.model.hasGroup(await db.models.Group.findOne({ where: { name: EXTERN_USER_GROUP_NAME } })) ||
      req?.ip === '81.250.180.245') {
      // Check permission
      let granted = false
      try {
        granted = await checkPermission(db, user.model, declaration.namespace, type, { req, user: null, databases, ...context })
      } catch (e) {
        log(`${req?.ip || 'unknown'} - ${user.model.name} - ${user?.uuid || 'unknown'} - Access to ${declaration.namespace}/${type} check error : ${e}`)
      }
      if (!granted) {
        log(`${req?.ip || 'unknown'} - ${user.model.name} - ${user?.uuid || 'unknown'} - Access to ${declaration.namespace}/${type} NOT GRANTED`)
        throw new AuthenticationError()
      }
      log(`${req?.ip || 'unknown'} - ${user.model.name} - ${user?.uuid || 'unknown'} - Access to ${declaration.namespace}/${type} GRANTED`)
      return resolver(parent, args, { user, databases, ...context }, ...rest)
    } else {
      log(`${req?.ip || 'unknown'} - ${user.model.name} - ${user?.uuid || 'unknown'} - Access to ${declaration.namespace}/${type} NOT GRANTED`)
      throw new AuthenticationError()
    }
  }
}

export const securizeAllResolvers = (o, type) => {
  for (const key in o) {
    if (typeof o[key].resolve === 'function') {
      o[key].resolve = securizeResolver(key, o[key].resolve, type, o[key])
    }
    if (typeof o[key].subscribe === 'function') {
      o[key].subscribe = securizeResolver(key, o[key].subscribe, type, o[key])
    }
  }
  return o
}
