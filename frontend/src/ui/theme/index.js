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

const status = {
  ok: '#99d420',
  error: '#f25c19',
  warn: '#f9b00f'
}

const typography = { useNextVariants: true }

export const lightTheme = createTheme({
  themeName: 'Biocoop UI light theme',
  palette,
  status,
  typography
})

export const lightThemeDense = createTheme({
  themeName: 'Biocoop UI light theme dense',
  palette,
  status,
  typography: {
    ...typography,
    fontSize: fontSizeDense
  },
  ...denseConfig
})

export const darkTheme = createTheme({
  themeName: 'Biocoop UI dark theme',
  palette: { mode: 'dark' },
  status,
  typography
})

export const darkThemeDense = createTheme({
  themeName: 'Biocoop UI dark theme dense',
  palette: { mode: 'dark' },
  status,
  typography: {
    ...typography,
    fontSize: fontSizeDense
  },
  ...denseConfig
})

export const toolTheme = createTheme({
  themeName: 'Biocoop UI tool theme',
  palette: {
    ...lightTheme.palette,
    ...palette,
    background: {
      default: status.warn,
      paper: status.warn
    }
  },
  status,
  typography
})

export const toolThemeDense = createTheme({
  themeName: 'Biocoop UI tool theme dense',
  palette: {
    ...lightTheme.palette,
    ...palette,
    background: {
      default: status.warn,
      paper: status.warn
    }
  },
  status,
  typography: {
    ...typography,
    fontSize: fontSizeDense
  },
  ...denseConfig
})

export const reversedTheme = createTheme({
  themeName: 'Biocoop UI reversed theme',
  palette: {
    ...darkTheme.palette,
    ...palette,
    background: {
      default: lightTheme.palette.primary.main,
      paper: lightTheme.palette.primary.main
    },
    primary: { main: status.warn }
  },
  status,
  typography
})

export const reversedThemeDense = createTheme({
  themeName: 'Biocoop UI reversed theme dense',
  palette: {
    ...darkTheme.palette,
    ...palette,
    background: {
      default: lightTheme.palette.primary.main,
      paper: lightTheme.palette.primary.main
    },
    primary: { main: status.warn, contrastText: '#ffffff' }
  },
  status,
  typography: {
    ...typography,
    fontSize: fontSizeDense
  },
  ...denseConfig
})

export default lightTheme
