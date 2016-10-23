var app = angular.module('CaseTopicosE2', ['ngRoute', 'ngTouch', 'ui.materialize', 'Barbara-Js']);

app.config(function ($routeProvider) {
        $routeProvider
            .when('/rotas/', {
                templateUrl : 'rotas.html',
                controller  : 'RotasController'
            })
            .when('/lista/', {
                templateUrl : 'lista.html',
                controller  : 'ListaController'
            })
            //rota principal
            .otherwise({redirectTo: '/rotas/'});
    }
);

app.run(function () {
    console.log('bodybuilder poha');
});

app.service('RotasService', function ($request) {

    this.obterBairros = function ($scope) {
        $scope.error = undefined;
        $request.get('http://localhost/neo4j/listar.php')
            .removeAjaxHeader()
            .send(function (data) {
                $scope.bairros = data;
            }, function (meta) {
                $scope.error = meta.error_message;
            })
    };

    this.melhorCaminho = function ($scope) {
        $scope.error = undefined;
        $request.get('http://localhost/neo4j/melhor_caminho.php')
            .addParams($scope.calcular)
            .removeAjaxHeader()
            .send(function (data) {
                $scope.caminhos = data;
            }, function (meta) {
                $scope.error = meta.error_message;
            })
    };

});

app.service('ListaService', function ($request, RotasService) {

    this.apagarBairro = function ($scope, id) {
        $scope.error = undefined;
        $request.get('http://localhost/neo4j/apagar.php')
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
        $request.get('http://localhost/neo4j/cadastrar.php')
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
        $request.get('http://localhost/neo4j/cadastrar_relacionamento.php')
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

app.controller('RotasController', function ($scope, RotasService) {

    $scope.calcular = {};
    $scope.error    = undefined;

    RotasService.obterBairros($scope);

    $scope.melhorCaminho = function ($valid) {
        if($valid)
            RotasService.melhorCaminho($scope);
    };

});

app.controller('ListaController', function ($scope, RotasService, ListaService) {

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