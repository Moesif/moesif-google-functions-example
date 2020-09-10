
# Example Google Functions with Moesif NodeJs

## Background:

This repo shows examples of how you can set up [moesif-nodejs SDK](https://github.com/Moesif/moesif-nodejs) with both incoming API calls and outGoing API calls.

There are three key example set ups:

- expressApp, this is an example express app with Moesif Middleware installed where all _incoming_ APIs will be captured.
- syncedOutgoing, this is where when triggered, it will make an API call to an external source, and this API call should be captured also.
- delayedOutgoing, this is where when triggered, it will immediately return a response, but then will trigger a series of API call to an external source. This may fail to be captured by Moesif if it exceeds timeout of google functions environment. However, it may be ok when google execution environment continues.

## To Set up the test


### Moesif Application Id

First, obtain your _Moesif Application Id_ from the onboarding flow or installation section of your Moesif Account.

Replace `Your Application Id` in the `initMoesif.js` file with your actual application Id.

### Google Cloud Function environment

If you haven't done so, please follow [Google Quick Start guide](https://cloud.google.com/functions/docs/first-nodejs) to ensure you can create and deploy functions and have `glcoud` properly installed.


## Run Tests Locally

You can also start each individual service and run locally using the `functions-framework`:

- `npm run start-syncedOutgoing`
- `npm run start-delayedOutgoing`
- `npm run start-expressApp`

And simply use postman, [api request runner](http://www.apirequest.io) or even an browser to test against these end points locally.

Or you can run these automated tests:

`npm run unit-test`

## Deploy to Google Cloud and Run Tests

First deploy following [google deployment instructions](https://cloud.google.com/functions/docs/deploying/filesystem), or use these commands.

- `npm run deploy-syncedOutgoing`
- `npm run deploy-delayedOutgoing`
- `npm run deploy-expressApp`

If deployment is successful, the trigger url should be available. Take notes of your baseUrl, which should be this format `https://YOUR_GCF_REGION-YOUR_GCP_PROJECT_ID.cloudfunctions.net/`

Of course, you can use postman or any of the test runners to test the apis.

If you want to use the run the system tests.

`export BASE_URL=https://YOUR_GCF_REGION-YOUR_GCP_PROJECT_ID.cloudfunctions.net/`

`npm run system-test`
