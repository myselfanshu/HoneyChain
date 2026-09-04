export * from './types';
export * from './users';
export * from './hives';
export * from './batches';
export * from './traceability';
export * from './insights';
export * from './market';
export * from './alerts';
export * from './weather';

// Wire up relationships
import { batches } from './batches';
import { traceabilityEvents } from './traceability';

// Attach events to their respective batches
batches.forEach(batch => {
  batch.events = traceabilityEvents.filter(event => event.batchId === batch.id);
});
