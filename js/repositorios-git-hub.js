// ===================== GITHUB PROJECTS =====================
const username = "valti021";
const projectsGrid = document.getElementById("projectsGrid");

async function carregarRepositorios() {
    try {
        const response = await fetch(`https://api.github.com/users/${username}/repos`);
        const repos = await response.json();

        projectsGrid.innerHTML = "";

        repos.forEach(repo => {
            if (repo.fork) return;

            const card = document.createElement("div");
            card.className = "project-card";

            card.innerHTML = `
                <div class="card-content">
                    <h3>${repo.name}</h3>
                    <p>${repo.description || "Projeto sem descrição no GitHub."}</p>
                    <a href="${repo.html_url}" target="_blank" class="project-link">
                        Ver no GitHub →
                    </a>
                </div>
            `;

            projectsGrid.appendChild(card);
        });

    } catch (erro) {
        projectsGrid.innerHTML = "<p>Não foi possível carregar os projetos.</p>";
        console.error("Erro ao carregar repositórios:", erro);
    }
}

carregarRepositorios();