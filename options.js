angular.module("ShitBlock", []);
angular.module("ShitBlock").controller("OptionsCtrl", function ($scope) {

	$scope.shitUsers = {};
	
	function isEmpty(obj) {
		for(var prop in obj) {
			if(obj.hasOwnProperty(prop))
				return false;
		}
		return true;
	}

	var config;
	
	chrome.storage.sync.get('ShitBlockConfig', function(result){
		if (!isEmpty(result)) {
			console.log("ok");
			config = result.ShitBlockConfig;
		}
		else
			config = { blocked : {}, enabled : true };
		$scope.shitUsers = config.blocked;
		console.log($scope.shitUsers);
		$scope.$digest();
	});
	
	$scope.editing = {};

	function save() {
		console.log(config);
		config.blocked = $scope.shitUsers;
		console.log(config);
		chrome.storage.sync.set({'ShitBlockConfig': config });
 		//localStorageService.set("ShitBlockConfig", config);	
 	}

 	$scope.add = function (newUser) {
 		if (newUser && !$scope.shitUsers[newUser.login]) {
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