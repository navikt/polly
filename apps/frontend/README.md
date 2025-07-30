[![Frontend](https://github.com/navikt/polly/workflows/Frontend/badge.svg?branch=master)](https://github.com/navikt/polly/actions)

# Frontend for Behandlingskatalogen

## Requires node 17

### Install dependencies

`yarn install`

### Login with Google Cloud with @nav.no user

Do this in Google Chrome as it doesn't always work in Firefox on Mac

`gcloud auth login`

Remember to flush sockets when you can't login

`chrome://net-internals/#sockets`

### Run locally, with port forward to dev-gcp

`kubectl port-forward deployment/polly-backend`

OR

`kpfb`

### Finally, run frontend

`yarn run start`

## Other

### To use Yarn you need to

1. `brew install yarn`
2. `brew install node`

--

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm i`

Install packages

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

Make a `.env.local` file first, to direct backend traffic etc. Use `.env.master` as base, use portforward or locally running backend.

### `npm test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (Webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).


