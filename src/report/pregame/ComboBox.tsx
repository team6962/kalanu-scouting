import { useCombobox, UseComboboxState, UseComboboxStateChangeOptions } from 'downshift';
import type { UseComboboxStateChange } from 'downshift';
import { Key, ReactNode, ReactElement, useState } from 'react';

import * as styles from './ComboBox.module.scss';

type ComboboxProps<T> = {
	items: T[];

	value: T | null;
	onChange: (item: T | null) => void;

	itemToString: (item: T | null) => string;
	itemToNode?: (item: T) => string | ReactNode;
	itemToKey?: (item: T) => Key;

	itemMatchesSearch?: (item: T, input: string) => boolean;
	sortItems?: (a: T, b: T) => number;

	label?: string;
	placeholder?: string;
	disabled?: boolean;
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
	placeholder,
	disabled
}: ComboboxProps<T>): ReactElement => {
	// will sort initial choices if possible
	items = (items || []).slice().sort(sortItems);

	const [inputItems, setInputItems] = useState<
		{
			index: number;
			item: T;
		}[]
	>(items.map((item, index) => ({ item, index })));

	const onSelectedItemChange = ({ selectedItem }: UseComboboxStateChange<T>) =>
		onChange(selectedItem === undefined ? null : selectedItem);

	const stateReducer = (
		{ highlightedIndex }: UseComboboxState<T>,
		{ type, changes }: UseComboboxStateChangeOptions<T>
	): Partial<UseComboboxState<T>> => {
		const { stateChangeTypes } = useCombobox;
		if (type === stateChangeTypes.InputKeyDownArrowUp) {
			const current = inputItems.findIndex(({ index }) => index === highlightedIndex);
			const prev = inputItems[current === -1 ? 0 : current - 1];
			return {
				...changes,
				highlightedIndex: prev.index
			};
		} else if (type === stateChangeTypes.InputKeyDownArrowDown) {
			const current = inputItems.findIndex(({ index }) => index === highlightedIndex);
			const next = inputItems[current === -1 ? 0 : current + 1];
			return {
				...changes,
				highlightedIndex: next.index
			};
		} else if (type === stateChangeTypes.InputFocus || type === stateChangeTypes.InputChange) {
			let tempItems: {
				index: number;
				item: T;
			}[] = items.map((item, index) => ({ item, index }));
			if (itemMatchesSearch !== undefined)
				tempItems = tempItems.filter((item) =>
					itemMatchesSearch(item.item, changes.inputValue || '')
				);
			setInputItems(tempItems);
			return changes;
		} else if (type === stateChangeTypes.InputBlur) {
			if (value !== null)
				return {
					...changes,
					inputValue: itemToString(value)
				};
			return changes;
		} else {
			return changes;
		}
	};

	const { getInputProps, getLabelProps, getMenuProps, getItemProps, highlightedIndex, isOpen } =
		useCombobox<T>({
			items,
			itemToString,
			selectedItem: value,
			onSelectedItemChange,
			stateReducer
		});

	return (
		<div className={styles.combobox}>
			{label !== undefined ? <label {...getLabelProps()}>{label}</label> : null}
			<input {...getInputProps()} placeholder={placeholder} disabled={disabled} />
			<ul {...getMenuProps({}, { suppressRefError: true })}>
				{isOpen && !disabled
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

export const ComboPlaceholder: React.FC<{ placeholder?: string }> = ({ placeholder }) => (
	<div className={styles.combobox}>
		<input type="text" placeholder={placeholder} disabled />
	</div>
);
