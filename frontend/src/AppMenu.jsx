import React, { useContext } from 'react'
import { PropTypes } from 'prop-types'

import { Link, withRouter } from 'react-router-dom'
import { withStyles } from '@mui/styles'

import BottomNavigation from '@mui/material/BottomNavigation'
import BottomNavigationAction from '@mui/material/BottomNavigationAction'

import Drawer from '@mui/material/Drawer'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import ListItemIcon from '@mui/material/ListItemIcon'
import Collapse from '@mui/material/Collapse'

import {
  Home as HomeIcon,
  Equalizer as StatsIcon,
  MoreVert as MoreIcon,
  ExitToApp as LogoutIcon,
  Settings as SettingsIcon,
  Build as ToolsIcon
} from '@mui/icons-material'

import List from '@mui/material/List'
import Paper from '@mui/material/Paper'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Box from '@mui/material/Box'
import useMediaQuery from '@mui/material/useMediaQuery'

import { ProfileContext } from './components/login/Context'

const menuEntries = (profile, onDisconnect) => [
  {
    label: 'Accueil',
    value: 'home',
    Icon: HomeIcon,
    path: '/',
    search: ''
  },
  {
    label: 'Outils',
    value: 'outils',
    Icon: ToolsIcon,
    path: '/outils',
    search: ''
  },
  ...profile.hasModule('Statistics')
    ? [{
        label: 'Statistiques',
        value: 'statistiques',
        Icon: StatsIcon,
        path: '/statistiques',
        search: ''
      }]
    : [],
  ...profile.hasOneModuleOf(['Configuration', 'User', 'Group'])
    ? [{
        label: 'Configuration',
        value: 'configuration',
        Icon: SettingsIcon,
        path: '/configuration',
        search: ''
      }]
    : [],
  {
    label: 'Se déconnecter',
    value: 'disconnect',
    Icon: LogoutIcon,
    path: '',
    search: '',
    onClick: onDisconnect
  }
]

const StyledMenu = withStyles({
  paper: {
    border: '1px solid #d3d4d5'
  }
})((props) => (
  <Menu
    elevation={0}
    TransitionComponent={Collapse}
    anchorOrigin={{
      vertical: 'top',
      horizontal: 'right'
    }}
    transformOrigin={{
      vertical: 'bottom',
      horizontal: 'right'
    }}
    {...props}
  />
))

function CustomizedMenus ({ anchorEl, handleClose, onChange, entries, open }) {
  const onSelect = (event, value, onClick) => {
    handleClose()
    if (onClick) {
      onClick()
    } else {
      onChange(event, value)
    }
  }

  return (
    <StyledMenu
      id="more-menu"
      anchorEl={anchorEl}
      open={open}
      onClose={handleClose}
      MenuListProps={{
        'aria-labelledby': 'more-button'
      }}
    >
      {entries.map(({ Icon, label, value, onClick }) => (
        <MenuItem key={value} onClick={(event) => onSelect(event, value, onClick)}>
          <ListItemIcon>
            <Icon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary={label} />
        </MenuItem>
      ))}
    </StyledMenu>
  )
}

CustomizedMenus.propTypes = {
  handleClose: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  anchorEl: PropTypes.instanceOf(window.Element),
  entries: PropTypes.arrayOf(PropTypes.shape({
    Icon: PropTypes.elementType.isRequired,
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    onClick: PropTypes.func
  })).isRequired
}

CustomizedMenus.defaultProps = {
  anchorEl: null
}

const drawerWidth = 240

export const AppDesktopMenu = withStyles((theme) => ({

  drawer: {
    width: drawerWidth,
    flexShrink: 0
  },
  drawerPaper: {
    width: drawerWidth
  },
  toolbar: theme.mixins.toolbar

}), { withTheme: true })(withRouter(({
  classes,
  match,
  module,
  onDisconnect
}) => {
  const profile = useContext(ProfileContext)

  return (
    <Drawer
      className={classes.drawer}
      variant="permanent"
      classes={{
        paper: classes.drawerPaper
      }}
    >
      <div className={classes.toolbar} />
      <List>
        {menuEntries(profile, onDisconnect).map(({
          Icon,
          value,
          label,
          path,
          search,
          onClick
        }) => (
          <ListItem
            key={value}
            component={onClick ? Box : Link}
            {...(onClick
              ? { onClick }
              : {
                  to: path + search,
                  selected: (match.params.module || module) === value
                })}
            button
          >
            <ListItemIcon color="primary">
              <Icon color="primary" />
            </ListItemIcon>
            <ListItemText primary={label} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  )
}))

export const AppMobileMenu = withStyles((theme) => ({
  root: {
    position: 'fixed',
    bottom: 0,
    width: '100%',
    zIndex: 2
  }
}), { withTheme: true })(withRouter(({
  searchContext,
  classes,
  match,
  module,
  history,
  onDisconnect
}) => {
  const closeAtOpenTimeoutWorkaround = React.useRef()
  const [closableWorkaround, setClosableWorkaround] = React.useState(true)
  const moreRef = React.useRef()
  const [popupOpen, setPopupOpen] = React.useState(false)
  const isVerySmall = useMediaQuery('(max-width:350px)')
  const entriesFrontLimit = isVerySmall ? 3 : 4
  let value = match.params.module || module || 'home'
  const profile = useContext(ProfileContext)

  const entries = menuEntries(profile, onDisconnect)
  if (!entries.map((e) => e.value).includes(value)) {
    value = 'home'
  }
  const handleClick = (event) => {
    closeAtOpenTimeoutWorkaround.current = setTimeout(() => setClosableWorkaround(true), 100)
    setClosableWorkaround(false)
    setPopupOpen(true)
  }

  const handleClose = (...args) => {
    if (closableWorkaround) {
      setPopupOpen(false)
    }
  }

  const onChange = (event, newValue) => {
    if (newValue !== 'more') {
      const [{ path, search }] = entries.filter((e) => e.value === newValue)

      history.push({
        pathname: path,
        search
      })
    }
  }

  const frontEntries = entries.length > entriesFrontLimit
    ? entries.slice(0, entriesFrontLimit - 1)
    : entries

  let extraEntries = entries.length > entriesFrontLimit
    ? entries.slice(entriesFrontLimit - 1)
    : []

  if (!frontEntries.map((e) => e.value).includes(value)) {
    extraEntries.unshift(frontEntries.pop())
    const [selectedEntry] = entries.filter((e) => e.value === value)
    if (selectedEntry) {
      frontEntries.push(selectedEntry)
    }
    extraEntries = extraEntries.filter((e) => e.value !== value)
  }

  return (
    <Paper elevation={4} className={classes.root}>
      <BottomNavigation
        value={value}
        onChange={onChange}
        showLabels
        ref={moreRef}
      >
        {frontEntries.map(({ Icon, value: entryValue, label }) => (
          <BottomNavigationAction
            label={label}
            key={entryValue}
            value={entryValue}
            icon={<Icon />}
          />
        )) }
        {extraEntries.length
          ? (
            <BottomNavigationAction
              label="Plus"
              value="more"
              aria-haspopup="true"
              aria-expanded={popupOpen ? 'true' : undefined}
              id="more-button"
              aria-controls="more-menu"
              onClick={handleClick}
              icon={<MoreIcon />}
            />
            )
          : null}
        {extraEntries.length && moreRef.current
          ? (
            <CustomizedMenus
              handleClose={handleClose}
              anchorEl={moreRef.current}
              open={popupOpen}
              onChange={onChange}
              entries={extraEntries}
            />
            )
          : null}
      </BottomNavigation>
    </Paper>
  )
}))
