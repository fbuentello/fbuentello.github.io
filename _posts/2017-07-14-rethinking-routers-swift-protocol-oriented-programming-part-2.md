---
category : swift
title: "Rethinking Routers in Swift using Protocol Oriented Programming — Part 2"
tagline: "Supporting tagline"
tags: 
  - swift
---

## Introduction
In this blog post, we will be adding the capability to add nested routers on top of part 1 of **Rethinking Routes in Swift using Protocol Oriented Programming**. If you have not read it (Add link here), please check it out before reading this post.

## Nested Routes

Let's add a few more properties to the `Routable` Protocol and a few methods inside of `RoutesProtocol.swift` that will allow us to do nested routes.

```swift
// RoutesProtocol.swift
...

protocol Routable {
    typealias Parameters = [String : Any]
    var route: String {get set}
    var urlParams: String! {get set} // Just add this new variable
    init()
}

extension Routable {

    init(_ _arg: String = "") {
        self.init()
        urlParams = _arg
    }

    /// Allows a route to become a nested route
    func nestedRoute(args: String, child: RequestConverterProtocol) -> RequestConverter {

        return RequestConverter(
            method: child.method,
            route: "\(self.route)/\(args)/\(child.route)",
            parameters: child.parameters
        )
    }

    /// Generate the URL string for generated nested routes
    func nestedRouteURL(parent: Routable, child: Routable) -> String {
        let nestedRoute = "\(parent.route)/\(parent.urlParams!)/" + child.route
        return nestedRoute
    }
}

...
```

Now let's update our `Router.swift` file by adding our new variable `urlParams` to our already existing routes.

```swift
// Routes.swift

...

struct User: Readable, Creatable, Deletable, Updatable {
    var route: String = "users"
    var urlParams: String!
}

struct Status: Readable, Creatable, Deletable {
    var route: String = "statuses"
    var urlParams: String!
}
    
...
```

Since we're working with reusable components, our nested routes can look a few different ways. I'm going to keep everything separated first, then I'm going to show you the final implementation. Feel free to make your own style.

Inside of `Router.swift` create an extension for our `User` route:

```swift
extension Router.User {

    func getStatus(params: String) -> RequestConverterProtocol {
        return nestedRoute(args: urlParams, child: Router.Status.get(params: params))
    }
}
```


Finally, if we move over to our `viewDidLoad` method inside of `ViewController.swift`, here's the updated code:

```swift
...

Alamofire.request(Router.User("2").getStatus(params: "2")).validate().responseJSON { response in
    switch response.result {
    case .success:
        debugPrint(response) // https://private-85a46-routable.apiary-mock.com/users/2/statuses/2
    case .failure(let error):
        print(error)
    }
}

...
```


You should expect the following: 
![]({{site.baseUrl}}/assets/img/rethinking-routers/images_2_nested_Routable_url.png){: .align-center}

Now that's pretty awesome! That makes our Router's look so much cleaner!

Let's resync, here's the git command if you need to catch up:

```bash
git checkout chapter_3_finishing
```


So let's wrap up this post with the final implementation of our Router. Instead of implementing `getStatus(_:)` for every route that contains statuses, we're better off making them into protocols. Oh and remember, our fake API doesn't allow us to `.update` statuses, so we don't implement `updateStatus(_:)`.



```swift
// Router.swift, Final Implementation...
...

protocol hasStatuses {}
extension hasStatuses where Self: Routable {
    func status(params: String) -> Router.Status {
        var child = Router.Status(params)
        child.route = nestedRouteURL(parent: self, child: child)
        return child
    }

    func getStatus(params: String) -> RequestConverterProtocol {
        return nestedRoute(args: urlParams, child: Router.Status.get(params: params))
    }

    func createStatus(parameters: Parameters) -> RequestConverterProtocol {
        return nestedRoute(args: urlParams, child: Router.Status.create(parameters: parameters))
    }

    func deleteStatus(params: String) -> RequestConverterProtocol {
        return nestedRoute(args: urlParams, child: Router.Status.delete(params: params))
    }
}

...
```


Now in the `User` route we simply have to conform to the `hasStatuses` protocol and now our `User` route can always get statuses no matter how nested it is:


```swift
// Router.swift, Final Implementation...
...

    struct User: Readable, Creatable, Updateable, 
        hasStatuses {
        var route: String = "users"
        var urlParams: String!
    }
    
...
```


Now we can run the following commands and expect that they will work:

```swift
let getUserStatus = Router.User("initFabian").getStatus(params: "2")
let createUserStatus = Router.User("initFabian").createStatus(parameters: ["title":"fabians post"])
let deleteUserStatus = Router.User("initFabian").deleteStatus(params: "2")
```



By turning our nested routes into protocols, we can be very expressive by saying "This route has a child route." We can really get crazy... check this out.

```swift
//Router.swift, Final Implementation file
struct Router: URLRouter {
    static var basePath: String {
        return "https://private-85a46-routable.apiary-mock.com/"
    }

    struct User: Readable, Creatable, Updateable,
        hasStatuses, hasPictures, hasPosts { // <- Here
        var route: String = "users"
        var urlParams: String!
    }

    struct Status: Readable, Creatable, Deletable,
        hasComments {
        var route: String = "statuses"
        var urlParams: String!
    }

    struct Picture: Readable, Creatable, Deletable, Updateable,
        hasComments {
        var route: String = "pictures"
        var urlParams: String!
    }

    struct Comment: Readable, Creatable, Deletable, Updateable,
        hasUsers {
        var route: String = "comments"
        var urlParams: String!
    }

    struct Post: Readable, Creatable, Deletable, Updateable,
        hasComments {
        var route: String = "posts"
        var urlParams: String!
    }
}

...
```



Here's the [gist](https://gist.github.com/initFabian/f14c663cd58d7d58f6fa9f48ad67ae2c) for the entire `Router.swift` file. It contains all the protocols such as `hasComments`, `hasUsers`, etc. 

With this update, let's move to our `viewDidLoad(_:)` and make a few changes. By the way, these routes don't exist on our API, I just wanted to show how we can build out these routes dynamically, so don't be surprised if the API returns a `404` for some of these endpoints.

```swift
//ViewController.swift

class ViewController: UIViewController {

    override func viewDidLoad() {
        
        ...

        _ = Router.Post("54").getComment(params: "43")                                  // posts/54/comments/43
        _ = Router.User("initFabian").getStatus(params: "2")                            // users/initFabian/statuses/2
        _ = Router.User("initFabian").picture(params: "2").getComment(params: "3")      // users/initFabian/pictures/2/comments/3


        let crazyNested = Router.User("initFabian")
            .status(params: "3")
            .comment(params: "32352")
            .getUser(params: "fakeUser")

        print(crazyNested)
        // users/initFabian/statuses/3/comments/32352/users/fakeUser

        let extremelyNested = Router.User("initFabian")
            .picture(params: "3")
            .comment(params: "507f191e810c19729de860ea")
            .user(params: "43")
            .status(params: "firstStatus")
            .comment(params: "27")
            .user(params: "63")
            .post(params: "4d6e5acebcd1b3fac9000002")
            .comment(params: "82")
            .user(params: "21")
            .getStatus(params: "1")

        print(extremelyNested)
        // users/initFabian/pictures/3/comments/507f191e810c19729de860ea/users/43/statuses/firstStatus/comments/27/users/63/posts/4d6e5acebcd1b3fac9000002/comments/82/users/21/statuses/1
         ...
    }
}
```

## Conclusion

The purpose of this post was to contain a file that can not only communicate what our API paths are, but to also tell us the relationship between our models. I know we could take this one step further and tie in our models directly into these routes, but that's beyond this blog post. Well, there you go! I hope you found this post useful and learned something from it. I definitely had a lot of fun building this and look forward to implementing it into already-existing projects. If you have any questions please reach out to me via twitter [@initFabian](https://twitter.com/initFabian). 

_Happy Hacking!_