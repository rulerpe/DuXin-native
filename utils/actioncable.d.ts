declare module '@rails/actioncable' {
  export const createConsumer: (url?: string) => any;
  export interface Cable {
    subscriptions: SubscriptionManager;
    connect(): void;
    disconnect(): void;
    send(data: string): void;
    ensureActiveConnection(): void;
  }
  export interface Subscription {
    consumer: Cable;
    identifier: string;
    perform(action: string, data?: object): void;
    unsubscribe(): void;
  }
  export interface SubscriptionManager {
    create(channelName: string | object, mixin?: object): Subscription;
  }
}
