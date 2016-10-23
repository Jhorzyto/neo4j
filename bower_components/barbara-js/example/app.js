var app = angular.module('App-Example', ['Barbara-Js']);

app.service("AppService", function($request){

    this.getData = function(data, success, error, load){
        $request.get('http://localhost/misael/aplicacao/http_response/getInfo')
                .addData(data)
                .load(load)
                .addHeaders({
                    Authorization : 'd2VudHdvcnRobWFuOkNoYW5nZV9tZQ==',
                    Accept : 'application/json'
                })
                .send(success, error);
    };

    this.getPopularPhotosInstagram = function(){

        var apiUrl = 'https://demo9691796.mockable.io/getPopularPhotosInstagram';

        var params = {
            access_token : 'xxxxxxxxxxxx',
            count : 5,
            max_tag_id : 1160235423409901109
        };

        $request.get(apiUrl)
                .addParams(params)
                .addHeaders({
                    Authorization : 'd2VudHdvcnRobWFuOkNoYW5nZV9tZQ==',
                    Accept : 'application/json'
                })
                .send(callbackSuccess, callbackError);

    };

    var callbackSuccess = function(data, meta, response){
        //console.log(response);
        //console.log('ocorreu tudo certo!');
    };

    var callbackError = function(meta, code, response){
        console.log(meta.error_message);
    };

});

app.controller('AppController', function($scope, AppService, bootstrap) {

    $scope.alert = bootstrap.alert();
    $scope.loading = bootstrap.loading();
    $scope.pagination = bootstrap.pagination();
    $scope.checkboxs = false;

    //$scope.$watch('checkboxs', function(value){
    //    if(value == true){
    //        $scope.hidePre = false;
    //        $scope.animateCss.animateByKey('fadeInUp', 'google');
    //
    //    } else
    //        $scope.animateCss.animateByKey('fadeOutDown', 'google', function(){
    //            $scope.hidePre = true;
    //        });
    //});

    AppService.getPopularPhotosInstagram();

    $scope.requestData = function(pagination){

        AppService.getData({
            page : 'pessoa',
            action : 'teste',
            currentPage : pagination.currentPage
        }, function(data){
            $scope.data = data;
            pagination.changePages(data.pagination.pages);
            $scope.alert.responseSuccess('Você recebeu os dados com successo!');
        }, function(meta){
            $scope.data = meta;
            $scope.alert.responseError(meta);
        }, $scope.loading.getRequestLoad('Carregando informações..'));

    };

    $scope.pagination.changePageCallback($scope.requestData);

    $scope.requestData($scope.pagination);

});