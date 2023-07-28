import { render, screen } from '@testing-library/react';

import UsersSinglePage from '../page';

describe('User single page', () => {
  it('should render successfully', async () => {
    render(await UsersSinglePage({ params: { id: 'id' } }))
  });

  it('should render user details', async () => {
    render(await UsersSinglePage({ params: { id: 'id' } }))
    expect(screen.getByText('Jane Doe', { exact: false })).toBeInTheDocument()
  });
}); 
