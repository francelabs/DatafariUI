import React from 'react';
import { NavLink } from 'react-router-dom';

import './MainNavigation.css';

const mainNavigation = (props) => (
  <header>
    <div>
      <h1>Datafari</h1>
    </div>
    <nav>
      <ul>
        {props.entries.map((entry) => (
          <li>
            <NavLink to={entry.path}>{entry.label}</NavLink>
          </li>
        ))}
      </ul>
    </nav>
  </header>
);

export default mainNavigation;
