# node-webserial-crawler
A simple nodeJS application to retrieve webserial's chapter and export it in a compiled format.

# Setting up
1. This application requires you to have [nodeJS](https://nodejs.org) installed to run.
2. Once you have installed it open up your command prompt or whatever CLI you use.
3. Go to the directory of the webcrawler and run ```npm install``` *
4. Set up your JSON file in the webserial folder; base it from the sample void-domain JSON
take note the selectors are based from [CSS selectors](https://try.jsoup.org/).
5. Edit the app.js file and go to the bottom part of webserial variable and assign it to your JSON filename 
  ```Don't blame me. This is still not v1.0, just edit the variable don't be lazy```
6. Run the command ```node app.js```
