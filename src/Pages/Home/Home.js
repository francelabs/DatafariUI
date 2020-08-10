import React from 'react';
import { useTranslation, Trans } from 'react-i18next';

import './Home.css';
import logo from '../../logo.svg';

const Home = (props) => {
  const { t } = useTranslation();
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          <Trans t={t} i18nKey="editSource">
            Edit <code>src/App.js</code> and save to reload.
          </Trans>
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          {t('Learn React')}
        </a>
        <input type="text" style={{ border: 'none' }} />
      </header>
    </div>
  );
};

export default Home;
