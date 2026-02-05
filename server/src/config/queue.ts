import Queue from 'bull'
import { config } from './env.js'
import { logger } from './logger.js'

export const createQueue = (queueName: string): Queue.Queue => {
  const redisConfig: any = {
    host: config.BULL_REDIS_HOST,
    port: config.BULL_REDIS_PORT,
    db: config.BULL_REDIS_DB,
  }

  if (config.BULL_REDIS_PASSWORD) {
    redisConfig.password = config.BULL_REDIS_PASSWORD
  }

  const queue = new Queue(queueName, {
    redis: redisConfig,
  })

  queue.on('completed', (job) => {
    logger.info(`Job ${job.id} completed in queue ${queueName}`)
  })

  queue.on('failed', (job, err) => {
    logger.error(`Job ${job?.id} failed in queue ${queueName}:`, err)
  })

  queue.on('error', (error) => {
    logger.error(`Queue ${queueName} error:`, error)
  })

  return queue
}

// Example queues (you can create more as needed)
export const emailQueue = createQueue('email')
export const notificationQueue = createQueue('notification')
export const imageProcessingQueue = createQueue('image-processing')

