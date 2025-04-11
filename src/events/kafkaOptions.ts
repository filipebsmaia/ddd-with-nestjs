import { ConsumerConfig, KafkaConfig, ProducerConfig } from 'kafkajs';
import { name } from '../../package.json';

interface KafkaOptions {
  consumer: ConsumerConfig
  client: KafkaConfig
  producer: ProducerConfig
}

export const kafkaOptions: KafkaOptions = {
    client: {
      clientId: name,
      brokers: (process.env.KAFKA_BOOTSTRAP_SERVERS || '').split(','),
      sasl:
        process.env.KAFKA_PROTOCOL === 'SASL_SSL'
          ? {
              mechanism: 'plain',
              username: process.env.KAFKA_USERNAME || '',
              password: process.env.KAFKA_PASSWORD || '',
            }
          : undefined,
      ssl: process.env.KAFKA_PROTOCOL === 'SASL_SSL',
      authenticationTimeout: 10000,
      connectionTimeout: 10000,
    },
    consumer: {
      groupId: name,
      heartbeatInterval: 9000,
      sessionTimeout: 30000,
      maxWaitTimeInMs: 15000,
    },
    producer: {
      //
    }
};
