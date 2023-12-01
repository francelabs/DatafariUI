//** Core */
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { UserContext } from '../../Contexts/user-context';
import { APIEndpointsContext } from '../../Contexts/api-endpoints-context';

//** Material UI */
import {makeStyles, Typography, Link} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    facetHeader: {
        margin: theme.spacing(4),
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    facetTitleText: {
        display: 'block',
        fontStyle: 'italic',
        fontSize: '18px',
        lineHeight: '1',
        color: '#5C5C5C', 
        paddingRight: theme.spacing(2), 
        marginRight: theme.spacing(2),    
        borderRight: '1px solid #B6B6B6',  
    },
}));

const NotConnectedUser = ({display = false}) => {
const classes = useStyles();
const { t } = useTranslation();
const { state: userState } = useContext(UserContext);

const { apiEndpointsContext } = useContext(APIEndpointsContext);
const loginURL = new URL(apiEndpointsContext.authURL);
loginURL.search = '?callback=' + new URL(process.env.PUBLIC_URL, window.location.href);

    if((userState.user === null) && display ){
        return (
            <div className={classes.facetHeader}>
                <Typography className={classes.facetTitleText}>{t('You are currently offline.')} </Typography>
                <Link color="secondary" href={loginURL}> {t('Login here to find reserved content')}</Link>    
            </div>
        );
    } else {
        return <></>;
    }
};

export default NotConnectedUser;