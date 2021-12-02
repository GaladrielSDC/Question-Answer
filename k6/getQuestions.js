/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
import { URL } from 'https://jslib.k6.io/url/1.0.0/index.js';
import http from 'k6/http';
import { sleep } from 'k6';

export default function () {
  const url = new URL('http://localhost:3000/qa/questions');
  url.searchParams.append('product_id', '7');

  http.get(url.toString());
  sleep(1);
}
