import React from 'react';
import RecentContributions from './lib/components/recentContributions';

var mountNode = document.getElementById('userMatrixRoot'),
  baseUrl;
baseUrl = mountNode.getAttribute('data-base-url');

React.render(<RecentContributions baseUrl={baseUrl} />, mountNode);
