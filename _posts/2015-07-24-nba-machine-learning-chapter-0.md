---
categories : machine-learning
tags : 
    - machine-learning
    - nba
    - tutorial
---

## Introduction

Before I get started, I want to say this is my first blog/tutorial ever. So bear with me if you find the structure of this tutorial a bit unorthodox. I’m just going to follow the structure I see on some other online tutorials along with throwing a little "Fabian pizzazz" on it. This tutorial will be half tutorial, half blog, and half BuzzFeed article. So we're talking about a 150% of pure awesomeness. Unfortunately, this article is not for the beginner/novice level. I’m going to assume you have experience with Python, Node.JS, and MongoDB. If not, don't worry, I will provide links to everything you need to get started throughout the tutorial. You can find the official repo to this project [here](https://github.com/initFabian/NBA-Machine-Learning-Tutorial).

Due to the amount of details in this tutorial, some may find it lengthy. If you want to go straight to the machine learning portion, you can skip straight to Chapter 4. If that's the case, you still need to do the MongoDB portion at the end of Chapter 3.

If you have little or no experience with machine learning, I recommend you quickly read over Dr. Konstantinova's short article, [Machine learning explained in simple words](http://nkonst.com/machine-learning-explained-simple-words/).

## What are we doing?

I’m going to show you the steps that I took in order to clean, structure, and run the data used to predict a player's PER rating with an accuracy of at least 95%.

If you have no idea what the PER score is used for, let me explain. [PER(Player Efficiency Rating)](https://en.wikipedia.org/wiki/Player_efficiency_rating), developed by John Hollinger, is a number used by the NBA to rate a player's performance throughout the season. If you scroll down to the [bottom of the wiki page](https://en.wikipedia.org/wiki/Player_efficiency_rating#Calculation), you'll see Hollinger's original formula. Don't worry, we're not going to touch on that at all, actually we're really not going to do much math.

This tutorial will be extremely detailed so that no one gets lost. I’m going to break down this tutorial into four chapters:

- Chapter 1. Read Data
- Chapter 2. Clean Data
- Chapter 3. Output Data
- Chapter 4. Machine Learning

We will be using [NodeJS](https://nodejs.org/) and [Python3](https://www.python.org/downloads/) throughout this project.

Ch 1. **Read Data**

We will be using NodeJS to do the following:

- Generate file paths.
- Read in the CSV files.

Ch 2. **Clean Data**

- Clean Data.
- 
Ch 3. **Output Data**

- Structure Data.
- Export to MongoDB.

Ch 4. **Machine Learning**

We will be using Python to go over the Machine Learning portion of this project. We will be connecting to MongoDB using python to read in the data for which we are then going to apply a linear regression algorithm to predict the player’s PER.

## There's only one question I want to ask you...
![]({{site.baseUrl}}/assets/img/machine-learning-assets/are_you_ready.713635a5.gif){: .align-center}