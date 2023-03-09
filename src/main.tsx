import React from 'react';
import ReactDOM from 'react-dom/client';
import { Report } from './report/Report';

import './main.scss';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
	<React.StrictMode>
		<Report />
	</React.StrictMode>
);
