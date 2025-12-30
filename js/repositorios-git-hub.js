const username = "USUARIO_GIT_HUB";
const projectsGrid = document.getElementById("projectsGrid");

async function carregarRepositorios() {
    try {
        const response = await fetch(`https://api.github.com/users/${username}/repos`);

        if (!response.ok) {
            throw new Error(`Erro HTTP ${response.status}`);
        }

        const repos = await response.json();

        if (!Array.isArray(repos)) {
            throw new Error("Resposta inválida da API");
        }

        projectsGrid.innerHTML = "";

        repos.forEach(repo => {
            if (repo.fork) return;

            const card = document.createElement("div");
            card.className = "project-card";

            card.innerHTML = `
                <h3>${repo.name}</h3>
                <p>${repo.description || "Projeto sem descrição."}</p>
                <a href="${repo.html_url}" target="_blank">Ver no GitHub →</a>
            `;

            projectsGrid.appendChild(card);
        });

    } catch (err) {
        console.error(err);
        projectsGrid.innerHTML = "<p>Erro ao carregar projetos.</p>";
    }
}

document.addEventListener("DOMContentLoaded", carregarRepositorios);
