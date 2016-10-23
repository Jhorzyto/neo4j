/*
 BarbaraJS v1.2.1
 (c) 2016 Jhordan Lima. https://github.com/Jhorzyto/barbara.js
 License: MIT
 */

//Iniciando o modulo Barbara-JS
var barbaraJs = angular.module('Barbara-Js', []);

//Inicializador do barbaraJs
barbaraJs.run(function(){
    //Animação para icone de carregamento
    //CSS não minificado
    //
    //.glyphicon.spinning {
    //    animation: spin 1s infinite linear;
    //    -webkit-animation: spin2 1s infinite linear;
    //}
    //
    //@keyframes spin {
    //    from { transform: scale(1) rotate(0deg); }
    //    to { transform: scale(1) rotate(360deg); }
    //}
    //
    //@-webkit-keyframes spin2 {
    //    from { -webkit-transform: rotate(0deg); }
    //    to { -webkit-transform: rotate(360deg); }
    //}
    //
    var loadingStyle = "<style type='text/css'>.glyphicon.spinning{animation:spin 1s infinite linear;-webkit-animation:spin2 1s infinite linear}@keyframes spin{from{transform:scale(1) rotate(0)}to{transform:scale(1) rotate(360deg)}}@-webkit-keyframes spin2{from{-webkit-transform:rotate(0)}to{-webkit-transform:rotate(360deg)}}</style>";

    //Atribuindo o style ao cabeçalho do HTML
    angular.element(document).find('head').prepend(loadingStyle);
});

//Factory request para requisições ajax.
barbaraJs.factory("$request", function($http){

    //Gerar meta a partir do response
    var getMetaResponse = function(response){
        return {
            code          : response.status,
            error_message : response.status >= 200 &&  response.status <= 300 ?
                'Estrutura de retorno inválida! Use "$request.checkResponse(false);" na requisição para permitir outros retornos' :
                (response.statusText != "" ? response.statusText : "Não foi possivel realizar esta requisição! Código de erro " + response.status)
        };
    };

    //Callback quando o response.status for entre 200 e 299.
    var callbackSuccess = function(response, request, success, error){
        //Verificar se algum callback de loaded
        if(angular.isDefined(request.callbackLoad))
            request.callbackLoad.loaded();

        //Chamar callback de sucesso caso for escolhido para "não" verificar meta no response.data
        if(!request.checkMeta)
            success(response);

        //Chamar callback de error caso o response.data não for um objeto (json)
        else if(!angular.isObject(response.data))
            error(getMetaResponse(response), response.status, response);

        //Verificar se há meta no response.data e se existe existe o atributo code para validar a requisição
        else if(angular.isObject(response.data.meta) && angular.isDefined(response.data.meta.code)){

            //Verificar se o meta.code corresponde ao código de sucesso, então chama o callback de sucesso
            if(response.data.meta.code >= 200 && response.data.meta.code <= 299)
                success(response.data.data, response.data.meta, response);

            //Caso o meta.code não estiver entre 200 a 299, retornar como callback de erro.
            else
                error(response.data.meta, response.status, response);

            //Caso seja definidos callbacks adicionais para determinados meta.code, serão executados aqui após.
            angular.forEach(request.callback, function(callback) {
                //Verificar se o meta.code do response for igual ao metacode definido pelo callback adicional.
                // Se for, executa o callback
                if(this.code == callback.metaCode)
                    callback.callback(response.data.data, response.data.meta, response);
            }, response.data.meta);

        }
        //Caso não atenda nenhum dos requisitos, retorna o callback de erro se for definido.
        else {
            var meta = getMetaResponse(response);

            //Caso seja definidos callbacks adicionais para determinados meta.code, serão executados aqui após.
            angular.forEach(request.callback, function(callback) {
                //Verificar se o meta.code do response for igual ao metacode definido pelo callback adicional.
                // Se for, executa o callback
                if(this.code == callback.metaCode)
                    callback.callback(meta, response.status, response);
            }, meta);

            error(meta, response.status, response);
        }

    };

    //Callback quando o response.status for considerado como erro.
    var callbackError = function(response, request, error){
        //Verificar se algum callback de loaded
        if(angular.isDefined(request.callbackLoad))
            request.callbackLoad.loaded();

        if(angular.isObject(response.data) && angular.isObject(response.data.meta)){
            response.status     = angular.isDefined(response.data.meta.code) ? response.data.meta.code : response.status ;
            response.statusText = angular.isDefined(response.data.meta.error_message) ? response.data.meta.error_message : response.statusText ;
        }

        var meta = getMetaResponse(response);

        //Caso seja definidos callbacks adicionais para determinados meta.code, serão executados aqui após.
        angular.forEach(request.callback, function(callback) {
            //Verificar se o meta.code do response for igual ao metacode definido pelo callback adicional.
            // Se for, executa o callback
            if(this.code == callback.metaCode)
                callback.callback(meta, response.status, response);
        }, meta);

        error(meta, response.status, response);
    };

    //Atributos e métodos do $request
    return {
        //Lista de parametros para enviar
        parameter : {},

        //Lista de dados para enviar
        data : {},

        //Lista de cabeçalho adicional, caso necessário
        headers : {
            "X-Requested-With" : "XMLHttpRequest"
        },

        //Método de requisição atual
        method : 'GET',

        //URL para requisição
        url : undefined,

        //Lista de Callbacks adicionais
        callback : [],

        //Configurações adicional para requisição
        callbackLoad : undefined,

        //Verificar o meta no response.data
        checkMeta : true,

        //Configurações adicional para requisição
        config : {},

        //Mudar a verificação do meta no response.data
        checkResponse : function(check){
            //Verifica se o atributo é valido ou não.
            this.checkMeta = check ? true : false;
            return this;
        },

        //Habilitar cabeçalho do ajax
        removeAjaxHeader : function () {
            if(angular.isDefined(this.headers['X-Requested-With']))
                delete this.headers['X-Requested-With'];
            return this;
        },

        //Adicionar callbacks adicionais para o meta.code
        addCallback : function(metaCode, callback){
            //Verficar se o metaCode é um número e o callback é função.
            // Se a condição for valida, adiciona o callback na lista
            if(angular.isNumber(metaCode) && angular.isFunction(callback))
                this.callback.push({ metaCode : metaCode, callback : callback });
            return this;
        },

        //Adicionar método de requisição
        addMethod : function(method){
            //Verificar se o method é string, para adicionar ao método de requisição
            this.method = angular.isString(method) ? method : 'GET';
            return this;
        },

        //Adicionar dados para enviar
        addData : function(data){
            //Verificar se o param é objeto, para adicionar ao dados/param para enviar
            this.data = angular.isObject(data) ? data : {};
            return this;
        },

        //Adicionar parametros para enviar
        addParams : function(param){
            //Verificar se o param é objeto, para adicionar ao dados/param para enviar
            this.parameter = angular.isObject(param) ? param : {};
            return this;
        },

        //Adicionar cabeçalho adicional
        addHeaders : function(headers){
            //Verificar se o headers é objeto, para adicionar ao cabeçalho adicional
            if(angular.isObject(headers))
                this.headers =  angular.extend(this.headers, headers);
            return this;
        },

        //Adicionar Url manualmente
        addUrl : function(url){
            //Verificar se o headers é objeto, para adicionar ao cabeçalho adicional
            this.url = angular.isString(url) ? url : this.url;
            return this;
        },

        //Adicionar callback de carregamento.
        load : function(onLoading, loaded){

            //Verificar se o onLoading é um objeto do bootstrap.loading
            if(angular.isObject(onLoading)){
                //Verificar se os callbacks loading e loaded existem
                if(angular.isFunction(onLoading.loading) && angular.isFunction(onLoading.loaded)){
                    loaded = onLoading.loaded;
                    onLoading = onLoading.loading;
                }
            }

            //Verificar se onLoading e loaded são callbacks validos!
            if(!angular.isFunction(onLoading) || !angular.isFunction(loaded))
                throw "Não foi possível adicionar as funções de carregamento!";

            //atribuindo os callbacks à variavel callbackLoad
            this.callbackLoad = {
                onLoading : onLoading,
                loaded : loaded
            };

            return this;
        },

        //Obter $request para requisição get
        get : function(url){
            //Verificar se o url é string para adicionar ao url atual.
            this.addUrl(url);
            //Mudar o método de requisição
            this.addMethod('GET');
            //Retornar copia do objeto.
            return angular.copy(this);
        },

        //Obter $request para requisição post
        post : function(url){
            //Verificar se o url é string para adicionar ao url atual.
            this.addUrl(url);
            //Mudar o método de requisição
            this.addMethod('POST');
            //Retornar copia do objeto.
            return angular.copy(this);
        },

        //Obter $request para requisição put
        put : function(url){
            //Verificar se o url é string para adicionar ao url atual.
            this.addUrl(url);
            //Mudar o método de requisição
            this.addMethod('PUT');
            //Retornar copia do objeto.
            return angular.copy(this);
        },

        //Obter $request para requisição delete
        delete : function(url){
            //Verificar se o url é string para adicionar ao url atual.
            this.addUrl(url);
            //Mudar o método de requisição
            this.addMethod('DELETE');
            //Retornar copia do objeto.
            return angular.copy(this);
        },

        //Obter $request para requisição jsonp
        jsonp : function(url){
            //Verificar se o url é string para adicionar ao url atual.
            this.addUrl(url);
            //Mudar o método de requisição
            this.addMethod('JSONP');
            //Retornar copia do objeto.
            return angular.copy(this);
        },

        //Enviar requisição
        send : function(success, error){
            //Atribuir a referencia do objeto para variavel request
            var request = this;

            //Verificar se o parametro success é uma função
            if(!angular.isFunction(success))
                throw "É necessário definir um callback de sucesso no $request.send()!";

            //Caso não exista callback de erro, criar um.
            if(!angular.isFunction(error))
                error = function(){};

            //Verificar se algum url foi definido para continuar a requisição
            if(!angular.isDefined(request.url))
                throw "Nenhum URL foi definido!";

            //Verificar se algum callback de loading
            if(angular.isDefined(request.callbackLoad))
                request.callbackLoad.onLoading();

            //Ajustar as configurações adicionais da requisição
            request.config.headers = request.headers;

            //Escolher qual método executar de acordo com o armazenado em request.method
            switch (request.method){

                case 'GET' :
                    angular.extend(request.parameter, request.data);
                    request.config.params = request.parameter;
                    $http.get(request.url, request.config)
                        .then(function(response){
                            callbackSuccess(response, request, success, error);
                        }, function(response){
                            callbackError(response, request, error);
                        });
                    break;

                case 'POST' :
                    request.config.params = request.parameter;
                    $http.post(request.url, request.data, request.config)
                        .then(function(response){
                            callbackSuccess(response, request, success, error);
                        }, function(response){
                            callbackError(response, request, error);
                        });
                    break;

                case 'PUT' :
                    request.config.params = request.parameter;
                    $http.put(request.url, request.data, request.config)
                        .then(function(response){
                            callbackSuccess(response, request, success, error);
                        }, function(response){
                            callbackError(response, request, error);
                        });
                    break;

                case 'DELETE' :
                    request.config.params = request.parameter;
                    request.config.data = request.data;
                    $http.delete(request.url, request.config)
                        .then(function(response){
                            callbackSuccess(response, request, success, error);
                        }, function(response){
                            callbackError(response, request, error);
                        });
                    break;

                case 'JSONP' :
                    request.config.params = request.parameter;
                    request.config.data   = request.data;
                    request.config.params.callback = 'JSON_CALLBACK';
                    $http.jsonp(request.url, request.config)
                        .then(function(response){
                            callbackSuccess(response, request, success, error);
                        }, function(response){
                            callbackError(response, request, error);
                        });
                    break;

                default :
                    request.config.params = request.parameter;
                    request.config.data   = request.data;
                    request.config.method = request.method;
                    request.config.url    = request.url;
                    $http(request.config)
                        .then(function(response){
                            callbackSuccess(response, request, success, error);
                        }, function(response){
                            callbackError(response, request, error);
                        });
                    break;
            }
        }
    };
});

//Factory bootstrap para alguns recursos do framework css
barbaraJs.factory("bootstrap", function(){
    return {
        //Configuração do alert para diretiva (alert-bootstrap)
        alert : function(){
            return {
                //Visibilidade da diretiva
                show : false,

                //Mudar Visibilidade da direitva
                changeShow : function( show ){
                    this.show = angular.isDefined(show) ? show : !this.show;
                },

                //Tipo de alerta (info, success, danger, warning)
                type : undefined,

                //Mudar tipo de alerta
                changeType : function(type){
                    this.type = angular.isString(type) ? type : this.type;
                },

                //Título do alerta
                title : undefined,

                //Mudar título do alerta
                changeTitle : function(title){
                    this.title = angular.isString(title) ? title : this.title;
                },

                //Mensagem do alerta
                message : undefined,

                //Mudar mensagem do alerta
                changeMessage : function(message){
                    this.message = angular.isString(message) ? message : this.message;
                },

                //Personalizar alerta para response de sucesso
                responseSuccess : function(message){
                    if(angular.isString(message)) {
                        this.changeTitle('Sucesso!');
                        this.changeType('success');
                        this.changeMessage(message);
                        this.changeShow(true);
                    }
                },

                //Personalizar alerta para response de erro
                responseError : function(meta){
                    this.changeTitle('Algo não ocorreu bem!');
                    this.changeType('danger');

                    if(angular.isDefined(meta.error_message) && angular.isString(meta.error_message)){
                        this.changeMessage(meta.error_message);
                        this.changeType('warning');
                    } else
                        this.changeMessage("Ocorreu um erro ao fazer uma requisição! Acompanhe o console do navegador para ter mais detalhes.");
                    this.changeShow(true);
                }
            };
        },

        //Configuração do loading para diretiva (loading-bootstrap)
        loading : function(){
            return {
                //Visibilidade da diretiva
                show : false,

                //Mudar Visibilidade da direitva
                changeShow : function( show ){
                    this.show = angular.isDefined(show) ? show : !this.show;
                },

                //Mensagem de loading
                message : 'Carregando...',

                //Mudar mensagem do loading
                changeMessage : function(message){
                    this.message = angular.isString(message) ? message : this.message;
                },

                //Mostrar mensagem de carregamento
                onLoading : function(message){
                    this.message = angular.isString(message) ? message : this.message;
                    this.changeShow(true);
                },

                //Deixar de exibir mensagem de carregamento
                loaded : function(){
                    this.changeShow(false);
                },

                //Obter loading trabalhado para o $request
                getRequestLoad : function(message){
                    var loading = this;
                    return {
                        loading : function(){
                            loading.onLoading(message);
                        },
                        loaded : function(){
                            loading.loaded();
                        }
                    };
                }
            };
        },

        //Configuração do pagination para diretiva (pagination-bootstrap)
        pagination : function(){
            return {
                //Quantidade de páginas disponíveis
                pages : 0,

                //Página atual
                currentPage : 1,

                //Lista de páginas processadas
                pagination : [],

                //Callback para executar após mudar a página
                callback : undefined,

                //Adicionar Callback validando o mesmo
                changePageCallback : function(callback){
                    this.callback = angular.isFunction(callback) ? callback : this.callback;
                },

                //Alterar a quantidade de páginas e refazendo a páginação
                changePages : function(pages){
                    this.pages = angular.isNumber(pages) ? pages : this.pages;
                    this.processPagination();
                },

                //Alterar a página atual e validar a mesma
                changeCurrentPage : function(currentPage){
                    this.currentPage = angular.isNumber(currentPage) && currentPage > 0
                    && currentPage <= this.pages ?
                        currentPage : this.currentPage;
                    return currentPage == this.currentPage ? true : false;
                },

                //Procesar páginação de acordo com o número de páginas e a página atual
                processPagination : function(){

                    //Verificar se há páginas
                    if(this.pages == 0)
                        return;

                    //Definir lista de paginação como vazia
                    this.pagination = [];

                    //1 Botão
                    this.pagination.push({
                        item : 1,
                        role : this.pages > 0
                    });

                    //2 Botão
                    this.pagination.push({
                        item : this.pages <= 9 ? 2 :
                            this.currentPage <= 5 ? 2 : undefined,
                        role : this.pages > 2
                    });

                    //3 Botão
                    this.pagination.push({
                        item : this.pages <= 9 || this.currentPage <= 5 ? 3 :
                            this.currentPage + 5 >= this.pages ? this.pages - 6 :
                            this.currentPage - 2,
                        role : this.pages > 3
                    });

                    //4 Botão
                    this.pagination.push({
                        item : this.pages <= 9 || this.currentPage <= 5 ? 4 :
                            this.currentPage + 5 >= this.pages ? this.pages - 5 :
                            this.currentPage - 1,
                        role : this.pages > 4
                    });

                    //5 Botão
                    this.pagination.push({
                        item : this.pages <= 9 || this.currentPage <= 5 ? 5 :
                            this.currentPage + 5 >= this.pages ? this.pages - 4 :
                                this.currentPage,
                        role : this.pages > 5
                    });

                    //6 Botão
                    this.pagination.push({
                        item : this.pages <= 9 || this.currentPage <= 5 ? 6 :
                            this.currentPage + 5 >= this.pages ? this.pages - 3 :
                            this.currentPage + 1,
                        role : this.pages > 6
                    });

                    //7 Botão
                    this.pagination.push({
                        item : this.pages <= 9 || this.currentPage <= 5 ? 7 :
                            this.currentPage + 5 >= this.pages ? this.pages - 2 :
                            this.currentPage + 2,
                        role : this.pages > 7
                    });

                    //8 Botão
                    this.pagination.push({
                        item : this.pages <= 9 ? 8 :
                            this.pages == 10 && this.currentPage == 5 ? undefined :
                                this.currentPage + 5 >= this.pages ? this.pages - 1 :
                                    undefined,
                        role : this.pages > 8
                    });

                    //9 Botão
                    this.pagination.push({
                        item : this.pages,
                        role : this.pages > 1
                    });

                    //Definir classes css para cada botão
                    angular.forEach(this.pagination, function(page){
                        page.class = {
                            active : this.currentPage == page.item,
                            disabled : angular.isUndefined(page.item)
                        }
                    }, this);
                },

                //Ação do clique do botão
                clickAction : function(page){
                    if(angular.isDefined(page) && this.changeCurrentPage(page)){

                        if(angular.isFunction(this.callback)){
                            this.changePages(0);
                            this.callback(this);
                        } else
                            this.processPagination();
                    }
                }
            }
        }
    };
});

//Direitava alert-bootstrap
barbaraJs.directive('alertBootstrap', function () {
    return {
        restrict : 'A',
        //Template html da diretiva
        //HTML Template não minificado
        //
        //<div class='alert alert-{{alert.type}} alert-dismissible' role='alert' ng-if='alert.show'>
        //  <button type='button' class='close' ng-click='alert.changeShow()'>
        //      <span aria-hidden='true'>&times;</span>
        //  </button>
        //  <strong>{{alert.title}}</strong> {{alert.message}}
        //</div>
        //
        template : "<div class='alert alert-{{alert.type}} alert-dismissible' role='alert' ng-if='alert.show'><button type='button' class='close' ng-click='alert.changeShow()'><span aria-hidden='true'>&times;</span></button><strong>{{alert.title}}</strong> {{alert.message}}</div>"
    };
});

//Direitava loading-bootstrap
barbaraJs.directive('loadingBootstrap', function () {
    return {
        restrict : 'A',
        //Template html da diretiva
        //HTML Template não minificado
        //
        //<div class='progress' ng-if='loading.show'>
        //    <div class='progress-bar progress-bar-striped active' role='progressbar' style='width: 100%'>
        //        <i class='glyphicon glyphicon-refresh spinning'></i> <strong>{{loading.message}}</strong>
        //    </div>
        //</div>
        //
        template : "<div class='progress' ng-if='loading.show'> <div class='progress-bar progress-bar-striped active' role='progressbar' style='width: 100%'><i class='glyphicon glyphicon-refresh spinning'></i> <strong>{{loading.message}}</strong></div></div>"
    };
});

//Direitava pagination-bootstrap
barbaraJs.directive('paginationBootstrap', function () {
    return {
        restrict : 'A',
        //Template html da diretiva
        //HTML Template não minificado
        //
        //<nav ng-if="pagination.pages > 0">
        //    <ul class="pagination">
        //        <li ng-repeat="page in pagination.pagination"
        //            ng-if="page.role"
        //            ng-class="page.class">
        //            <a href="" ng-click="pagination.clickAction(page.item)">
        //                {{page.item ? page.item : '...'}}
        //            </a>
        //        </li>
        //    </ul>
        //</nav>
        //
        template : "<nav ng-if='pagination.pages > 0'> <ul class='pagination'> <li ng-repeat='page in pagination.pagination' ng-if='page.role' ng-class='page.class'> <a href='' ng-click='pagination.clickAction(page.item)'>{{page.item ? page.item : '...'}}</a> </li></ul> </nav>"
    };
});

//Filtro para mostrar data de forma mais amigável ex: (há 7d, há 32sm, há 4a)
barbaraJs.filter("timeago", function () {

    return function (time) {
        //Variavel para hora atual
        var local = new Date().getTime();

        //Verificar se há algum dado
        if (!time)
            return "indefinido";

        //Verificar se time é um objeto Date
        if (angular.isDate(time))
            time = time.getTime();

        //Verificar se o time é um timestamp
        else if (angular.isNumber(time))
            time = new Date(time * 1000).getTime();

        //Verificar se o time é uma data em string
        else if (angular.isString(time))
            time = new Date(time).getTime();

        //Verificar se retornou uma data válida
        if (!angular.isNumber(time))
            return "Data invalida";

        //Atributos de configurações para calculos
        var offset = Math.abs((local - time) / 1000),
            span = [],
            MINUTE = 60,
            HOUR = 3600,
            DAY = 86400,
            WEEK = 604800,
            YEAR = 31556926;

        //Calculos para determinar o tempo decorrido
        if (offset <= MINUTE)              span = [ '', 'agora' ];
        else if (offset < (MINUTE * 60))   span = [ Math.round(Math.abs(offset / MINUTE)), 'm' ];
        else if (offset < (HOUR * 24))     span = [ Math.round(Math.abs(offset / HOUR)), 'h' ];
        else if (offset < (DAY * 7))       span = [ Math.round(Math.abs(offset / DAY)), 'd' ];
        else if (offset < (WEEK * 52))     span = [ Math.round(Math.abs(offset / WEEK)), 'sm' ];
        else if (offset < (YEAR * 10))     span = [ Math.round(Math.abs(offset / YEAR)), 'a' ];
        else                               span = [ '', '...' ];

        //Transformar array em string separado por espaço
        span = span.join('');

        //Retornar data em formato decorrido
        return (time <= local) ? 'há ' + span + '' : span;
    }
});

//Filtro para truncar texto com opção de ignorar dinamicamente
barbaraJs.filter('cuttext', function () {
    return function (value, ignoreFilter, max, tail) {
        //Verificar se o valor é valido
        if (!value || !angular.isString(value))
            return '';

        //Verificar se o tamanho maximo do texto é um número valido, caso contrario retorna o valor original
        if (!max || !angular.isNumber(max))
            return value;

        //Converter maximo para inteiro
        max = parseInt(max, 10);

        //Verificar se o tamanho do texto é menor que o tamanho máximo ou se o filtro foi ignorado
        //Caso a condição seja verdadeira, retornar o valor original
        if (value.length <= max || ignoreFilter)
            return value;

        //Trunca o texto para o tamanho definido
        value = value.substr(0, max);

        //Verifica se o ultimo elemento do texto é um espaço
        var lastspace = value.lastIndexOf(' ');

        //Caso o ultimo elemento seja um espaço, ele é truncado novamente
        if (lastspace != -1)
            value = value.substr(0, lastspace);

        //Retornar texto formatado
        return value + (tail || ' …');
    };
});