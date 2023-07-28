import { rest } from "msw";

const singleUserHandler = rest.get(/.*\/users\/.*/, (_req, res, ctx) =>
  res(ctx.json(
    {
      id: '87398cbf-aa5b-4cfd-8399-18f5509f2ae7',
      name: 'Jane Doe'
    },
  ))
)

export default singleUserHandler;
