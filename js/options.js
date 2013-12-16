angular.module("ShitBlock", ['ui.bootstrap']);

angular.module("ShitBlock").filter('array', function() {
	return function(items) {
	console.log(items);
		var filtered = [];
		angular.forEach(items, function(item) {
			filtered.push(item);
		});
		return filtered;
	};
});

angular.module("ShitBlock").controller("OptionsCtrl", function ($scope, $http) {

	$scope.shitUsers = {};
	$scope.newUser = {};
	$scope.editing = {};
	$scope.shitters = {};
	$scope.searchText = "";

	var config;

	chrome.storage.sync.get('ShitBlockConfig', function(result){
		config = (!isEmpty(result)) ? result.ShitBlockConfig : { blocked : {}, enabled : true };
		$scope.shitUsers = config.blocked;
		console.log($scope.shitUsers);
		$scope.$digest();
		if (config.enabled == true)
		{
			$('#enableShitBlock').bootstrapSwitch('setAnimated', false);
			$('#enableShitBlock').bootstrapSwitch('setState', true);
			setTimeout("$('#enableShitBlock').bootstrapSwitch('setAnimated', true)", 50);
		}
		$('#enableShitBlock').on('switch-change', function (e, data) {
			config.enabled = data.value;
			save();
		});
		$http.get("logins.json").then(function (res) {
			$scope.shitters = res.data;
			for (var key in config.blocked) {
				$scope.shitters.splice($scope.shitters.indexOf(config.blocked[key].login), 1);
			}
		}, function (err) {
			console.log(err);
		});
	});

	chrome.storage.onChanged.addListener(function(changes, namespace) {
		if (changes["ShitBlockConfig"])
		{
			if (changes["ShitBlockConfig"].newValue.enabled != config.enabled)
				$('#enableShitBlock').bootstrapSwitch('toggleState');
		}
	});

	function save() {
		config.blocked = $scope.shitUsers;
		chrome.storage.sync.set({'ShitBlockConfig': config });
	}

	$scope.add = function (newUser) {
		if (newUser && newUser.login && !$scope.shitUsers[newUser.login] && $scope.shitters.indexOf(newUser.login) != -1) {
			$scope.shitUsers[newUser.login] = newUser;
			$scope.shitters.splice($scope.shitters.indexOf(newUser.login), 1);
			$scope.newUser = {};
			save();
		}
	};

	$scope.delete = function (index) {
		$scope.shitters.push($scope.shitUsers[index].login);
		delete $scope.shitUsers[index];
		save();
	};

	$scope.formValid = function (newUser) {
		return (newUser && newUser.login && !($scope.shitUsers[newUser.login]) && $scope.shitters.indexOf(newUser.login) != -1);
	};

	$scope.editDescription = function (user) {
		$scope.editing[user.login] = true;
	};

	$scope.saveDescription = function (user) {
		$scope.editing[user.login] = false;
		save();
	};

	function isEmpty(obj) {
		for(var prop in obj) {
			if(obj.hasOwnProperty(prop))
				return false;
		}
		return true;
	}
});
