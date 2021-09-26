/**
 *  @fileOverview Embed app loading animation container
 *
 *  @author       Marc-Olivier Laux
 */
import React from 'react'
import PropTypes from 'prop-types'
import Dialog from '@mui/material/Dialog'
import Fade from '@mui/material/Fade'
import LoadingAnimation from './LoadingAnimationDefault'

const Transition = React.forwardRef((props, ref) => <Fade {...props} ref={ref} />)

/**
 * This component is responsible to provide a container to
 * get loading animation rendering
 * At present time, it uses {@link LoadingAnimationDefault}
 */
const AppLoadingAnimation = ({ open }) => (
  <Dialog
    open={open}
    aria-labelledby="info-dialog-title"
    aria-describedby="info-dialog-description"
    fullScreen
    TransitionComponent={Transition}
  >
    <LoadingAnimation />
  </Dialog>
)

AppLoadingAnimation.propTypes = {
  open: PropTypes.bool
}

AppLoadingAnimation.defaultProps = {
  open: true
}

export default AppLoadingAnimation
