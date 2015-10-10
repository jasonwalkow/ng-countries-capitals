angular.module('countCapLibrary', [])
	.constant('GEONAME_API_BASEURL', 'http://api.geonames.org/')
	.constant('GEONAME_USERNAME', 'jasonwalkow')

	.factory('ccURL', ['$http', '$q', 'GEONAME_API_BASEURL', 'GEONAME_USERNAME',
		function($http, $q, GEONAME_API_BASEURL, GEONAME_USERNAME){
		
		return function(path, params){
			var params = params || {};
			params.username = GEONAME_USERNAME;
			params.type = 'JSON'; 
			var defer = $q.defer();
			$http.get(GEONAME_API_BASEURL + path,
				{
					params: params,
					cache: true
				})
				.success(function(data){
					defer.resolve(data);
				});
				return defer.promise;
			}

	}])
	.factory('ccCountries', ['ccURL',
		function(ccURL){
		return function(){
			return ccURL('countryInfo');
		}		

	}])

	.factory('ccCountry', ['ccURL',
		function(ccURL){
		return function(name){
			return ccURL('countryInfo', {country: name});
		}		

	}])

	.factory('ccNeighbors', ['ccURL',
		function(ccURL){
		return function(name){
			return ccURL('neighbours', {country: name});
		}	

	}])

	.factory('ccCapital', ['ccURL',
		function(ccURL){
		return function(name){
			return ccURL('search', {country: name, featureCode: 'PPLC'});
		}	

	}])