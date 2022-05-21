const keys = require("./keys");
const redis = require("redis");

const redisClient = redis.createClient({
  host: keys.redisHost,
  port: keys.redisPort,
  // whenever disconnected, try to reconnect every 1 sec
  retry_strategy: () => 1000,
});

// Subscribing to a channel requires a dedicated stand-alone
// connection. You can easily get one by .duplicate()ing an
// existing Redis connection.
const sub = redisClient.duplicate();

function fib(index) {
  if (index < 2) return 1;
  return fib(index - 1) + fib(index - 2);
}

sub.on("message", (channel, message) => {
  // store the key:value pair in a hash field called `values`
  redisClient.hset("values", message, fib(parseInt(message)));
});
sub.subscribe("insert");
