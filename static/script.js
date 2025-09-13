function createCategory() {
            const name = document.getElementById("categoryName").value;
            if (!name) return alert("Digite um nome válido.");

            fetch("/api/categories", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ name })
            })
            .then(res => res.json())
            .then(data => {
                alert(data.message || "Categoria criada.");
                document.getElementById("categoryName").value = "";
            })
            .catch(err => alert("Erro ao criar categoria."));
        }

        function listCategories() {
            fetch("/api/categories")
            .then(res => res.json())
            .then(categories => {
                const list = document.getElementById("categoryList");
                list.innerHTML = "";
                if (categories.length === 0) {
                    list.innerHTML = "<p>Nenhuma categoria encontrada.</p>";
                    return;
                }

                categories.forEach(cat => {
                    const item = document.createElement("div");
                    item.innerHTML = `
                        <p><strong>ID:</strong> ${cat.id} | <strong>Nome:</strong> ${cat.name}</p>
                        <button onclick="deleteCategory(${cat.id})">Deletar</button>
                    `;
                    list.appendChild(item);
                });
            })
            .catch(err => alert("Erro ao listar categorias."));
        }

        function deleteCategory(id) {
            if (!confirm("Deseja realmente deletar essa categoria?")) return;

            fetch(`/api/categories/${id}`, {
                method: "DELETE"
            })
            .then(res => res.json())
            .then(data => {
                alert(data.message || "Categoria deletada.");
                listCategories();
            })
            .catch(err => alert("Erro ao deletar categoria."));
        }