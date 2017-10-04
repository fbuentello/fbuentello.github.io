---
categories : standard-architecture
tags : 
    - architecture
canonical : https://chaione.com/blog/team-needs-standard-architecture/
---

This post will explain how implementing a Standard Architecture in ChaiOne's Engineering Department has helped us, and why you should implement a Standard Architecture for your own team.
Before I start, there’s something I should mention.
At first glance, it may seem as if I'm only talking about standardizing the architecture of codebases, but that's actually not the case. What we defined as a Standard Architecture at ChaiOne goes beyond just an architecture of a codebase, it includes standardizing tools, versions, coding practices, and principles. The term "Standard Architecture" just flows better than "Standard Architecture and Coding Principles".

Believe it or not, your team already has a standard architecture, but this usually takes the form of an "Unwritten Rule". For example, it may not make sense to document a standard architecture when your standards are only, *"our backend is powered by NodeJS running version 6.10.x and we follow [AirBnB's JavaScript Style Guide](https://github.com/airbnb/javascript)"*. But what if you have multiple teams with multiple projects all over the world? It would then make more sense to have a document that allows you to communicate current standards across all teams. Plus, it would provide you the flexibility to expand down the road if your team decides to add branching strategies or change linters.

## What is a Standard Architecture(SA)

A Standard Architecture(SA) is a high-level document that outlines a set of criteria for your team’s technology stacks to follow. Ultimately, your SA should speed up development cycles, increase consistency across all codebases, and help with ramping up new developers. An SA should be created by the team and not by a single individual.

>"The layers of a Standard Architecture are very important... It gives us an overview of all the different foundational technologies that we support and how they tie in together."
> 
> \- Chad Modad, Chief Innovation Officer

*Backend Standard Diagram*  

![]({{site.baseUrl}}/assets/img/standard-architecture/C1SA-Server.png){: .align-center}
<!-- <img src="img/C1SA-Server.png" alt="Drawing" style="width: 900px;"/> -->

The above figure is an architecture diagram that all backend (NodeJS, Ruby on Rails, .NET, Elixir) projects at ChaiOne must follow in order to make the project flexible and expandable in the future.

*Mobile Standard Diagram*  

![]({{site.baseUrl}}/assets/img/standard-architecture/C1SA-Mobile.png){: .align-center}
<!-- <img src="img/C1SA-Mobile.png" alt="Drawing" style="height: 200px;"/> -->

We crafted a similar architecture for our mobile team (iOS, Android, Xamarin). Since many of ChaiOne's projects are mobile apps, our team decided to standardize what frameworks and architectures are approved for use in client projects. For our specific needs, we elected to use [Model View Controller(MVC)](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller) as our architecture and use frameworks like [Retrofit(Android)](https://github.com/square/retrofit) and [Alamofire(iOS)](https://github.com/alamofire/alamofire) to handle all network calls.
 
There are two advantages to doing this:

First, we can offer more maintainability in our codebases. And if a developer seeks to use an architecture other than MVC, or to add a particular framework we ask them to justify it. This helps prevent developers from leaving the team with codebases using the [MVVM](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93viewmodel) design pattern when no one else on the team is familiar with MVVM.... But more on this later. 

> "What I like the most from our Standard Architecture is its reliability... because the biggest problem software could have is maintainability."
> 
> \- Sally Ransom, Solutions Architect

Second, by pre-defining these standards, we are prepared when we come across a project for which MVC might not be the best approach. This allows us to identify issues, compare the pros and cons of other architectures, and consider how introducing a new architecture will affect other parts of our SA moving forward.

You’re probably thinking, "You're trying to limit my creativity as a developer!", when in fact, having an SA means quite the opposite. An SA should accelerate the tedious parts of app development, giving the developer more time to express their creativity on the interesting problems within an application.

>"I like the idea of having a starting place and having reference architectures that everyone understands... These reference architectures and guidelines aren't something we just made up because we think they might work, these architectures are a result of years working on multiple projects and they are what emerged as being successful approaches."
>
>\- Nathan Eror, Solutions Architect

### Standard Architecture must be flexible
The beauty of an SA is its ability to be flexible–it should never get stale and should always be challenged. ChaiOne's SA has a revision cycle of 1 year, and we constantly have open discussions about what should be added or changed. As mentioned above, the only approved architectures that can currently be used inside of our mobile apps is MVC, so I have recently been building a compelling argument for adding the [Unidirectional Dataflow Architecture](https://news.realm.io/news/benji-encz-unidirectional-data-flow-swift/), (or as you might know it, [Redux](http://redux.js.org/), to our list of approved architectures. This was fun as a developer because it allowed me to challenge the current standard, which I also supported, while comparing the pros and cons of both architectures and considering how adding Redux would improve our development process.
 

>"I like the fact that the Standard Architecture is flexible and open to change. But on the flip side of that coin, it draws a line that prevents us from switching to the next shiny thing. Yes, we will be able to play and develop on new technologies, but it would need to be proven before incorporating it into our Standard Architecture."
>
> \- Chris Mason, Solutions Architect

### ChaiOne's Standard Architecture: Development Process 

To show you the power of having an SA, I'm going to go over a small subsection of our very own SA, our **development process**. Let's pretend today is your first day working at ChaiOne, and along with getting a coffee mug and an awesome shirt, we share our Standard Architecture with you. No matter what level of experience you have as a developer or what your technology stack is, you will be able to read our development process and instantly get ramped up on how we do things here.

#### ChaiOne's Development Process
We've laid down a road map for developers to follow when creating a new feature for an application. A thing to note, we use [Gitflow](https://www.atlassian.com/git/tutorials/comparing-workflows#gitflow-workflow) as our branching strategy which becomes important once we start talking about Continuous Integration & Deployment (CI/CD).

*Development flow*  

![]({{site.baseUrl}}/assets/img/standard-architecture/EngineeringProcess-FeatureFlow.png){: .align-center}
<!-- <img src="img/EngineeringProcess-FeatureFlow.png" alt="Drawing" style="height: 500px;"/> -->

Once the code has been submitted for review, we allow branch names(`feature-*`, `fix-*`) to trigger certain workflows from within our CI/CD. Below is a high-level overview of our Continuous Integration Workflow.

*Continuous Integration workflow*  

![]({{site.baseUrl}}/assets/img/standard-architecture/continous_integration.png){: .align-center}
<!-- <img src="img/continous_integration.png" alt="Drawing" style="height: 500px;"/> -->

Having the CI run unit tests, static analysis, and linters acts as our first round of Code Reviews. This prevents other developers from having to immediately stop what they are doing in order to start a Code Review.

Next, we defined what is our **Deployment flow**, which should be ran on a set schedule. What we do inside of our Deployment flow varies depending on the stack. For example, in iOS we use [Fastlane](https://fastlane.tools/) to release new builds, update stories, generate documentation, etc.

*Continuous Deployment workflow*  

![]({{site.baseUrl}}/assets/img/standard-architecture/continous_deployment.png){: .align-center}
<!-- <img src="img/continous_deployment.png" alt="Drawing" style="height: 500px;"/> -->


As you see, having all of this documented provides our team with a sophisticated system that is consistent across all stacks. Yes, it is possible to be able to accomplish such a flow without an SA, but it becomes a lot to handle when trying to ramp up new developers or trying to understand how introducing a change to the flow will affect the system as a whole.


#### Other Standardization at ChaiOne


Standardizing project structure per technology stack promotes consistency across all projects, allowing developers to learn one less thing when familiarizing themselves with a new codebase. This may not be needed with projects built with Ruby on Rails since Rails follows [Convention over Configuration](https://en.wikipedia.org/wiki/Convention_over_configuration), but the same cannot be said for projects built with NodeJS, whose [entry point could differ between applications](https://stackoverflow.com/questions/36002413/conventions-for-app-js-index-js-and-server-js-in-node-js).


Another very important reason to standardize a project structure is when integrating CI/CD. This was especially helpful when adding CI/CD to our iOS projects since the CI/CD needed to know the path to the file `project.xcodeproj`. We even took it one step further by standardizing how we named [provisioning profiles](https://stackoverflow.com/questions/3362652/what-is-a-provisioning-profile-used-for-when-developing-iphone-applications), app IDs, configurations, etc. This allowed us to make all our [fastlane scripts](https://fastlane.tools/) generic and reusable by simply defining project settings in our code.

```ruby
def settings
    {
        :ipa_path => './build/___PROJECTNAME___-ios.ipa',
        :scheme => 'ChaiOne-Release', #  ChaiOne-Debug, Client
        :app_id => 'com.chaione.CLIENT_PROJECT-ios', 
        :xcode_project => '/src/___PROJECTNAME___-ios.xcodeproj',
        :xcode_workspace => '/src/___PROJECTNAME___-ios.xcworkspace',
    }
end
``` 

## Why should your team implement a Standard Architecture

I feel our very own Standard Architecture documentation says it best:

>#### Expandability
>The Standard Architecture should be designed to allow for product development, which means the ability to add new features in an iterative multi-release fashion. The Standard Architecture should contain the navigation patterns and code modularity to allow for growing applications easily over time.

>#### Flexibility
>Not all clients are the same, nor will their projects be the same. The Standard Architecture should be a strong foundation for any project we undertake, but be flexible enough to allow for those differences. This involves a strong use of modular code and dependency injection.

>#### Reusability
>The Standard Architecture will be the basis of every project that we undertake, but it would be useless if for each project we have to re-architect or re-write features. The Standard Architecture should identify the key pieces of all applications and provide reusable components for those pieces. Depending on the component, this could be a design pattern or a code module.

>#### Efficiency
>Adopting the Standard Architecture should accelerate the mundane pieces of app development so that we can focus on the interesting problems presented by a client’s application. If a component or pattern slows development down, it should be re-architected or discarded.

>#### Testability
>The Standard Architecture should be easy to test both in unit testing by developers and in testing by Quality Engineering.

I could not have said it better. Since implementing our standard architecture we have drastically reduced the amount of time we have spent [bikeshedding](https://en.wiktionary.org/wiki/bikeshedding), improved collaboration within our team and across departments, and improved consistency across all our applications.


>"Developers can now talk about what's unique about the project versus having to explain the portions that have already been standardized on. So now it is much easier to talk about specific nuances of your problem."
>
>\- Travis Fischer, Director of Engineering

### Sales

Within ChaiOne, the impact of a Standard Architecture has gone beyond just the engineering department. Other departments, such as Sales, have reaped the benefits as well; our SA has helped us establish credibility with our clients' IT and helped simplify the technical portion of our sales deck. An SA has helped Sales communicate the value of our team to our clients.

### Improved Estimates

If your team is like ours and builds applications for clients, this point is especially relevant. Since implementing an SA, the estimates that we give clients have become much more accurate. For example, we have standardized our backend around using [JWT](https://jwt.io/introduction/) to handle authentication for all our applications. By so doing, we know exactly how long it should take to build out each feature and how much it should cost.

But what if our client requires other forms of authentication, such as authenticating across their Active Directory?

By having an SA in place, we know exactly what parts of our backend architecture would need to change and how that affects estimates. 


## Conclusion

Though ChaiOne's description of a Standard Architecture may not apply to everyone, I encourage you to start a discussion with your team over what could and should be standardized. Since it would be created by the team, I feel confident that you will start to see improvements with team collaboration just as we did. At ChaiOne, we try to hire the best, and we can't afford for our team to feel like "cogs in a machine". No matter their experience level, we like for our developers to feel heard, and what better way than to give them the ability to affect core processes in their own workplace.
