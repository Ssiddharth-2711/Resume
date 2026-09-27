/**
 * Siddharth Sahu Portfolio - Core Interactive Features
 * Modern, smooth, accessible micro-interactions & animations
 */

document.addEventListener('DOMContentLoaded', () => {
  // --------------------------------------------------------------------------
  // 1. Loading Screen
  // --------------------------------------------------------------------------
  const loadingScreen = document.getElementById('loading-screen');
  if (loadingScreen) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        loadingScreen.classList.add('fade-out');
        setTimeout(() => loadingScreen.remove(), 600);
      }, 700);
    });
    // Fallback if load already fired or takes too long
    setTimeout(() => {
      if (document.body.contains(loadingScreen)) {
        loadingScreen.classList.add('fade-out');
        setTimeout(() => loadingScreen.remove(), 600);
      }
    }, 2000);
  }

  // --------------------------------------------------------------------------
  // 2. Custom Animated Cursor
  // --------------------------------------------------------------------------
  const cursorDot = document.querySelector('.custom-cursor');
  const cursorFollower = document.querySelector('.custom-cursor-follower');

  if (cursorDot && cursorFollower && window.matchMedia('(pointer: fine)').matches) {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let followerX = mouseX;
    let followerY = mouseY;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDot.style.left = `${mouseX}px`;
      cursorDot.style.top = `${mouseY}px`;
    });

    const renderFollower = () => {
      followerX += (mouseX - followerX) * 0.18;
      followerY += (mouseY - followerY) * 0.18;
      cursorFollower.style.left = `${followerX}px`;
      cursorFollower.style.top = `${followerY}px`;
      requestAnimationFrame(renderFollower);
    };
    requestAnimationFrame(renderFollower);

    // Expand cursor on interactive elements
    const interactiveElements = document.querySelectorAll('a, button, input, textarea, .glass-card, .skill-pill, .filter-btn');
    interactiveElements.forEach((el) => {
      el.addEventListener('mouseenter', () => {
        cursorDot.classList.add('active');
        cursorFollower.classList.add('active');
      });
      el.addEventListener('mouseleave', () => {
        cursorDot.classList.remove('active');
        cursorFollower.classList.remove('active');
      });
    });
  }

  // --------------------------------------------------------------------------
  // 3. Scroll Progress Indicator & Back To Top Ring
  // --------------------------------------------------------------------------
  const progressBar = document.querySelector('.scroll-progress-bar');
  const backToTopBtn = document.getElementById('back-to-top');
  const progressRing = document.querySelector('.progress-ring-circle');
  const circumference = 2 * Math.PI * 22; // radius ~22 => circumference ~138.2

  if (progressRing) {
    progressRing.style.strokeDasharray = `${circumference} ${circumference}`;
    progressRing.style.strokeDashoffset = `${circumference}`;
  }

  const handleScroll = () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

    if (progressBar) {
      progressBar.style.width = `${scrollPercent}%`;
    }

    if (backToTopBtn) {
      if (scrollTop > 350) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }

      if (progressRing) {
        const offset = circumference - (scrollPercent / 100) * circumference;
        progressRing.style.strokeDashoffset = offset;
      }
    }

    // Navbar Scrolled State
    const navbar = document.querySelector('.navbar');
    if (navbar) {
      if (scrollTop > 40) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // --------------------------------------------------------------------------
  // 4. Navbar Active State Scroll Spy
  // --------------------------------------------------------------------------
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link[href^="#"]');

  const updateActiveNavLink = () => {
    let currentId = '';
    const scrollPosition = window.scrollY + 140;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        currentId = section.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentId}`) {
        link.classList.add('active');
      }
    });
  };

  window.addEventListener('scroll', updateActiveNavLink, { passive: true });
  updateActiveNavLink();

  // --------------------------------------------------------------------------
  // 5. Mobile Navigation Drawer
  // --------------------------------------------------------------------------
  const mobileToggle = document.getElementById('mobile-toggle');
  const mobileMenu = document.getElementById('mobile-menu');

  if (mobileToggle && mobileMenu) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('open');
      mobileToggle.classList.toggle('open', isOpen);
      mobileToggle.setAttribute('aria-expanded', isOpen);
    });

    mobileMenu.querySelectorAll('.nav-link').forEach((link) => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        mobileToggle.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', 'false');
      });
    });

    document.addEventListener('click', (e) => {
      if (!mobileMenu.contains(e.target) && !mobileToggle.contains(e.target) && mobileMenu.classList.contains('open')) {
        mobileMenu.classList.remove('open');
        mobileToggle.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // --------------------------------------------------------------------------
  // 6. Rotating Subtitle Typewriter
  // --------------------------------------------------------------------------
  const typewriterTarget = document.getElementById('typewriter-text');
  const roles = [
    'AI/ML Engineer',
    'FastAPI Developer',
    'LangChain Explorer',
    'Java DSA Learner'
  ];

  if (typewriterTarget) {
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typeSpeed = 90;
    const deleteSpeed = 45;
    const holdTime = 1800;

    const tickTypewriter = () => {
      const currentRole = roles[roleIndex];

      if (!isDeleting) {
        typewriterTarget.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;

        if (charIndex === currentRole.length) {
          isDeleting = true;
          setTimeout(tickTypewriter, holdTime);
          return;
        }
      } else {
        typewriterTarget.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;

        if (charIndex === 0) {
          isDeleting = false;
          roleIndex = (roleIndex + 1) % roles.length;
          setTimeout(tickTypewriter, 350);
          return;
        }
      }

      setTimeout(tickTypewriter, isDeleting ? deleteSpeed : typeSpeed);
    };

    setTimeout(tickTypewriter, 600);
  }

  // --------------------------------------------------------------------------
  // 7. 3D Hover Tilt Effect for Project Cards & Avatar
  // --------------------------------------------------------------------------
  const tiltCards = document.querySelectorAll('.tilt-card');

  tiltCards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -7;
      const rotateY = ((x - centerX) / centerX) * 7;

      card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
    });
  });

  // --------------------------------------------------------------------------
  // 8. Skills Category Filter
  // --------------------------------------------------------------------------
  const filterButtons = document.querySelectorAll('.filter-btn');
  const skillCategories = document.querySelectorAll('.skill-category-card');

  filterButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      skillCategories.forEach((cat) => {
        const categoryGroup = cat.getAttribute('data-category');
        if (filter === 'all' || categoryGroup === filter) {
          cat.style.display = 'flex';
          setTimeout(() => {
            cat.style.opacity = '1';
            cat.style.transform = 'scale(1)';
          }, 20);
        } else {
          cat.style.opacity = '0';
          cat.style.transform = 'scale(0.96)';
          setTimeout(() => {
            cat.style.display = 'none';
          }, 200);
        }
      });
    });
  });

  // --------------------------------------------------------------------------
  // 9. Toast Notification System
  // --------------------------------------------------------------------------
  const toastContainer = document.getElementById('toast-container');

  const showToast = (message, icon = '✓') => {
    if (!toastContainer) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <span style="color: var(--accent-cyan); font-weight: 700;">${icon}</span>
      <span>${message}</span>
    `;
    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(-15px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3800);
  };

  // --------------------------------------------------------------------------
  // 10. Copy Email Utility
  // --------------------------------------------------------------------------
  const copyButtons = document.querySelectorAll('.copy-email-btn');
  copyButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const email = 'siddharth.sahu.dev@gmail.com';
      navigator.clipboard.writeText(email).then(() => {
        showToast('Email address copied to clipboard!');
        const originalText = btn.innerHTML;
        btn.innerHTML = '<span>✓ Copied</span>';
        setTimeout(() => {
          btn.innerHTML = originalText;
        }, 2000);
      }).catch(() => {
        showToast('Direct email: siddharth.sahu.dev@gmail.com');
      });
    });
  });

  // --------------------------------------------------------------------------
  // 11. Modals: Project Details & Resume Preview
  // --------------------------------------------------------------------------
  const modalOverlay = document.getElementById('project-modal');
  const modalTitle = document.getElementById('modal-title');
  const modalBadge = document.getElementById('modal-badge');
  const modalImage = document.getElementById('modal-image');
  const modalDescription = document.getElementById('modal-description');
  const modalTechStack = document.getElementById('modal-tech-stack');
  const modalInteractiveArea = document.getElementById('modal-interactive-area');
  const modalCloseBtn = document.getElementById('modal-close');

  const resumeModal = document.getElementById('resume-modal');
  const resumeCloseBtn = document.getElementById('resume-modal-close');
  const resumeTriggers = document.querySelectorAll('.resume-trigger');

  // Project details data
  const projectDatabase = {
    'research-agent': {
      title: 'Research Agent (Autonomous Multi-Step AI)',
      badge: 'Generative AI & LangGraph',
      image: 'assets/images/project_research_agent.jpg',
      description: 'An enterprise-grade autonomous research assistant that retrieves external information, performs cyclic multi-step reasoning, validates factual references with live citation checks, and delivers grounded synthesis.',
      tech: ['LangChain', 'LangGraph', 'OpenAI / DeepSeek', 'APIs', 'Vector DB', 'Python'],
      interactiveType: 'research-agent',
      highlights: [
        'Cyclic State Graph: Dynamically evaluates whether gathered evidence is sufficient or triggers sub-query iterations.',
        'Grounded Source Citation: Maps each synthesized paragraph to specific scientific / web publications to mitigate hallucinations.',
        'High Throughput: Async parallel document retrieval pipelines reduce end-to-end research latency by 64%.'
      ]
    },
    'insurance-api': {
      title: 'Insurance Premium Prediction ML API',
      badge: 'FastAPI & Machine Learning',
      image: 'assets/images/project_insurance_api.jpg',
      description: 'High-performance production REST API delivering real-time insurance premium category classifications and continuous risk probability distributions based on client biometric and lifestyle factors.',
      tech: ['FastAPI', 'Pydantic V2', 'Scikit-Learn', 'Docker', 'Uvicorn', 'NumPy'],
      interactiveType: 'insurance-api',
      highlights: [
        'Strict Schema Validation: 100% typed request payload filtering using Pydantic V2 with custom sanitizers.',
        'Containerized Deployment: Lightweight multi-stage Docker build with health probes and under 15ms response latency.',
        'Interactive Swagger: Auto-generated OpenAPI v3 documentation with mock request payloads.'
      ]
    },
    'ecommerce-api': {
      title: 'FastAPI E-Commerce Backend Service',
      badge: 'Backend & High-Concurrency APIs',
      image: 'assets/images/project_ecommerce_api.jpg',
      description: 'Production-ready e-commerce catalog API engineered for high-concurrency search, multi-faceted filtering (price, category, ratings), dynamic sorting, and unified structured error handling.',
      tech: ['FastAPI', 'Python', 'Pydantic', 'AsyncIO', 'REST API', 'PostgreSQL / SQLite'],
      interactiveType: 'ecommerce-api',
      highlights: [
        'Compound Search & Filter: Optimized multi-attribute search indices with debounce and pagination.',
        'Robust Error Hierarchy: Centralized HTTP exception handlers with RFC 7807 compliant error schemas.',
        'Asynchronous Execution: Non-blocking I/O maximizing request throughput under stress loads.'
      ]
    },
    'next-word': {
      title: 'Next Word Prediction NLP System',
      badge: 'TensorFlow & Deep Learning',
      image: 'assets/images/project_next_word.jpg',
      description: 'A deep learning sequential language model built with Long Short-Term Memory (LSTM) recurrent networks, word tokenizers, and a real-time Streamlit web dashboard displaying token probability heatmaps.',
      tech: ['TensorFlow', 'Keras', 'LSTM', 'Python', 'Streamlit', 'NumPy'],
      interactiveType: 'next-word',
      highlights: [
        'Recurrent Architecture: Custom trained multi-layer LSTM capturing bidirectional semantic context across sequences.',
        'Top-K Candidate Scoring: Beam search and temperature decoding options to balance accuracy and text creativity.',
        'Interactive Visualizer: Live sequence attention and hidden state activation monitor.'
      ]
    },
    'mental-health': {
      title: 'Student Mental Health Analytics & Prediction',
      badge: 'Data Science & Predictive ML',
      image: 'assets/images/project_mental_health.jpg',
      description: 'Predictive data science pipeline quantifying student mental health vulnerability indicators based on digital engagement patterns, social media usage, sleep metrics, and academic stress.',
      tech: ['Pandas', 'NumPy', 'Scikit-Learn', 'Matplotlib', 'Seaborn', 'Python'],
      interactiveType: 'mental-health',
      highlights: [
        'Feature Engineering: Designed composite indices for digital fatigue, night-time screen ratio, and peer interaction scores.',
        'Interpretability with SHAP: Explainable ML metrics identifying which factors contribute most significantly to high-stress flags.',
        'Data Cleaning & Imputation: Robust statistical treatment of missing entries and outlier normalization.'
      ]
    }
  };

  // Open Project Modal
  const openProjectModal = (projectId) => {
    const data = projectDatabase[projectId];
    if (!data || !modalOverlay) return;

    modalTitle.textContent = data.title;
    modalBadge.textContent = data.badge;
    modalImage.src = data.image;
    modalImage.alt = data.title;
    modalDescription.textContent = data.description;

    // Render tech tags
    modalTechStack.innerHTML = data.tech
      .map((t) => `<span class="tech-tag">${t}</span>`)
      .join('');

    // Render interactive simulation according to type
    if (data.interactiveType === 'insurance-api') {
      modalInteractiveArea.innerHTML = `
        <div style="background: rgba(11, 15, 25, 0.75); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 20px; margin-top: 20px;">
          <h4 style="font-size: 15px; color: var(--accent-cyan); margin-bottom: 12px; display: flex; align-items: center; gap: 8px;">
            <span>⚡</span> Live API Test Console (Simulated Endpoint)
          </h4>
          <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; margin-bottom: 14px;">
            <div>
              <label style="font-size: 11.5px; color: var(--text-muted); display: block; margin-bottom: 4px;">Age</label>
              <input type="number" id="test-age" value="28" style="width: 100%; padding: 8px 12px; background: rgba(255,255,255,0.05); border: 1px solid var(--border-subtle); border-radius: 6px; color: #fff; font-size: 13px;" />
            </div>
            <div>
              <label style="font-size: 11.5px; color: var(--text-muted); display: block; margin-bottom: 4px;">BMI</label>
              <input type="number" id="test-bmi" value="24.2" step="0.1" style="width: 100%; padding: 8px 12px; background: rgba(255,255,255,0.05); border: 1px solid var(--border-subtle); border-radius: 6px; color: #fff; font-size: 13px;" />
            </div>
            <div>
              <label style="font-size: 11.5px; color: var(--text-muted); display: block; margin-bottom: 4px;">Smoker</label>
              <select id="test-smoker" style="width: 100%; padding: 8px 12px; background: #131b30; border: 1px solid var(--border-subtle); border-radius: 6px; color: #fff; font-size: 13px;">
                <option value="no">No</option>
                <option value="yes">Yes</option>
              </select>
            </div>
          </div>
          <button id="btn-run-api-test" style="padding: 8px 18px; background: var(--grad-primary); border-radius: var(--radius-sm); font-size: 13px; font-weight: 600; color: #fff; cursor: pointer;">
            Execute POST /predict_premium
          </button>
          <div id="api-output" style="margin-top: 14px; padding: 12px; background: #070a12; border-radius: 6px; font-family: var(--font-mono); font-size: 12px; color: #34d399; display: none;">
          </div>
        </div>
      `;

      const runBtn = document.getElementById('btn-run-api-test');
      const output = document.getElementById('api-output');
      runBtn.addEventListener('click', () => {
        runBtn.textContent = 'Processing with ML pipeline...';
        setTimeout(() => {
          const age = parseInt(document.getElementById('test-age').value) || 28;
          const bmi = parseFloat(document.getElementById('test-bmi').value) || 24.2;
          const smoker = document.getElementById('test-smoker').value;
          const base = (age * 120) + (bmi * 80) + (smoker === 'yes' ? 4500 : 800);
          const category = base > 5000 ? 'High Tier' : base > 3000 ? 'Medium Tier' : 'Standard Tier';

          output.style.display = 'block';
          output.innerHTML = `
            <div><strong>Status:</strong> <span style="color:#38bdf8">200 OK</span> (Latency: 11.4ms)</div>
            <div><strong>Response JSON:</strong></div>
            <pre style="margin-top: 6px; color:#cbd5e1;">{
  "predicted_category": "${category}",
  "estimated_premium_usd": "$${base.toLocaleString()}",
  "risk_score": ${(base / 8500).toFixed(2)},
  "model_version": "v1.2.4-rf-ensemble"
}</pre>
          `;
          runBtn.textContent = 'Execute POST /predict_premium';
        }, 400);
      });
    } else if (data.interactiveType === 'research-agent') {
      modalInteractiveArea.innerHTML = `
        <div style="background: rgba(11, 15, 25, 0.75); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 20px; margin-top: 20px;">
          <h4 style="font-size: 15px; color: var(--accent-cyan); margin-bottom: 10px;">
            <span>🤖</span> Test Agent Prompt Reasoning
          </h4>
          <div style="display: flex; gap: 8px;">
            <input type="text" id="agent-query" value="Assess breakthrough trends in multimodal RAG architectures" style="flex-grow: 1; padding: 10px 14px; background: rgba(255,255,255,0.05); border: 1px solid var(--border-subtle); border-radius: 6px; color: #fff; font-size: 13px;" />
            <button id="btn-agent-run" style="padding: 10px 18px; background: var(--grad-primary); border-radius: var(--radius-sm); font-size: 13px; font-weight: 600; color: #fff;">
              Initiate Loop
            </button>
          </div>
          <div id="agent-terminal" style="margin-top: 12px; padding: 12px; background: #060911; border-radius: 6px; font-family: var(--font-mono); font-size: 12px; color: #94a3b8; display: none; line-height: 1.6;">
          </div>
        </div>
      `;

      const agentBtn = document.getElementById('btn-agent-run');
      const terminal = document.getElementById('agent-terminal');
      agentBtn.addEventListener('click', () => {
        agentBtn.textContent = 'Reasoning in LangGraph...';
        terminal.style.display = 'block';
        terminal.innerHTML = '<span style="color:#38bdf8;">[1/3] Parsing query intent & formulating sub-queries...</span>';
        setTimeout(() => {
          terminal.innerHTML += '<br><span style="color:#2dd4bf;">[2/3] Querying vector index & cross-referencing arXiv 2024 citations...</span>';
        }, 500);
        setTimeout(() => {
          terminal.innerHTML += '<br><span style="color:#c084fc;">[3/3] Evaluator approved groundness score 0.96. Generating synthesis with 4 footnotes.</span>';
          terminal.innerHTML += '<br><span style="color:#34d399;">✓ Completed successfully.</span>';
          agentBtn.textContent = 'Initiate Loop';
        }, 1100);
      });
    } else {
      modalInteractiveArea.innerHTML = `
        <div style="margin-top: 20px; padding: 16px; background: rgba(255,255,255,0.03); border: 1px solid var(--border-subtle); border-radius: var(--radius-md);">
          <h4 style="font-size: 14.5px; color: var(--text-primary); margin-bottom: 8px;">Key Engineering Highlights</h4>
          <ul style="padding-left: 20px; color: var(--text-secondary); font-size: 13.5px; display: flex; flex-direction: column; gap: 6px;">
            ${data.highlights.map((h) => `<li>${h}</li>`).join('')}
          </ul>
        </div>
      `;
    }

    modalOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  // Close Project Modal
  const closeProjectModal = () => {
    if (modalOverlay) {
      modalOverlay.classList.remove('open');
      document.body.style.overflow = '';
    }
  };

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeProjectModal);
  }

  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeProjectModal();
    });
  }

  // Bind project cards
  const projectCards = document.querySelectorAll('.project-card');
  projectCards.forEach((card) => {
    const projectId = card.getAttribute('data-project');
    const demoBtn = card.querySelector('.btn-project-demo');
    const title = card.querySelector('.project-title');

    if (demoBtn) {
      demoBtn.addEventListener('click', (e) => {
        e.preventDefault();
        openProjectModal(projectId);
      });
    }

    if (title) {
      title.style.cursor = 'pointer';
      title.addEventListener('click', () => {
        openProjectModal(projectId);
      });
    }
  });

  // Resume Modal logic
  resumeTriggers.forEach((trigger) => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      if (resumeModal) {
        resumeModal.classList.add('open');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  if (resumeCloseBtn && resumeModal) {
    resumeCloseBtn.addEventListener('click', () => {
      resumeModal.classList.remove('open');
      document.body.style.overflow = '';
    });

    resumeModal.addEventListener('click', (e) => {
      if (e.target === resumeModal) {
        resumeModal.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }

  // Print / Download Resume Trigger
  const downloadResumeBtn = document.getElementById('btn-download-resume-pdf');
  if (downloadResumeBtn) {
    downloadResumeBtn.addEventListener('click', () => {
      window.print();
    });
  }

  // Close modals on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeProjectModal();
      if (resumeModal) {
        resumeModal.classList.remove('open');
        document.body.style.overflow = '';
      }
    }
  });

  // --------------------------------------------------------------------------
  // 12. Modern Contact Form Submission
  // --------------------------------------------------------------------------
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('contact-name');
      const emailInput = document.getElementById('contact-email');
      const messageInput = document.getElementById('contact-message');
      const submitBtn = contactForm.querySelector('.form-submit-btn');

      if (!nameInput.value.trim() || !emailInput.value.trim() || !messageInput.value.trim()) {
        showToast('Please fill out all required fields.', '⚠️');
        return;
      }

      // Email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailInput.value.trim())) {
        showToast('Please provide a valid email address.', '⚠️');
        return;
      }

      // Simulate sending
      submitBtn.disabled = true;
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = `
        <span class="pulse-dot" style="background:#fff; width:6px; height:6px;"></span>
        <span>Transmitting message...</span>
      `;

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        contactForm.reset();
        showToast('Message sent! Siddharth will get back to you shortly.', '✓');
      }, 1200);
    });
  }
});
