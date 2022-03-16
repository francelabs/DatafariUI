import { Chip, Typography } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';
import React from 'react';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    background: theme.palette.background.paper,
    padding: theme.spacing(2),
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),

    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },

  promoContainer: {
    display: 'grid',
    gridTemplateAreas: '"title action" "content content"',
  },

  titleContainer: {
    gridArea: 'title',
    padding: '5px 0px',
    display: 'flex',
    alignItems: 'center',
  },

  title: {
    display: 'inline',
    paddingInline: theme.spacing(1),
  },

  content: {
    gridArea: 'content',
  },

  close: {
    gridArea: 'action',
    display: 'flex',
    alignSelf: 'center',
    justifyContent: 'flex-end',
  },
}));

function PromoContent({ title, content, ...props }) {
  const [open, setOpen] = React.useState(true);

  const classes = useStyles();
  const {
    t,
    i18n: { language },
  } = useTranslation();

  return open ? (
    <div className={classes.root}>
      <div className={classes.promoContainer}>
        <div className={classes.titleContainer}>
          <Chip
            label={t('promolink')}
            size="small"
            color="secondary"
            className={classes.badge}
          />
          <Typography variant="h6" className={classes.title}>
            {props['title_' + language] ? props['title_' + language] : title}
          </Typography>
        </div>
        <div className={classes.content}>
          <Typography variant="body2">
            {props['content_' + language]
              ? props['content_' + language]
              : content}
          </Typography>
        </div>
        <div className={classes.close}>
          <IconButton
            aria-label="close"
            size="small"
            onClick={() => {
              setOpen(false);
            }}
          >
            <CloseIcon fontSize="inherit" />
          </IconButton>
        </div>
      </div>
    </div>
  ) : null;
}

export default PromoContent;
