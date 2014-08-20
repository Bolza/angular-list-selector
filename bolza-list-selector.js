'use strict';
angular.module('bolza.listSelector', [])
.directive('listSelector', function ($swipe) {
	var list = [];
	var currentIndex = -1;
	var currentElement;
	var scope;
	var mainWidth = 0, mainHeight = 0;
	var container, box, arrowBack, arrowForward;
	var backDisabled = false, forwardDisabled = false;
	var childData = {}, 
		movedata = {start:0, end:0, current:0};
		
	function selectByIndex(index) {
		if (index < 0 || index > list.length-1) return;
		if (currentElement && index != currentIndex) currentElement.classList.remove('selected');
		currentIndex = index;
		currentElement = container.children[index]; // if forward
		currentElement.classList.add('selected');
		scope.$emit('listSelectorChange', {selectorScope: scope, selectorRoot: container, selectedItem: list[index], selectedElement: currentElement});
	}
	function scrollToPosition(pos) {
		pos = movedata.end + pos;
		pos = checkBoundaries(pos);
	    container.style.left = pos+'px';
	    return pos;
	}

	function checkBoundaries(pos) {
		var limit = (mainWidth - box.offsetWidth) * -1;
		if (pos >= 0) { 
			pos = 0; arrowBack.classList.add('disabled');
			backDisabled = true;
		}
		else if (pos < limit) {
			pos = limit; arrowForward.classList.add('disabled');
			forwardDisabled = true;
		}
		else {
			if (backDisabled) { arrowBack.classList.remove('disabled'); backDisabled = false; }
			if (forwardDisabled) {arrowForward.classList.remove('disabled'); forwardDisabled = false;}
		}
		return pos;
	}

	return {
		restrict: 'AE',
		transclude: true,
		scope: {
			name: '@',
			startIndex: '@',
			list: '=',
			selectionChange: '&',
			orientation: '@',
			arrowsStep: '@',
			itemWidth: '@',
			itemHeight: '@'
		},
		template: '<div class="icon forward" ng-click="stepForward()"></div>' +'<div class="icon back" ng-click="stepBack()"></div>' +'<div class="lcenterbox"><div class="lwrapper"><list-selector-item class="lselector-item" ng-click="changeSelection(this)" ng-repeat="item in list" ng-transclude></list-selector-item></div></div>',
		compile: function(element, attrs) {

			container = element[0].querySelector('.lwrapper');
			box = element[0].querySelector('.lcenterbox');
			arrowBack = element[0].querySelector('.back');
			arrowForward = element[0].querySelector('.forward');

			$swipe.bind(angular.element(container), {
				start:function(pos) {
					movedata.start = pos.x;
					movedata.startTime = Date.now();
				},
				move: function(pos) {
					var delta = pos.x - movedata.start;
					movedata.current = scrollToPosition(delta);
				},
				end: function(pos) {
					movedata.end = movedata.current;
					movedata.endTime = Date.now();
					/*
					var delta = Math.abs(movedata.end - movedata.start); //px
					var elapsed = movedata.endTime - movedata.startTime; //ms
					var velocity = delta / elapsed; // px/ms

					for (var i = 0; i < 50; i++) {
						movedata.end = movedata.current = scrollToPosition(movedata.current + velocity);
					}
					console.log(delta,elapsed,velocity, movedata); 
					*/
				} 
			} );
		},
		controller: function($scope, $element, $attrs) {
			scope = $scope;
			var orientation = scope.orientation == 'vertical' ? 'vertical' : 'horizontal';
			if (!$scope.itemWidth) $scope.itemWidth = 'auto';
			if (!$scope.itemHeight) $scope.itemHeight  = 'auto';

			$scope.$watch('list', function() {
				checkBoundaries(0)
				if ($scope.list && $scope.list.length) list = $scope.list;
			});

			// stucox GIST: https://gist.github.com/stucox/5231211
			var MutationObserver = (function () {
				var prefixes = ['WebKit', 'Moz', 'O', 'Ms', ''];
				for(var i=0; i < prefixes.length; i++) {
					if(prefixes[i] + 'MutationObserver' in window) {
					return window[prefixes[i] + 'MutationObserver'];
					}
				}
				return false;
			}());
			
			if (!MutationObserver) { 
				container.addEventListener("DOMNodeInserted", function (ev) {
					if (ev.target.nodeName == 'LIST-SELECTOR-ITEM') {
						var child = angular.element(ev.target);
						resize(child);
					}
				}, false);
			}
			else {
				var observer = new MutationObserver(function(mutations) {
					//console.log('MutationObserver',mutations, $scope); 
					for (var i = 0, mute; mute = mutations[i]; i++) {
						var child = angular.element(mute.addedNodes[0]);
						resize(child);
					};
				});
				var config = { attributes: false, childList: true, characterData: false };
				observer.observe(container, config);	
			}

			var resize = function(elem) {
				if ($scope.startIndex && $scope.startIndex == $scope.$index) selectByIndex(parseInt($scope.startIndex));
				childData.width = parseInt($scope.itemWidth) || elem.width();
				childData.height = parseInt($scope.itemHeight) || elem.height();
				mainWidth += childData.width;
				mainHeight += childData.height;
				if (orientation == 'horizontal') container.style.width = mainWidth+'px';
				if (orientation == 'vertical') container.style.height = mainHeight+'px';
				//console.log(childData, mainWidth);
			}
		
			$scope.changeSelection = function(item) {
				selectByIndex(item.$index);
				$scope.selectionChange(item);
			}

			$scope.stepForward = function() {	
				var step = parseInt($scope.arrowsStep) || 2;
				var pos = (childData.width * step) * -1;
				movedata.end = scrollToPosition(pos);
			}

			$scope.stepBack = function() {
				var step = parseInt($scope.arrowsStep) || 2;
				var pos = childData.width * step;			
				movedata.end = scrollToPosition(pos);
			}

		}
	}
})
.directive('listSelectorItem', function () {
	return {
		restrict: 'AE',
		scope: {},
		link: function(scope, elem) {
			scope.height = elem[0].offsetHeight;
			scope.width = elem[0].offsetWidth;
		}
    
	}
});