angular.module('countCapApp', ['ngRoute', 'ngAnimate', 'countCapLibrary'])
	.run(['$rootScope', '$location', '$timeout', function($rootScope, $location, $timeout) {
	    $rootScope.$on('$routeChangeError', function() {
	        $location.path("/error");
	    });
	    $rootScope.$on('$routeChangeStart', function() {
	        $rootScope.isLoading = true;
	    });
	}])
	.config(['$routeProvider', function($routeProvider){

	$routeProvider
		.when('/', {
		    templateUrl : './home.html',
		    controller: 'HomeCtrl'
		})
		.when('/countries', {
		    templateUrl : './countries/countries.html',
		    controller : 'CountriesCtrl',
		    resolve: {
		    	countries: ['ccCountries', function(ccCountries){
		    		return ccCountries();
		    	}]
		    }
		})
		.when('/countries/:country', {
		    templateUrl : './countries/country.html',
		    controller : 'CountryCtrl',
		    resolve: {
		    	countryInfo: ['$route', 'ccCountry', function($route, ccCountry){
		    		return ccCountry($route.current.params.country);
		    	}]
		    }
		})
		.when('/error', {
		    template : '<p>Error Page: Not Found</p>'
		})
		.otherwise({
		  redirectTo : '/error'
	  });

	}])
	.controller('HomeCtrl', ['$rootScope', '$timeout',
		function($rootScope, $timeout){	
	  		$timeout(function() {
				$rootScope.isLoading = false;
		}, 1000);
	}])
	.controller('CountriesCtrl', ['$scope', '$rootScope', '$location', 'countries', 
		function($scope, $rootScope, $location, countries){	
		$scope.order = 'countryName';
		$scope.reverseSort = false;

		$rootScope.isLoading = false;

		$scope.changeOrder = function(order){
			$scope.reverseSort = (order == $scope.order) ? !$scope.reverseSort : false;
			$scope.order = order || 'countryName';
		}

		$scope.changeLocation = function(location){
			$location.path('/countries/'+location);
		}

		$scope.countries = countries.geonames;
	}])
	.controller('CountryCtrl', ['$scope', '$rootScope', '$route', 'countryInfo', 'ccNeighbors', 'ccCapital', 
		function($scope, $rootScope, $route, countryInfo, ccNeighbors, ccCapital){
		$scope.country = countryInfo.geonames[0];
		$scope.isLoadingCount = 0; 

		ccNeighbors($route.current.params.country).then(function(data){
			$scope.neighbors = data.geonames;
			$scope.isLoadingCount++;
			if($scope.isLoadingCount == 2) $rootScope.isLoading = false;
		});

		ccCapital($route.current.params.country).then(function(data){
			$scope.capital = data.geonames[0];
			$scope.isLoadingCount++;
			if($scope.isLoadingCount == 2) $rootScope.isLoading = false;
		});
	
	
}])




