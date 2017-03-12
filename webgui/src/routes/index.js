import React from 'react';
import { Route, IndexRoute } from 'react-router';

import App from '../screens/app';
import Start from '../screens/start';

const url = "http://localhost:5000";
export const API = {
  yrkesgrupper: url + "/yrkesgrupper",
  search: url + "/search",
  geografi: url + "/geografi",
};

export default () => (
  <Route component={ App }>
    <IndexRoute component={ Start } />
  </Route>
);
