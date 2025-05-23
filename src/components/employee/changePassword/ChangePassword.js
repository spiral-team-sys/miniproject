import React, { useState } from 'react';
import ActionSheet, { SheetManager } from 'react-native-actions-sheet';
import NoticeView from './Page/NoticeView';
import ChangePasswordView from './Page/ChangePasswordView';
import useTheme from '../../../hooks/useTheme';
import { KEYs } from '../../../utils/storageKeys';
import { StyleSheet, View } from 'react-native';

const ChangePassword = ({ }) => {
	const { appColors } = useTheme()
	const [activeView, setActiveView] = useState('NOTICE')

	const handlerClose = () => {
		SheetManager.hide(KEYs.ACTION_SHEET.PASSWORD_SHEET)
		setActiveView('NOTICE')
	}

	const onChangePass = () => {
		setActiveView('CHANGE')
	}

	const styles = StyleSheet.create({
		mainContainer: { backgroundColor: appColors.backgroundColor },
		contentView: { marginBottom: 38 }
	})

	return (
		<ActionSheet id={KEYs.ACTION_SHEET.PASSWORD_SHEET} containerStyle={styles.mainContainer}>
			<View style={styles.contentView}>
				{activeView === 'CHANGE' ?
					<ChangePasswordView onClose={handlerClose} />
					:
					<NoticeView onChangePass={onChangePass} />
				}
			</View>
		</ActionSheet>
	);
};
export default ChangePassword;
