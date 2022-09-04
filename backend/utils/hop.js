// import { Hop } from '@onehop/js';
const { Hop } = require('@onehop/js');
require('dotenv').config();

const token = process.env.HOP_TOKEN;

const hop = new Hop(token);

module.exports = hop;

// await hop.projects.secrets.create(
// 	'RANDOM_NUMBER',
// 	Math.floor(Math.random() * 100).toString(),
// );
