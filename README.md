This is an example of using Mintlify's Discovery API to embed AI chat with your docs as a knowledge source into a Next.js application.

An example of this with the Mintlify docs is live at [chat.mintlify.com](https://chat.mintlify.com).

## Getting Started

First, generate a discovery API key in the [Mintlify Dashboard](https://dashboard.mintlify.com/products/chat/widget).
This application uses a `NEXT_PUBLIC` environment variable to load the key.

To run it locally, you'll need to do something like `EXPORT NEXT_PUBLIC_DISCOVERY_API_KEY=<your api key>`.

Then, you can run the development server:

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
