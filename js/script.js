//simula um banco de dados em memória
var clientes = []

//guarda o objeto que está sendo alterado
var clienteAlterado = null

function adicionar(){
    //libera para digitar o CPF
    document.getElementById("cpf").disabled = false
    clienteAlterado = null
    mostrarModal()
    limparForm()
}
function alterar(cpf){

    //procurar o cliente que tem o CPF clicado no alterar
    for(let i = 0; i < clientes.length; i++){
        let cliente = clientes[i]
        if (cliente.cpf == cpf){
            //achou o cliente, entao preenche o form
            document.getElementById("nome").value = cliente.nome
            document.getElementById("cpf").value = cliente.cpf
            document.getElementById("telefone").value = cliente.telefone
            document.getElementById("idade").value = cliente.idade
            document.getElementById("tamanhoDoChinelo").value = cliente.tamanhoDoChinelo
            clienteAlterado = cliente
        }
    }
    //bloquear o cpf para nao permitir alterá-lo
    document.getElementById("cpf").disabled = true
    mostrarModal()
}
function excluir(cpf){
    if (confirm("Você deseja realmente excluir?")){
        fetch("http://localhost:3000/excluir/" + cpf, {
            headers: {
                "Content-type": "application/json"
            },
            method: "DELETE"
        }).then((response) => {
            //após terminar de excluir, recarrega a lista 
            //de clientes
            recarregarClientes()
            alert("Cliente excluído com sucesso")
        }).catch((error) => {
            console.log(error)
            alert("Não foi possível excluir o cliente")
        })       
    }
}
function mostrarModal(){
    let containerModal = document.getElementById("container-modal")
    containerModal.style.display = "flex"
}
function ocultarModal(){
    let containerModal = document.getElementById("container-modal")
    containerModal.style.display = "none"
}
function cancelar(){
    ocultarModal()
    limparForm()
}
function salvar(){
    let nome = document.getElementById("nome").value
    let cpf = document.getElementById("cpf").value
    let telefone = document.getElementById("telefone").value
    let idade = document.getElementById("idade").value
    let tamanhoDoChinelo = document.getElementById("tamanhoDoChinelo").value

    //se não estiver alterando ninguém, adiciona no vetor
    if (clienteAlterado == null){
        let cliente = {
            "nome": nome,
            "cpf": cpf,
            "telefone": telefone,
            "idade": idade,
            "tamanhoDoChinelo": tamanhoDoChinelo
        }

        //salva o cliente no back-end
        fetch("http://localhost:3000/cadastrar", {
            headers: {
                "Content-type": "application/json"
            },
            method: "POST",
            body: JSON.stringify(cliente)
        }).then(() => {
            clienteAlterado = null
            //limpa o form
            limparForm()
            ocultarModal()
            recarregarClientes()
            alert("Cliente cadastrado com sucesso")
        }).catch(() => {
            alert("Ops... algo deu errado")
        })

    }else{
        clienteAlterado.nome = nome
        clienteAlterado.cpf = cpf
        clienteAlterado.telefone = telefone
        clienteAlterado.idade = idade
        clienteAlterado.tamanhoDoChinelo = tamanhoDoChinelo
        fetch("http://localhost:3000/alterar", {
            headers: {
                "Content-type": "application/json"
            },
            method: "PUT",
            body: JSON.stringify(clienteAlterado)
        }).then((response) => {
            clienteAlterado = null
            //limpa o form
            limparForm()
            ocultarModal()
            recarregarClientes()
            alert("Cliente alterado com sucesso")
        }).catch((error) => {
            alert("Não foi possível alterar o cliente")
        })
    }
}

//Buscador de clientes(professor, não sabia se deveria buscar pelo nome ou cpf, coloquei os dois para evitar problemas haha, obrigado pela prova)
function buscarClientes() {
    let busca = document.getElementById("busca").value.toLowerCase();
    let clientesListados = clientes.filter(cliente => {
        return cliente.nome.toLowerCase().includes(busca) || cliente.cpf.includes(busca);
    });
    exibirDados(clientesListados);
}

function exibirDados(clientesParaExibir = clientes) {
    let tbody = document.querySelector("#table-customers tbody");
    tbody.innerHTML = "";

    for (let i = 0; i < clientesParaExibir.length; i++) {
        let linha = `
        <tr>
            <td>${clientesParaExibir[i].nome}</td>
            <td>${clientesParaExibir[i].cpf}</td>
            <td>${clientesParaExibir[i].telefone}</td>
            <td>${clientesParaExibir[i].idade}</td>
            <td>${clientesParaExibir[i].tamanhoDoChinelo}</td>
            <td>
                <button onclick="alterar('${clientesParaExibir[i].cpf}')">Alterar</button>
                <button onclick="excluir('${clientesParaExibir[i].cpf}')" class="botao-excluir">Excluir</button>
            </td>
        </tr>`;
        
        let tr = document.createElement("tr");
        tr.innerHTML = linha;
        tbody.appendChild(tr);
    }
}

function limparForm(){
    document.getElementById("nome").value = ""
    document.getElementById("cpf").value = ""
    document.getElementById("telefone").value = ""
    document.getElementById("idade").value = ""
    document.getElementById("tamanhoDoChinelo").value = ""
}

function recarregarClientes(){
    fetch("http://localhost:3000/listar", {
        headers: {
            "Content-type": "application/json"
        },
        method: "GET"
    }).then((response) => response.json()) //converte a resposta para JSON
    .then((response) => {
        console.log(response)
        clientes = response //recebe os clientes do back-end

        //chama função para ordenar
        ordenarClientes(clientes, 'nome');

        exibirDados()
    }).catch((error) => {
        alert("Erro ao listar os clientes")
    })
}

//função para deixar os clientes na ordem
function ordenarClientes(clientes, ordem) {
    for (let i = 1; i < clientes.length; i++) {
        let alfabeto = clientes[i];
        let j = i - 1;

        while (j >= 0 && clientes[j][ordem] > alfabeto[ordem]) {
            clientes[j + 1] = clientes[j];
            j = j - 1;
        }
        clientes[j + 1] = alfabeto;
    }
}