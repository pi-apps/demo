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
        <Grid item xs={9} margin={2}>
        <Typography>
          THIS IS A NEW DEMO HOME PAGE 
          ADD MORE TEXT HERE!
        </Typography>
        </Grid>
      </Grid>
    </Box>
    <Footer/>
    </>
);

};