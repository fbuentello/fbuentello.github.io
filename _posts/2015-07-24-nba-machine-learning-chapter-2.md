---
categories : machine-learning
tags : 
    - machine-learning
    - nba
    - tutorial
---

## Intro

The following command will sync your repo with mine if you're having issues:
```
$ git checkout startChapter2 -f
```

When it comes to machine learning, you're going to spend the majority of your development cleaning and structuring the data. If you look at the image below, you'll see that we have a few issues in the data.

*   The first row is empty.
*   Headers being repeated.
*   Empty columns.

![]({{site.baseUrl}}/assets/img/machine-learning-assets/excel_01.d50b6ea5.png){: .align-center}

He tests me, he tests me not.

![]({{site.baseUrl}}/assets/img/machine-learning-assets/test_test_not.43e43de0.gif){: .align-center}

We need to tell our program when we want to test something out or not in the terminal. Let's add a few parameters, change `Main Function`:

```javascript
/**
- Main Function
*/
(function () {
// Code in here
// Stays the same
})();
```


to

```javascript
/**
- Main Function
*/
(function (task, isTest) {
// Code in here
// Stays the same
})(process.argv[2], process.argv[3]);
```

If you've never seen this before, it's OK. Just check out this [StackOverflow answer](http://stackoverflow.com/questions/4351521/how-to-pass-command-line-arguments-to-node-js), it gives a great explanation of what's going on. I rarely use/see this in a lot of code anyways. What we're going to do is pass in two arguments when we run the data. Our first argument will either be <var>=BUILD</var> or <var>=CLEAN</var> and our 2nd argument can be <var>TEST</var>. The reason why we have a test argument is so that we don't have to generate all the seasons when we're testing. So the command we run will be one of the following:

```
$ node buildNBA_Data.js =BUILD
```
```
$ node buildNBA_Data.js =CLEAN
```
```
$ node buildNBA_Data.js =BUILD TEST
```
```
$ node buildNBA_Data.js =CLEAN TEST
```

Now, replace the existing `Functions Section` with the following code, and I'm going to explain it piece by piece.

```javascript
/* Functions Section
============================================= */

/**
*Function Name: cleanData
*Parameters: array of file paths
*RUN: node misc_NBA_Data.js =CLEAN
*/
var cleanData = function(paths) {
  //Clean up time!
  console.log(paths);
  console.log('*****DONE CLEANING DATA*****');
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
    console.log('*****DONE BUILDING DATA*****');
  });
};

/**
- Main Function
*/
(function (task, isTest) {

  // 1
  if (['=BUILD','=CLEAN'].indexOf(task) === -1) {
    console.log('You did not pick an available task.');
    return ;
  }

  // Type of stats
  var STATS = ['totals', 'advanced'];

  // 2
  var endYr = (isTest) ? 1982 : 2016;

  // 3
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

  //4
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

**Inside of Main Function**

**Part 1** - We check our `task` argument and we see if it is inside of our array of `allowed tasks`. If it is not in the array, we end the program.

**Part 2** - We made a new variable `endYr`, it's value depends on whether or not `isTest` is set. If `isTest` is set, I'm only allowing our `_.range()` function to go up to 1982 because I don't want to generate all the file paths, just a few. You can change the number if you want.

**Part 3** - We turned `pathList` into a function that takes in an argument. Depending on `beg`, we'll either generate the file paths to our `./data/csv/` or `./data/output/` folder. **Be sure to create an output folder with totals and advanced folders inside of it if you haven't already.**

**I REPEAT!!! Be sure to create an output folder with totals and advanced folders inside of it if you haven't already.**

Your directory should look like this:

NBA-Machine-Learning-Tutorial

  - data
    - csv
      - advanced
      - totals
    - output
      - advanced
      - totals
  - buildNBA_Data.js
  - package.json

**Part 4** - Depending on what task you choose, we set the `beg` to the appropriate path. Then we send you to either `buildData()` which contains our `fast_csv` code, or our new function called `cleanData()`.

Go ahead and run the code with a combination of <var>=BUILD</var> <var>=CLEAN</var> and <var>TEST</var> to make sure everything is working properly. If not, don't worry there's a _Code Checkup_ at the end of this section. Now that all of that is done, let's get back to what we wanted to do to begin with, which is to clean up the data. Make your `cleanData()`(top of `Function Section`) look like this:

```javascript
var cleanData = function(paths) {

  // 1
  async.each(paths, function(filePath, callback) {
    // 2
    fs.readFile(filePath, function(err, data) {
      if(err) throw err;
      var data_Str = data.toString();
      console.log(data_Str);
      callback();
    });
  },function (err) {
    console.log('*****DONE CLEANING DATA*****');
  });
};
```

**Part 1** - I don't feel I have to explain this again after this. For every `filePath` inside of our `paths` variable, we repeat the following.

**Part 2** - We read the data from the `filePath`, then we `console.log()` the data. From now on I will be running everything with the <var>TEST</var> argument set. I will explicitly tell you when not to. Go ahead and run it:
```
$ node buildNBA_Data.js =CLEAN TEST
```

You should've gotten a result like this:

![]({{site.baseUrl}}/assets/img/machine-learning-assets/console_004.4bfc8eb8.png){: .align-center}

OK cool, I think we can work with this. Had we not set the "**TEST**" variable, we would have printed out every single line on those CSV files. Don't believe me? try it! Here's a quick recap of what we are trying to fix:

1.  The first row is empty.
2.  Headers being repeated.
3.  Empty columns.

Let's start off with 3. If you scroll up on your terminal till you get to the gap, you should see the following:

![]({{site.baseUrl}}/assets/img/machine-learning-assets/console_005.63c79488.png){: .align-center}

Do you see those `,,`? These are our empty columns. Place the following two lines before our `console.log()` inside of `cleanData()`:

```javascript
// Remove double commas
data_Str = data_Str.replace(/,,/g,',0,');
var data_Arr = data_Str.split("\n");
```

run it:
```
$ node buildNBA_Data.js =CLEAN TEST
```

We're going to replace every `,,` with `,0,`. I know what you're thinking, **_"Fabian, but then I'm just going to have a column full of zeros!"_** Jimmy, what have I told you about worrying? Don't worry, I got **CHU**. The reason we are replacing them with a `,0,` is because some stats just aren't there. Plus We don't want to shift the entire row over. Check out what I mean, had we used this --> `replace(/,,/g,',');`, Kareem Abdul-Jabbar would've started 2976 games in 1981. Count the commas inside of the red lines!

![]({{site.baseUrl}}/assets/img/machine-learning-assets/console_006.6b5d3668.png){: .align-center}

Did any of you wonder why there was a gap when we printed out the data? (You don't have to raise your hand, Jimmy. )

Yes, because of the empty row at the beginning of each file. We're going to solve that next, but first `console.log(data_Arr)` instead of `data_Str` and run it:
```
$ node buildNBA_Data.js =CLEAN TEST
```

If you scroll all the way to the beginning of the last array, you should see an empty row.

![]({{site.baseUrl}}/assets/img/machine-learning-assets/console_007.7308b8d6.png){: .align-center}

AH HA! We caught the **_Empty Row Bandit_** red handed!!(Say that 10 times) Now inside of `CleanData()`, insert these lines before `console.log(data_Arr)`:

```javascript
// Check if first row is empty
if (!data_Arr[0].length) {
  data_Arr.shift();
}
```

We are going to use the [`shift()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/shift) method to remove the first row. Let's run it one more time and see if we sent the **_Empty Row Bandit_** to the gates of **HELL**! Ok, maybe that was a bit too much.

![]({{site.baseUrl}}/assets/img/machine-learning-assets/console_008.c66faf3f.png){: .align-center}

Don't want to sound like **Freddy** from **Scooby-Doo**, but **_"looks like we did it, gang!"_** That's two down, only one more to go and that is the repeating headers. What we are going to do is remove all the repeating headers, and we'll insert our own header in the next step. Go ahead and paste the following before our `console.log(data_Arr)`:

```javascript
data_Arr = _.filter(data_Arr, function (_str) {
  return (_str.indexOf('Rk,Player'));
});
```

You guessed it, we're going to use `underscoreJS` again. This time its [`_.filter()`](http://underscorejs.org/#filter), I actually learned something from this function. This whole time I thought `-1` is `False`, but it's not, it's a `True` value. So what's happening is, the `indexOf('Rk,Player')` starts at `index 0` of the string. Therefore, when it is present it returns `false`. had we used `indexOf('k,Player')`, it wouldn't work properly. I didn't want to just use `indexOf('Rk')`, in the case of some person's name actually starting with that.

If you're still confused about it like I was, run the following code in **[repl.it](https://repl.it/)**, it should explain what's happening.

```javascript
//RUN IN REPL.IT

str_ONE = 'Rk,Player,Pos,Age,Tm,G,MP,PER,TS%,3PAr,FTr,ORB%,';
str_TWO = '1,Kareem Abdul-Jabbar*,C,33,LAL,80,2976,25.5,.616,.0';

test1 = str_ONE.indexOf('Rk,Player'); // Starting 0, False
test2 = str_ONE.indexOf('k,Player'); // Starting 1, True

test3 = str_TWO.indexOf('Rk,Player');

if (test1) {
  //This shouldn't print
  console.log('test1 is true, we return it in our _.filter() function');
} else {
  console.log('test1 returned',test1,'in our filter().',
  'therefore we dont return it.');
}

if (test2) {
  //This should print
  console.log('test2 is true, we return it in our _.filter() function',
  'with a value of',test2);
} else {
  console.log(test2);
}

if (test3) {
  //This should print
  console.log('test3 is true, we return it in our _.filter() function',
  'with a value of',test3);
} else {
  console.log(test3);
}

```

We're so close guys, almost done cleaning the data. **So why are we removing all the headers?** Well Jimbo, when I made this project, I realize that some of the headers didn't match up. Let me show you what I mean, check out the photo below.

![]({{site.baseUrl}}/assets/img/machine-learning-assets/headerCheck.b8c687cc.png){: .align-center}

Do you see how a portion of the headers from the `totals` don't match up? It's stuff like this that you have to fix when cleaning your data. Or you'll end up like me, and have half your data missing when querying your database.

Now all we have to do is insert our header. Go ahead and add this function to your `Helper Section`:

```javascript
var getHeader = function (path) {
  var statObj = {
    'totals': 'Rk,Player,Pos,Age,Tm,G,GS,MP,FG,FGA,FG%,3P,3PA,3P%,2P,2PA,2P%,eFG%,FT,FTA,FT%,ORB,DRB,TRB,AST,STL,BLK,TOV,PF,PTS',
    'advanced': 'Rk,Player,Pos,Age,Tm,G,MP,PER,TS%,3PAr,FTr,ORB%,DRB%,TRB%,AST%,STL%,BLK%,TOV%,USG%,0,OWS,DWS,WS,WS/48,0,OBPM,DBPM,BPM,VORP'
  };
  var header = _.map(statObj, function (val, key) {
    // 1
    if (path.indexOf(key) > -1) {
      // 2
      return val;
    }
  });
  console.log(header);
  // 3
  return _.compact(header)[0];
};
```

**Part 1** - `key` can either equal `totals` or `advanced`. We then check if the word `totals` or `advanced` appears inside the string `path` which we passed as an argument to `getHeader()`.

**Part 2** - We then return the `val` of the stat(`totals`, `advanced`) that appeared in the string `path`.

**Part 3** - We're going to use the [`_.compact()`](http://underscorejs.org/#compact) function from the `underscoreJS` module to remove all `falsy` values.

So let's use this bad boy, go back to `cleanData()`, and paste the following line after our `_.filter()` function:

```javascript
var finalHeader = getHeader(filePath);
```

Change out `console.log(data_Arr)` for `console.log(finalHeader)`. Before we run it, our `cleanData()` should look like this:

```javascript
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

      callback();
    });
  },function (err) {
    console.log('*****DONE CLEANING DATA*****');
  });
};

```

Ok let's run it:
```
$ node buildNBA_Data.js =CLEAN TEST
```

Your console should look like this:

![]({{site.baseUrl}}/assets/img/machine-learning-assets/console_010.5d34c40d.png){: .align-center}

I know what you're thinking Slim Jim. It's been bothering you for quite some time now. Something about `getHeader()` just don't seem right.

![]({{site.baseUrl}}/assets/img/machine-learning-assets/tim_duncan_smell.7ac78b42.gif){: .align-center}

Let's combine **Part 2** and **Part 3** so `getHeader()` looks like this.

```javascript
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
```

AHHHH much better! Now let's just add our `finalHeader` to the beginning of the file and then we're good, right? A couple more lines, and we officially finished cleaning our data. Inside of `cleanData()` at the bottom of `fs.readFile()`, insert the following lines above `callback()`:

```javascript
// 1
data_Arr.unshift(finalHeader);
// 2
var outputPath = filePath.replace(/csv/,'output');
// 3
fs.writeFileSync(outputPath, data_Arr.join('\n'));
```

**Part 1** - Remember that `shift()` method we used earlier? [`unshift()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/unshift) is simply the opposite. Meaning we added `finalHeader` at the front of the array.

**Part 2** - `.replace(/csv/,'output')` will replace the first instance of **csv** that it finds with **output**. Meaning we will be writing to our output folder. We set this new path to `outputPath`.

**Part 3** - We are going to use `outputPath` to write the file. Since `data_Arr` is an array, we use the [`.join()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/join) method to make it one big string Separated by new lines.

Let's test it before we apply it to all our data.
```
$ node buildNBA_Data.js =CLEAN TEST
```

Open up your `output/advanced/leagues_NBA_1981_advanced.csv` file and make sure everything looks correct. It should look like this:

![]({{site.baseUrl}}/assets/img/machine-learning-assets/sublime_01.2dc0b463.png){: .align-center}

### Code Checkup

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
    console.log('*****DONE BUILDING DATA*****');
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
  var endYr = (isTest) ? 1982 : 2016;


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

Once you check that everything is correct let's run it for production!
```
$ node buildNBA_Data.js =CLEAN
```

Your console should look like this:

![]({{site.baseUrl}}/assets/img/machine-learning-assets/console_011.09d643c4.png){: .align-center}

Well gang, looks like we finally finished cleaning our data... for now. We just have to structure it and we're one step closer to Machine Learning.

![]({{site.baseUrl}}/assets/img/machine-learning-assets/school_of_rock.63decf24.gif){: .align-center}
