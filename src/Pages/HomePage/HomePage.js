import React from "react";
import { useTranslation } from "react-i18next";

import { Grid, makeStyles, Paper } from "@material-ui/core";
import SimpleSearchBar from "../../Components/SearchBar/SimpleSearchBar";

const useStyles = makeStyles((theme) => ({
  content: {
    marginTop: "10vh",
    width: "80%",
    margin: "auto",
  },
  card: {
    padding: theme.spacing(2),
  },
  logo: {
    display: "block",
    margin: "auto",
    maxHeight: "15vh",
    minHeight: "70px",
    maxWidth: "100%",
  },
}));

const HomePage = (props) => {
  const classes = useStyles();
  const { t } = useTranslation();

  return (
    <Grid
      container
      justifyContent="center"
      spacing={4}
      className={classes.content}
    >
      <Grid item xs={10}>
        <img
          src={`${process.env.PUBLIC_URL}/images/logo_big.png`}
          alt="logo"
          className={classes.logo}
        />
      </Grid>
      <Grid item xs={10}>
        <SimpleSearchBar />
      </Grid>
      {[1, 2, 3].map((value) => (
        <Grid key={value} item xs={10} lg={3}>
          <Paper
            className={classes.card}
            dangerouslySetInnerHTML={{ __html: t(`homepage column ${value}`) }}
          ></Paper>
        </Grid>
      ))}
    </Grid>
  );
};

export default HomePage;
