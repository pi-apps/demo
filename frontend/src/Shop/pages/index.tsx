import Footer from "../components/Footer";
import Header from "../components/Header";
import { Box, Grid, Typography } from "@mui/material";


export default function HomePage() {

return(
    <>
    <Header/>
    <Box>
      <Grid container>
        <Grid item xs></Grid>
        <Grid item xs={10} marginTop={2}>
          <Typography variant="h5">
            Demo Application
          </Typography>
          <Grid margin={1}>
            <Typography>
              This application is a demonstration of what the Pi App Platform
              can provide to applications. 
            </Typography>
          </Grid>
          <Grid margin={1}>
            <Typography>
              Authorization: The sign in function leverages the Authentication feature
              to give applications a way to ID users.
            </Typography>
          </Grid >
          <Grid margin={1}>
            <Typography>
              Payments: 
              Process Pi transactions within your application. <br/>
              Naviagate to the respective page from the top left menu
                <ul>
                  <li>
                    User to App
                  </li>
                  <li>
                    App to User
                  </li>
                </ul>
            </Typography>
          </Grid>
        </Grid>
      </Grid>
    </Box>
    <Footer/>
    </>
);

};