document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("product-form");
    const updateButton = document.getElementById("update-product-button");
    const deleteButton = document.getElementById("delete-product-button");
    const productList = document.getElementById("product-list");

    // Função para atualizar um produto quando o botão de atualização for clicado
    updateButton.addEventListener("click", function (event) {
        event.preventDefault(); // Impede o comportamento padrão do botão

        const productId = prompt("Digite o ID do produto que deseja atualizar:");
        if (!productId) {
            return; // Se o usuário cancelar, saia da função
        }

        const updatedData = {
            name: document.getElementById("product-name").value,
            brand: document.getElementById("product-brand").value,
            value: parseFloat(document.getElementById("product-value").value),
        };

        // Chama a função para atualizar o produto
        updateProduct(productId, updatedData);
    });

    // Função para excluir o produto quando o botão de exclusão for clicado
    deleteButton.addEventListener("click", function (event) {
        event.preventDefault(); // Impede o comportamento padrão do botão

        const productId = prompt("Digite o ID do produto que deseja excluir:");
        if (!productId) {
            return; // Se o usuário cancelar, saia da função
        }

        // Chama a função para excluir o produto
        deleteProduct(productId);
    });

    // Função para listar todos os produtos
    function getAllProducts() {
        fetch("http://localhost:8080/products")
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Erro na solicitação.");
                }
                return response.json();
            })
            .then((data) => {
                // Lida com os dados recebidos do backend (lista de produtos com IDs)
                console.log("Produtos recebidos do backend:", data);

                const productsTableBody = document.querySelector("#products-table tbody");

                // Limpa as linhas existentes da tabela
                productsTableBody.innerHTML = "";

                // Adiciona cada produto como uma nova linha na tabela
                data.forEach((product) => {
                    const row = productsTableBody.insertRow();
                    row.innerHTML = `<td>${product.idProduct}</td>
                                     <td>${product.name}</td>
                                     <td>${product.brand}</td>
                                     <td>${product.value}</td>`;
                });
            })
            .catch((error) => {
                console.error("Erro:", error);
            });
    }

    // Função para cadastrar um novo produto (POST)
    form.addEventListener("submit", function (event) {
        event.preventDefault();

        const productName = document.getElementById("product-name").value;
        const productBrand = document.getElementById("product-brand").value;
        const productValue = parseFloat(document.getElementById("product-value").value);

        if (isNaN(productValue)) {
            alert("Por favor, insira um valor numérico válido para o preço.");
            return;
        }

        const productData = {
            name: productName,
            brand: productBrand,
            value: productValue,
        };

        fetch("http://localhost:8080/products", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(productData),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Erro na solicitação.");
                }
                return response.json();
            })
            .then(() => {
                getAllProducts(); // Atualiza a lista de produtos após o cadastro
                form.reset();
            })
            .catch((error) => {
                console.error("Erro:", error);
            });
    });

    // Função para atualizar um produto no backend (PUT)
    function updateProduct(productId, updatedData) {
        fetch(`http://localhost:8080/products/${productId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedData),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Erro na solicitação.");
                }
                return response.json();
            })
            .then(() => {
                getAllProducts(); // Atualiza a lista de produtos após a atualização
            })
            .catch((error) => {
                console.error("Erro:", error);
            });
    }

 // Função para excluir um produto
function deleteProduct(productId) {
    fetch(`http://localhost:8080/products/${productId}`, {
        method: "DELETE",
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Erro na solicitação.");
            }
            return response.json(); // Processa a resposta JSON (se houver)
        })
        .then((data) => {
            // Aqui você pode lidar com a resposta JSON (por exemplo, exibir uma mensagem de confirmação)
            console.log("Produto excluído do backend:", data);
        })
        .catch((error) => {
            console.error("Erro:", error);
        });
}



    // Inicializa a lista de produtos
    getAllProducts();
});
