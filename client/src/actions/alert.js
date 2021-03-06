import { v4 as uuid } from 'uuid';
import { SET_ALERT, REMOVE_ALERT } from './types';

export const setAlert = (msg, alertType) => (dispath) => {
	const id = uuid.v4;
	dispath({
		type: SET_ALERT,
		payload: { msg, alertType, id },
	});

	setTimeout(() => dispath({ type: REMOVE_ALERT, payload: id }), 3600);
};
