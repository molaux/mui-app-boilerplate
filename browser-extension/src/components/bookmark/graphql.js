import { propType as graphQLPropType } from 'graphql-anywhere'
import { gql } from '@apollo/client'

export const BOOKMARK_DETAILS_FRAGMENT = gql`
  fragment BookmarkDetails on Bookmark {
    id
    url
    visits
    createdAt
    updatedAt
    User {
      id
      name
    }
  }
`

BOOKMARK_DETAILS_FRAGMENT.propTypes = graphQLPropType(BOOKMARK_DETAILS_FRAGMENT)

export const BOOKMARK_QUERY = gql`
  query RootQueryType($query: JSON) {
    Bookmarks(query: $query) {
      ...BookmarkDetails
    }
  }
  ${BOOKMARK_DETAILS_FRAGMENT}
`

BOOKMARK_QUERY.propTypes = graphQLPropType(BOOKMARK_QUERY)

export default BOOKMARK_QUERY

export const BOOKMARK_UPDATE_SUBSCRIPTION = gql`
  subscription {
    updatedBookmark  {
      ...BookmarkDetails
    }
  }
  ${BOOKMARK_DETAILS_FRAGMENT}
`

export const BOOKMARK_CREATION_SUBSCRIPTION = gql`
  subscription {
    createdBookmark  {
      ...BookmarkDetails
    }
  }
  ${BOOKMARK_DETAILS_FRAGMENT}
`

export const BOOKMARK_DELETION_SUBSCRIPTION = gql`
  subscription {
    deletedBookmark  {
      id
    }
  }
`

export const BOOKMARK_CREATE_MUTATION = gql`
  mutation RootMutationType($input: BookmarkCreateInput) {
    createBookmark(input: $input) {
      ...BookmarkDetails
    }
  }
  ${BOOKMARK_DETAILS_FRAGMENT}
`

export const BOOKMARK_UPDATE_MUTATION = gql`
  mutation RootMutationType($query: JSON, $input: BookmarkUpdateInput) {
    updateBookmark(input: $input, query: $query) {
      ...BookmarkDetails
    }
  }
  ${BOOKMARK_DETAILS_FRAGMENT}
`

export const BOOKMARK_DELETE_MUTATION = gql`
  mutation RootMutationType($query: JSON) {
    deleteBookmark(query: $query) {
      ...BookmarkDetails
    }
  }
  ${BOOKMARK_DETAILS_FRAGMENT}
`
