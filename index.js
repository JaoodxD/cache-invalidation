import { createCache } from 'async-cache-dedupe'
import { setTimeout } from 'timers/promises'

const cache = createCache({
  ttl: 10,
  storage: { type: 'memory', options: { invalidation: true } }
})

cache.define(
  'getRandomNumber',
  {
    references: (args, key, result) => {
      console.log('references', { args, key, result })
      const reference = result ? [`${args.min}-${args.max}`] : null
      return reference
    }
  },
  async ({ min, max }) => {
    await setTimeout(1000)
    return Math.floor(Math.random() * (max - min + 1)) + min
  }
)

const test = async (min, max) => {
  const number = await cache.getRandomNumber({ min, max })
  console.log(`${min}-${max}:`, number)
}

const invdalidate = async (min, max) =>
  cache.invalidate('getRandomNumber', `${min}-${max}`)

await test(1, 100)
await test(1, 100)
await test(1, 10)
await invdalidate(1, 100)
await test(1, 100)
await test(1, 10)

