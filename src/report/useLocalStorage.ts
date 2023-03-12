import { useState } from 'react';

export const useLocalStorage = <T extends unknown>(
	key: string,
	initialValue: T
): [T, (value: T) => void] => {
	// if value exists in local storage, use that instead of initialValue
	const loaded = localStorage.getItem(key);
	const [value, setValue] = useState<T>(loaded === null ? initialValue! : JSON.parse(loaded));

	// before setting value, put it in local storage
	const setHandler = (value: T) => {
		localStorage.setItem(key, JSON.stringify(value));
		setValue(value);
	};

	return [value, setHandler];
};
