Barbara-JS
=====================

Um framework para o AngularJS com novos serviços, diretivas e filtros.

1. [Como usar](#como-usar)
2. [$request Service](#request-service)
3. [bootstrap Service](#request-service)

## Como usar

Primeiro, instale com o Bower:

```
bower install barbara-js
```



Em seguida, referenciar o script minificado:

```html
<script src="./bower_components/barbara-js/barbarajs.min.js"></script>
```

Especifique o BarbaraJS como uma dependência do seu aplicativo:

```js
var app = angular.module('ExemploApp', ['Barbara-Js']);
```

Agora é só injetar os recursos do BarbaraJS em seu controller, service ou directive quando você precisar dele.
Exemplo:


```js
app.controller('ExemploController', function($scope, $request) {

    $scope.getPopularPhotosInstagram = function(){
    
        var apiUrl = 'https://demo9691796.mockable.io/getPopularPhotosInstagram';
    
        var params = {
            access_token : 1160235423409901109,
            count : 5,
            max_tag_id : 1160235423409901109
        };
    
        $request.get(apiUrl)
                .addData(params)
                .send(callbackSuccess, callbackError);
    
    };
    
    $scope.getPopularPhotosInstagram();
    
    var callbackSuccess = function(data, meta, response){
        console.log(data);
        console.log('ocorreu tudo certo!');
    };
    
    var callbackError = function(meta, code, response){
        console.log(meta.error_message);
    };

});
```

#### $request Service

O `$request service` trabalha sobre $http do AngularJS para dar mais poder ao realizar uma requisição http. Com ele, é possível realizar uma requisição de forma mais dinâmica ao repassar os dados, também existe a possibilidade de executar callbacks nos eventos 'antes de enviar a requisição' e 'após receber a resposta'. Há outros recursos interessantes que você pode conferir abaixo:

* **`$request.get(url)`**: Criar um objeto $request GET.

    Parâmetro | Tipo | Descrição
    --- | --- | --- 
    `url` | `string` | `URL relativo ou absoluto do destino da requisição` 

    `Retorna um novo objeto $request com method configurado para GET`
     
    ```js
    $request.get('http://localhost/moca_bonita/')
            .addData({
                page : 'pessoa', 
                action : 'read'
            })
            .send(function(){ 
                console.log('Success!'); 
            }, function(){ 
                console.log('Error!'); 
            });
    ```
     
* **`$request.post(url)`**: Criar um objeto $request POST. 

    Parâmetro | Tipo | Descrição
    --- | --- | --- 
    `url` | `string` | `URL relativo ou absoluto do destino da requisição` 

    `Retorna um novo objeto $request com method configurado para POST`
     
    ```js
    $request.post('http://localhost/moca_bonita/')
            .addData({
                todo : 'pessoa', 
                action : 'create',
                data : {
                    nome : 'Fulano',
                    sobrenome : 'De Tal',
                    email : 'fulandodetal@mocabonita.com'
                }
            })
            .send(function(){ 
                console.log('Success!'); 
            }, function(){ 
                console.log('Error!'); 
            });
    ```

* **`$request.put(url)`**: Criar um objeto $request PUT. 

    Parâmetro | Tipo | Descrição
    --- | --- | --- 
    `url` | `string` | `URL relativo ou absoluto do destino da requisição` 

    `Retorna um novo objeto $request com method configurado para PUT`
     
    ```js
    $request.put('http://localhost/moca_bonita/')
            .addData({
                todo : 'pessoa', 
                action : 'update',
                data : {
                    id : 1,
                    nome : 'Beltrano',
                    sobrenome : 'De Tal',
                    email : 'fulandodetal@mocabonita.com'
                }
            })
            .send(function(){ 
                console.log('Success!'); 
            }, function(){ 
                console.log('Error!'); 
            });
    ```
    
* **`$request.delete(url)`**: Criar um objeto $request DELETE. 

    Parâmetro | Tipo | Descrição
    --- | --- | --- 
    `url` | `string` | `URL relativo ou absoluto do destino da requisição` 

    `Retorna um novo objeto $request com method configurado para DELETE`
     
    ```js
    $request.delete('http://localhost/moca_bonita/')
            .addData({
                todo : 'pessoa', 
                action : 'delete',
                data : {
                    id : 1
                }
            })
            .send(function(){ 
                console.log('Success!'); 
            }, function(){ 
                console.log('Error!'); 
            });
    ```
                      
* **`$request.addData(data)`**: Adiciona dados no corpo da requisição, exceto quando o method for `GET`, onde ele converte os dados em parametros da url.

    Parâmetro | Tipo | Descrição
    --- | --- | --- 
    `data` | `object` | `Dados em JSON para enviar ao url definido` 

    `Retorna o objeto $request com os dados da requisição armazenado`
     
    ```js
    $request.get('http://localhost/moca_bonita/')
            .addData({
                page : 'pessoa', 
                action : 'read'
            }) 
            //O URL final será http://localhost/moca_bonita/?page=pessoa&action=read pois o method da requisição é GET.
            .send(success, error);            
            
    $request.post('http://localhost/moca_bonita/')
            .addData({
                todo : 'pessoa', 
                action : 'create',
                data : {
                    nome : 'Fulano',
                    sobrenome : 'De Tal',
                    email : 'fulandodetal@mocabonita.com'
                }
            }) 
            //Neste caso, o URL permanecerá http://localhost/moca_bonita/ pois os dados estão no corpo da mensagem em json.
            .send(success, error);
    ```

* **`$request.checkResponse(check)`**: Alterar a verificação de estrutura do response.data, por padrão a verificação é habilitada. (opicional)
    
    Parâmetro | Tipo | Descrição
    --- | --- | --- 
    `check` | `boolean` | `Valor booleano para habilitar ou desabilitar a verificação da estrutura do response.data` 
    
    *Estrutura response.data recomendada*
    ```js
    {
        "meta": { //Obrigatório
            "code": 400, //Obrigatório
            "error_message": "400 - BAD REQUEST" //Obrigatório quando o meta.code não estiver entre 200 a 299
        }, 
        "data":[]  //Obrigatório quando o meta.code estiver entre 200 a 299
    }
    ```
    
    `Retorna o objeto $request configurado para verificar ou não o response.data .`
     
    ```js
    $request.get('http://localhost/moca_bonita/')
            .addData({
                page : 'pessoa', 
                action : 'read'
            })
            .checkResponse(false)
            .send(function(response){
                console.log('Response completo sem verificação!');
            });
    ```

* **`$request.addMethod(method)`**: Alterar o method da requisição do objeto $request. (opicional)

    Parâmetro | Tipo | Descrição
    --- | --- | --- 
    `method` | `string` | `Nome do method da requisição. Ex: (GET, POST, PUT, DELETE, OPTIONS)` 

    `Retorna o objeto $request com o novo method registrado`
     
    ```js
    $request.addMethod('GET');
    ```

* **`$request.addHeaders(headers)`**: Adicionar cabeçalho adicional ao $request. (opicional)

    Parâmetro | Tipo | Descrição
    --- | --- | --- 
    `headers` | `object` | `Cabeçalho em JSON para ser acrescentado ao cabeçalho da requisição` 

    `Retorna o objeto $request com o novo cabeçalho registrado`
     
    ```js
    $request.get('http://localhost/moca_bonita/')
            .addData({
                page : 'pessoa', 
                action : 'read'
            })
            .addHeaders({
                Authorization : 'bW/Dp2EgYm9uaXRh',
                Accept : 'application/json'
            })
            .send(success, error);
    ```

* **`$request.load(onLoading, [loaded])`**: Adicionar callbacks para executar antes da requisição e após receber o response. (opicional)

    Parâmetro | Tipo | Descrição
    --- | --- | --- 
    `onLoading` | `function | object bootstrap.loading` | `Callback para executar antes da requisição ser executada. Objeto da diretiva loading-bootstrap para tratar o carregamento dinâmico` 
    `loaded` | `function` | `Callback para executar após receber o response` 

    `Retorna o objeto $request com os callbacks armazenado`
     
    ```js
    $request.get('http://localhost/moca_bonita/')
            .addData({
                page : 'pessoa', 
                action : 'read'
            })
            .load(function(){
                console.log('Carregando os dados...');
            }, function(){
                console.log('Os dados foram carregados!');
            })
            .send(success, error);
            
    $request.get('http://localhost/moca_bonita/')
            .addData({
                page : 'pessoa', 
                action : 'read'
            })
            //Precisa definir o bootstrap service e adicionar a diretiva loading-bootstrap na view
            .load(bootstrap.loading().getRequestLoad('Carregando informações..')) 
            .send(success, error);
    ```

* **`$request.addCallback(metaCode, callback)`**: Adicionar callbacks adicionais para executar quando o meta.code do response.data for igual ao definido. (opicional)(pode ser executado diversas vezes)

    Parâmetro | Tipo | Descrição
    --- | --- | --- 
    `metaCode` | `number` | `Código para comparação com o meta.code` 
    `callback` | `function` | `Callback para executar quando o meta.code for igual ao metaCode definido. Os parametros do callback são (data, meta, response)` 

    `Retorna o objeto $request com os callbacks de meta.code armazenado`
     
    ```js
    $request.get('http://localhost/moca_bonita/')
            .addData({
                page : 'pessoa', 
                action : 'read'
            })
            .addCallback(401, function(data, meta, response){
                console.log('Request unauthorized!');
            })
            .addCallback(405, function(data, meta, response){
                console.log('Method not allowed!');
            })
            .send(success, error);
    ```

* **`$request.send(success, [error])`**: Fazer a requisição para o url definido.

    Parâmetro | Tipo | Descrição
    --- | --- | --- 
    `success` | `function` | `Callback que será executado caso o meta.code estiver entre 200 a 299. Caso a verificação de estrutura do response.data esteja desabilitado, este callback é executado quando o response.status estiver entre 200 a 299. Os parametros do success são (data, meta, response).`
    `error` | `function` | `Callback que será executado caso o meta.code ou response.status não estiver entre 200 a 299. Caso a estrutura do response.data for diferente da recomendada, este callback é executado. Os parametros do error são (meta, status, response)` 

    `Sem retorno`
     
    ```js            
    var callbackSuccess = function(data, meta, response){
        console.log(data);
    };       
            
    var callbackError = function(meta, status, response){
        console.log(meta);
    };        
     
    $request.get('http://localhost/moca_bonita/')
            .addData({
                page : 'pessoa', 
                action : 'read'
            })
            .send(callbackSuccess, callbackError);
            
    ```

#### bootstrap Service

O `bootstrap service` traz os atributos e métodos das diretivas do barbaraJs. Deve ser injetado no controller ou service sempre que existir a necessidade de usar uma diretiva inclusa no barbaraJS:

##### bootstrap.alert
O `bootstrap.alert` trabalha com a diretiva alert-bootstrap do BarbaraJS, o alert é um componente do bootstrap que traz mensagens de forma mais elegante à página. O `bootstrap.alert` precisa está incluso dentro do scope, como atributo `alert`. ex: $scope.alert ou $rootScope.alert.
É necessário adicionar a diretiva na view:
```html
<div alert-bootstrap></div>
```

* **`alert.changeShow([show])`**: Alterar a visibilidade da diretiva

    Parâmetro | Tipo | Descrição
    --- | --- | --- 
    `show` | `boolean` | `Valor booleano para mostrar ou não mostrar a diretiva na view. Caso show não for definido, a visibilidade será o oposto da atual.` 
    
    `Sem retorno.`
     
    ```js
    app.controller('AppController', function($scope, bootstrap) {
    
        $scope.alert = bootstrap.alert();
    
        $scope.alert.changeType('success');
        $scope.alert.changeTitle('Parabéns!');
        $scope.alert.changeMessage('Ocorreu tudo certo.');
        $scope.alert.changeShow(true);
        
        $scope.toggleAlert = function(){
            $scope.alert.changeShow();
        };
        
        $scope.dismissAlert = function(){
            $scope.alert.changeShow(false);
        };
    
    });
    ```

* **`alert.changeType(type)`**: Alterar o tipo da diretiva

    Parâmetro | Tipo | Descrição
    --- | --- | --- 
    `type` | `string` | `Valores válidos para o type "success", "info", "warning", "danger". O valor precisa ser atender os requisitos do Bootstrap Alert. Mais:` http://getbootstrap.com/components/#alerts 
    
    `Sem retorno.`
     
    ```js
    app.controller('AppController', function($scope, bootstrap) {
    
        $scope.alert = bootstrap.alert();
    
        $scope.alert.changeType('success');
        $scope.alert.changeTitle('Parabéns!');
        $scope.alert.changeMessage('Ocorreu tudo certo.');
        $scope.alert.changeShow(true);
        
        $scope.infoAlert = function(){
            $scope.alert.changeType('info');
        };
        
        $scope.dangerAlert = function(){
            $scope.alert.changeType('danger');
        };
    
    });
    ```
    
* **`alert.changeTitle(title)`**: Alterar o titulo da diretiva

    Parâmetro | Tipo | Descrição
    --- | --- | --- 
    `title` | `string` | `Texto de titulo do alert`
    
    `Sem retorno.`
     
    ```js
    app.controller('AppController', function($scope, bootstrap) {
    
        $scope.alert = bootstrap.alert();
    
        $scope.alert.changeType('success');
        
        $scope.alert.changeTitle('Parabéns!');
        
        $scope.alert.changeMessage('Ocorreu tudo certo.');
        $scope.alert.changeShow(true);
    
    });
    ```
    
* **`alert.changeMessage(message)`**: Alterar a mensagem da diretiva

    Parâmetro | Tipo | Descrição
    --- | --- | --- 
    `message` | `string` | `Texto de mensagem do alert do alert`
    
    `Sem retorno.`
     
    ```js
    app.controller('AppController', function($scope, bootstrap) {
    
        $scope.alert = bootstrap.alert();
    
        $scope.alert.changeType('success');
        $scope.alert.changeTitle('Parabéns!');
        
        $scope.alert.changeMessage('Ocorreu tudo certo.');
        
        $scope.alert.changeShow(true);
    
    });
    ```
    
* **`alert.responseSuccess(message)`**: Ajustar a diretiva para type = 'success', title='Parabéns!' e show = true. Recomendado para usar no callback de sucesso do `$request`

    Parâmetro | Tipo | Descrição
    --- | --- | --- 
    `message` | `string` | `Texto de mensagem do alert do alert`
    
    `Sem retorno.`
     
    ```js
    app.controller('AppController', function($scope, bootstrap) {
    
        $scope.alert = bootstrap.alert();
        
        //$scope.alert.changeType('success');
        //$scope.alert.changeTitle('Parabéns!');        
        //$scope.alert.changeMessage('Ocorreu tudo certo.');        
        //$scope.alert.changeShow(true);
        
        $scope.alert.responseSuccess('Ocorreu tudo certo.'); //Esta linha é equivalente às 4 linhas comentadas acima.
    
    });
    ```
    
* **`alert.responseError(meta)`**: Ajustar a diretiva para trabalhar com o meta do response. Recomendado para usar no callback de erro do `$request`

    Parâmetro | Tipo | Descrição
    --- | --- | --- 
    `meta` | `object` | `Objeto meta recebido pelo $request no callback de erro`
    
    `Sem retorno.`
     
    ```js
    app.controller('AppController', function($scope, bootstrap, $request) {
    
        $scope.alert = bootstrap.alert();
        
        var callbackSuccess = function(data, meta, response){
            $scope.alert.responseSuccess('Ocorreu tudo certo.');
        };       
                
        var callbackError = function(meta, status, response){
            $scope.alert.responseError(meta);
        };        
         
        $request.get('http://localhost/moca_bonita/')
                .addData({
                    page : 'pessoa', 
                    action : 'read'
                })
                .send(callbackSuccess, callbackError);
    
    });
    ```
    
##### bootstrap.loading
O `bootstrap.loading` trabalha com a diretiva loading-bootstrap do BarbaraJS, o loading é um componente do bootstrap que traz uma barra de progresso de forma mais elegante à página. O `bootstrap.loading` precisa está incluso dentro do scope, como atributo `loading`. ex: $scope.loading ou $rootScope.loading.
É necessário adicionar a diretiva na view:
```html
<div loading-bootstrap></div>
```

* **`loading.changeShow([show])`**: Alterar a visibilidade da diretiva

    Parâmetro | Tipo | Descrição
    --- | --- | --- 
    `show` | `boolean` | `Valor booleano para mostrar ou não mostrar a diretiva na view. Caso show não for definido, a visibilidade será o oposto da atual.` 
    
    `Sem retorno.`
     
    ```js
    app.controller('AppController', function($scope, bootstrap) {
    
        $scope.loading = bootstrap.loading();
    
        $scope.alert.changeType('success');
        $scope.alert.changeTitle('Parabéns!');
        $scope.alert.changeMessage('Ocorreu tudo certo.');
        $scope.alert.changeShow(true);
        
        $scope.toggleAlert = function(){
            $scope.alert.changeShow();
        };
        
        $scope.dismissAlert = function(){
            $scope.alert.changeShow(false);
        };
    
    });
    ```

* **`alert.changeType(type)`**: Alterar o tipo da diretiva

    Parâmetro | Tipo | Descrição
    --- | --- | --- 
    `type` | `string` | `Valores válidos para o type "success", "info", "warning", "danger". O valor precisa ser atender os requisitos do Bootstrap Alert. Mais:` http://getbootstrap.com/components/#alerts 
    
    `Sem retorno.`
     
    ```js
    app.controller('AppController', function($scope, bootstrap) {
    
        $scope.alert = bootstrap.alert();
    
        $scope.alert.changeType('success');
        $scope.alert.changeTitle('Parabéns!');
        $scope.alert.changeMessage('Ocorreu tudo certo.');
        $scope.alert.changeShow(true);
        
        $scope.infoAlert = function(){
            $scope.alert.changeType('info');
        };
        
        $scope.dangerAlert = function(){
            $scope.alert.changeType('danger');
        };
    
    });
    ```
    
* **`alert.changeTitle(title)`**: Alterar o titulo da diretiva

    Parâmetro | Tipo | Descrição
    --- | --- | --- 
    `title` | `string` | `Texto de titulo do alert`
    
    `Sem retorno.`
     
    ```js
    app.controller('AppController', function($scope, bootstrap) {
    
        $scope.alert = bootstrap.alert();
    
        $scope.alert.changeType('success');
        
        $scope.alert.changeTitle('Parabéns!');
        
        $scope.alert.changeMessage('Ocorreu tudo certo.');
        $scope.alert.changeShow(true);
    
    });
    ```
    
* **`alert.changeMessage(message)`**: Alterar a mensagem da diretiva

    Parâmetro | Tipo | Descrição
    --- | --- | --- 
    `message` | `string` | `Texto de mensagem do alert do alert`
    
    `Sem retorno.`
     
    ```js
    app.controller('AppController', function($scope, bootstrap) {
    
        $scope.alert = bootstrap.alert();
    
        $scope.alert.changeType('success');
        $scope.alert.changeTitle('Parabéns!');
        
        $scope.alert.changeMessage('Ocorreu tudo certo.');
        
        $scope.alert.changeShow(true);
    
    });
    ```
    
* **`alert.responseSuccess(message)`**: Ajustar a diretiva para type = 'success', title='Parabéns!' e show = true. Recomendado para usar no callback de sucesso do `$request`

    Parâmetro | Tipo | Descrição
    --- | --- | --- 
    `message` | `string` | `Texto de mensagem do alert do alert`
    
    `Sem retorno.`
     
    ```js
    app.controller('AppController', function($scope, bootstrap) {
    
        $scope.alert = bootstrap.alert();
        
        //$scope.alert.changeType('success');
        //$scope.alert.changeTitle('Parabéns!');        
        //$scope.alert.changeMessage('Ocorreu tudo certo.');        
        //$scope.alert.changeShow(true);
        
        $scope.alert.responseSuccess('Ocorreu tudo certo.'); //Esta linha é equivalente às 4 linhas comentadas acima.
    
    });
    ```
    
* **`alert.responseError(meta)`**: Ajustar a diretiva para trabalhar com o meta do response. Recomendado para usar no callback de erro do `$request`

    Parâmetro | Tipo | Descrição
    --- | --- | --- 
    `meta` | `object` | `Objeto meta recebido pelo $request no callback de erro`
    
    `Sem retorno.`
     
    ```js
    app.controller('AppController', function($scope, bootstrap, $request) {
    
        $scope.alert = bootstrap.alert();
        
        var callbackSuccess = function(data, meta, response){
            $scope.alert.responseSuccess('Ocorreu tudo certo.');
        };       
                
        var callbackError = function(meta, status, response){
            $scope.alert.responseError(meta);
        };        
         
        $request.get('http://localhost/moca_bonita/')
                .addData({
                    page : 'pessoa', 
                    action : 'read'
                })
                .send(callbackSuccess, callbackError);
    
    });
    ```
