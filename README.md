## Getting Started

Create a new Pinata project with tailwindcss using this command:

```
npx create-pinata-app
```

Follow the prompts in the command line to create the project. Once complete, change into the new project directory and run the app with the following command:

```
npm run dev
```

You can edit the `pages/index.js` file and the API route file `pages/api/files` to see the Pinata functionality and extend it or make changes.

### Environment Variables

This project makes use of both public and private environment variables. The private environment variables are used to protect sensitive data like your Pinata API keys. The public environment variables are convenient central variable housing.

Read more about [how environment variables work with Next.js here](https://nextjs.org/docs/pages/building-your-application/configuring/environment-variables).

There is a `.env.sample` file you can copy and rename to `.env.local` for use in your project. Be sure to fill out the environment variable values in the `.env.local` file with your actual values.

### Styling

This project already has tailwindcss ready to use out of the box.

### Learn More

For more information about building apps with Pinata and IPFS, check out the following resources:

- [Pinata Docs](https://docs.pinata.cloud)
- [Pinata Tutorials](https://medium.com/pinata)
- [Quick Start Recipes](https://docs.pinata.cloud/recipes)
