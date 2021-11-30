import { URL } from 'https://jslib.k6.io/url/1.0.0/index.js';
import http from 'k6/http';
import { sleep } from 'k6';

export default function () {
  const url = new URL('http://localhost:3000/qa/questions/3518964/answers');
  const res = http.get(url.toString());
}
