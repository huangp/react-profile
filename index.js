import React from 'react';
import RecentContributions from './lib/components/recentContributions';

React.render(<RecentContributions baseUrl='./lib/stores/userStats.json?foo=' />, document.getElementById('userMatrixRoot'));
