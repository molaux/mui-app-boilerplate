/* eslint-disable no-console */
import React, { useState, useContext, useEffect } from 'react'
import { useQuery, useSubscription, useMutation } from '@apollo/client'
import { PropTypes } from 'prop-types'
// import useMediaQuery from '@mui/material/useMediaQuery'

// V5 temporary migration fix
import { Button } from '@mui/material'

import { ReactComponent as Logo } from './ui/logo.svg'

import {
  BOOKMARK_QUERY,
  BOOKMARK_UPDATE_SUBSCRIPTION,
  BOOKMARK_CREATION_SUBSCRIPTION,
  BOOKMARK_DELETION_SUBSCRIPTION,
  BOOKMARK_CREATE_MUTATION,
  BOOKMARK_UPDATE_MUTATION,
  BOOKMARK_DELETE_MUTATION
} from './components/bookmark/graphql'

import { ProfileContext } from './components/login/Context'

function ContentApp ({ url, linkEl }) {
  // const isMobile = useMediaQuery(normalTheme.breakpoints.down('sm'))
  const { profile } = useContext(ProfileContext)

  const [bookmark, setBookmark] = useState(null)
  const [
    createBookmark,
    { loading: createBookmarkLoading }
  ] = useMutation(BOOKMARK_CREATE_MUTATION, {
    variables: {
      input: {
        url,
        User: {
          id: profile?.id
        }
      }
    },
    skip: !profile,
    onCompleted: ({ createBookmark }) => {
      setBookmark(createBookmark)
    }
  })

  const [
    addVisit
  ] = useMutation(BOOKMARK_UPDATE_MUTATION, {
    variables: {
      input: {
        visits: bookmark?.visits + 1
      },
      query: {
        where: {
          id: bookmark?.id
        }
      }
    },
    skip: !profile,
    onCompleted: ({ updateBookmark }) => {
      setBookmark(updateBookmark?.[0])
    }
  })

  const [
    deleteBookmark,
    { loading: deleteBookmarkLoading }
  ] = useMutation(BOOKMARK_DELETE_MUTATION, {
    variables: {
      query: {
        where: {
          url
        }
      }
    },
    onCompleted: () => {
      setBookmark(null)
    }
  })

  const {
    loading: bookmarksLoading
    // refetch: updateBookmarks
  } = useQuery(BOOKMARK_QUERY, {
    variables: {
      query: {
        where: {
          url
        }
      }
    },
    onCompleted: ({
      Bookmarks
    }) => {
      if (Bookmarks.length) {
        setBookmark(Bookmarks[0])
      } else {
        setBookmark(null)
      }
    }
  })

  // Listen to visits
  useEffect(() => {
    if (bookmark) {
      linkEl.addEventListener('click', addVisit)
      return () => linkEl.removeEventListener('click', addVisit)
    }
    return null
  }, [bookmark, addVisit, linkEl])

  // Subscriptions
  useSubscription(BOOKMARK_UPDATE_SUBSCRIPTION, {
    onSubscriptionData: ({
      subscriptionData: {
        data: { updatedBookmark }
      }
    }) => {
      const sameUrlBookmarks = updatedBookmark.filter(({ url }) => url === bookmark.url)
      if (sameUrlBookmarks.length) {
        setBookmark(sameUrlBookmarks[0])
      }
    }
  })

  useSubscription(BOOKMARK_CREATION_SUBSCRIPTION, {
    onSubscriptionData: ({
      subscriptionData: {
        data: { createdBookmark }
      }
    }) => {
      const sameUrlBookmarks = createdBookmark.filter(({ url: newUrl }) => newUrl === url)
      if (sameUrlBookmarks.length) {
        setBookmark(sameUrlBookmarks[0])
      }
    }
  })

  useSubscription(BOOKMARK_DELETION_SUBSCRIPTION, {
    onSubscriptionData: ({
      subscriptionData: {
        data: { deletedBookmark }
      }
    }) => {
      if (bookmark) {
        const sameBookmarks = deletedBookmark.filter(({ id }) => id === bookmark.id)
        if (sameBookmarks.length) {
          setBookmark(null)
        }
      }
    }
  })

  return (
    <>
      <Logo height="2em" width="2em" style={{ marginBottom: '-0.5em' }} />
      <Button
        onClick={bookmark ? deleteBookmark : createBookmark}
        disabled={bookmarksLoading || createBookmarkLoading || deleteBookmarkLoading || !profile}
      >
        {bookmark ? 'Remove' : 'Add'} Bookmark
      </Button>
      {bookmarksLoading || createBookmarkLoading || deleteBookmarkLoading || !profile
        ? '...'
        : bookmark && `Visits: ${bookmark?.visits}`}
    </>
  )
}

ContentApp.propTypes = {
  url: PropTypes.string.isRequired,
  linkEl: PropTypes.node.isRequired
}

export default ContentApp
