import { Box, Menu, Option } from '@rocket.chat/fuselage';
import { useMediaQuery, useMutableCallback } from '@rocket.chat/fuselage-hooks';
import { useRoute } from '@rocket.chat/ui-contexts';
import type { KeyboardEvent, ReactElement } from 'react';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { GenericTableRow, GenericTableCell } from '../../../../components/GenericTable';
import DeviceIcon from '../../../../components/deviceManagement/DeviceIcon';
import { useDeviceLogout } from '../../../../hooks/useDeviceLogout';
import { useFormatDateAndTime } from '../../../../hooks/useFormatDateAndTime';

type DeviceRowProps = {
	_id: string;
	username?: string;
	ip: string;
	deviceName?: string;
	deviceType?: string;
	deviceOSName?: string;
	loginAt: string;
	rcVersion?: string;
	onReload: () => void;
};

const DeviceManagementAdminRow = ({
	_id,
	username,
	ip,
	deviceName,
	deviceType = 'browser',
	deviceOSName = '',
	loginAt,
	rcVersion,
	onReload,
}: DeviceRowProps): ReactElement => {
	const { t } = useTranslation();
	const deviceManagementRouter = useRoute('device-management');
	const formatDateAndTime = useFormatDateAndTime();
	const mediaQuery = useMediaQuery('(min-width: 1024px)');

	const handleDeviceLogout = useDeviceLogout(_id, '/v1/sessions/logout');

	const handleClick = useMutableCallback((): void => {
		deviceManagementRouter.push({
			context: 'info',
			id: _id,
		});
	});

	const handleKeyDown = useCallback(
		(e: KeyboardEvent<HTMLOrSVGElement>): void => {
			if (!['Enter', 'Space'].includes(e.nativeEvent.code)) {
				return;
			}
			handleClick();
		},
		[handleClick],
	);

	const menuOptions = {
		logout: {
			label: { label: t('Logout_Device'), icon: 'sign-out' },
			action: (): void => handleDeviceLogout(onReload),
		},
	};

	return (
		<GenericTableRow key={_id} onKeyDown={handleKeyDown} onClick={handleClick} tabIndex={0} action>
			<GenericTableCell>
				<Box display='flex' alignItems='center'>
					<DeviceIcon deviceType={deviceType} />
					{deviceName && <Box withTruncatedText>{deviceName}</Box>}
				</Box>
			</GenericTableCell>
			<GenericTableCell>{rcVersion}</GenericTableCell>
			<GenericTableCell>{deviceOSName}</GenericTableCell>
			<GenericTableCell withTruncatedText>{username}</GenericTableCell>
			{mediaQuery && <GenericTableCell>{formatDateAndTime(loginAt)}</GenericTableCell>}
			{mediaQuery && <GenericTableCell withTruncatedText>{_id}</GenericTableCell>}
			{mediaQuery && <GenericTableCell withTruncatedText>{ip}</GenericTableCell>}
			<GenericTableCell onClick={(e): void => e.stopPropagation()}>
				<Menu
					title={t('Options')}
					options={menuOptions}
					renderItem={({ label: { label, icon }, ...props }): ReactElement => <Option label={label} icon={icon} {...props} />}
				/>
			</GenericTableCell>
		</GenericTableRow>
	);
};

export default DeviceManagementAdminRow;
