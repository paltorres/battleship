/**
 * Material Index.
 */
import React from 'react'
import {
  MuiThemeProvider,
  createMuiTheme
} from '@material-ui/core/styles'


const theme = createMuiTheme({});

const Index = ({ children }) => (
  <MuiThemeProvider theme={theme}>
    {children}
  </MuiThemeProvider>
);

export default Index
