import DayJsUtils from "@date-io/dayjs";
import { CssBaseline, ThemeProvider } from "@material-ui/core";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import { SnackbarProvider } from "notistack";
import { BrowserRouter } from "react-router-dom";
import AuthProvider from "~config/auth";

import theme from "../config/theme";
import ScrollToTop from "./components/ScrollToTop";
import Routes from "./Routes";

const Core = () => {
  return (
    <BrowserRouter>
      <ScrollToTop>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <SnackbarProvider
            anchorOrigin={{
              vertical: "top",
              horizontal: "center",
            }}
            autoHideDuration={2000}
            preventDuplicate
          >
            <MuiPickersUtilsProvider utils={DayJsUtils}>
              <AuthProvider>
                <Routes />
              </AuthProvider>
            </MuiPickersUtilsProvider>
          </SnackbarProvider>
        </ThemeProvider>
      </ScrollToTop>
    </BrowserRouter>
  );
};

export default Core;
