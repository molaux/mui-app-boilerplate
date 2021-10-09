import React from 'react'
import PropTypes from 'prop-types'

import BookmarksCRUDF from './BookmarksCRUDF'

const Bookmarks = ({ className }) => (
  <div className={className}>
    <BookmarksCRUDF />
  </div>
)

Bookmarks.propTypes = {
  className: PropTypes.string
}

Bookmarks.defaultProps = {
  className: ''
}

export default Bookmarks
