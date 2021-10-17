import { createTheme } from '@mui/material/styles'

const palette = {
  // primary: { main: '#0e4194', contrastText: '#ffffff' },
  // secondary: { main: '#ec285d', contrastText: '#ffffff' }
}

const fontSizeDense = 11
const denseConfig = {
  props: {
    MuiButton: {
      size: 'small'
    },
    MuiFilledInput: {
      margin: 'dense'
    },
    MuiFormControl: {
      margin: 'dense'
    },
    MuiFormHelperText: {
      margin: 'dense'
    },
    MuiIconButton: {
      size: 'small'
    },
    MuiInputBase: {
      margin: 'dense'
    },
    MuiInputLabel: {
      margin: 'dense'
    },
    MuiListItem: {
      dense: true
    },
    MuiOutlinedInput: {
      margin: 'dense'
    },
    MuiFab: {
      size: 'small'
    },
    MuiTable: {
      size: 'small'
    },
    MuiTableCell: {
      size: 'small'
    },
    MuiTextField: {
      margin: 'dense'
    },
    MuiToolbar: {
      variant: 'dense'
    }
  },
  overrides: {
    MuiIconButton: {
      sizeSmall: {
        // Adjust spacing to reach minimal touch target hitbox
        marginLeft: 6,
        marginRight: 6,
        padding: 8
      }
    }
  },
  components: {
    MuiTableCell: {
      styleOverrides: {
        root: {
          padding: 6
        }
      }
    }
  },
  spacing: 3
}

const typography = { useNextVariants: true }

export const lightTheme = createTheme({
  themeName: 'Light theme',
  palette,
  typography
})

export const lightThemeDense = createTheme({
  themeName: 'Light theme dense',
  palette,
  typography: {
    ...typography,
    fontSize: fontSizeDense
  },
  ...denseConfig
})

export const darkTheme = createTheme({
  themeName: 'Dark theme',
  palette: { mode: 'dark' },
  typography
})

export const darkThemeDense = createTheme({
  themeName: 'Dark theme dense',
  palette: { mode: 'dark' },
  typography: {
    ...typography,
    fontSize: fontSizeDense
  },
  ...denseConfig
})

export const toolTheme = createTheme({
  themeName: 'Tool theme',
  palette: {
    ...lightTheme.palette,
    ...palette,
    background: {
      default: lightTheme.palette.warning.main,
      paper: lightTheme.palette.warning.main
    }
  },
  typography
})

export const toolThemeDense = createTheme({
  themeName: 'Tool theme dense',
  palette: {
    ...lightTheme.palette,
    ...palette,
    background: {
      default: lightTheme.palette.warning.main,
      paper: lightTheme.palette.warning.main
    }
  },
  typography: {
    ...typography,
    fontSize: fontSizeDense
  },
  ...denseConfig
})

export const reversedTheme = createTheme({
  themeName: 'Reversed theme',
  palette: {
    ...darkTheme.palette,
    ...palette,
    background: {
      default: lightTheme.palette.primary.main,
      paper: lightTheme.palette.primary.main
    },
    primary: { main: lightTheme.palette.warning.main }
  },
  typography
})

export const reversedThemeDense = createTheme({
  themeName: 'Reversed theme dense',
  palette: {
    ...darkTheme.palette,
    ...palette,
    background: {
      default: lightTheme.palette.primary.main,
      paper: lightTheme.palette.primary.main
    },
    primary: { main: lightTheme.palette.warning.main, contrastText: '#ffffff' }
  },
  typography: {
    ...typography,
    fontSize: fontSizeDense
  },
  ...denseConfig
})

export default lightTheme
