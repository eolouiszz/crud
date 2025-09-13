// Cria nova categoria
function createCategory() {
    const name = document.getElementById("categoryName").value.trim();
    if (!name) return alert("Digite um nome válido.");
    if (name.length < 4) return alert("O nome da categoria precisa ter pelo menos 4 caracteres.");

    fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name })
    })
    .then(res => res.json())
    .then(data => {
        alert(data.message || "Categoria criada.");
        document.getElementById("categoryName").value = "";
        // Não atualiza a lista automaticamente
    })
    .catch(err => alert("Erro ao criar categoria."));
}

// Lista todas as categorias
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
            item.className = "category-item";
            item.innerHTML = `
                <p><strong>ID:</strong> ${cat.id} | <strong>Nome:</strong> <span class="cat-name">${cat.name}</span></p>
                <div class="action-buttons">
                    <button class="editar" onclick="startEditing(${cat.id}, this)">Editar</button>
                    <button class="deletar" onclick="deleteCategory(${cat.id})">Deletar</button>
                </div>
            `;
            list.appendChild(item);
        });
    })
    .catch(err => alert("Erro ao listar categorias."));
}

// Deleta categoria
function deleteCategory(id) {
    if (!confirm("Deseja realmente deletar essa categoria?")) return;

    fetch(`/api/categories/${id}`, { method: "DELETE" })
    .then(res => res.json())
    .then(data => {
        alert(data.message || "Categoria deletada.");
        listCategories();
    })
    .catch(err => alert("Erro ao deletar categoria."));
}

// Inicia edição: substitui o nome pelo input
function startEditing(id, btn) {
    const itemDiv = btn.closest(".category-item");
    const nameSpan = itemDiv.querySelector(".cat-name");
    const currentName = nameSpan.textContent;

    // Cria input substituindo o span
    const input = document.createElement("input");
    input.type = "text";
    input.value = currentName;
    input.className = "edit-input";

    // Cria botão salvar
    const saveBtn = document.createElement("button");
    saveBtn.textContent = "Salvar";
    saveBtn.className = "atualizar";

    saveBtn.onclick = () => {
        const newName = input.value.trim();
        if (!newName) return alert("Digite um nome válido.");
        if (newName.length < 4) return alert("O nome da categoria precisa ter pelo menos 4 caracteres.");

        // Atualiza no backend
        fetch(`/api/categories/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: newName })
        })
        .then(res => res.json())
        .then(data => {
            alert(data.message || "Categoria atualizada.");
            nameSpan.textContent = newName; // substitui o nome antigo
            input.replaceWith(nameSpan); // restaura o span no lugar do input
            saveBtn.remove(); // remove botão salvar
        })
        .catch(err => alert("Erro ao atualizar categoria."));
    };

    // Substitui o span pelo input
    nameSpan.replaceWith(input);
    // Adiciona botão salvar depois do input
    input.after(saveBtn);
}
