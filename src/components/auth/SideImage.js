import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";

export function SideImage({
  label,
  formComponent: FormComponent,
  navigationComponent: NavigationComponent,
}) {
  return (
    <Grid container sx={{ height: "100vh" }} component="main">
      <CssBaseline />
      <Grid
        item
        xs={false}
        sm={3}
        md={7}
        sx={{
          backgroundImage: "url(https://source.unsplash.com/random)",
          backgroundRepeat: "no-repeat",
          backgroundColor: (t) =>
            t.palette.mode === "light"
              ? t.palette.grey[50]
              : t.palette.grey[900],
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      ></Grid>
      <Grid item xs={12} sm={9} md={5} component={Paper} elevation={5}>
        <Box
          sx={{
            my: 8,
            mx: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography component="h1" variant="h5">
            {label}
          </Typography>
          <FormComponent></FormComponent>
          <NavigationComponent></NavigationComponent>
        </Box>
      </Grid>
    </Grid>
  );
}
