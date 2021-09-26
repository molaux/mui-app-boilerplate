import React from 'react'
import PropTypes from 'prop-types'

import {
  CRUDF
} from '@molaux/mui-crudf'

const GroupsConfiguration = ({ className, initialView, onLink }) => (
  <CRUDF
    className={className}
    typeName="Group"
    initialView={initialView?.view}
    initialValue={initialView?.value}
    handles={{
      User: (view, o) => onLink('User', view, o)
    }}
    translations={{
      fields: {
        createdAt: 'Date de création',
        updatedAt: 'Date de mise à jour',
        name: 'Nom',
        comment: 'Commentaire',
        Users: 'Membres'
      },
      type: {
        singular: 'Groupe',
        plural: 'Groupes',
        'Group creation': 'Nouveau groupe',
        'Group edition': 'Modifier un groupe'
      }
    }}
    listLayout={{
      order: [
        'name', 'Permissions', 'comment'
      ],
      layout: {
        Permissions: { maxLength: 8 }
      },
      hide: ['id', 'Users', 'createdAt', 'updatedAt']
    }}
    editLayout={{
      layout: [
        ['name'],
        ['Permissions'],
        ['Users'],
        ['comment']
      ],
      hide: [
        'id', 'createdAt', 'updatedAt'
      ]
    }}
    createLayout={{
      layout: [
        ['name'],
        ['Permissions'],
        ['Users'],
        ['comment']
      ],
      hide: [
        'id', 'createdAt', 'updatedAt'
      ]
    }}
    showLayout={{
      layout: [
        ['name'],
        ['Permissions'],
        ['comment'],
        ['Users'],
        ['createdAt', 'updatedAt']
      ],
      hide: [
        'id'
      ]
    }}
  />
)

GroupsConfiguration.propTypes = {
  className: PropTypes.string,
  initialView: PropTypes.shape({
    view: PropTypes.string,
    value: PropTypes.shape({})
  }),
  onLink: PropTypes.func
}

GroupsConfiguration.defaultProps = {
  className: null,
  initialView: null,
  onLink: () => null
}

export default GroupsConfiguration
