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
<script src="bower_components/angular-list-selector/angular-list-selector.js"></script>
```
And the standard css (recommended), that you will eventually edit later

```html
<link rel="stylesheet" href="bower_components/angular-list-selector/angular-list-selector.css" />
```

Add `bolzaListSelector` as a dependency for your app:

```javascript
angular.module('myApp', ['ngTouch', 'bolzaListSelector']);
```

Use the directive by specifying a `list-selector` attribute on an element.
```html
<list-selector start-index="0" list="myListArray" selection-change="changeme(item)" item-width="200px" item-height="100px" >
	<li class="h-item">{{item}}</li>
</list-selector>
```

## Usage

Inside the `list-selector` tag you can put any template fragment, it will be repeated for each loop object and represented by the `item` variable inside the loop. You can always refer to `item` inside `list-selector`.

###list
	@param {Array} list=[]
`list` must be an array containing primitives or objects, think of what you would pass to ngRepeat (because, you know, this IS actually an ngRepeat).

###start-index
	@param {Int} [startIndex=-1]
Defines the initially selected item index, starts from 0. 
-1 means nothing is selected at the beginning.

###selection-change
	@param {Function} [selectionChange]
If you pass a callback function to `selection-change` it will be called every time the list selection is changed, even the first time if `start-index` is defined. `item` is passed to the `selectionChange` callback.

###orientation
	@param {'horizontal'|'vertical'} [orientation='horizontal']
You can choose between `horizontal` and `vertical` layout for your list.

###arrows-step
	@param {Int} [arrowStep=2]
The directive automatically adds `back` and `forward` arrows to scroll the list if can't be contained in the current view. This property sets the number of elements beeing scrolled when clicking on an arrow.

###item-width 
	@param {String} [item-width]
This is the fixed width for a single list element. If not set it will automatically be 'auto' but in this case the content must be immediatly avaiable (eg: no remote images).

###item-height 
	@param {String} [item-height]
This is the fixed height for a single list element. If not set it will automatically be 'auto' but in this case the content must be immediatly avaiable (eg: no remote images)

###name
	@param {String} [name]
Name is actually only for application specific purposes, can be retrieved by the scope of the directive and from the events it fires.

## Events

###listSelectorChange
	@eventType emit
	@param {Scope} selectorScope
	@param {DOMElement} selectorRoot
	@param {Object} selectedItem
	@param {DOMElement} selectedElement


Fired each time the selection on the list changes, also fires at startup if `start-index` is set.


####Example

```javascript
$rootScope.$on('listSelectorChange', function(ev, data) {
	$scope.myDatas = MyResource.get(data.selectedItem);  
	selectDom(data.selectedElement);
});
```

