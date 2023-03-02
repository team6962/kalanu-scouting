import { useEffect, useState } from 'react';

export function usePromise<T = any>(promise: Promise<T>) {
	const [loading, setLoading] = useState(true);
	const [value, setValue] = useState<T>();
	const [error, setError] = useState<Error>();

	useEffect(() => {
		promise
			.then((v) => setValue(v))
			.catch((e) => setError(e))
			.finally(() => setLoading(false));
	});

	return [loading, value, error];
}
