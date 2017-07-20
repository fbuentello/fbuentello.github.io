---
categories : machine-learning
tags : 
    - machine-learning
    - nba
    - tutorial
---

# Chapter 4. Machine Learning

##### 7/24/2015

## Intro

The following command will sync your repo with mine if you're having issues:

```bash
$ git checkout startChapter4 -f 
```

I want to mention this before continuing. When it comes to programming the machine learning portion, it's actually extremely easy and fast. This tutorial will not teach you everything you need to know about machine learning, it will simply show you how to implement it. If you want to continue with machine learning, I will be referencing free online courses and tutorials that I read that helped me along the way.

As of right now, we have read in data from CSV files. We cleaned the data, we structured the data, and we exported the data. I've been waiting days to say this, now let's do something with the data!

Before we start I want to go on the record about something. If I told you that I was a **_PYTHON GURU_**, I would be **_lying like the rug_**.

With the exception of a [Codecademy](https://www.codecademy.com/learn) and "Hello World!" type programs, this is my first real program with Python. I apologize if some of my code is very **_noob-ish_**. If anyone knows a better way of implementing some of my code, by all means, make a pull request to the repo.

You can either use the checkout above or simply create these two new files:

**nbaImport.py**

**runNBA_Data.py**

In `nbaImport.py`, we will have two variables and the methods we need in order to connect to mongo. Let's get started with that. Add this comment section at the top of the page:

```python
'''
PER
    FGM - totals.FG
    Stl - totals.STL
    3PTM - totals.3P
    FTM - totals.FT
    Blk - totals.BLK
    Off_Reb - totals.ORB
    Ast - totals.AST
    Def_Reb - totals.DRB
    Foul - totals.PF
    FT_Miss - totals.FTA-totals.FT
    FG_Miss - totals.FGA-totals.FG
    TO - totals.TOV
'''
```

These are the stats from [Zach Fien article](http://bleacherreport.com/articles/113144-cracking-the-code-how-to-calculate-hollingers-per-without-all-the-mess) from <a ui-sref="blog.NBA_Machine_Learning_Tutorial1" title="Chapter 1">Chapter 1</a> along with their property names in the database.

The following methods will connect us to our MongoDB. I followed this [StackOverflow answer](http://stackoverflow.com/a/16255680/1973339) as a guide to connect to MongoDB. It's pretty straight forward, I made a few tweaks to it. Add the following methods to `nbaImport.py`

```python
# Connect to MongoDB
def connectMongo(db, host='localhost', port=27017, mongo_uri=None):

    """ A util for making a connection to mongo """

    if mongo_uri:
        conn = MongoClient(mongo_uri)
    else:
        conn = MongoClient(host, port)

    return conn[db]

def readMongo(db, collection, query={}, queryReturn=None,
                _limit=None,no_id=True,mongo_uri=None):

    """ Read from Mongo and Store into DataFrame """

    # Connect to MongoDB
    db = connectMongo(db=db, mongo_uri=mongo_uri)

    # Make a query to the specific DB and Collection
    cursor = db[collection].find(query, queryReturn)

    # Check if a limit was set
    if _limit:
        cursor = cursor.limit(_limit)
    # Expand the cursor and construct the DataFrame
    df =  pd.DataFrame(list(cursor))

    # Delete the _id
    if no_id:
        del df['_id']

    return df
```

I will explain `DataFrame` when we get to `runNBA_Data.py`. Almost forgot, add these imports at the top of `nbaImport.py`:

```python
import pandas as pd
from pymongo import MongoClient
from bson.objectid import ObjectId
```

So we have our database methods set. We know what stats we need to get and from what collection. Now we just have to query them. Add the following variables:

```python
PER_FEATURES = [
    'FG',
    'STL',
    '3P',
    'FT',
    'BLK',
    'ORB',
    'AST',
    'DRB',
    'PF',
    'FT_M', #FT_Miss - totals.FTA-totals.FT
    'FG_M', #FG_Miss - totals.FGA-totals.FG
    'TOV',
    'MP'
]

WANTED_FEATURES = {
    'Seasons.advanced.PER': 1,  # double
    'Seasons.totals.MP': 1,     # Int32
    'Seasons.totals.STL': 1,    # Int32
    'Seasons.totals.3P': 1,     # Int32
    'Seasons.totals.FT': 1,     # Int32
    'Seasons.totals.BLK': 1,    # Int32
    'Seasons.totals.ORB': 1,    # Int32
    'Seasons.totals.AST': 1,    # Int32
    'Seasons.totals.DRB': 1,    # Int32
    'Seasons.totals.PF': 1,     # Int32
    'Seasons.totals.FTA': 1,    # Int32
    'Seasons.totals.FGA': 1,    # Int32
    'Seasons.totals.FG': 1,     # Int32
    'Seasons.totals.TOV': 1     # Int32
}
```

That's pretty much it when it comes to `nbaImport.py`, we'll do a code checkup right now.

### Code Checkup

```python
import pandas as pd
from pymongo import MongoClient
from bson.objectid import ObjectId

'''
PER
    FGM - totals.FG
    Stl - totals.STL
    3PTM - totals.3P
    FTM - totals.FT
    Blk - totals.BLK
    Off_Reb - totals.ORB
    Ast - totals.AST
    Def_Reb - totals.DRB
    Foul - totals.PF
    FT_Miss - totals.FTA-totals.FT
    FG_Miss - totals.FGA-totals.FG
    TO - totals.TOV
'''

PER_FEATURES = [
    'FG',
    'STL',
    '3P',
    'FT',
    'BLK',
    'ORB',
    'AST',
    'DRB',
    'PF',
    'FT_M', #FT_Miss - totals.FTA-totals.FT
    'FG_M', #FG_Miss - totals.FGA-totals.FG
    'TOV',
    'MP'
]

WANTED_FEATURES = {
    'Seasons.advanced.PER': 1,  # double
    'Seasons.totals.MP': 1,     # Int32
    'Seasons.totals.STL': 1,    # Int32
    'Seasons.totals.3P': 1,     # Int32
    'Seasons.totals.FT': 1,     # Int32
    'Seasons.totals.BLK': 1,    # Int32
    'Seasons.totals.ORB': 1,    # Int32
    'Seasons.totals.AST': 1,    # Int32
    'Seasons.totals.DRB': 1,    # Int32
    'Seasons.totals.PF': 1,     # Int32
    'Seasons.totals.FTA': 1,    # Int32
    'Seasons.totals.FGA': 1,    # Int32
    'Seasons.totals.FG': 1,     # Int32
    'Seasons.totals.TOV': 1     # Int32
}

# Connect to MongoDB
def connectMongo(db, host='localhost', port=27017, mongo_uri=None):

    """ A util for making a connection to mongo """

    if mongo_uri:
        conn = MongoClient(mongo_uri)
    else:
        conn = MongoClient(host, port)

    return conn[db]

def readMongo(db, collection, query={}, queryReturn=None,
                _limit=None,no_id=True,mongo_uri=None):

    """ Read from Mongo and Store into DataFrame """

    # Connect to MongoDB
    db = connectMongo(db=db, mongo_uri=mongo_uri)

    # Make a query to the specific DB and Collection
    cursor = db[collection].find(query, queryReturn)

    # Check if a limit was set
    if _limit:
        cursor = cursor.limit(_limit)
    # Expand the cursor and construct the DataFrame
    df =  pd.DataFrame(list(cursor))

    # Delete the _id
    if no_id:
        del df['_id']

    return df
```

Now let's go over to our `runNBA_Data.py` and implement our four functions, that's right only four functions. One of those functions I consider a helper, so you know it's short. Let's import our modules at the top of the page.

```python
# runNBA_Data.py
import time
import pandas as pd
import numpy as np

# Machine Learning algorithms
from sklearn.pipeline import Pipeline
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import PolynomialFeatures,scale
from sklearn.cross_validation import train_test_split, KFold
from sklearn.learning_curve import learning_curve

# Plot modules
import matplotlib.pyplot as plt
from matplotlib import style
style.use("ggplot")
pd.options.display.max_columns = 50
pd.set_option('expand_frame_repr', False)

# Custom modules
from nbaImport import readMongo, WANTED_FEATURES, PER_FEATURES
```

If you don't already have the modules installed on your computer/environment, here's the command to install all of them:

```bash
$ pip install pandas numpy scikit-learn matplotlib pymongo scipy
```

Once you have everything installed, go ahead and run your python script to make sure no errors occur. Since I am using python 3.4, my command looks like the following:

```bash
$ python3 runNBA_Data.py
```

If nothing is displayed on the console, then that means were good! Let's continue...

Paste the following at the bottom of `runNBA_Data.py`:

```python
def flatten(objToFlatten):
    return [item for sublist in objToFlatten for item in sublist]

def BuildDataSet():
    return True, True;

def PlotLearningCurve(X_data, y_data,algorithm, s_time):
    return True;

def Analysis(_deg=1):
    X, y = BuildDataSet()

Analysis()
```

We are going to start off in `BuildDataSet()`. Depending if you are using [mongolab](https://mongolab.com/home "mongolab") to host your database, you will paste one of the following lines before the `return` statement:

**USING MONGOLAB**. <a ng-click="showURI= true" title="What is URI?">What is URI?</a>

![]({{site.baseUrl}}/assets/img/machine-learning-assets/mongolab_05.1764ab03.png){: .align-center}

```python

# 1
nbaFrame = readMongo(db='YOUR DATABASE',collection='players',
        query= {}, queryReturn=WANTED_FEATURES, no_id=False,
        mongo_uri='YOUR URI')

# 2
statsDF = pd.DataFrame(list(flatten(nbaFrame.Seasons)))
```

**NOT USING MONGOLAB**

```python

# 1
nbaFrame = readMongo(db='YOUR DATABASE',collection='players',
        query= {}, queryReturn=WANTED_FEATURES, no_id=False)

# 2
statsDF = pd.DataFrame(list(flatten(nbaFrame.Seasons)))
```

**Part 1** - We are using our `readMongo()` method that we imported. We set `query = {}` so it would return everything. `queryReturn` is the [projection document](http://docs.mongodb.org/manual/tutorial/project-fields-from-query-results/) of the query. Meaning, it tells mongo: **"Hey, I don't care about all that other stuff, I only want back these values here(WANTED_FEATURES)."**

**Part 2** - Picture `DataFrame` as a [spreadsheet/SQL table](http://pandas-docs.github.io/pandas-docs-travis/dsintro.html#dataframe). Since `nbaFrame.Seasons` returns an array of **objects**, and objects don't go well with spreadsheets. We need to use our `flatten()` function to transform our data so it can work with the `DataFrame`.

Let's `console.lo....` I mean, `print(statsDF)` after we set it. Add the following line after we set `statsDF`:

```python
print(statsDF)
```

Be sure you have your Mongo DB instant running if you're not using Mongolab. Let's run this code:

```bash
$ python3 runNBA_Data.py
```

Hopefully should've gotten something similar to this:

![]({{site.baseUrl}}/assets/img/machine-learning-assets/console_13.cc653949.png){: .align-center}

Do you see what I'm talking about when I was talking about `DataFrame` and objects? Goodluck trying to put that in a spreadsheet.

Let's go ahead and finish up this function, paste the following in `BuildDataSet()`:

```python

# 1
stats = pd.DataFrame(list(statsDF.totals.values))
stats['FT_M'] = stats['FTA'] - stats['FT']
stats['FG_M'] = stats['FGA'] - stats['FG']
stats[PER_FEATURES] = stats[PER_FEATURES].astype(float)

# 2
stats['PER'] = pd.DataFrame(list(statsDF.advanced.values))

# 3
stats = stats.reindex(np.random.permutation(stats.index))
X = np.array(stats[PER_FEATURES].values)
y = (stats["PER"].values.tolist())

return X,y
```

**Part 1** - Make a new DataFrame object called `stats` which is set to the values of all the `totals` stats. We make a new features called `FT_M` and `FG_M` which calculate `free throws missed` and `field goals missed`. Lastly, we convert all the numbers to floats.

**Part 2** - We add `PER` to the `stats` from the `advanced` stats.

**Part 3** - We are randomizing our data, which is very common in machine learning. Next we are setting our input`X` and output `y`.

Now to our `PlotLearningCurve()`, I am not going to go into detail as to how the machine learning portion is working. I will, however, be referencing documentation which goes into much more detail and contains examples.

```python
def PlotLearningCurve(X_data, y_data,algorithm, s_time):

    print('PlotLearningCurve called')

    # 1
    sizes = np.array([.1,.2,.5,.8,.99])

    train_sizes, train_scores, test_scores = learning_curve(
                                                    algorithm,
                                                    X_data,
                                                    y_data,
                                                    train_sizes=sizes)
    print('after learning_curve')
    train_mean = np.mean(train_scores, axis=1)
    train_std = np.std(train_scores, axis=1)
    test_mean = np.mean(test_scores, axis=1)
    test_std = np.std(test_scores, axis=1)

    # 2
    plt.figure(figsize=(15,10)) # Width, Height

    # Training Set
    plt.fill_between(train_sizes, train_mean-train_std,
                    train_mean+train_std, alpha=0.1, color="r")

    # Cross Validation Set
    plt.fill_between(train_sizes, test_mean-test_std,
                    test_mean+test_std, alpha=0.1, color="g")

    # Graph Legend text
    trainLabel = ('%.3f%% Training score' % (train_mean[4]))
    testLabel = ('%.3f%% Cross-validation score' % (test_mean[4]))

    # Plot lines
    plt.plot(train_sizes, train_mean, 'o-', color="r", label=trainLabel)
    plt.plot(train_sizes, test_mean, 'o-', color="g", label=testLabel)

    # Place title, X-axis label, Y-axis label
    plt.suptitle('Linear Regression: NBA PER', fontsize=20)
    plt.xlabel('Training examples')
    plt.ylabel('Accuracy')

    # Set limit on Y-axis, Place graph legend
    plt.ylim((0, 1.1))
    plt.legend(loc="best")

    # Print duration of program
    print("--- %s seconds ---" % (time.time() - s_time))
    plt.show()
```

**Part 1** - Machine Learning: `[learning_curve()](http://scikit-learn.org/stable/modules/generated/sklearn.learning_curve.learning_curve.html#sklearn.learning_curve.learning_curve)` returns the data we need for our graph. So you have an idea of what a learning curve looks like, check out [this example](http://scikit-learn.org/stable/modules/learning_curve.html#learning-curve). The variables `algorithm`, `X_data`, and `y_data` will make more sense when we get to the `Analysis()` function. Our variable `sizes` tells our `learning_curve()`, "Hey, I want you to calculate the accuracy at **<u>10%</u>**, **<u>20%</u>**, **<u>50%</u>**, **<u>80%</u>**, and **<u>99%</u>**." The variables ending in `_mean` and `_std` are simply the measurements of the [average](http://docs.scipy.org/doc/numpy/reference/generated/numpy.mean.html) and the [standard deviation](http://docs.scipy.org/doc/numpy/reference/generated/numpy.std.html) at each of the percentages.

**Part 2** - Plot Graph: Here we are placing the data onto the graph and finally displaying it at the end. I put comments to help explain what's going on since it's pretty straightforward. Just setting up labels, legends, titles, etc.

Finally, let's finish up this program with `Analysis()`:

```python
def Analysis(_deg=1):
    start_time = time.time()

    # 1
    X, y = BuildDataSet()
    linear_regression = LinearRegression()

    # 2
    polynomial_features = PolynomialFeatures(degree=_deg, include_bias=False)

    # 3
    algorithm = Pipeline([("polynomial_features", polynomial_features),
                         ("linear_regression", linear_regression)])
    #========================================================================== */
    print('after Pipeline')

    # 4
    PlotLearningCurve(X, y, algorithm, start_time)
```

**Part 1** - Here we get our `X` and `y` which we get returned from `BuildDataSet()`. Next, we make a new variable called `linear_regression` which is set to our imported `[LinearRegression()](http://scikit-learn.org/stable/modules/generated/sklearn.linear_model.LinearRegression.html#sklearn.linear_model.LinearRegression)` algorithm class.

**Part 2** - We're going to be adding `[Polynomial Features](http://scikit-learn.org/stable/auto_examples/model_selection/plot_underfitting_overfitting.html#example-model-selection-plot-underfitting-overfitting-py)` to our algorithm. [This video](https://class.coursera.org/ml-005/lecture/23) by Andrew Ng does an extraordinary job explaining the importance of this. I will be speaking about Andrew's course in the conclusion of this tutorial.

**Part 3** - we need to use our `[Pipeline](http://scikit-learn.org/stable/modules/generated/sklearn.pipeline.Pipeline.html)` class to combine `polynomial_features` to our `LinearRegression()` algorithm.

**Part 4** - lastly, we pass in our `X`, `y`, and `algorithm` as arguments to `PlotLearningCurve()`.

Are y'all ready to predict a player's PER? Let's do one last checkup before running it.

### Code CheckUp

```python
# runNBA_Data.py

import time
import pandas as pd
import numpy as np

# Machine Learning algorithms
from sklearn.pipeline import Pipeline
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import PolynomialFeatures,scale
from sklearn.cross_validation import train_test_split, KFold
from sklearn.learning_curve import learning_curve

# Plot modules
import matplotlib.pyplot as plt
from matplotlib import style
style.use("ggplot")
pd.options.display.max_columns = 50
pd.set_option('expand_frame_repr', False)

# Custom modules
from nbaImport import readMongo, WANTED_FEATURES, PER_FEATURES

def flatten(objToFlatten):
    return [item for sublist in objToFlatten for item in sublist]

def BuildDataSet():

    ###### USING MONGOLAB ######
    nbaFrame = readMongo(db='YOUR DATABASE',collection='players',
            query= {}, queryReturn=WANTED_FEATURES, no_id=False,
            mongo_uri='YOUR URI')

    ###### NOT USING MONGOLAB ######
    nbaFrame = readMongo(db='YOUR DATABASE',collection='players',
            query= {}, queryReturn=WANTED_FEATURES, no_id=False)

    ##################################################################

    statsDF = pd.DataFrame(list(flatten(nbaFrame.Seasons)))

    stats = pd.DataFrame(list(statsDF.totals.values))
    stats['FT_M'] = stats['FTA'] - stats['FT']
    stats['FG_M'] = stats['FGA'] - stats['FG']
    stats[PER_FEATURES] = stats[PER_FEATURES].astype(float)

    stats['PER'] = pd.DataFrame(list(statsDF.advanced.values))

    # 3
    stats = stats.reindex(np.random.permutation(stats.index))
    X = np.array(stats[PER_FEATURES].values)
    y = (stats["PER"].values.tolist())

    return X,y

def PlotLearningCurve(X_data, y_data,algorithm, s_time):

    print('PlotLearningCurve called')

    sizes = np.array([.1,.2,.5,.8,.99])

    train_sizes, train_scores, test_scores = learning_curve(
                                                    algorithm,
                                                    X_data,
                                                    y_data,
                                                    train_sizes=sizes)
    print('after learning_curve')
    train_mean = np.mean(train_scores, axis=1)
    train_std = np.std(train_scores, axis=1)
    test_mean = np.mean(test_scores, axis=1)
    test_std = np.std(test_scores, axis=1)

    plt.figure(figsize=(15,10)) # Width, Height

    # Training Set
    plt.fill_between(train_sizes, train_mean-train_std,
                    train_mean+train_std, alpha=0.1, color="r")

    # Cross Validation Set
    plt.fill_between(train_sizes, test_mean-test_std,
                    test_mean+test_std, alpha=0.1, color="g")

    # Graph Legend text
    trainLabel = ('%.3f%% Training score' % (train_mean[4]))
    testLabel = ('%.3f%% Cross-validation score' % (test_mean[4]))

    # Plot lines
    plt.plot(train_sizes, train_mean, 'o-', color="r", label=trainLabel)
    plt.plot(train_sizes, test_mean, 'o-', color="g", label=testLabel)

    # Place title, X-axis label, Y-axis label
    plt.suptitle('Linear Regression: NBA PER', fontsize=20)
    plt.xlabel('Training examples')
    plt.ylabel('Accuracy')

    # Set limit on Y-axis, Place graph legend
    plt.ylim((0, 1.1))
    plt.legend(loc="best")

    # Print duration of program
    print("--- %s seconds ---" % (time.time() - s_time))
    plt.show()

def Analysis(_deg=1):
    start_time = time.time()

    X, y = BuildDataSet()
    linear_regression = LinearRegression()

    polynomial_features = PolynomialFeatures(degree=_deg, include_bias=False)

    algorithm = Pipeline([("polynomial_features", polynomial_features),
                         ("linear_regression", linear_regression)])
    #========================================================================== */
    print('after Pipeline')

    PlotLearningCurve(X, y, algorithm, start_time)

Analysis()
```

Be sure to have MongoDB running if you are not using Mongolab.

let's run it:

```bash
$ python3 runNBA_Data.py
```

Did you get something like this:

![]({{site.baseUrl}}/assets/img/machine-learning-assets/prediction_01.9193ea18.png){: .align-center}

I bet you're saying, "Fabian, what the hell man? I thought you said **95%**!?!? What the hell is this **40%** that I'm seeing?!? **_[I can't get jiggy with this!!](https://www.youtube.com/watch?v=zT8QQr6MjBo)_** ." I know, I know!! Something went wrong, I think we might have missed something, let's go back to <a ui-sref="blog.NBA_Machine_Learning_Tutorial1" title="Chapter 1">Chapter 1</a> and redo it all..... Nah I'm just kidding, when I first saw this, It kinda scared me. But don't worry, I got this. Let's open up [basketball-reference](http://www.basketball-reference.com/leagues/NBA_2015_advanced.html) in a new tab, and click on the **PER** stat, like so:

![]({{site.baseUrl}}/assets/img/machine-learning-assets/bb_ref_01.3c4e6758.png){: .align-center}

It should put all the **PER** stats in descending order. As you see, our data could use a bit more cleaning. There's no way **_Sim Bhullar_** should have a higher PER than **Anthony Davis**, **Stephen Curry**, and especially the best 2-Guard in the game right now, **James Harden**. Some may find that last statement a bit biased, I don't know, you tell me, does this gif lie?

![]({{site.baseUrl}}/assets/img/machine-learning-assets/jamesHarden.5d25f3f5.gif){: .align-center}

I see what's going on, it's the amount of games(G) the player has played. That's why **_Sim Bhullar_** has a high PER.

I know what you're thinking, "Fabian, are we going to have to go back to <a ui-sref="blog.NBA_Machine_Learning_Tutorial2" title="Chapter 2">Chapter 2</a> and redo something?" The answer is "if I was an asshole, I would make you do that, but I'm not. So I'll tell you what to do." We're going to make a new collection in our database that will not include seasons from players who did not play a certain amount of games. **_Derrick Rose_** will act as our example. We will use all the seasons Derrick has played except his **_'12-'13_** and **_'13-'14_** seasons for which he was hurt.

Open up `Robomongo` and run the following command:

```python
db.players.aggregate(
  {$unwind: "$Seasons"},
  {$match: {"Seasons.advanced.G": { $gt:50 }}},
  {$group: {
        _id: "$_id",
        Player: {$first:"$$ROOT.Player"},
        Pos: {$first:"$$ROOT.Pos"},
        Seasons:{ $push: "$Seasons"}}
    },
  {$out:"above50Games"})
```

**_Be sure to right click `collections` on the sidebar and click `refresh`._** This will make our new collection `above50Games` show up on the sidebar. You should get something like this returned:

![]({{site.baseUrl}}/assets/img/machine-learning-assets/robomongo_02.120e7794.png){: .align-center}

This function will make our new `above50Games` collection be identical to our `players` collection. Of course, with the exception that it removes any season where the player has played less than 50 games.

**_Why did I choose 50 games?_** I tried a few numbers like 35, 50, 55. Having a minimum of 50 games seemed to give me the best results.

OK let's go back to `runNBA_Data.py` and make a few changes inside of our `BuildDataSet()` function. Change `readMongo()` to get data from `above50Games` instead of `players`:

```python
nbaFrame = readMongo(db='YOUR DATABASE',collection='above50Games', query= {}, queryReturn=WANTED_FEATURES, no_id=False)
```

Let's run it:

```bash
$ python3 runNBA_Data.py
```

Hopefully, you got something like this:

![]({{site.baseUrl}}/assets/img/machine-learning-assets/prediction_02.61ed8c6e.png){: .align-center}

I'm sure you're saying: **_"Fabian 85% does not equal 95%! I'm getting really close to just leaving this tutorial! I'm tired of you playing with my emotions!!"_**

OK I'm sorry this is the last fix, **_I PROMISE!_** Remember that `polynomial_features`? Since `_deg` gets set to 1 in `Analysis(_deg=1)`, we aren't taking advantage of that feature. So at the very bottom of the page, the very last line, where you see `Analysis()` all by itself. Replace it with this:

```python
Analysis(2)
```

and then run it. Watch your accuracy shoot up! By the way, it may take a little longer than before. Let's try `3` next.

```python
Analysis(3)
```

You hopefully should've gotten this:

![]({{site.baseUrl}}/assets/img/machine-learning-assets/prediction_03.323fbfa2.png){: .align-center}

**There's your _95% + 1_!**

![]({{site.baseUrl}}/assets/img/machine-learning-assets/drop_MIC.1ac6f159.gif){: .align-center}

Let's zoom into the graph a bit. At the end of `PlotLearningCurve()`, replace the following lines:

```python
plt.ylim((0, 1.1))
plt.legend(loc="best")
```

with:

```python
plt.ylim((0.5, 1.1))
plt.xlim((0, 6500))
plt.legend(loc="best")
```

Looks a lot better don't you say?

![]({{site.baseUrl}}/assets/img/machine-learning-assets/prediction_04.2518c0fa.png){: .align-center}

## Conclusion

I hope you were able to take something away from this tutorial. Machine learning is a very exciting field and I highly recommend you look into it. As you see, it takes more time to collect and clean data than the actual Machine Learning part. Machine Learning is all about theory:

*   What are you trying to predict?
*   What are your features?
*   What algorithm are you going to use?

Machine learning is nothing like programming. In programming, you can grind it out. Meaning, you can work when your body is completely drained and still get something done. Machine learning is not like that, you need to have a clear mind and really understand your data.

I want to thank [basketball-reference](http://www.basketball-reference.com/?lid=homepage_logo) and all the hard working teams involved for allowing me to use their data. I also want to thank Sean Forman for allowing me to make their data available for download on this tutorial. I want to thank Andrew Ng for his amazing [FREE Machine Learning course on coursera](https://www.coursera.org/learn/machine-learning/home/info). Lastly, I want to thank [sentdex](https://www.youtube.com/user/sentdex) for his great [python machine learning tutorials](https://www.youtube.com/playlist?list=PLQVvvaa0QuDd0flgGphKCej-9jp-QdzZ3) on YouTube. Both sentdex and Andrew's videos really helped out! I recommend you watch them(Andrew's before sentdex) if you want to get into Machine Learning. If you've made it all the way down to this sentence here, I want to personally thank you for taking the time out of your day to do this tutorial. I hope you took something away from it, but most importantly, I hope you had a good time. Any feedback would be appreciated. Thank you again!

_-Fabian Buentello_