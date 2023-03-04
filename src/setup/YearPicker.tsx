import { ChangeEvent, Dispatch } from 'react';

interface YearPickerProps {
	year: number;
	setYear: Dispatch<number>;
}

export const YearPicker: React.FC<YearPickerProps> = ({ year, setYear }) => {
	const onChange = (event: ChangeEvent<HTMLInputElement>) => {
		const value = parseInt(event.target.value);
		if (Number.isNaN(value)) return;
		if (value < 0) return;
		setYear(value);
	};
	return <input type="number" value={year} onChange={onChange} />;
};
