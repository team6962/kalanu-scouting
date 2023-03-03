import { useCombobox } from 'downshift';
import type { UseComboboxStateChange } from 'downshift';
import { Key, ReactNode, ReactElement, useState } from 'react';

import * as styles from './ComboBox.module.scss';

type ComboboxProps<T> = {
	items: T[];

	value: T | null;
	onChange: (item: T | null | undefined) => void;

	itemToString: (item: T | null) => string;
	itemToNode?: (item: T) => string | ReactNode;
	itemToKey?: (item: T) => Key;

	itemMatchesSearch?: (item: T, input: string) => boolean;
	sortItems?: (a: T, b: T) => number;

	label?: string;
	placeholder?: string;
};

export const ComboBox = <T extends unknown>({
	items,

	value,
	onChange,

	itemToString,
	itemToNode,
	itemToKey,

	itemMatchesSearch,
	sortItems,

	label,
	placeholder
}: ComboboxProps<T>): ReactElement => {
	// will sort initial choices if possible
	items = items.slice().sort(sortItems);

	const [inputItems, setInputItems] = useState<
		{
			index: number;
			item: T;
		}[]
	>(items.map((item, index) => ({ item, index })));

	const onSelectedItemChange = ({ selectedItem }: UseComboboxStateChange<T>) =>
		onChange(selectedItem);

	const onStateChange = ({ type, inputValue }: UseComboboxStateChange<T>) => {
		switch (type) {
			case useCombobox.stateChangeTypes.InputFocus:
			case useCombobox.stateChangeTypes.InputChange:
				let tempItems: {
					index: number;
					item: T;
				}[] = items.map((item, index) => ({ item, index }));
				if (itemMatchesSearch !== undefined)
					tempItems = tempItems.filter((item) =>
						itemMatchesSearch(item.item, inputValue || '')
					);
				setInputItems(tempItems);
				break;
		}
	};

	const { getInputProps, getLabelProps, getMenuProps, getItemProps, highlightedIndex, isOpen } =
		useCombobox<T>({
			items,
			itemToString,
			selectedItem: value,
			onSelectedItemChange,
			onStateChange
		});

	return (
		<div className={styles.combobox}>
			{label !== undefined ? <label {...getLabelProps()}>{label}</label> : null}
			<input {...getInputProps()} placeholder={placeholder} />
			<ul {...getMenuProps({}, { suppressRefError: true })}>
				{isOpen
					? inputItems.map(({ item, index }) => (
							<li
								{...getItemProps({ item, index })}
								key={itemToKey === undefined ? itemToString(item) : itemToKey(item)}
								className={
									index === highlightedIndex ? styles.highlighted : undefined
								}
							>
								{itemToNode !== undefined ? itemToNode(item) : itemToString(item)}
							</li>
					  ))
					: null}
			</ul>
		</div>
	);
};
