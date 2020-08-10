import React from 'react';

import './MainNavigation.css';

const mainNavigation = (props) => (
  <header>
    <div>
      <h1>Datafari</h1>
    </div>
    <nav>
      <ul>
        {props.entries.map((entry) => (
          <li>{entry}</li>
        ))}
      </ul>
    </nav>
  </header>
);

export default mainNavigation;
