---
categories : machine-learning
tags : 
    - machine-learning
    - nba
    - tutorial
---

## Intro

The following command will sync your repo with mine if you're having issues:

```shell
$ git checkout startChapter3 -f
```

I'll be honest, I restructured my data at least four times throughout this project. I'm going to show you the final version of my data structure. The structure of the data in the database will be the following:

```javascript
// Final Structure
[
    {
        "Player" : "LeBron James",
        "Pos" : "SF",
        "Seasons" : [
            {
                "totals" : {
                    ......
                    ......
                },
                "advanced" : {
                    ......
                    ......
                }
            },
            ......
        ]
    },
    ....
]
```

Let's move into our `buildData()` function. All the following work will be done in `.on("data", fun..`. Since MongoDB deals with objects, we are going to make one giant object in our program called `DB_OBJ`. Let's put `DB_OBJ` with our modules. So add the following line to your `Modules Section`:

```javascript
var DB_OBJ = {};
```

Next, jump inside of our `.on("data")` method inside of `buildData()`. Around this time of development, I was using a debugger like [node-inspector](https://github.com/node-inspector/node-inspector "node-inspector"). It'll be too much of a hassle to bring the `debugging` aspect into this tutorial. So I'm just going to show you how the data looks like at this point of the program.

![]({{site.baseUrl}}/assets/img/machine-learning-assets/node_inspector_01.5ac526a4.png){: .align-center}

This data is missing some very important information that we need to know. We don't know what season this data belongs to, or what stat folder it came from(totals, advanced). So we need to parse out the **<u>stat type</u>** and **<u>season</u>** from the file path, time for some good old fashion regex! I took it upon myself to find out the regex formula we are going to use.

![]({{site.baseUrl}}/assets/img/machine-learning-assets/node_inspector_02.6d29d3e3.png){: .align-center}

Inside of `buildData()`, make `.transform()`look like this:

```javascript
.transform(function(data){
    var parsedPath = path.match(/(advanced|totals)|(\d{4})/g);
    data.statType = parsedPath[0];
    data.Season = parsedPath[1];
    return data;
})
```


Let's check the debugger to make sure we added `statType` and `Season` to our `data` variable. Don't worry about running it right now.

![]({{site.baseUrl}}/assets/img/machine-learning-assets/node_inspector_03.35d7d840.png){: .align-center}

Now since `Season` and `statType` have been added to data, we can now start playing with `DB_OBJ`.

In this object, the player's name will be the key and their seasons/stats will be the value. Let me show you what I mean:

```javascript
{
    "<PLAYER NAME>": { // LeBron James
        "<SEASON YEAR>" : { // 2007
            "advanced": {
                ... // Stats from advanced CSV
            },
            "totals": {
                ... // Stats from totals CSV
            },
        }
    }
}
```

I know this data structure does not match up with our final data structure, don't worry, we will be fixing that a bit later.

Since we are going to use the player names as a key in the `DB_OBJ`. We need to check if that name already exists in the object. Put the following code in your `.on("data")` inside of `buildData()`:

```javascript
console.log(data);
// Does Player exist?
if (!DB_OBJ.hasOwnProperty(data.Player)) {
    // Player doesn't exist
} else {
    // Player does exist
}
```

Let's test out the `=BUILD`, so run the following command:

```shell
$ node buildNBA_Data.js =BUILD TEST
```

Nothing crazy going on here, just checking if the player exists. Place the following lines inside of the `if(!DB_OBJ.hasOwnProperty(data.Player))` statement:

```javascript
// Player doesn't exist
DB_OBJ[data.Player] = {}; // 1
DB_OBJ[data.Player].Seasons = {}; // 2
DB_OBJ[data.Player].Seasons[data.Season] = {}; // 3
DB_OBJ[data.Player].Seasons[data.Season][data.statType] = {}; // 4
DB_OBJ[data.Player].Seasons[data.Season][data.statType] = data; // 5
```

This is a data example and how the above code would interact with it:


```javascript
// Data Example, DONT PASTE THIS!!
data = {
    Player : "LeBron James",
    Season : "2007",
    statType: "advanced",
    G : "78",
    Age: "22"
};
```


**Part 1** - Create a new player in `DB_OBJ`. Example:

```javascript
// DB_OBJ[data.Player] = {};
{
    "LeBron James": {}
}
```

**Part 2** - Create a `Seasons` property in Player's Object. Example:

```javascript
// DB_OBJ[data.Player].Seasons = {};
{
    "LeBron James": {
        "Seasons" : {}
    }
}
```

**Part 3** - Add the year to `Seasons` object. Example:

```javascript
// DB_OBJ[data.Player].Seasons[data.Season] = {};
{
    "LeBron James": {
        "Seasons": {
            "2007" : {}
        }
    }
}
```

**Part 4** - Add stats to `Year` object. Example:

```javascript
// DB_OBJ[data.Player].Seasons[data.Season][data.statType] = {};
{
    "LeBron James": {
        "Seasons":{
            "2007" : {
                "advanced": {

                }
            }
        }
    }
}
```

**Part 5** - Add all of the `data` to the `statType` object. Example:

```javascript
// DB_OBJ[data.Player].Seasons[data.Season][data.statType] = data;
{
    "LeBron James": {
        "Seasons":{
            "2007" : {
                "advanced": {
                    // ALL DATA HERE!!
                }
            }
        }
    }
}
```

If you're thinking to yourself, **"I'm sure this section irritates Fabian a lot, we all know he hates long lines and those are some long ass lines!"** Yea, you're right and we haven't even added the `else` portion! Let's get rid of all these `data.<something>` to help shorten the lines. Inside of `.on("data")`, erase everything and replace it with this:

```javascript
// 1
var name = data.Player,
    yr = data.Season,
    stat = data.statType;

// Does Player exist?
if (!DB_OBJ.hasOwnProperty(name)) {
    // Player doesn't exist

    // 2
    var tmpPlayer = {
        Player: name,
        Pos: data.Pos,
        Seasons: {}
    };
    DB_OBJ[name] = tmpPlayer;
    DB_OBJ[name].Seasons[yr] = {};
} else if(!DB_OBJ[name].Seasons.hasOwnProperty(yr)) {
        // Player Exists, Season doesnt exist
        DB_OBJ[name].Seasons[yr] = {};
}
// 3
DB_OBJ[name].Seasons[yr][stat] = {};
DB_OBJ[name].Seasons[yr][stat] = data;
```

**Part 1** - We are reducing the variables to a single word to reduce the length of the line.

**Part 2** - This `tmpPlayer` is helping us for the final data structure.

**Part 3** - we are adding the stats to the player object.

OK now in the `.on("end")` portion, let's print out our `DB_OBJ`:

```javascript
.on("end", function(){
    console.log("done");
    console.log(DB_OBJ);
    _aCallback();
});
```

Let's run it:

```shell
$ node buildNBA_Data.js =BUILD TEST
```

You should've gotten something similar to this:

![]({{site.baseUrl}}/assets/img/machine-learning-assets/console_012.953ca28a.png){: .align-center}

Yeah I know, I know. This data is starting to be really hard to examine, I think it's time we put it in a file.

In your `Modules Section`, add the following line:

```javascript
var jsonfile = require('jsonfile');
```

and replace `async.each()` callback to this:( look at the next step if you're confused )

```javascript
function (err) {
    console.log('***DONE BUILDING DATA***');
    jsonfile.writeFile('./data/outputFile.json', DB_OBJ, { spaces: 4}, function(err) {
        console.error(err);
    });
});
```

Your entire `buildData()` function should look like this:

```javascript
var buildData = function(paths) {
    async.each(paths, function (path, _aCallback) {

        // Create File Stream
        var inputStream = fs.createReadStream(path);

        // Read in CSV file
        fast_csv.fromStream(inputStream,{
            headers: true,
            ignoreEmpty: true
        })
        .transform(function(data){
            var parsedPath = path.match(/(advanced|totals)|(\d{4})/g);
            data.statType = parsedPath[0];
            data.Season = parsedPath[1];
            return data;
        })
        .on("data", function(data){

            var name = data.Player,
                yr = data.Season,
                stat = data.statType;

            // Does Player exist?
            if (!DB_OBJ.hasOwnProperty(name)) {
                // Player doesn't exist

                // helps us for the final data structure.
                var tmpPlayer = {
                    Player: name,
                    Pos: data.Pos,
                    Seasons: {}
                };
                DB_OBJ[name] = tmpPlayer;
                DB_OBJ[name].Seasons[yr] = {};
            } else if(!DB_OBJ[name].Seasons.hasOwnProperty(yr)) {
                    // Player Exists, Season doesnt exist
                    DB_OBJ[name].Seasons[yr] = {};
            }
            // add the stats to the player object.
            DB_OBJ[name].Seasons[yr][stat] = {};
            DB_OBJ[name].Seasons[yr][stat] = data;
        })
        .on("end", function(){
            console.log("done");
            console.log(DB_OBJ);
            _aCallback();
        });

    }, function (err) {
        console.log('*****DONE BUILDING DATA*****');
        jsonfile.writeFile('./data/outputFile.json', DB_OBJ, { spaces: 4}, function(err) {
            console.error(err);
        });
    });
};
```

Let's run it:

```shell
$ node buildNBA_Data.js =BUILD TEST
```

It should create a file called **<u>outputFile.json</u>** that should look like this, if not don't worry, a code check up is soon:

![]({{site.baseUrl}}/assets/img/machine-learning-assets/sublime_02.c7e48eba.png){: .align-center}

OK let's remove our `console.log(DB_OBJ)` add a few more years to our `=TEST`. Inside of your `Main Function` change `endYr` from `1982` to `1990`:

```javascript
// If Test is set, only get a few years
var endYr = (isTest) ? 1990 : 2016;

``` 

Let's run it:

```shell
$ node buildNBA_Data.js =BUILD TEST
```

Hopefully your **<u>outputFile.json</u>** looks like this:

![]({{site.baseUrl}}/assets/img/machine-learning-assets/sublime_04.c62be7b9.png){: .align-center}

OK, so we're not done cleaning our data yet. I know were about to get to the Mongo portion of the tutorial, but it'll be fast, I promise. Here's our code checkup for the second section:

### Code Checkup

```javascript
/* Modules Section
============================================= */

var _ = require("underscore");
var fs = require('fs');
var fast_csv = require("fast-csv");
var async = require("async");
var jsonfile = require('jsonfile');
var DB_OBJ = {};
// End of Modules

/* Helper Section
============================================= */
var getHeader = function (path) {
    var statObj = {
        'totals': 'Rk,Player,Pos,Age,Tm,G,GS,MP,FG,FGA,FG%,3P,3PA,3P%,2P,2PA,2P%,eFG%,FT,FTA,FT%,ORB,DRB,TRB,AST,STL,BLK,TOV,PF,PTS',
        'advanced': 'Rk,Player,Pos,Age,Tm,G,MP,PER,TS%,3PAr,FTr,ORB%,DRB%,TRB%,AST%,STL%,BLK%,TOV%,USG%,0,OWS,DWS,WS,WS/48,0,OBPM,DBPM,BPM,VORP'
    };
    return _.compact(_.map(statObj, function (val, key) {
        // key = totals || advanced
        // If key exist inside of path
        if (path.indexOf(key) > -1) {
            // Returns the value at statObj[statType]
            return val;
        }
    }))[0];
};
// End of Helper

/* Functions Section
============================================= */

/**
*Function Name: cleanData
*Parameters: array of file paths
*RUN: node misc_NBA_Data.js =CLEAN
*/
var cleanData = function(paths) {

    async.each(paths, function(filePath, callback) {
        // get data from file
        fs.readFile(filePath, function(err, data) {
            if(err) throw err;
            var data_Str = data.toString();
            // Remove double commas
            data_Str = data_Str.replace(/,,/g,',0,');
            var data_Arr = data_Str.split("\n");

            // Check if first row is empty
            if (!data_Arr[0].length) {
                data_Arr.shift();
            }

            data_Arr = _.filter(data_Arr, function (_str) {
                return (_str.indexOf('Rk,Player'));
            });

            var finalHeader = getHeader(filePath);
            console.log(finalHeader);

            data_Arr.unshift(finalHeader);
            var outputPath = filePath.replace(/csv/,'output');

            fs.writeFileSync(outputPath, data_Arr.join('\n'));
            callback();
        });
    },function (err) {
        console.log('*****DONE CLEANING DATA*****');
    });
};


/**
*Function Name: buildData
*Parameters: array of file paths
*RUN: node misc_NBA_Data.js =BUILD
*/
var buildData = function(paths) {
    async.each(paths, function (path, _aCallback) {

        // Create File Stream
        var inputStream = fs.createReadStream(path);

        // Read in CSV file
        fast_csv.fromStream(inputStream,{
            headers: true,
            ignoreEmpty: true
        })
        .transform(function(data){
            var parsedPath = path.match(/(advanced|totals)|(\d{4})/g);
            data.statType = parsedPath[0];
            data.Season = parsedPath[1];
            return data;
        })
        .on("data", function(data){

            var name = data.Player,
                yr = data.Season,
                stat = data.statType;

            // Does Player exist?
            if (!DB_OBJ.hasOwnProperty(name)) {
                // Player doesn't exist

                 // helps us for the final data structure.
                var tmpPlayer = {
                    Player: name,
                    Pos: data.Pos,
                    Seasons: {}
                };
                DB_OBJ[name] = tmpPlayer;
                DB_OBJ[name].Seasons[yr] = {};
            } else if(!DB_OBJ[name].Seasons.hasOwnProperty(yr)) {
                    // Player Exists, Season doesnt exist
                    DB_OBJ[name].Seasons[yr] = {};
            }
            DB_OBJ[name].Seasons[yr][stat] = {};
            DB_OBJ[name].Seasons[yr][stat] = data;
        })
        .on("end", function(){
            console.log("done");
            _aCallback();
        });

    }, function (err) {
        console.log('*****DONE BUILDING DATA*****');
        jsonfile.writeFile('./data/outputFile.json', DB_OBJ, { spaces: 4}, function(err) {
            console.error(err);
        });
    });
};

/**
- Main Function
*/
(function (task, isTest) {


    // Allowed Tasks
    if (['=BUILD','=CLEAN'].indexOf(task) === -1) {
        console.log('You did not pick an available task.');
        return ;
    }

    // Type of stats
    var STATS = ['totals', 'advanced'];

    // If Test is set, only get a few years
    var endYr = (isTest) ? 1990 : 2016;


    // Get generate our list of file paths
    var pathList = function(begPath) {
        return _.flatten(_.map(STATS, function (stat) {

            return _.map(_.range(1981,endYr), function (year) {
                var finalStr = [begPath,stat,'/leagues_NBA_',
                                year,'_',stat,'.csv'].join('');

                return finalStr;
            });
        }));
    };


    // Divider ===================================

    // What task did user choose
    if (task === '=BUILD') {
        console.log('*****BUILDING DATA*****');
        buildData(pathList('./data/output/'));
    }
    else if(task === '=CLEAN'){
        console.log('*****CLEANING DATA*****');
        cleanData(pathList('./data/csv/'));
    } else {
        console.log('*scratching head* how you got here?');
    }

})(process.argv[2], process.argv[3]);
```

## Mongo

We're going to pretend that all of us know what issues are going to arise in the future from how our data is currently. For one, it's not even in the final structure that we wanted. I'm going to go ahead and list the issues that we have with our data:

1.  Not in the final structure.
2.  `*` at the end of names(HoF players).
3.  All values are `strings`.

The first is self-explanatory. The second one causes problems when we want to search up certain players in the database. The third, I didn't pay too much attention to it at first... Until I had to apply math in the Machine Learning portion of this project. I tried converting them to floats while in Python. After 10 minutes of doing that, I figured it would be much easier for them to already be a float type in the database.

So for my final trick.

![]({{site.baseUrl}}/assets/img/machine-learning-assets/final_trick.16609a7f.gif){: .align-center}

We're gonna use `modules` that were inspired from reading [Ben Cherry's amazing article on Javascript Modules](http://www.adequatelygood.com/JavaScript-Module-Pattern-In-Depth.html).

This module will have a few properties that will help keep our code together. The first property, `filter`, will take care of converting all our stats(strings) into floats and remove unwanted properties like `Rk`, `0`, `matches`. The next property, `clean`, will change our structure from:

```javascript
{
    "<PLAYER NAME>": { // LeBron James
        "Player" : "LeBron James",
        "Pos" : "SF",
        "<SEASON YEAR>" : { // 2007
            "advanced": {
                ... // Stats from advanced CSV
            },
            "totals": {
                ... // Stats from totals CSV
            },
        }
    }
}
```

to the desired structure:

```javascript
// Final Structure
[
    {
        "Player" : "LeBron James",
        "Pos" : "SF",
        "Seasons" : [
            {
                "totals" : {
                    ......
                    ......
                },
                "advanced" : {
                    ......
                    ......
                }
            },
            ......
        ]
    },
    ....
]
```


So replace our `var DB_OBJ = {};` in our `Module Section` with:

```javascript
var DB_OBJ = (function(data) {

    data.clean = function() {

    };

    data.filter = function(obj, reg) {

    };

    return data;
})({});
```

If you rarely work with modules, I recommend reading that article I mentioned above, even if you just need a quick refresher. The reason why we are making `DB_OBJ` a module is so that we have all the data and data manipulation in one location. As of right now, we are filtering the data in the `.transform()` and we **would** be cleaning the data right before our `jsonfile.writeFile()` line.

Let's start off with `filter` since we have the majority of the code for it already. We will be calling our filtering method in our `.transform()` method. Inside of `buildData()`, replace `.transform()` with:

```javascript
.transform(function(data){
    var regex = path.match(/(advanced|totals)|(\d{4})/g);
    return DB_OBJ.filter(data, regex);
})
```

Since we do not have access to `path` in our data object, we won't be able to apply our regex in our filter property unless we pass it in as an argument. Let's hop back to our `data.filter`:

```javascript
data.filter = function(obj, reg) {
    obj.statType = reg[0];
    obj.Season = reg[1];
    obj.Player = obj.Player.replace(/\*/g,'');
    delete obj["Rk"];
    delete obj["0"];
    return _.mapObject(obj, function (val, key) {

        if (!isNaN(val)) {
            val = +val;
        }
        return val;
    });
};
```

Those first two lines seem familiar, what about the rest? The next three are pretty simple to explain. If the player has an `*` in his name, we remove it. The next two lines we `delete` the `rk` and `0` property. The last section may look a bit confusing, but its not. We are going through each property and checking if the string could be a number. This [stack overflow answer](http://stackoverflow.com/a/175787/1973339) does a great job explaining it.

Let's run it and see if the stats are no longer strings and we've removed the `*` from **Kareem Abdul-Jabbar**:

```shell
$ node buildNBA_Data.js =BUILD TEST
```

Did your stats turn into numbers like mine? if not, its ok, a code checkup is very soon!:

![]({{site.baseUrl}}/assets/img/machine-learning-assets/sublime_05.f9fe5f9f.png){: .align-center}

Now let's get to cleaning. Some of you might have already figured out that we are going to print out those functions inside of **<u>outputFile.json</u>**(**depending jsonfile version**). Does that mean we're going to be printing those out to? We're going to `delete` them before it gets to that point, so make your `data.clean` look like this:

```javascript
data.clean = function() {
    delete data["clean"];
    delete data["filter"];
    // 1
    return _.map(data, function (plyr) {
        // 2
        plyr.Seasons = _.values(plyr.Seasons);
        return plyr;
    });
};
```

**Part 1** - Since we are using the [`_.map()`](http://underscorejs.org/#map "map") function, it's going to return all the values in our data object as an array, so we get rid of the "Player Name" property.

```javascript
[
    {
        "Player": "Kareem Abdul-Jabbar",
        "Pos": "C",
        ....
    },
    ....
]
```

**Part 2** - If you remember correctly, our seasons aren't in the structure that we want, this is where we fix that issue. We set `Seasons` equal to the [`_.values()`](http://underscorejs.org/#values) of itself. `_.values()` will return the data in an array format, which is what we want.

```javascript
[
    {
        "Player": "Kareem Abdul-Jabbar",
        "Pos": "C",
        "Seasons": [ // Heres the array that we wanted :)
            {
                "totals": {
                    ......
                },
                "advanced": {
                    ......
                }
            },
            {...
            }
        ]
    },
    ....
]
```

Let's see, we just have to call `DB_OBJ.clean()` now, go to the line where `jsonfile.writeFile()` is, and replace it with:

```javascript
jsonfile.writeFile('./data/outputFile.json', DB_OBJ.clean(), { spaces: 4}, function(err) {
    console.error(err);
});

```

Now let's run it! :)

```shell
$ node buildNBA_Data.js =BUILD TEST
```

Did you get something like this:

![]({{site.baseUrl}}/assets/img/machine-learning-assets/sublime_06.f839ba3f.png){: .align-center}

Before we do a code checkup, let's minimize **<u>outputFile.json</u>**. This dramatically improves performance when uploading to MongoDB. Change `{spaces: 4}` to `{spaces: 0}` on the `jsonfile.writeFile()` line:

```javascript
jsonfile.writeFile('./data/outputFile.json', DB_OBJ.clean(), { spaces: 0}, function(err) {
```

Now let's run without `=TEST` set:

```shell
$ node buildNBA_Data.js =BUILD
```

Your **<u>outputFile.json</u>** should look like the following(**it may take a bit to load**):

![]({{site.baseUrl}}/assets/img/machine-learning-assets/sublime_07.30c3623b.png){: .align-center}

### Code Checkup

`buildNBA_Data.js` with `{spaces: 4}`

```javascript
/* Modules Section
============================================= */

var _ = require("underscore");
var fs = require('fs');
var fast_csv = require("fast-csv");
var async = require("async");
var jsonfile = require('jsonfile');
var DB_OBJ = (function(data) {

    data.clean = function() {
        delete data["clean"];
        delete data["filter"];
        // 1
        return _.map(data, function (plyr) {
            // 2
            plyr.Seasons = _.values(plyr.Seasons);
            return plyr;
        });
    };

    data.filter = function(obj, reg) {
        obj.statType = reg[0];
        obj.Season = reg[1];
        obj.Player = obj.Player.replace(/\*/g,'');
        delete obj["Rk"];
        delete obj["0"];
        return _.mapObject(obj, function (val, key) {

            if (!isNaN(val)) {
                val = +val;
            }
            return val;
        });
    };

    return data;
})({});
// End of Modules

/* Helper Section
============================================= */
var getHeader = function (path) {
    var statObj = {
        'totals': 'Rk,Player,Pos,Age,Tm,G,GS,MP,FG,FGA,FG%,3P,3PA,3P%,2P,2PA,2P%,eFG%,FT,FTA,FT%,ORB,DRB,TRB,AST,STL,BLK,TOV,PF,PTS',
        'advanced': 'Rk,Player,Pos,Age,Tm,G,MP,PER,TS%,3PAr,FTr,ORB%,DRB%,TRB%,AST%,STL%,BLK%,TOV%,USG%,0,OWS,DWS,WS,WS/48,0,OBPM,DBPM,BPM,VORP'
    };
    return _.compact(_.map(statObj, function (val, key) {
        // key = totals || advanced
        // If key exist inside of path
        if (path.indexOf(key) > -1) {
            // Returns the value at statObj[statType]
            return val;
        }
    }))[0];
};
// End of Helper

/* Functions Section
============================================= */

/**
*Function Name: cleanData
*Parameters: array of file paths
*RUN: node misc_NBA_Data.js =CLEAN
*/
var cleanData = function(paths) {

    async.each(paths, function(filePath, callback) {
        // get data from file
        fs.readFile(filePath, function(err, data) {
            if(err) throw err;
            var data_Str = data.toString();
            // Remove double commas
            data_Str = data_Str.replace(/,,/g,',0,');
            var data_Arr = data_Str.split("\n");

            // Check if first row is empty
            if (!data_Arr[0].length) {
                data_Arr.shift();
            }

            data_Arr = _.filter(data_Arr, function (_str) {
                return (_str.indexOf('Rk,Player'));
            });

            var finalHeader = getHeader(filePath);
            console.log(finalHeader);

            data_Arr.unshift(finalHeader);
            var outputPath = filePath.replace(/csv/,'output');

            fs.writeFileSync(outputPath, data_Arr.join('\n'));
            callback();
        });
    },function (err) {
        console.log('*****DONE CLEANING DATA*****');
    });
};

/**
*Function Name: buildData
*Parameters: array of file paths
*RUN: node misc_NBA_Data.js =BUILD
*/
var buildData = function(paths) {
    async.each(paths, function (path, _aCallback) {

        // Create File Stream
        var inputStream = fs.createReadStream(path);

        // Read in CSV file
        fast_csv.fromStream(inputStream,{
            headers: true,
            ignoreEmpty: true
        })
        .transform(function(data){
            var regex = path.match(/(advanced|totals)|(\d{4})/g);
            return DB_OBJ.filter(data, regex);
        })
        .on("data", function(data){

            var name = data.Player,
                yr = data.Season,
                stat = data.statType;

            // Does Player exist?
            if (!DB_OBJ.hasOwnProperty(name)) {
                // Player doesn't exist

                 // helps us for the final data structure.
                var tmpPlayer = {
                    Player: name,
                    Pos: data.Pos,
                    Seasons: {}
                };
                DB_OBJ[name] = tmpPlayer;
                DB_OBJ[name].Seasons[yr] = {};
            } else if(!DB_OBJ[name].Seasons.hasOwnProperty(yr)) {
                    // Player Exists, Season doesnt exist
                    DB_OBJ[name].Seasons[yr] = {};
            }
            DB_OBJ[name].Seasons[yr][stat] = {};
            DB_OBJ[name].Seasons[yr][stat] = data;
        })
        .on("end", function(){
            console.log("done");
            _aCallback();
        });

    }, function (err) {
        console.log('*****DONE BUILDING DATA*****');
        jsonfile.writeFile('./data/outputFile.json', DB_OBJ.clean(), { spaces: 4}, function(err) {
            console.error(err);
        });
    });
};

/**
- Main Function
*/
(function (task, isTest) {


    // Allowed Tasks
    if (['=BUILD','=CLEAN'].indexOf(task) === -1) {
        console.log('You did not pick an available task.');
        return ;
    }

    // Type of stats
    var STATS = ['totals', 'advanced'];

    // If Test is set, only get a few years
    var endYr = (isTest) ? 1990 : 2016;


    // Get generate our list of file paths
    var pathList = function(begPath) {
        return _.flatten(_.map(STATS, function (stat) {

            return _.map(_.range(1981,endYr), function (year) {
                var finalStr = [begPath,stat,'/leagues_NBA_',
                                year,'_',stat,'.csv'].join('');

                return finalStr;
            });
        }));
    };


    // Divider ===================================

    // What task did user choose
    if (task === '=BUILD') {
        console.log('*****BUILDING DATA*****');
        buildData(pathList('./data/output/'));
    }
    else if(task === '=CLEAN'){
        console.log('*****CLEANING DATA*****');
        cleanData(pathList('./data/csv/'));
    } else {
        console.log('*scratching head* how you got here?');
    }

})(process.argv[2], process.argv[3]);
```

### Export to MongoDB!

If you do not have MongoDB installed, follow their [Installation Guide](http://docs.mongodb.org/manual/installation/#installation-guides "Installation Guide"). If you're a Mac user, I recommend following their [Homebrew Guide](http://docs.mongodb.org/manual/tutorial/install-mongodb-on-os-x/#install-mongodb-with-homebrew "Homebrew Guide"), it's really simple. Once you have it installed, the following section will change depending on how much experience you have with MongoDB. Choose one of the following: <a href="#experienced-with-mongodb">Experienced with MongoDB</a> or <a href="#mongodb-noob">MongoDB Noob</a>.

<span id="experienced-with-mongodb"></span>
#### Experienced with MongoDB
Go ahead and Fire up mongo with `mongod` in a separate terminal. Then come back to your initial terminal and input the following:

```shell
$ mongoimport --db NBA_Tutorial --collection players --file ./data/outputFile.json --jsonArray
```

if you have your **<u>outputFile.json</u>** in a different directory, simply replace the above path with yours. This [short article](http://www.avilpage.com/2014/12/importing-exporting-json-data-to-mongodb.html) clarified a lot of questions I had when using `mongoimport`.

<span id="mongodb-noob"></span>
#### MongoDB Noob
We're just gonna set you up with a [**FREE MongoLab account**](https://mongolab.com/signup/ "MongoLab"). Once you're signed in, you should be brought to a screen like this. Click the **Create new** button:

![]({{site.baseUrl}}/assets/img/machine-learning-assets/mongolab_01.4340dcf8.png){: .align-center}

For the free tier, select these options. Don't forget to put a database name at the bottom.

![]({{site.baseUrl}}/assets/img/machine-learning-assets/mongolab_02.e2ca72c7.png){: .align-center}

We need to create a database user to access the data. <u>Do not forget your **username** and **password**, we're going to need it to upload our data.

![]({{site.baseUrl}}/assets/img/machine-learning-assets/mongolab_03.4be14674.png){: .align-center}

on that same page, take note of your **URI**, we're going to be using it in the next step.

![]({{site.baseUrl}}/assets/img/machine-learning-assets/mongolab_04.7c687389.png){: .align-center}

In the root directory of this project, paste the following command with your credentials. Quick tips:

<var>-d = database</var>, <var>-c = collection</var>, <var>-u = username</var>, <var>-p = password</var>.

```shell
$ mongoimport -h <URI> -d mongolab_nba -c players -u <USERNAME> -p <PASSWORD> --file ./data/outputFile.json --jsonArray 
```

I use [Robomongo](http://robomongo.org/) to view my database. If you have trouble setting it up, follow this [super fast scotch tutorial](https://scotch.io/quick-tips/connecting-to-mongodb-using-robomongo#setting-up). Your database should look like this:

![]({{site.baseUrl}}/assets/img/machine-learning-assets/robomongo_01.4c94f388.png){: .align-center}

<u style="color:red">**We're about to start our final chapter!**</u> I know you're excited, but I don't want people jumping off the stage yet!

![]({{site.baseUrl}}/assets/img/machine-learning-assets/stage_dive.eb2901bf.gif){: .align-center}


