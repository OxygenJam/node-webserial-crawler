# node-webserial-crawler
A simple nodeJS application to retrieve webserial's chapter and export it in a compiled format.

# Setting up
1. This application requires you to have [nodeJS](https://nodejs.org) installed to run.
2. Once you have installed it open up your command prompt or whatever CLI you use. 
3. Go to the directory of the webcrawler and run ```npm install``` \[1\],\[2\]
4. Set up your JSON file in the webserial folder; base it from the sample void-domain JSON \[3\]
5. Run the command ```node app.js -load <filename>.json```\[2\]

### Notes:
1. If your are not familiar with navigating using your command prompt refer below. And if you're using linux, I assume you already know how to use your CLI.
```cd <directory of the node-webserial-crawler>```
2. If ```npm``` or ```node``` is not recognized, you must add it to your environment variable; please refer to the following guide:
    1. Press windows key or start menu and search for environment variables
    2. Click on *Edit the system environment variables*.
    3. Under the advanced tab, click on the *Environment Variables* button
    4. Under *System Variables*, click on *Path* and the edit button
    5. Click the new button and add the directory of your NodeJS, then click ok
    6. You're done! Just restart your CLI and you're good to go!
3. Please use this [online tool](https://try.jsoup.org/) for css selectors, just simple load the table of content url of your webserial. If you're not familiar with css selectors, please [refer to this tutorial](https://www.w3schools.com/cssref/css_selectors.asp).
