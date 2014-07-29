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
		template: '<div class="icon back" ng-click="stepBack()"></div><div class="lcenterbox"><div class="lwrapper"><div class="lselector-item" ng-click="changeSelection(this)" ng-init="init(this)" ng-repeat="item in list" ng-transclude></div></div></div><div class="icon forward" ng-click="stepForward()"></div>',
		compile: function(element, attrs) {
			container = element[0].querySelector('.lwrapper');
			box = element[0].querySelector('.lcenterbox');
			arrowBack = element[0].querySelector('.back');
			arrowForward = element[0].querySelector('.forward');

			$swipe.bind(angular.element(container), {
				start:function(pos) {
					movedata.start = pos.x;
				},
				move: function(pos) {
					var delta = pos.x - movedata.start;
					movedata.current = scrollToPosition(delta);
				},
				end: function(pos) {
					movedata.end = movedata.current;
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

			$scope.init = function(item) {
				if ($scope.startIndex && $scope.startIndex == item.$index) selectByIndex(parseInt($scope.startIndex));
				var elem = container.children[item.$index];	
				childData.width = parseInt($scope.itemWidth) || elem.offsetWidth;
				childData.height = parseInt($scope.itemHeight) || elem.offsetHeight;
				elem.style.width = $scope.itemWidth;
				elem.style.height = $scope.itemHeight;
				mainWidth += childData.width;
				mainHeight += childData.height;
				if (orientation == 'horizontal') container.style.width = mainWidth+'px';
				if (orientation == 'vertical') container.style.height = mainHeight+'px';
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
});