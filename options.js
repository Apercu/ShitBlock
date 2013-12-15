angular.module("ShitBlock", ['LocalStorageModule']);
angular.module("ShitBlock").controller("OptionsCtrl", function ($scope, localStorageService) {

	function isEmpty(obj) {
		for(var prop in obj) {
			if(obj.hasOwnProperty(prop))
				return false;
		}
		return true;
	}

	var config;
	chrome.storage.sync.get('ShitBlockConfig', function(result){
		if (isEmpty(result))
			config = result;
		else
			config = { blocked : {}, enabled : true };
	});

	$scope.shitUsers = config.blocked;
	$scope.editing = {};

	function save() {
		console.log(config);
		config.blocked = $scope.shitUsers;
		console.log(config);
		chrome.storage.sync.set({'ShitBlockConfig': config.blocked});
 		//localStorageService.set("ShitBlockConfig", config);	
 	}

 	$scope.add = function (newUser) {
 		if (!$scope.shitUsers[newUser.login]) {
 			$scope.shitUsers[newUser.login] = newUser;
 			$scope.newUser = {};
 			save();
 		}
 	};

 	$scope.delete = function (index) {
 		delete $scope.shitUsers[index];
 		save();
 	};

 	$scope.formValid = function (newUser) {
 		return (newUser && newUser.login && !($scope.shitUsers[newUser.login]));
 	};

 	$scope.editDescription = function (user) {
 		$scope.editing[user.login] = true;
 	};

 	$scope.saveDescription = function (user) {
 		$scope.editing[user.login] = false;
 		save();
 	};
 });