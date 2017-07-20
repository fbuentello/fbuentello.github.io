---
categories : machine-learning
tags : 
    - machine-learning
    - nba
    - tutorial
---

{% include toc %}

## Chapter 1. Read in Data

Go ahead clone the repo using the following command:

```shell 
$ git clone https://github.com/initFabian/NBA-Machine-Learning-Tutorial
```

```shell 
$ cd NBA-Machine-Learning-Tutorial/
```

Now let's start from the beginning:

```shell 
$ git checkout startChapter1
```

Your directory should look like this:
- NBA-Machine-Learning-Tutorial
  - data
    - csv
      - advanced
      - totals
  - buildNBA_Data.js
  - package.json


### Let's get started

The first step with machine learning is to gather all your data. Luckily for us, [Basketball-Reference](http://www.basketball-reference.com/) granted me permission to make a portion of their data available for you(in repository). So we know what we want to predict, the PER stat. Now it's just a matter of knowing what Features(stats) we are going to use as input. Fortunately for us, Zach Fien's article [Cracking the Code: How to Calculate Hollinger's PER Without All the Mess](http://bleacherreport.com/articles/113144-cracking-the-code-how-to-calculate-hollingers-per-without-all-the-mess) did a great job in doing just that. In Zach's article, he explains how he used the stats below to calculate a player's PER without having to use Hollinger's formula. Of course Zach's formula is off by a bit since he is not using Hollinger's formula, but it's close enough for us.

**Features(Input):**  
- FGM
- Stl
- 3PTM
- FTM
- Blk
- Off. Reb
- Ast
- Def. Reb
- Foul
- FT Miss
- FG Miss
- TO

**Predict(Output):**
- PER


We're only going to have to look at two tables, [Totals stats](http://www.basketball-reference.com/leagues/NBA_2015_totals.html) and [Advanced stats](http://www.basketball-reference.com/leagues/NBA_2015_advanced.html). The Totals stats table has all the Features(Input) we need. The Advanced stats table contains the PER stat which is what we are trying to predict(Output).
Next we're going to get all the stats from 1980 to 2015, why 1980? Two Reasons:

1. In the 1979-1980 season, the NBA added the three point line . Why is this important? The 3-pointer is a very important stat in calculating PER.

2. I think even numbers are sexy, and 1979 is not a sexy number. So we're going to be using all the seasons between the years 1980-2015.

### Time to Code

I want to mention that I split up this file into three sections, `Module Section` `Helper Section` and `Function Section` just to help keep things organized. OK, Fabian shut up and let's get to coding. Remember to install all your NodeJS modules

```shell 
$ npm install
```

## Generate file paths

What's the first step? That would be reading in the CSV files, but we don't even have the paths to all those files.

*If you think we're going to type out 70 file paths, expect the following to happen to you:*


![]({{site.baseUrl}}/assets/img/machine-learning-assets/George_Of_the_Jungle.4e7140e9.gif){: .align-center}

Paste the follow in your **buildNBA_Data.js**


```javascript
/* Modules Section
============================================= */

var _ = require("underscore");

// End of Modules

/* Helper Section
============================================= */

// End of Helper

/* Functions
============================================= */

/**
- Main Function
*/
(function () {
    // Type of stats
    var STATS = ['totals', 'advanced'];

    // 1.A
    var pathList = _.map(STATS, function (stat) {

        // 1.B
        return _.map(_.range(1981,2016), function (year) {
            // 1.C
            var finalStr = ['./data/csv/',stat,'/leagues_NBA_',
                            year,'_',stat,'.csv'].join('');

            return finalStr;
        });
    });

    // 2
    _.flatten(pathList).forEach(function (path) {
        console.log(path);
    });
})();
```

**Main Function** - If this is your first time seeing a self-executing anonymous function, check out [this article](http://esbueno.noahstokes.com/post/77292606977/self-executing-anonymous-functions-or-how-to-write). Anonymous functions are a great way to start off your program, plus they're sexy.

**Part 1**


**A** - if you have never seen this [`_.map()`](http://underscorejs.org/#map) function it's OK. It's a method from the `underscoreJS` module that we imported above. It is essentially a [`forEach()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach) statement like you would use on an array. The main difference being, the `_.map()` function returns data, unlike the `forEach()` method. If you have never used [underscoreJS](http://underscorejs.org/) before, I highly recommend you start. I regret not using it sooner.

**B** - I know what you're thinking, **_"Fabian you don't have to explain the `_.map()` function again, I understand it!"_** I know you understand it Jimmy(I'm going call you that). Look inside of that map function, you'll see a new function called [`_.range()`](http://underscorejs.org/#range). This function lets you create an array, without having to create an array. Inside of `_.range()` you have a START number and you increment by one all the way to [but not including] the END number.

**C** - This part is pretty simple to explain. What we're doing is, for each <var>year</var> we join an array of strings using the [`join()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/join) method. Then we set it equal to a variable <var>finalStr</var>, for which we return.

**<var>pathList</var>** - so once we finish our little mini **_"callback from hell"_** we'll end up with an array of two arrays. The first array being all the paths for our totals stats. The second array being all the paths to our advanced stats.

**Part 2**

- I know you see that little `_`, can you guess what [`_.flatten()`](http://underscorejs.org/#flatten) does? If you guessed **_"Can Fabian stop with the damn questions..."_**, You guessed wrong. `_.flatten()` is going to turn our array of arrays(<var>pathList</var>) into one big array.

Run the code with:

```shell
$ node buildNBA_Data.js
```

And your terminal should look like this:

![]({{site.baseUrl}}/assets/img/machine-learning-assets/console_001.9accee37.png){: .align-center}


So now that we have all our paths in our <var>pathList</var>, we now have to read the files. But before we get to that, something in our code isn't very sexy. Let's combine **Part 1** and **Part 2** so that our `Main Function` looks like this:


```javascript
/**
* Main Function
*/
(function () {
    // Type of stats
    var STATS = ['totals', 'advanced'];

    // 1
    var pathList = _.flatten(_.map(STATS, function (stat) {

        return _.map(_.range(1981,2016), function (year) {
            var finalStr = ['./data/csv/',stat,'/leagues_NBA_',
                            year,'_',stat,'.csv'].join('');

            return finalStr;
        });
    }));

    // Divider ===================================


})();
```


Before we start reading in the file paths we have to import three new modules to our <var>Module Section</var>.


```javascript
var fs = require('fs');
var fast_csv = require("fast-csv");
var async = require("async");
```

We are going to be using our `[fast_csv](https://github.com/C2FO/fast-csv "fast_csv")` variable to read in the CSV files. `fast_csv` will use the `fs`(file system) module which is built into NodeJS. We are going to be using the `[async](https://github.com/caolan/async "async")` module to make sure everything happens in order. That's very important when messing with files. Just like `underscoreJS`, I wish I would have used `async` much sooner.

Next, let's move to the bottom of our `Main Function` after our `// Divider====` line and add the following:

```javascript
async.each(pathList, function (path, _aCallback) {

    // Create File Stream

    // Read in CSV file

    console.log(path);
    _aCallback();

}, function (err) {
    console.log('hey were done!!');
});
```

**_"Soooo what's the difference between `async` and `underscore`? because they look identical."_** Man Jimmy, you ask some really good questions. Unlike `underscore`, `async` lets you decide when you want to move to the next object in the `pathList`. This is going to be very important when we use `fast_csv` to read in our data. Let's run this:

```shell
$ node buildNBA_Data.js
```

Your terminal should look like this:

![]({{site.baseUrl}}/assets/img/machine-learning-assets/console_002.7c1a8348.png){: .align-center}


Let's start getting our fingers dirty. Place this line under the `// Create File Stream` comment:

```javascript
// Create File Stream
var inputStream = fs.createReadStream(path);
```

This line allows us to read in the file which will then be used in our [`fast-csv` methods](https://github.com/C2FO/fast-csv#transforming). Go ahead and copy-n-paste the following code after `// Read in CSV file` and delete that `console.log()` and `_aCallback()` that was there earlier:

```javascript
// Read in CSV file
fast_csv.fromStream(inputStream,{
    headers: true,
    ignoreEmpty: true
})
.transform(function(data){
    // We might need this, im not sure...
    // Foreshadowing!!!!!
    return data;
})
.on("data", function(data){
    console.log(data);
})
.on("end", function(){
    console.log("done");
    _aCallback();
});
```


Let's run, shall we:

```shell
$ node buildNBA_Data.js
```

You're terminal should look like this:

![]({{site.baseUrl}}/assets/img/machine-learning-assets/console_003.d002c0dc.png){: .align-center}


### Code Checkup

OK, so we're about to get to the good part! Before we do, if your code is not working, replace all your code with the following.

Your `buildNBA_Data.js` should look like this:


```javascript
/* Modules Section
============================================= */

var _ = require("underscore");
var fs = require('fs');
var fast_csv = require("fast-csv");
var async = require("async");

// End of Modules

/* Helper Section
============================================= */

// End of Helper

/* Functions
============================================= */

/**
* Main Function
*/
(function () {
    // Type of stats
    var STATS = ['totals', 'advanced'];

    // 1
    var pathList = _.flatten(_.map(STATS, function (stat) {

        return _.map(_.range(1981,2016), function (year) {
            var finalStr = ['./data/csv/',stat,'/leagues_NBA_',
                            year,'_',stat,'.csv'].join('');

            return finalStr;
        });
    }));

    // Divider ===================================

    async.each(pathList, function (path, _aCallback) {

        // Create File Stream
        var inputStream = fs.createReadStream(path);

        // Read in CSV file
        fast_csv.fromStream(inputStream,{
            headers: true,
            ignoreEmpty: true
        })
        .transform(function(data){
            // We might need this, im not sure...
            // Foreshadowing!!!!!
            return data;
        })
        .on("data", function(data){
            console.log(data);
        })
        .on("end", function(){
            console.log("done");
            _aCallback();
        });

    }, function (err) {
        console.log('hey were done!!');
    });
})();
```


Now that we have access to all the data we need, we just have to structure.



**You may proceed to chapter 2**

![]({{site.baseUrl}}/assets/img/machine-learning-assets/kick_door_down.67f4fd48.gif){: .align-center}
