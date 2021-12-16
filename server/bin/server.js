#! /usr/bin/env node
/* eslint-disable no-console */

import getApp from '../index';

const port = process.env.PORT || 5000;
const address = '0.0.0.0';

(await getApp()).listen(port, address, () => {
  console.log(`Server is running on port: ${port}`);
});
