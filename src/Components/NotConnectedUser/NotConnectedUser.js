//** Core */
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { UserContext } from '../../Contexts/user-context';

//** Material UI */
import {makeStyles, Typography} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    facetHeader: {
        margin: theme.spacing(4),
      

    },
    facetTitleText: {
        fontStyle: 'normal',
        fontWeight: 'bold', 
        fontSize: '18px',
        color: '#FF0000',
        wordBreak: 'break-all',
       
    }
}));


const NotConnectedUser = ({display = false}) => {
const classes = useStyles();
const { t } = useTranslation();
const { state: userState } = useContext(UserContext);

console.log(display)
console.log(userState)

if((userState.user === null) && display ){
    return (
        <div className={classes.facetHeader}>
            <Typography className={classes.facetTitleText}>
                {t('Search is in disconnected mode')}
            </Typography>      
        </div>
    );
} else {
    return <></>;
}

};

export default NotConnectedUser;