import React from 'react'
import {
  useLocation,
  useNavigate,
  useParams
} from 'react-router-dom'

export const withRouter = (Component) => {
  function ComponentWithRouterProp (props) {
    const location = useLocation()
    const navigate = useNavigate()
    const params = useParams()
    return (
      <Component
        {...props}
        match={{ params }}
        location={location}
        history={{ push: navigate }}
      />
    )
  }

  return ComponentWithRouterProp
}

export default withRouter
