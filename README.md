# Shop Place Application

<p align="center">
  <a href="https://nodejs.org/en/docs" target="blank"><img src="https://firebasestorage.googleapis.com/v0/b/shopplace-41632.appspot.com/o/Githup%2FNodeJs.png?alt=media&token=a0457543-9e06-429a-9364-fddc0e5b65b0&_gl=1*shqfs2*_ga*MTc4OTQzODUwNy4xNjk0Nzk3MzI5*_ga_CW55HF8NVT*MTY5Nzg4MTIyMi4yNC4xLjE2OTc4ODI0MDEuMjMuMC4w" width="400" alt="Nest Logo" /></a>
  <a href="https://legacy.reactjs.org/docs/getting-started.html" target="blank"><img src="https://firebasestorage.googleapis.com/v0/b/shopplace-41632.appspot.com/o/Githup%2FReactJs.png?alt=media&token=214d305b-a1af-437b-8eb7-e5a90b98f253&_gl=1*y4l745*_ga*MTc4OTQzODUwNy4xNjk0Nzk3MzI5*_ga_CW55HF8NVT*MTY5Nzg4MTIyMi4yNC4xLjE2OTc4ODIzODAuNDQuMC4w" width="300" alt="Nest Logo" /></a>
</p>

## Project Description
It is an online shopping application that can be used in everyday life. The project is not yet fully completed and there are improvements to be added. The project includes features such as registration, login, Forgot Decryption, welcome message, product add-edit, product search, sending a message to the page owner, adding to favorites, adding to cart and displaying products purchased by the customer, among others. Many of the features have already been completed and the rest will be completed shortly.

## Improvements to be added to the project
- There will be more plugins on my profile page.
- Design beautification.
- ...

Besides these features, many more new features will be added to make the online shopping page the most user-friendly in everyday life.

## How the project works?
After the installation process is completed, first run the backend, and then run the frontend. This is because the products on the homepage will throw errors if the backend is not running. 

## Project testing
Launches the test runner in the interactive watch mode.
See the section about [running tests](https://create-react-app.dev/docs/running-tests/) for more information.

## Technologies used in the project
Using JavaScript library *Reactjs*, based on Nodejs *Expressjs*, and database management with *MongoDb*, I have created a full-stack project with the assistance of technologies such as *Redux*, *AntDesign*, *cookie*, *jwt*, and *firebase*.

## Project Installation
To begin with, you need to clone the project to your computer. Simply run the following code in your command prompt.
```bash
$ git clone https://github.com/ismailkcbss/ShopPlace.git
```
After cloning the project to your computer, you need to open the command prompt in the directory where you copied the folder. Then, to complete the project installation, you should follow the steps below in sequence.

- ### Frontend Installation

Open the **Frontend** folder in the downloaded directory and click the folder path above the directory to run the *command prompt* and run the command client using this path. Then, type the following command to upload the *node modules* folder to the directory

```bash
$ npm install
```

After the download is complete, to run our project, type the following command in the same command prompt.

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

You can run the project by typing this command. In some cases, after the download is complete, you may encounter errors due to package versions. In such a situation, you can manually download according to the versions of the packages in the *package.json* file shown below

![PackageJsonPNG](https://firebasestorage.googleapis.com/v0/b/shopplace-41632.appspot.com/o/Githup%2FshopplaceFrontPackage.png?alt=media&token=0d5e435f-6726-4e12-8835-4dd545625a3d&_gl=1*mpqnoh*_ga*MTc4OTQzODUwNy4xNjk0Nzk3MzI5*_ga_CW55HF8NVT*MTY5Nzg4NDU4OC4yNS4xLjE2OTc4ODc1MjMuMjQuMC4w)

An example of the command you should type in the command prompt when you are inside the project's main directory for the download process is;
```bash
$ npm install react@18.0.2 --save --force
```
Writing this will assist you in downloading the package.

- ### Backend Installation 

Open the **backend** folder in the downloaded directory and click the folder path above the directory to run the command prompt and run this path in the command client. Then, type the following command to load the *node-modules* folder into the directory

```bash
$ npm install
```

After the download is complete, to run our project, type the following command in the same command prompt
```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

You can run the project by typing this command. In some cases, after the download is complete, you may encounter errors due to package versions. In such a situation, you can manually download according to the versions of the packages in the package.json file shown below.

![PackageJsonPNG](https://firebasestorage.googleapis.com/v0/b/shopplace-41632.appspot.com/o/Githup%2FshopplaceBackendPackage.png?alt=media&token=7b153fec-f600-418d-92ad-976b53f3cdc6&_gl=1*p6riy7*_ga*MTc4OTQzODUwNy4xNjk0Nzk3MzI5*_ga_CW55HF8NVT*MTY5Nzg4NDU4OC4yNS4xLjE2OTc4ODc0OTcuNTAuMC4w)

An example of the command you should type in the command prompt when you are inside the project's main directory for the download process is:

- ### for dependencies packages
```bash
$ npm install express@4.18.2 --save --force
```


- ### for devDependencies packages
```bash
$ npm install express@4.18.2 --save-dev --force
```
writing this will assist you in downloading the package.

## Application images

- Register Page

![Register](https://firebasestorage.googleapis.com/v0/b/shopplace-41632.appspot.com/o/Githup%2FShopPlaceRegister.png?alt=media&token=d17bb1af-359d-4098-989c-a7e0594f237a)

- Login Page

![Login](https://firebasestorage.googleapis.com/v0/b/shopplace-41632.appspot.com/o/Githup%2FshopplaceLogin.png?alt=media&token=658be220-ecd7-4439-b178-ad9d942f94f3)

- Forgot Password Page

![ForgotPassword](https://firebasestorage.googleapis.com/v0/b/shopplace-41632.appspot.com/o/Githup%2FShopPlaceForgotPassword.png?alt=media&token=655f47fb-ac28-44e3-973c-fd4fa47125fa)

- ContactUs Page

![Contact](https://firebasestorage.googleapis.com/v0/b/shopplace-41632.appspot.com/o/Githup%2FShopPlaceContackUs.png?alt=media&token=e51a0471-c5a5-4e70-a7f3-61f6f866ed40)

- Home Page

![Home](https://firebasestorage.googleapis.com/v0/b/shopplace-41632.appspot.com/o/Githup%2FShopPlaceHome1.png?alt=media&token=a5bfdc36-6825-4b3a-a425-6674ab00f4b1)

- Home Page 2

![Home2](https://firebasestorage.googleapis.com/v0/b/shopplace-41632.appspot.com/o/Githup%2FShopPlaceHome2.png?alt=media&token=5873e37c-d5a3-4057-a773-9400cdab8683)

- Seller MyProfile Page

![SellerMyProfile](https://firebasestorage.googleapis.com/v0/b/shopplace-41632.appspot.com/o/Githup%2FShopPlaceMyProfile1.png?alt=media&token=73d85e07-4a0f-4217-ab38-73e800eff5be)

- Seller MyProfile Page 2

![SellerMyProfile2](https://firebasestorage.googleapis.com/v0/b/shopplace-41632.appspot.com/o/Githup%2FShopPlaceMyProfile2.png?alt=media&token=842746d7-9e1c-4d2b-9226-de7f338cf97a)

- Customer Product view Page

![CustomerProductView](https://firebasestorage.googleapis.com/v0/b/shopplace-41632.appspot.com/o/Githup%2FShopPlaceCustomerViewer1.png?alt=media&token=7dc31e08-7796-480e-b0cb-ff75ec0aaa54)

- Seller Product view Page

![SellerProductView](https://firebasestorage.googleapis.com/v0/b/shopplace-41632.appspot.com/o/Githup%2FShopPlaceSellerViewer1.png?alt=media&token=307178c8-080a-42c9-a277-0b905060d210)

- Customer Pay Page 

![PayPage](https://firebasestorage.googleapis.com/v0/b/shopplace-41632.appspot.com/o/Githup%2FShopPlacePayPage1.png?alt=media&token=12c4c239-930c-4679-957a-504ff3ad208f)



## Stay in touch
- E-Mail [ismailcankocabas@gmail.com](ismailcankocabas@gmail.com)
- LinkedIn [@ismailkcbss](https://www.linkedin.com/in/ismailkcbss/)

## Learn more

You can learn more in the [Create React App documentation](https://create-react-app.dev/docs/getting-started/) <br/>
To learn React, check out the [React documentation](https://react.dev/)<br/>
To learn Express, check out the [Express documentation](https://expressjs.com/)<br/>
To learn MongoDB, check out the [MongoDB Nodejs documantation](https://www.mongodb.com/docs/drivers/node/current/) <br/>

## License
Shop Place application is [MIT licensed](LICENSE).
