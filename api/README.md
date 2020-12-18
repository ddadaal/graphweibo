# graphweibo API

This project contains **API definitions** (endpoints and data schema) which can be used by both the frontend and backend to generate clients and server routes.

# Development

After modifying any API, run `npm run api` to generate data schemas `schemas.json` based on the interfaces defined in the `api` directory, which will be used by the backend to generate validation rules.

This project should NOT be compiled directly. Instead, the build pipelines of frontend and backend will include this project and bundle its content into frontend and backend bundles.
