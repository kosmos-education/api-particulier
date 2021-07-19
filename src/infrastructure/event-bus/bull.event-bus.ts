import {Queue} from 'bullmq';
import * as IORedis from 'ioredis';
import {TokenConsumed} from 'src/domain/data-fetching/events/token-consumed.event';
import {TokenNotFound} from 'src/domain/data-fetching/events/token-not-found.event';
import {Event} from 'src/domain/event';
import {EventBus} from 'src/domain/event-bus';
import {logFor} from 'src/domain/logger';

export const applicationEventQueueName = 'Application events';
export const tokenEventQueueName = 'Token events';

export class BullEventBus implements EventBus {
  private readonly applicationEventQueue: Queue;
  private readonly tokenEventQueue: Queue;
  private readonly logger = logFor(BullEventBus.name);

  constructor(redisConnection: IORedis.Redis) {
    this.applicationEventQueue = new Queue(applicationEventQueueName, {
      connection: redisConnection,
    });
    this.tokenEventQueue = new Queue(applicationEventQueueName, {
      connection: redisConnection,
    });
  }

  publish(event: Event): void {
    this.logger.log('debug', `Publishing ${event.constructor.name} event`, {
      event,
    });
    switch (event.constructor) {
      case TokenNotFound:
      case TokenConsumed:
        this.tokenEventQueue.add(event.constructor.name, event);
        break;
      default:
        this.applicationEventQueue.add(event.constructor.name, event);
        break;
    }
  }
}
