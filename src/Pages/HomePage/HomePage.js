import { makeStyles, Paper } from "@material-ui/core";
import React from "react";
import { useTranslation } from "react-i18next";
import SimpleSearchBar from "../../Components/SearchBar/SimpleSearchBar";

const useStyles = makeStyles((theme) => ({
  container: {
    display: "grid",
    gridTemplateRows: "minmax(10em, 1fr)",
    gridTemplateColumns: "minmax(auto, 65em)",
    justifyContent: "center",
    alignContent: "center",
    gridGap: "1em",
    padding: "0em 1em",
  },
  contentContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(200px, 1fr))",
    gridGap: "1em",

    [theme.breakpoints.down("xs")]: {
      gridTemplateColumns: "1fr",
      fontSize: "0.75em",
    },
  },
  content: {
    marginTop: "10vh",
    width: "80%",
    margin: "auto",
  },
  card: {
    padding: theme.spacing(2),
    textAlign: "justify",
  },
  logo: {
    display: "block",
    margin: "auto",
    maxWidth: "15em",
  },
}));

const HomePage = (props) => {
  const classes = useStyles();
  const { t } = useTranslation();

  return (
    <div className={classes.container}>
      <img
        src={`${process.env.PUBLIC_URL}/images/logo_big.png`}
        alt="logo"
        className={classes.logo}
      />
      <SimpleSearchBar />
      <div className={classes.contentContainer}>
        {[1, 2, 3].map((value) => (
          <Paper
            key={value}
            className={classes.card}
            dangerouslySetInnerHTML={{
              __html: t(`homepage column ${value}`),
            }}
          ></Paper>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
