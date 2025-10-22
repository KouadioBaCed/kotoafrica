Usage

import { API_BASE_URL, api } from './config';

fetch(api('/products'))
  .then(r => r.json())
  .then(data => console.log(data));

Remember to create `.env.development` or `.env.production` from the examples before running or building.