---
category : swift
title: "Using Enum Dictionaries as Arguments"
tagline: "Supporting tagline"
tags: 
  - swift
---

# Using Enum Dictionaries as Arguments

## Intro and Problem

I learned a lot of things while developing [Cely](https://github.com/chaione/cely), but one of the coolest things was looking at `enum` dictionaries as a way to pass in arguments as an alternative to having optional parameters with default values. To illustrate what I'm talking about, check out this example:

```swift
enum RequestOptions {
    case httpMethod
    case encoding
    case body
    ...
}

// not including completion block for example
func request(_ apiEndpoint: String, options: [RequestOptions: Any?]) {
    let httpMethod = options[.httpMethod] as? HTTPMethod ?? .get
    let body = options[.body] as? [String: Any?] ?? [:]
    ...
}



...
// usage
request("/example", options: [
    .httpMethod: .post,
    .encoding: JSONEncoding.default,
    .body: [
        "username": "initFabian"
    ]
])
...
```

I came across this problem while writing Cely's `setup(_:)` method. This method gets called inside of `AppDelegate.swift` and needs to be short and simple. Here are the optional parameters for `setup(_:)` that would've made my method extremely lengthy had they not be placed in an `enum` dictionary:

  * Ability to use a customized login screen(via storyboard).
  * Ability to use a storyboard other than `Main.storyboard` as an entry point to the application.
  * If using Cely's default login screen, allow completion block once the login button is pressed.
  * If using Cely's default login screen, allow the user to style the login screen.
  * Allow the use of a different storage to store credentials, i.e.: plists or documents. 


## Current Solution

That's a pretty heavy list huh? If we were to strictly follow swift practices, we would see a method declaration as such:

```swift
// Removed generic code to prevent confusion
 
func setup(with window: UIWindow?, forModel: CelyUser, requiredProperties:[RawRepresentable] = [], storage: CelyStorage? = nil, homeStoryboard: UIStoryboard? = nil, loginStoryboard: UIStoryboard? = nil, loginCompletionBlock: ((String,String) -> Void)? = nil, loginStyle: CelyStyle? = nil) {

}
```
I don't know about you, but this method looks scary. Not only is there a lot of parameters that I'm not sure I need, but this method is very difficult to read.

## Solutions in other Languages

Since I wanted to keep all of Cely's setup enclosed in one method call, my options were very limited. **I especially didn't want to do the following**:

```swift
let cely = Cely.setup(...)
cely.loginStoryboard = ...
cely.homeStoryboard = ...
cely.storage = ...
...
```

I decided to explore alternative, more creative ways to solve my problem. I wanted to give users options when using Cely, but most importantly, I wanted to be able to add new options easily without breaking/renaming methods. So I thought about how we do this in JavaScript, more specifically, a URL request in JavaScript. If you look at most popular JavaScript Networking Libraries, you'll see the majority of them set options inside of a dictionary:

```javascript
// Simple GET request example using Angular:
$http({
  method: 'POST',
  url: '/someUrl',
  headers: {
   'Content-Type': 'json/application'
  }
}).then(function(response) {
    ...
});

```

## My Solution

I definitely wanted the user to add options using a dictionary, but I didn't want the user to be using strings as keys. That's when the thought of `enums` came to mind since it would throw errors if typos were made. This allowed the user to set the options they needed without bloating the declaration for `setup(_:)`. So I created an `enum` called `CelyOptions` with the following cases:

```swift
public enum CelyOptions {
    case storage
    case homeStoryboard
    case loginStoryboard
    case loginCompletionBlock
    case loginStyle
}
```

Which would make the declaration of `setup(_:)` and it’s usage look as such:

```swift
// Removed generic code to prevent confusion

func setup(with window: UIWindow?, forModel: CelyUser, requiredProperties:[RawRepresentable] = [], withOptions options: [CelyOptions : Any?]? = [:]) {
...
}

...

// Usage

Cely.setup(with: window!, forModel: User.ref, requiredProperties: [.token], withOptions: [
    .loginStoryboard: UIStoryboard(name: "MyCustomLogin", bundle: nil),
    .homeStoryboard: UIStoryboard(name: "NonMain", bundle: nil)
])
```

_Checkout Cely's [documentation](https://github.com/chaione/Cely#celyoptions) for more examples_

## Conclusion
I understand this approach is not for every use case, but when used appropriately, it can be quite powerful. As I'm reviewing old code, I'm seeing where this pattern would be useful. I feel things such as Network calls, components(like custom segmented controllers), and especially generic `UITableView` datasource/delegate classes(will be a post for the future) would highly benefit from this pattern. If you ever find yourself using this pattern, or if this pattern sparks an idea, please reach out!


