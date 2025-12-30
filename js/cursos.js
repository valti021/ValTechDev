// ===================== CURSOS (JSON EXTERNO) =====================
const COURSES_JSON_URL = "data/courses.json";
const YT_MAX_COURSES = 2;

const coursesContainer = document.getElementById("coursesGrid");

async function fetchCoursesFromJSON() {
    try {
        const resp = await fetch(COURSES_JSON_URL);
        if (!resp.ok) {
            throw new Error("Erro ao carregar courses.json");
        }
        const courses = await resp.json();
        return courses.slice(0, YT_MAX_COURSES);
    } catch (error) {
        console.error("Erro ao buscar cursos:", error);
        return [];
    }
}

function renderCourses(courses) {
    if (!coursesContainer) return;
    coursesContainer.innerHTML = "";

    if (!courses || courses.length === 0) {
        coursesContainer.innerHTML = "<p class='no-courses'>Ainda não há cursos disponíveis.</p>";
        return;
    }

    courses.forEach(course => {
        // Limpa o ID removendo parâmetros extras (como &si=...)
        const cleanId = course.id.split('&')[0];
        const playlistUrl = `https://www.youtube.com/playlist?list=${cleanId}`;
        
        // Pega a imagem diretamente do campo 'img' do JSON
        const thumbnailUrl = course.img;

        const card = document.createElement("div");
        card.className = "course-card";
        
        card.innerHTML = `
            <a href="${playlistUrl}" target="_blank" rel="noopener noreferrer" class="course-link">
                <div class="thumb-container">
                    <img src="${thumbnailUrl}" 
                         alt="${course.title}" 
                         class="course-thumb"
                         loading="lazy"
                         onerror="this.onerror=null; this.src='https://via.placeholder.com/300x169/333/666?text=Imagem+Não+Disponível'">
                    <div class="video-count-badge">${course.count} aulas</div>
                </div>
                <div class="course-info">
                    <h4 class="course-title">${course.title}</h4>
                    <div class="course-meta">
                        <span class="yt-brand">YouTube</span>
                    </div>
                </div>
            </a>
        `;

        coursesContainer.appendChild(card);
    });
}

async function loadCourses() {
    try {
        const courses = await fetchCoursesFromJSON();
        renderCourses(courses);
    } catch (error) {
        console.error("Erro ao carregar cursos:", error);
        if (coursesContainer) {
            coursesContainer.innerHTML = `
                <div class="error-message">
                    <p>Erro ao carregar cursos.</p>
                    <button onclick="loadCourses()" class="retry-btn">Tentar novamente</button>
                </div>
            `;
        }
    }
}

// Carrega os cursos quando a página estiver pronta
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadCourses);
} else {
    loadCourses();
}