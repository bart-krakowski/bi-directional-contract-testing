import { DefaultBodyType, rest } from "msw";

const allUsersHandler = rest.get(/.*\/users$/, (_req, res, ctx) =>
  res(ctx.json([
    {
      id: '3640c80d-13fd-4a20-b8ef-f9cb2943508d',
      name: 'John Doe',
    },
    {
      id: '87398cbf-aa5b-4cfd-8399-18f5509f2ae7',
      name: 'Jane Doe'
    }
  ]))
)

export default allUsersHandler;
