angular.module("ShitBlock", []);
angular.module("ShitBlock").controller("OptionsCtrl", function ($scope) {

	$scope.shitUsers = {};
	$scope.newUser = {};
	
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
			config = result.ShitBlockConfig;
		}
		else
			config = { blocked : {}, enabled : true };
		$scope.shitUsers = config.blocked;
		$scope.$digest();
	});
	
	$scope.editing = {};

	function save() {
		config.blocked = $scope.shitUsers;
		chrome.storage.sync.set({'ShitBlockConfig': config });
 	}

 	$scope.add = function (newUser) {
 		if (newUser && newUser.login && !$scope.shitUsers[newUser.login]) {
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