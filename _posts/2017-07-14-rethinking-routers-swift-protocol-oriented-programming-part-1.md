---
category : swift
title: "Rethinking Routers in Swift using Protocol Oriented Programming — Part 1"
tagline: "Supporting tagline"
tags: 
  - swift
---

With any project, whether it's written in Swift, Objective-C, python, Ruby, etc. A big plus for all developers is to quickly learn about as much of the project without spending too much time going through each file.

I feel a router does just that, it should act as a roadmap to an application. It shouldn't give you every detail of an application, but give you enough information for you to infer the following:

- API endpoints the application uses
- What models exist in an application 
- What HTTP method each model has. Example: `.get`, `.post`

**Setup project**

I built a basic application that will make a network call using `Alamofire`. To focus strictly on the Router portion of the application, we won't implement any models. 

We will be making calls to a mock server I made using [Apiary](https://apiary.io/), you should check it out if you haven't already.

Let's clone the repo, so we can start building out our router.

```bash
git clone https://github.com/chaione/RoutableApp
```
Before building a router using protocols we need to build our router using today's common approaches.

## Building Router using Alamofire Router


To follow along with this tutorial, run the following command:

```bash
git checkout chapter_1_starting
```

So we can actually make real API calls, we're going to be using [Apiary](https://apiary.io/) to host a mock server, you should check it out if you haven't already. 

In my first attempt in building a Router, I was using [Alamofire's Router](https://github.com/Alamofire/Alamofire#crud--authorization).
To get a better idea of how this would all work, let's code. Let's create a `Router.swift` file. 

```swift

// Router.swift 

import Alamofire

enum Router: URLRequestConvertible {
    case readUsers
    case createUser(parameters: Parameters)
    case readUser(username: String)
    case updateUser(username: String, parameters: Parameters)
    case destroyUser(username: String)

    // Using a fake URL to get data
    static let baseURLString = "https://private-85a46-routable.apiary-mock.com"

    var method: HTTPMethod {
        switch self {
        case .readUsers:
            return .get
        case .createUser:
            return .post
        case .readUser:
            return .get
        case .updateUser:
            return .put
        case .destroyUser:
            return .delete
        }
    }

    var path: String {
        switch self {
        case .readUsers:
            return "/users"
        case .createUser:
            return "/users"
        case .readUser(let username):
            return "/users/\(username)"
        case .updateUser(let username, _):
            return "/users/\(username)"
        case .destroyUser(let username):
            return "/users/\(username)"
        }
    }

    // MARK: URLRequestConvertible

    func asURLRequest() throws -> URLRequest {
        let url = try Router.baseURLString.asURL()

        var urlRequest = URLRequest(url: url.appendingPathComponent(path))
        urlRequest.httpMethod = method.rawValue

        switch self {
        case .createUser(let parameters):
            urlRequest = try URLEncoding.default.encode(urlRequest, with: parameters)
        case .updateUser(_, let parameters):
            urlRequest = try URLEncoding.default.encode(urlRequest, with: parameters)
        default:
            break
        }
        
        return urlRequest
    }
}
```

And here's the ViewController code that would implement our `Router`

```swift

// ViewController.swift

import Alamofire

class ViewController: UIViewController {

    override func viewDidLoad() {
        super.viewDidLoad()
        
        Alamofire.request(Router.readUsers).validate().responseJSON { response in
            switch response.result {
            case .success:
                print("Validation Successful")
                debugPrint(response)
            case .failure(let error):
                print(error)
            }
        }
    }
}
```

You should expect the following: 
![]({{site.baseUrl}}/assets/img/rethinking-routers/images_1_AlamofireRequest.png){: .align-center}

Hmmmm.... It's very clean and works very well! This looks really promising! Remember, we're making a simple social network app, so let's add another model.

_I am putting this code in a gist since it's not the desired result._ 

[Alamofire Router with multiple models](https://gist.github.com/initFabian/ecb9a26841391a55bcb4a0de60338a85)

Oh No! No! No! I'm not loving this solution at all. This file seems to grow vertically extremely fast and we haven't even gotten to the relationships between the routes... need a new solution. Let's check out a popular library [Moya](https://github.com/Moya/Moya).

### Moya

After looking into Moya's documentation and finding their [basic example code](https://github.com/Moya/Moya/blob/master/docs/Examples/Basic.md), it seems like we'll run into the same "growing vertical" issue. Moya definitely provides a lot of solutions, just not the solution for my problem. It definitely bums me out because I was very excited to use Moya. 


### Routers in other Languages 

Using my experience in backend development, I decided to revisit some old Ruby-on-Rails projects to get some ideas on how a Router should look. If you open a Rails project inside of a terminal, and run the command `rake routes`, the following will be printed:

```ruby
#             Prefix Verb   URI Pattern                                     Controller#Action
#            v1_post GET    /v1/posts/:id(.:format)                         v1/posts#show
#                    POST   /v1/posts/:id(.:format)                         v1/posts#create
#                    PUT    /v1/posts/:id(.:format)                         v1/posts#update
#                    DELETE /v1/posts/:id(.:format)                         v1/posts#destroy

#         v1_comment GET    /v1/posts/:post_id/comments/:id(.:format)       v1/comments#show
#                    POST   /v1/posts/:post_id/comments/:id(.:format)       v1/comments#create
#                    PUT    /v1/posts/:post_id/comments/:id(.:format)       v1/comments#update
#                    DELETE /v1/posts/:post_id/comments/:id(.:format)       v1/comments#destroy

...
```

As you can see, this is doing a great job describing the application using very little information. This definitely seems like the way to go. Let's see how we would build something like this in Swift.

## Build Router using Protocol Oriented Programming

So what exactly am I looking for then? What would be cool is if I can declare a route and easily communicate, "Hey, this route can do the following: `.get`, `.post`, `.delete`, but it can't do `.put`".

Anyways, I should declare the route once and not have to repeat all the different HTTP Method mutations, aka, **not have a huge switch statement**. This will be hard to do using enums. Instead, let's use structs and protocols! Let's start designing this. Here's some pseudo code to help illustrate what I'm shooting for:

```swift
// Router.swift 

// user route: .get, .post, .put, .delete
// status route: .get, .post, .delete

...
```
Now to bring this to life. To prevent a massive `Routes.swift` file, create a `RoutesProtocol.swift`.

Inside `RoutesProtocol.swift`, let's import `Alamofire` and create a protocol called `URLRouter` that will contain our base URL.

```swift
// RoutesProtocol.swift
import Alamofire

/// Protocol that allows us to implement a base URL for our application
protocol URLRouter {
    static var basePath: String { get }
}
```

Next, we need to create additional protocols that will handle `.get`, `.post`, `.put`, `.delete`.

```swift
protocol Routable {
    typealias Parameters = [String : Any]
    var route: String {get set}
    init()
}

protocol Readable: Routable {}

protocol Creatable: Routable {}

protocol Updatable: Routable {}

protocol Deletable: Routable {}
```

The above snippet says, "If we have a route that conforms to either `Readable`, `Creatable`, `Updatable`, `Deletable`, you need to declare a `route` variable and implement a `init` method."

Since I don't want our simple routes to have to implement methods, let's define all our methods in protocol extensions.

```swift
//RoutesProtocol.swift

...

extension Routable {

    /// Create instance of Object that conforms to Routable
    init() {
        self.init()
    }
}
```

`Readable` method.

```swift
//RoutesProtocol.swift

...

extension Readable where Self: Routable {

    static func get(params: String) -> RequestConverter {
        let temp = Self.init()
        let route = "\(temp.route)/\(params)"
        return RequestConverter(method: .get, route: route)
    }
}
```

`Creatable` method.

```swift
//RoutesProtocol.swift

...

extension Creatable where Self: Routable {

    static func create(parameters: Parameters) -> RequestConverter {
        let temp = Self.init()
        let route = "\(temp.route)"
        return RequestConverter(method: .post, route: route)
    }
}
```

`Updatable` method.

```swift
//RoutesProtocol.swift

...

extension Updatable where Self: Routable {

    static func update(params: String, parameters: Parameters) -> RequestConverter {
        let temp = Self.init()
        let route = "\(temp.route)/\(params)"
        return RequestConverter(method: .put, route: route, parameters: parameters)
    }
}
```

`Deletable` method.

```swift
//RoutesProtocol.swift

...

extension Deletable where Self: Routable {

    static func delete(params: String) -> RequestConverter {
        let temp = Self.init()
        let route = "\(temp.route)/\(params)"
        return RequestConverter(method: .delete, route: route)
    }
}
```

There's still one more thing we need to do to `RouterProtocol.swift`. We have our protocols, but they aren't playing well with `Alamofire`. Since `Alamofire.request(_:)` is expecting an object that conforms to `URLRequestConvertible`, let's create a converter that will allow just that.

Append the following to `RouterProtocol.swift `:

```swift
...

protocol RequestConverterProtocol: URLRequestConvertible {
    var method: HTTPMethod {get set}
    var route: String {get set}
    var parameters: Parameters {get set}
}

/// Converter object that will allow us to play nicely with Alamofire
struct RequestConverter: RequestConverterProtocol {

    var method: HTTPMethod
    var route: String
    var parameters: Parameters = [:]

    init(method: HTTPMethod, route: String, parameters: Parameters = [:]) {
        self.method = method
        self.route = route
        self.parameters = parameters
    }

    func asURLRequest() throws -> URLRequest {

        let url = try Router.basePath.asURL()
        let urlRequest = URLRequest(url: url.appendingPathComponent(route))

        return try URLEncoding.default.encode(urlRequest, with: parameters)
    }
}
```

I created a gist with the [complete version](https://gist.github.com/initFabian/cb31254854cf4912ad3a54655b7cf281) of `RouterProtocol.swift` that contains all the code along with comments.

Awesome! now let's get started on building our router! There won't be any comments since that was the point of our protocols, to make our code more expressive. 

Using these protocols, our simple router can look like this:

```swift
//Router.swift

struct Router: URLRouter {
    static var basePath: String {
        return "https://private-85a46-routable.apiary-mock.com/"
    }

    struct User: Readable, Creatable, Deletable, Updatable {
        var route: String = "users"
    }

    struct Status: Readable, Creatable, Deletable {
        var route: String = "statuses"
    }
}
```

**Doesn't that look beautiful?!** 

This Router easily communicates that there are 2 routes, and what HTTP methods you can perform on each.

Now how do we use this awesome router?!

```swift
// ViewController.swift
class ViewController: UIViewController {

    override func viewDidLoad() {
        super.viewDidLoad()

        Alamofire.request(Router.User.get(params: "2")).validate().responseJSON { response in
            switch response.result {
            case .success:
                print("Validation Successful")
                debugPrint(response)
            case .failure(let error):
                print(error)
            }
        }
    }
}
```

You should expect the following: 
![]({{site.baseUrl}}/assets/img/rethinking-routers/images_3_Routable_Request.png){: .align-center}


To sync back up with the tutorial, here's the git command to catch you back up:

```bash
git checkout chapter_2_finished
```

Before moving to the next chapter, you should try to execute the `.update(_:)` method on our `Status` route. Here's that snippet of code:

```swift
Router.Status.update(params: "3") // errors out
```

In order to fix this, simply add `.Updatable` to the `Status` route. :)


### Nested Routes
In order to keep these blog post relatively small, we'll make a separate post for nested routes. We'll be discussing how to create a router to handle URL endpoints such as:

    
```ruby
/posts/:post_id/comments/:comment_id 
```

Please checkout the new part 2 of this blog post, [Rethink Routes in Swift using Protocols Part 2]({{site.baseUrl}}/swift/rethinking-routers-swift-protocol-oriented-programming-part-2).

## Conclusion

Well, there you go! I hope you found this post useful and learned something from it. I definitely had a lot of fun building this and look forward to implementing `Routable` into already-existing projects. Please share if you liked this post so we can continue pushing out content via our Dev Blog. If you have any questions please reach out to me via twitter [@initFabian](https://twitter.com/initFabian). 

_Happy Hacking!_

