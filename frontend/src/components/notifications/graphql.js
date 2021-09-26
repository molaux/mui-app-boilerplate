import { gql } from '@apollo/client'
import { propType as graphQLPropTypes } from 'graphql-anywhere'

export const NOTIFICATION_FRAGMENT = gql`
  fragment NotificationFragment on NotificationType {
    notificationId
    pause
    openDate
    closeDate
    dueDate
    title
    message
    type
    subType
    autoFixable
    article {
      id, libArt, designArt
    }
  }
`

NOTIFICATION_FRAGMENT.propTypes = graphQLPropTypes(NOTIFICATION_FRAGMENT)

export const NOTIFICATIONS_QUERY = gql`
  query {
    Notifications {
      ...NotificationFragment
    }
  }
  ${NOTIFICATION_FRAGMENT}
`

NOTIFICATIONS_QUERY.propTypes = graphQLPropTypes(NOTIFICATIONS_QUERY)

export const NOTIFICATIONS_SUBSCRIPTION = gql`
  subscription onNotificationsChanged {
    changedNotifications  {
      action, 
      object {
        ...NotificationFragment
      }
    }
  }
  ${NOTIFICATION_FRAGMENT}
`

export const ADD_REMINDER = gql`
  mutation addReminder($message: String, $title: String!, $dueDate: String!) {
    addReminder(message: $message, title: $title, dueDate: $dueDate) {
      id
    }
  }
`

export const DELETE_REMINDER = gql`
  mutation deleteReminder($id: String!) {
    deleteReminder(id: $id)
  }
`

export const CLOSE_REMINDER = gql`
  mutation closeReminder($id: String!) {
    closeReminder(id: $id)
  }
`

export const AUTOFIX_REMINDER = gql`
  mutation autofixReminder($id: String!) {
    autofixReminder(id: $id)
  }
`
