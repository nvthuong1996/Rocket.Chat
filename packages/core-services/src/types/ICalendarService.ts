import type { ICalendarEvent, IUser } from '@rocket.chat/core-typings';
import type { InsertionModel } from '@rocket.chat/model-typings';
import type { PaginatedResult } from '@rocket.chat/rest-typings';

export interface ICalendarService {
	create(data: InsertionModel<ICalendarEvent>): Promise<void>;
	list(uid: IUser['_id'], pagination?: { offset?: number; count?: number }): Promise<PaginatedResult<{ data: ICalendarEvent[] }>>;
}
