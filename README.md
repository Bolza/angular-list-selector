angular-list-selector
=====================

List Component for AngularJS, notyfies the selection and handles scrolling and slide, fully configurable and stylizable

## Version Numbers

bolzaListSelector follows [semantic versioning](http://semver.org/) and uses the following versioning scheme:

 * Versions starting with 0 (e.g. 0.1.0, 0.2.0, etc.) are for initial development, and the API is not stable
 * Versions with an even minor version (1.0.0, 1.4.0, 2.2.0, etc.) are stable releases
 * Versions with an odd minor version (1.1.0, 1.3.0, 2.1.0, etc.) are development releases



## Getting Started

Install with `bower`:

```shell
bower install angular-list-selector
```

Add a `<script>` to your `index.html`:

```html
<script src="/bower_components/angular-list-selector/angular-list-selector.js"></script>
```

And add `bolzaListSelector` as a dependency for your app:

```javascript
angular.module('myApp', ['ngTouch', 'bolzaListSelector']);
```

Use the directive by specifying a `list-selector` attribute on an element.

```html
	<list-selector class="horizontal" start-index="{{selectedIndex}}" list="alphabet" selection-change="change(item)" >
	 {{item}}
	</list-selector>
```

## Documentation

 
