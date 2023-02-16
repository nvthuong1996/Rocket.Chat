// import type { ICalendarEvent } from '@rocket.chat/core-typings';

import type { CalendarEventCreateProps } from './CalendarEventCreateProps';
// import type { PaginatedResult } from '../../helpers/PaginatedResult';

export * from './CalendarEventCreateProps';

export type CalendarEndpoints = {
	'/v1/calendar-events.create': {
		POST: (params: CalendarEventCreateProps) => void;
	};
};
