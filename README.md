# DragonFly Ai App

This app integrates with the Dragonfly file upload API to generate predictive analytics for visual assets.

## Running the React App

Copy the .env. examplecontent to a .env file in the root folder

In the project directory, you can run:

### `npm install`

This will install all package dependencies required to run this app

### `npm start`

Runs the app in the development mode.\ By default the app runs using port 5173. You can change that in the package.json file under scripts > start.
Open [http://localhost:5173](http://localhost:5173) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

**Note: You may experience Cors issues while running the app, a proxy midddleware as been developed to bypass this issue till it is resolved and it is included in this project as proxy. It is built with .Net Core**

To disable the use of the proxy middleware, navigate to src/apis/file-upload.js, under the functions get_url and process_image, you will see the functions to uncomment to use the proxy app.

## Running the Proxy App

In the proxy folder, run the following command. You need to have .net core installed to successfully run this command.

### `dotnet run`

Make sure to add the link to the .env file in your react app as REACT_APP_API_URL_PROXY
