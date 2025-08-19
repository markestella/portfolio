function throttle(func, limit) {
  let inThrottle;
  return function () {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

function createStars() {
  const starsContainer = document.querySelector('.stars');
  const starsCount = 100;
  const fragment = document.createDocumentFragment();

  for (let i = 0; i < starsCount; i++) {
    const star = document.createElement('div');
    star.classList.add('star');
    star.style.left = `${Math.random() * 100}%`;
    star.style.top = `${Math.random() * 100}%`;
    const size = Math.random() * 3;
    star.style.width = `${size}px`;
    star.style.height = `${size}px`;
    star.style.opacity = Math.random() * 0.8 + 0.2;
    star.style.animationDuration = `${Math.random() * 3 + 2}s`;
    fragment.appendChild(star);
  }
  starsContainer.appendChild(fragment);
}

function playLandingAnimation() {
  const welcomeMessage = document.querySelector('#welcome-message');
  const progressBar = document.querySelector('.progress-bar');
  const title = welcomeMessage.querySelector('h1');
  const paragraph = welcomeMessage.querySelector('p');

  gsap.to(title, {
    opacity: 1,
    y: 0,
    duration: 1,
    ease: 'power2.out'
  });

  gsap.to(paragraph, {
    opacity: 1,
    y: 0,
    duration: 1,
    delay: 0.5,
    ease: 'power2.out'
  });

  gsap.to(progressBar, {
    opacity: 1,
    duration: 0.5,
    delay: 1.5,
    onComplete: () => {
      gsap.to(progressBar, {
        width: '100%',
        duration: 3,
        ease: 'power2.inOut',
        onComplete: () => {
          gsap.to('#landing', {
            opacity: 0,
            duration: 1,
            onComplete: () => {
              document.getElementById('landing').style.display = 'none';
            }
          });
          gsap.to('header', {
            y: 0,
            duration: 0.8,
            ease: 'power2.out'
          });
          gsap.to('#home', {
            opacity: 1,
            y: 0,
            duration: 1,
            delay: 0.3,
            ease: 'power2.out'
          });
        }
      });
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  createStars();
  if (!sessionStorage.getItem('animationPlayed')) {
    playLandingAnimation();
    sessionStorage.setItem('animationPlayed', 'true');
  } else {
    document.getElementById('landing').style.display = 'none';
    document.querySelector('header').style.transform = 'translateY(0)';
    document.getElementById('home').style.opacity = '1';
    document.getElementById('home').style.transform = 'translateY(0)';
  }
});

const navLinks = document.querySelectorAll('nav a');
const sections = document.querySelectorAll('section');
const mobileMenuButton = document.getElementById('mobileMenuBtn');
const mobileNav = document.querySelector('nav ul');

function setActiveNav() {
  let current = '';
  const scrollYPosition = window.scrollY;
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    if (scrollYPosition >= sectionTop - sectionHeight / 3) {
      current = section.getAttribute('id');
    }
  });
  navLinks.forEach(link => {
    const shouldBeActive = link.getAttribute('href') === `#${current}`;
    link.classList.toggle('active', shouldBeActive);
  });
}

navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const targetId = link.getAttribute('href');
    const targetSection = document.querySelector(targetId);
    if (targetSection) {
      window.scrollTo({
        top: targetSection.offsetTop - 80,
        behavior: 'smooth'
      });
    }
    mobileNav.classList.remove('active');
  });
});

mobileMenuButton.addEventListener('click', () => {
  mobileNav.classList.toggle('active');
});

function handleScroll() {
  setActiveNav();
  const windowHeight = window.innerHeight;
  sections.forEach(section => {
    const sectionTop = section.getBoundingClientRect().top;
    if (sectionTop < windowHeight * 0.75) {
      section.classList.add('visible');
    }
  });
}

window.addEventListener('scroll', throttle(handleScroll, 150));

const aboutTabs = document.querySelectorAll('.about-tabs .tab-btn');
const aboutPanels = document.querySelectorAll('.about-content .content-panel');

aboutTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    if (tab.dataset.tab === 'profile') {
      const link = document.createElement('a');
      link.href = './assets/cv.pdf';
      link.download = 'Mark_Estella_CV.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
    aboutTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    aboutPanels[0].style.transform = 'rotateY(-180deg)';
    aboutPanels[0].style.opacity = '0';
    aboutPanels[1].style.transform = 'rotateY(0deg)';
    aboutPanels[1].style.opacity = '1';
  });
});

const paginationConfig = {
  projects: {
    itemsPerPage: 6,
    container: document.querySelector('.projects-panel .contents-grid')
  },
  certificates: {
    itemsPerPage: 6,
    container: document.querySelector('.certificates-panel .contents-grid')
  },
  tech: {
    itemsPerPage: 28,
    container: document.querySelector('.tech-panel .tech-stack-grid')
  }
};

let currentPage = {
  projects: 1,
  certificates: 1,
  tech: 1
};
let activeTab = 'projects';
let filteredProjects = [...projects];
let selectedTechFilters = [];
let searchQuery = '';

document.addEventListener('DOMContentLoaded', () => {
  renderProjects(currentPage.projects);
  renderCertificates(currentPage.certificates);
  renderTechStack(currentPage.tech);
  setupTabs();
  setupModals();
  setupPagination(activeTab, filteredProjects.length);
  setupTechFilters();
  setupEventListeners();
  updatePageInfo();
});

function setupEventListeners() {
  document.getElementById('project-search').addEventListener('input', (e) => {
    searchQuery = e.target.value.toLowerCase();
    filterProjects();
  });

  const filterToggle = document.getElementById("filter-toggle");
  const filterModal = document.getElementById("filter-modal");
  const filterCloseModal = document.querySelector('.filter-close-modal');

  filterToggle.addEventListener("click", () => filterModal.classList.add("active"));
  filterCloseModal.addEventListener("click", () => filterModal.classList.remove("active"));
  filterModal.addEventListener("click", (e) => {
    if (e.target === filterModal) {
      filterModal.classList.remove("active");
    }
  });

  document.getElementById('reset-filters').addEventListener('click', resetFilters);

  paginationConfig.projects.container.addEventListener('click', e => {
    const viewDetailsButton = e.target.closest('.view-details');
    if (viewDetailsButton) {
      e.preventDefault();
      const projectId = viewDetailsButton.dataset.project;
      const project = projects.find(p => p.id === projectId);
      if (project) {
        openProjectModal(project);
      }
    }
  });
}

function setupTechFilters() {
  const techFiltersContainer = document.getElementById('tech-filters');
  const allTech = [...new Set(projects.flatMap(project => project.tech))];
  const fragment = document.createDocumentFragment();

  allTech.forEach(tech => {
    const filter = document.createElement('div');
    filter.className = 'tech-filter';
    filter.textContent = tech;
    filter.dataset.tech = tech;
    filter.addEventListener('click', () => {
      filter.classList.toggle('active');
      const techName = filter.dataset.tech;
      const index = selectedTechFilters.indexOf(techName);
      if (index > -1) {
        selectedTechFilters.splice(index, 1);
      } else {
        selectedTechFilters.push(techName);
      }
      filterProjects();
    });
    fragment.appendChild(filter);
  });
  techFiltersContainer.appendChild(fragment);
}

function filterProjects() {
  filteredProjects = projects.filter(project => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchQuery) ||
      project.description.toLowerCase().includes(searchQuery) ||
      project.category.toLowerCase().includes(searchQuery) ||
      project.tech.some(tech => tech.toLowerCase().includes(searchQuery));
    const matchesTech = selectedTechFilters.length === 0 ||
      selectedTechFilters.every(tech => project.tech.includes(tech));
    return matchesSearch && matchesTech;
  });
  currentPage.projects = 1;
  renderProjects(currentPage.projects);
  setupPagination('projects', filteredProjects.length);
  updatePageInfo();
}

function resetFilters() {
  searchQuery = '';
  selectedTechFilters = [];
  document.getElementById('project-search').value = '';
  document.querySelectorAll('.tech-filter.active').forEach(filter => {
    filter.classList.remove('active');
  });
  document.getElementById('filter-modal').classList.remove('active');
  filterProjects();
}

function setupTabs() {
  const showcaseTabs = document.querySelectorAll('.showcase-tab');
  const showcasePanels = document.querySelectorAll('.showcase-panel');
  const filtersContainer = document.querySelector('.filters-container');

  showcaseTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      showcaseTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const targetTab = tab.dataset.tab;
      activeTab = targetTab;
      showcasePanels.forEach(panel => {
        const isActive = panel.classList.contains(`${targetTab}-panel`);
        panel.classList.toggle('active', isActive);
      });
      const totalItems = activeTab === 'projects' ? filteredProjects.length :
        activeTab === 'certificates' ? certificates.length : techStack.length;
      setupPagination(activeTab, totalItems);
      updatePageInfo();
      filtersContainer.style.display = (activeTab === 'projects') ? 'flex' : 'none';
    });
  });
}

function renderProjects(page) {
  const config = paginationConfig.projects;
  const startIndex = (page - 1) * config.itemsPerPage;
  const endIndex = startIndex + config.itemsPerPage;
  const pageItems = filteredProjects.slice(startIndex, endIndex);
  config.container.innerHTML = '';
  const fragment = document.createDocumentFragment();

  if (pageItems.length === 0) {
    const emptyState = document.createElement('div');
    emptyState.className = 'empty-state';
    emptyState.innerHTML = `
      <i class="fas fa-search"></i>
      <h3>No Projects Found</h3>
      <p>Try adjusting your search or filter criteria</p>
      <button class="btn btn-outline" id="reset-empty">Reset Filters</button>
    `;
    config.container.appendChild(emptyState);
    document.getElementById('reset-empty').addEventListener('click', resetFilters);
    return;
  }
  pageItems.forEach(project => {
    const projectCard = document.createElement('div');
    projectCard.className = 'project-card';
    projectCard.innerHTML = `
      <div class="project-image">
        <img src="${project.image}" alt="${project.title}">
        <div class="project-badge">${project.category}</div>
      </div>
      <div class="project-content">
        <h3>${project.title}</h3>
        <p>${project.description.substring(0, 120)}...</p>
        <div class="project-actions">
          <a href="#" class="project-link view-details" data-project="${project.id}">
            View Details <i class="fas fa-arrow-right"></i>
          </a>
        </div>
      </div>
    `;
    fragment.appendChild(projectCard);
  });
  config.container.appendChild(fragment);
}

function renderCertificates(page) {
  const config = paginationConfig.certificates;
  const startIndex = (page - 1) * config.itemsPerPage;
  const endIndex = startIndex + config.itemsPerPage;
  const pageItems = certificates.slice(startIndex, endIndex);
  config.container.innerHTML = '';
  const fragment = document.createDocumentFragment();

  pageItems.forEach(cert => {
    const certCard = document.createElement('div');
    certCard.className = 'certificate-card';
    certCard.innerHTML = `
      <div class="certificate-image">
        <img src="${cert.image}" alt="${cert.title}">
        <div class="certificate-badge">${cert.date}</div>
      </div>
      <div class="certificate-content">
        <h3>${cert.title}</h3>
        <p>Issued by ${cert.issuer}</p>
      </div>
    `;
    fragment.appendChild(certCard);
  });
  config.container.appendChild(fragment);
}

function renderTechStack(page) {
  const config = paginationConfig.tech;
  const startIndex = (page - 1) * config.itemsPerPage;
  const endIndex = startIndex + config.itemsPerPage;
  const pageItems = techStack.slice(startIndex, endIndex);
  config.container.innerHTML = '';
  const fragment = document.createDocumentFragment();

  pageItems.forEach(tech => {
    const techItem = document.createElement('div');
    techItem.className = 'tech-item';
    techItem.innerHTML = `
                          <img src="${tech.icon}" alt="${tech.name}" class="tech-icon" />
                          <div class="tech-name">${tech.name}</div>
                        `;
    fragment.appendChild(techItem);
  });
  config.container.appendChild(fragment);
}

function setupPagination(type, totalItems) {
  const paginationContainer = document.getElementById('global-pagination');
  const config = paginationConfig[type];
  const totalPages = Math.ceil(totalItems / config.itemsPerPage) || 1;
  const currentPageNum = currentPage[type];

  paginationContainer.querySelectorAll('.page-btn:not(.prev):not(.next), .page-ellipsis').forEach(el => el.remove());

  const nextBtn = paginationContainer.querySelector('.next');

  if (totalPages > 1) {
    let pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPageNum > 3) pages.push('...');
      let start = Math.max(2, currentPageNum - 1);
      let end = Math.min(totalPages - 1, currentPageNum + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (currentPageNum < totalPages - 2) pages.push('...');
      pages.push(totalPages);
    }
    pages.forEach(pageNum => {
      if (pageNum === '...') {
        const ellipsis = document.createElement('span');
        ellipsis.className = 'page-ellipsis';
        ellipsis.textContent = '...';
        paginationContainer.insertBefore(ellipsis, nextBtn);
      } else {
        const pageBtn = document.createElement('button');
        pageBtn.className = 'page-btn';
        pageBtn.textContent = pageNum;
        if (pageNum === currentPageNum) pageBtn.classList.add('active');
        pageBtn.addEventListener('click', () => handlePageChange(type, pageNum));
        paginationContainer.insertBefore(pageBtn, nextBtn);
      }
    });
  }

  const prevBtn = paginationContainer.querySelector('.prev');
  prevBtn.disabled = currentPageNum === 1;
  nextBtn.disabled = currentPageNum === totalPages;

  prevBtn.onclick = () => {
    if (currentPageNum > 1) handlePageChange(type, currentPageNum - 1);
  };
  nextBtn.onclick = () => {
    if (currentPageNum < totalPages) handlePageChange(type, currentPageNum + 1);
  };
}

function handlePageChange(type, newPage) {
  currentPage[type] = newPage;
  if (type === 'projects') {
    renderProjects(newPage);
  } else if (type === 'certificates') {
    renderCertificates(newPage);
  } else {
    renderTechStack(newPage);
  }
  const totalItems = type === 'projects' ? filteredProjects.length :
    type === 'certificates' ? certificates.length : techStack.length;
  setupPagination(type, totalItems);
  updatePageInfo();
}

function updatePageInfo() {
  const config = paginationConfig[activeTab];
  const totalItems = activeTab === 'projects' ? filteredProjects.length :
    activeTab === 'certificates' ? certificates.length : techStack.length;
  const totalPages = Math.ceil(totalItems / config.itemsPerPage) || 1;
  const pageInfo = document.getElementById('page-info');
  pageInfo.textContent = `Page ${currentPage[activeTab]} of ${totalPages}`;
}

function setupModals() {
  const modal = document.getElementById('projectModal');
  const closeModal = document.querySelector('.close-modal');
  const close = () => {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
  };
  closeModal.addEventListener('click', close);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      close();
    }
  });
}

function openProjectModal(project) {
  const modal = document.getElementById('projectModal');
  document.getElementById('modalTitle').textContent = project.title;
  document.getElementById('modalDate').textContent = project.date;

  const modalMediaContainer = document.getElementById('modalMedia');

  modalMediaContainer.innerHTML = '';

  if (project.video) {
    const iframe = document.createElement('iframe');
    iframe.src = `https://www.youtube.com/embed/${project.video}`;
    iframe.title = project.title;
    iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
    iframe.allowFullscreen = true;
    iframe.width = "100%";
    iframe.height = "400";
    modalMediaContainer.appendChild(iframe);
  } else {
    const img = document.createElement('img');
    img.src = project.image;
    img.alt = project.title;
    modalMediaContainer.appendChild(img);
  }

  document.getElementById('modalDescription').textContent = project.description;

  const modalTech = document.getElementById('modalTech');
  modalTech.innerHTML = '';

  project.tech.forEach(tech => {
    const tag = document.createElement('span');
    tag.className = 'tech-tag';
    tag.textContent = tech;
    modalTech.appendChild(tag);
  });

  // Update modal links
  const modalLinks = document.querySelector('.modal-links');
  modalLinks.innerHTML = `
    ${project.codeLink
      ? `<a href="${project.codeLink}" class="btn btn-primary" target="_blank" rel="noopener noreferrer">
           <i class="fab fa-github"></i> View Code
         </a>`
      : ""
    }
    ${project.demoLink
      ? `<a href="${project.demoLink}" class="btn btn-outline" target="_blank" rel="noopener noreferrer">
           <i class="fas fa-external-link-alt"></i> Live Demo
         </a>`
      : ""
    }
  `;

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

const API_URL = "https://portfolio-contact-api-j0fi.onrender.com/api/contact";
document.getElementById('contact-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = {
    name: document.getElementById('name').value,
    email: document.getElementById('email').value,
    subject: document.getElementById('subject').value,
    message: document.getElementById('message').value
  };
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });
    if (response.ok) {
      alert('Thanks for reaching out! I’ll get back to you soon.');
      e.target.reset();
    } else {
      const errorData = await response.json();
      alert(`Failed to send message: ${errorData.message || 'Please try again later.'}`);
    }
  } catch (error) {
    console.error("Error submitting form:", error);
    alert('An error occurred. Please check your connection and try again.');
  }
});

window.addEventListener('load', () => {
  handleScroll();
});