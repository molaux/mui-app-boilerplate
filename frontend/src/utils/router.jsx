import React from 'react'
import {
  useLocation,
  useNavigate,
  useParams,
  useMatch
} from 'react-router-dom'

export const withRouter = (Component) => {
  function ComponentWithRouterProp(props) {
    let location = useLocation()
    let navigate = useNavigate()
    let params = useParams()
    return (
      <Component
        {...props}
        match={{ params }}
        location={ location }
        history={{ push: navigate }}
      />
    )
  }

  return ComponentWithRouterProp;
}

export default withRouter
