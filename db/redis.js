const Redis = require('ioredis')

const redis = {
  port: 6379,          // Redis port
  host: '127.0.0.1',   // Redis host
  family: 4,           //连接方式，IPV4或IPV6
  db: 0
}

const ioredis = new Redis(redis)
module.exports = ioredis
