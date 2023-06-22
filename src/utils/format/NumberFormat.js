export const autoFormatNumberInputChange = (number) => {
	return number
		.toString()
		.replace(/\D/g, '')
		.split('')
		.reverse()
		.join('')
		.replace(/(\d{3})(?=\d)/g, '$1,')
		.split('')
		.reverse()
		.join('');
};
export const formatMoneyUSDT = (value) => {
	let cleanedInput = `${value}`?.replace(/,/g, '');
	if (cleanedInput?.includes('.')) {
		let parts = cleanedInput.split('.');
		let wholePart = parts[0];
		let decimalPart = parts[1];

		wholePart = wholePart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
		return wholePart + '.' + decimalPart;
	} else {
		cleanedInput = cleanedInput.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

		return cleanedInput;
	}
};
export const convertNumberMultiple = (number, multipleNumber) => {
	const numberConvert = parseInt(number.toString().replace(/\D/g, ''), 10);
	const multiplied = numberConvert * multipleNumber;
	//console.log(autoFormatNumberInputChange(multiplied)); //x.xxx
	return multiplied;
};
