## Details
To check it out go here http://betterbggcollection.com

In addition to inputting your BGG username onto the webpage you can also directly go to your collection by appending `?username=<insert username here>` to the end of the URL.<br />
For example: http://betterbggcollection.com/?username=gamerkingfaiz

You can also control the default number of rows returned with `&rows=<insert number here>`.<br />
For example: http://betterbggcollection.com/?username=gamerkingfaiz&rows=1000<br />
I only have ~40 games, so it doesn't look different, but try with a bigger collection and see the difference!

## Geeky Details:
The page is built in React, so it's responsive, meaning it will play nice on mobile.<br />
I'm using the official [BGG XML API](https://boardgamegeek.com/wiki/page/BGG_XML_API2) then the [xml2js library](https://www.npmjs.com/package/xml2js) to convert the XML to JSON.<br />
Finally, I'm using [cors-anywhere](https://github.com/Rob--W/cors-anywhere) to add a CORS header to the BGG API.<br />
