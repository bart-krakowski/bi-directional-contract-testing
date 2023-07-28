import { render, screen } from '@testing-library/react';

import UsersPage from '../page';

describe("Users page", () => {
  it("should render successfully", async () => {
    console.log('process.env.PACT_PROVIDER', process.env.PACT_PROVIDER)
    render(await UsersPage())
  });
  it('should render user list', async () => {
    render(await UsersPage())
    expect(screen.getByText('Jane Doe', { exact: false })).toBeInTheDocument()
  })
})