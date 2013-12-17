angular.module("ShitBlock", ['ui.bootstrap']);

angular.module("ShitBlock").controller("OptionsCtrl", function ($scope, $http) {

	$scope.shitUsers = [];
	$scope.newUser = {};
	$scope.editing = {};
	$scope.shitters = {};
	$scope.searchText = "";
	$scope.total = 0;

	var config;

	chrome.storage.sync.get('ShitBlockConfig', function(result){
		config = (!isEmpty(result)) ? result.ShitBlockConfig : { blocked : [], enabled : true };
		$scope.shitUsers = config.blocked;
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

	chrome.storage.sync.get('ShitBlockCount', function(result){
		$scope.total = (!isEmpty(result)) ? result.ShitBlockCount.total : 0;
	});

	// Listeners on change config and total count
	chrome.storage.onChanged.addListener(function(changes, namespace) {
		if (changes["ShitBlockConfig"])
		{
			if (changes["ShitBlockConfig"].newValue.enabled != config.enabled)
				$('#enableShitBlock').bootstrapSwitch('toggleState');
		}
		else if (changes["ShitBlockCount"])
		{
			$scope.total = changes["ShitBlockCount"].newValue.total;
			$scope.$digest();
		}
	});

	function save () {
		config.blocked = $scope.shitUsers;
		chrome.storage.sync.set({'ShitBlockConfig': config });
	}

	function alreadyAdded (newUser) {
		for (var i = 0; i < $scope.shitUsers.length; i++) {
			if ($scope.shitUsers[i].login == newUser.login)
				return (true);
		}
		return (false);
	}

	$scope.add = function (newUser) {
		if (newUser && newUser.login && !alreadyAdded(newUser) && $scope.shitters.indexOf(newUser.login) != -1) {
			$scope.shitUsers.push(angular.copy(newUser));
			$scope.shitters.splice($scope.shitters.indexOf(newUser.login), 1);
			$scope.newUser = {};
			save();
		}
	};

	$scope.delete = function (index) {
		$scope.shitters.push($scope.shitUsers[index].login);
		$scope.shitUsers.splice(index, 1);
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
