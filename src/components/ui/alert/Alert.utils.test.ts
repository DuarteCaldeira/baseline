import { describe, expect, it } from 'vitest';

import { ALERT_ICON_MAP, ALERT_ROLE_MAP, hasAlertDescription } from './Alert.utils';

describe('Alert.utils', () => {
	it.each(['success', 'error', 'warning', 'info'] as const)(
		'maps %s to an icon',
		(variant) => {
			expect(ALERT_ICON_MAP[variant]).toBeDefined();
		}
	);

	it('uses alert role for error and warning', () => {
		expect(ALERT_ROLE_MAP.error).toBe('alert');
		expect(ALERT_ROLE_MAP.warning).toBe('alert');
	});

	it('uses status role for success and info', () => {
		expect(ALERT_ROLE_MAP.success).toBe('status');
		expect(ALERT_ROLE_MAP.info).toBe('status');
	});

	it.each([null, undefined, false, '', '   '])(
		'treats %j as having no description',
		(value) => {
			expect(hasAlertDescription(value)).toBe(false);
		}
	);

	it('treats non-empty strings as having a description', () => {
		expect(hasAlertDescription('Details here')).toBe(true);
	});
});
