var app = angular.module('CaseTopicosE2', ['ngRoute', 'ngTouch', 'ui.materialize', 'Barbara-Js', 'ng.deviceDetector']);

app.config(function ($routeProvider) {
        $routeProvider
            .when('/rotas/', {
                templateUrl : 'rotas.html',
                controller  : 'RotasController',
                resolve     : {
                    inicialmento: function(JhorMapsFactory){
                        return JhorMapsFactory.inicialmento();
                    }
                }
            })
            .when('/lista/', {
                templateUrl : 'lista.html',
                controller  : 'ListaController',
                resolve     : {
                    inicialmento: function(JhorMapsFactory){
                        return JhorMapsFactory.inicialmento();
                    }
                }
            })
            .when('/desktop/', {
                templateUrl : 'desktop.html'
            })
            //rota principal
            .otherwise({redirectTo: '/rotas/'});
    }
);

app.run(function ($rootScope, deviceDetector) {
    $rootScope.deviceDetector = deviceDetector.raw.device;
    $rootScope.url = 'http://191.234.177.246/api/';
    console.log('bodybuilder poha');
});

app.factory('JhorMapsFactory', function ($q, $location, $rootScope) {
    return {
        inicialmento : function(){
            var deferred      = $q.defer();
            var device        = $rootScope.deviceDetector;
            $rootScope.mobile = device['android'] || device['iphone'] || device['windows-phone'];
            if($rootScope.mobile){
                deferred.resolve(device);
            } else {
                $location.path("/desktop/");
                deferred.reject(device);
            }
            return deferred.promise;
        }
    }
});

app.service('RotasService', function ($request, $rootScope) {

    this.obterBairros = function ($scope) {
        $scope.error = undefined;
        $request.get($rootScope.url + '/listar.php')
            .removeAjaxHeader()
            .send(function (data) {
                $scope.bairros = data;
            }, function (meta) {
                $scope.error = meta.error_message;
            })
    };

    this.melhorCaminho = function ($scope) {
        $scope.error = undefined;
        $scope.carregando = "Calculando melhor caminho...";
        $request.get($rootScope.url + '/melhor_caminho.php')
            .addParams($scope.calcular)
            .removeAjaxHeader()
            .send(function (data) {
                $scope.caminhos   = data;
                $scope.carregando = undefined;
            }, function (meta) {
                $scope.error      = meta.error_message;
                $scope.carregando = undefined;
            })
    };

});

app.service('ListaService', function ($request, $rootScope, RotasService) {

    this.apagarBairro = function ($scope, id) {
        $scope.error = undefined;
        $request.get($rootScope.url + '/apagar.php')
            .addParams({
                bairro : id
            })
            .removeAjaxHeader()
            .send(function () {
                RotasService.obterBairros($scope);
            }, function (meta) {
                $scope.error = meta.error_message;
            })
    };

    this.adicionarBairro = function ($scope) {
        $scope.error = undefined;
        $request.get($rootScope.url + '/cadastrar.php')
            .addParams({
                bairro : $scope.formulario.bairro
            })
            .removeAjaxHeader()
            .send(function () {
                RotasService.obterBairros($scope);
                $scope.formulario.bairro = undefined;
            }, function (meta) {
                $scope.error = meta.error_message;
            })
    };

    this.adicionarRelacionamento = function ($scope) {
        $scope.error = undefined;
        $request.get($rootScope.url + '/cadastrar_relacionamento.php')
            .addParams($scope.relacionamento)
            .removeAjaxHeader()
            .send(function () {
                RotasService.obterBairros($scope);
                $scope.relacionamento = undefined;
            }, function (meta) {
                $scope.error = meta.error_message;
            })
    };
});

app.controller('RotasController', function ($scope, inicialmento, RotasService) {

    $scope.calcular = {};
    $scope.error    = undefined;

    RotasService.obterBairros($scope);

    $scope.melhorCaminho = function ($valid) {
        if($valid)
            RotasService.melhorCaminho($scope);
    };

});

app.controller('ListaController', function ($scope, inicialmento, RotasService, ListaService) {

    $scope.error = undefined;

    $scope.formulario = {};

    $scope.relacionamento = undefined;

    RotasService.obterBairros($scope);

    $scope.apagarBairro = function (id) {
        if(confirm('Gostaria de apagar esse bairro?'))
            ListaService.apagarBairro($scope, id);
    };

    $scope.adicionarBairro = function () {
        if(angular.isDefined($scope.formulario.bairro))
            ListaService.adicionarBairro($scope);
    };

    $scope.relacionamentoForm = function (bairro) {
        $scope.bairroRelacionamento = bairro;
        $scope.relacionamento = {
            de: bairro.id
        }
    };

    $scope.adicionarRelacionamento = function ($valid) {
        if($valid)
            ListaService.adicionarRelacionamento($scope);
    };

});