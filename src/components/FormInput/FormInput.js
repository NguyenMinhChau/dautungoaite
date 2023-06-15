import React, { forwardRef, useState } from 'react';
import PropTypes from 'prop-types';
import className from 'classnames/bind';
import { Icons } from '../';
import styles from './FormInput.module.css';

const cx = className.bind(styles);

const FormInput = forwardRef(
	(
		{
			label,
			type,
			placeholder,
			classNameInput,
			classNameField,
			value,
			showPwd,
			onChange,
			name,
			readOnly,
			onEnter,
			required,
		},
		ref,
	) => {
		const [typePwd, setTypePwd] = useState(false);
		const classedInput = cx(
			'input',
			classNameInput,
			showPwd ? 'show-pwd' : '',
			readOnly ? 'read-only' : '',
		);
		const classedField = cx('field-container', classNameField);
		const handleTypePwd = () => {
			setTypePwd(!typePwd);
		};
		return (
			<div className={classedField}>
				{label && (
					<label className="label">
						{label} {required && <span className="cancel">*</span>}
					</label>
				)}
				<div className={cx('relative-input')}>
					<input
						ref={ref}
						type={showPwd ? (typePwd ? 'text' : 'password') : type}
						className={classedInput}
						placeholder={!readOnly ? placeholder : 'Read only'}
						value={value}
						onChange={onChange}
						name={name}
						readOnly={readOnly}
						onKeyPress={(e) => {
							if (e.key === 'Enter') {
								onEnter(e);
							}
						}}
					/>
					{showPwd && (
						<span
							className={cx('icon-eye')}
							onClick={handleTypePwd}
						>
							{typePwd ? (
								<Icons.EyeIcon className={cx('icon')} />
							) : (
								<Icons.EyeShowIcon className={cx('icon')} />
							)}
						</span>
					)}
				</div>
			</div>
		);
	},
);

FormInput.propTypes = {
	label: PropTypes.string,
	type: PropTypes.string,
	placeholder: PropTypes.string,
	classNameInput: PropTypes.string,
	classNameField: PropTypes.string,
	value: PropTypes.node,
	showPwd: PropTypes.bool,
	onChange: PropTypes.func,
	name: PropTypes.string,
	readOnly: PropTypes.bool,
};

export default FormInput;
