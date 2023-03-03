import Downshift from 'downshift';
import { Key, ReactNode } from 'react';

interface ComboboxProps<T = any> {
	choices: T[];
	value: T;
	onChange: (item: T) => void;
	itemMatchesSearch: (item: T, search: string | null) => boolean;
	itemToString: (item: T) => string;
	itemVis?: (item: T) => string | ReactNode;
	itemToKey: (item: T) => Key;
	sortFn?: (a: T, b: T) => number;
	label?: string;
	placeholder?: string;
	activeClass?: string;
	hoverClass?: string;
}

export const Combobox: React.FC<ComboboxProps> = ({
	choices,
	value,
	onChange,
	itemMatchesSearch,
	itemToString,
	itemVis,
	itemToKey,
	label,
	placeholder,
	activeClass,
	hoverClass,
	sortFn
}) => {
	return (
		<Downshift onChange={onChange} itemToString={itemToString} selectedItem={value}>
			{({
				getInputProps,
				getItemProps,
				getLabelProps,
				getMenuProps,
				isOpen,
				inputValue,
				highlightedIndex,
				selectedItem,
				getRootProps,
				setState
			}) => (
				<div>
					<div {...getRootProps({}, { suppressRefError: true })}>
						{label !== undefined ? <label {...getLabelProps()}>{label}</label> : null}
						<input
							{...getInputProps()}
							placeholder={placeholder}
							onFocus={() => setState({ isOpen: true })}
						/>

						{isOpen ? (
							<ul {...getMenuProps()}>
								{choices
									.filter((item) => itemMatchesSearch(item, inputValue))
									.slice()
									.sort(sortFn)
									.map((item, index) => (
										<li
											{...getItemProps({
												key: itemToKey(item),
												index,
												item,
												className: `${
													hoverClass && highlightedIndex === index
														? hoverClass
														: ''
												} ${
													activeClass && selectedItem === item
														? activeClass
														: ''
												}`
											})}
										>
											{itemVis !== undefined
												? itemVis(item)
												: itemToString(item)}
										</li>
									))}
							</ul>
						) : null}
					</div>
				</div>
			)}
		</Downshift>
	);
};
