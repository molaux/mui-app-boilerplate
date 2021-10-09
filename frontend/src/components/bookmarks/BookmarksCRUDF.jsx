import React from 'react'
import PropTypes from 'prop-types'

import {
  CRUDF
} from '@molaux/mui-crudf'

const BookmarkCRUDF = ({ className, initialView, onLink }) => (
  <CRUDF
    className={className}
    typeName="Bookmark"
    initialView={initialView?.view}
    initialValue={initialView?.value}
    translations={{
      fields: {
        createdAt: 'Creation date',
        updatedAt: 'Update date',
        url: 'Link',
        comment: 'Comment',
        visits: 'Visits',
        User: 'Creator'
      },
      type: {
        singular: 'Bookmark',
        plural: 'Bookmarks',
        'Bookmark creation': 'Add bookmark',
        'Bookmark edition': 'Edit bookmark'
      }
    }}
    listLayout={{
      order: [
        'url', 'visits', 'User', 'comment'
      ],
      hide: ['id', 'createdAt', 'updatedAt']
    }}
    editLayout={{
      layout: [
        ['url'],
        ['comment'],
        ['User']
      ],
      hide: [
        'id', 'createdAt', 'updatedAt'
      ]
    }}
    createLayout={{
      layout: [
        ['url'],
        ['comment'],
        ['User']
      ],
      hide: [
        'id', 'createdAt', 'updatedAt'
      ]
    }}
    showLayout={{
      layout: [
        ['url'],
        ['visits'],
        ['comment'],
        ['User'],
        ['createdAt', 'updatedAt']
      ],
      hide: [
        'id'
      ]
    }}
  />
)

BookmarkCRUDF.propTypes = {
  className: PropTypes.string,
  initialView: PropTypes.shape({
    view: PropTypes.string,
    value: PropTypes.shape({})
  }),
  onLink: PropTypes.func
}

BookmarkCRUDF.defaultProps = {
  className: null,
  initialView: null,
  onLink: () => null
}

export default BookmarkCRUDF
