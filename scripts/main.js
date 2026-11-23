import { SITE_CONFIG } from './site-config.js';

/**
 * Inicialização modular da experiência interativa BLADE & CO. Barbearia.
 */
document.addEventListener('DOMContentLoaded', () => {
  applySiteConfig();
  initHeaderAndScrollSpy();
  initMobileDrawer();
  initServiceFiltersAndSelection();
  initBookingForm();
  initGalleryLightbox();
});

/* --------------------------------------------------------------------------
   1. HIDRATAÇÃO DE CONFIGURAÇÃO CENTRAL (site-config.js)
   -------------------------------------------------------------------------- */
function applySiteConfig() {
  const { brand, contact, location, hours, hoursNote, pricingNote, reviews } = SITE_CONFIG;

  setText('[data-hero-badge]', brand.heroBadge);
  setText('[data-pricing-note]', pricingNote);
  setText('[data-location-street]', location.street);
  setText('[data-location-city]', location.districtCity);
  setText('[data-contact-whatsapp]', contact.whatsappDisplay);
  setText('[data-contact-phone]', contact.phoneDisplay);
  setText('[data-hours-note]', hoursNote);
  setText('[data-footer-whatsapp]', contact.whatsappDisplay);
  setText('[data-footer-instagram]', contact.instagramHandle);
  setText('[data-footer-email]', contact.emailDisplay);
  setText('[data-reviews-rating]', reviews.ratingLabel.replace(/—/g, '--'));
  setText('[data-reviews-count]', reviews.countLabel);

  // Links configuráveis de contato e redes sociais (ativados apenas quando reais)
  if (contact.whatsappNumber) {
    const cleanPhone = contact.whatsappNumber.replace(/\D/g, '');
    const waBaseUrl = `https://wa.me/${cleanPhone}`;
    const footerWa = document.getElementById('footer-whatsapp-link');
    if (footerWa) {
      footerWa.href = waBaseUrl;
      footerWa.target = '_blank';
      footerWa.rel = 'noopener noreferrer';
    }
    const statusBadge = document.getElementById('whatsapp-status-badge');
    if (statusBadge) statusBadge.textContent = 'WhatsApp ativo';
    const configNote = document.getElementById('whatsapp-config-note');
    if (configNote) {
      configNote.textContent = 'Ao clicar em Agendar horário, você será direcionado ao WhatsApp oficial da barbearia com esta mensagem preenchida.';
    }
  }

  if (contact.instagramUrl) {
    upgradeStaticContactToLink('footer-instagram-wrap', contact.instagramUrl, true);
  }

  if (contact.email) {
    upgradeStaticContactToLink('footer-email-wrap', `mailto:${contact.email}`, false);
  }

  if (contact.googleReviewsUrl) {
    const reviewsLink = document.getElementById('google-reviews-link');
    if (reviewsLink) {
      reviewsLink.href = contact.googleReviewsUrl;
      reviewsLink.target = '_blank';
      reviewsLink.rel = 'noopener noreferrer';
      const label = reviewsLink.querySelector('span');
      if (label) label.textContent = 'Avaliar no Google';
    }
  }

  // Horários configuráveis
  const hoursList = document.getElementById('hours-list');
  if (hoursList && Array.isArray(hours) && hours.length > 0) {
    hoursList.innerHTML = hours
      .map(
        (item) => `
          <li class="hours-row">
            <span class="hours-row__days">${escapeHtml(item.days)}</span>
            <span class="hours-row__time tabular-nums">${escapeHtml(item.time)}</span>
          </li>
        `
      )
      .join('');
  }

  // Mapa real do Google Maps (ativado automaticamente se mapEmbedUrl estiver preenchido)
  const mapStage = document.getElementById('map-stage');
  if (mapStage && location.mapEmbedUrl) {
    const iframe = document.createElement('iframe');
    iframe.src = location.mapEmbedUrl;
    iframe.title = `Mapa de localização de ${brand.fullName}`;
    iframe.loading = 'lazy';
    iframe.referrerPolicy = 'no-referrer-when-downgrade';
    mapStage.innerHTML = '';
    mapStage.appendChild(iframe);
  }
}

function upgradeStaticContactToLink(elementId, href, external) {
  const el = document.getElementById(elementId);
  if (!el || el.tagName === 'A') return;
  const anchor = document.createElement('a');
  anchor.className = 'footer-link';
  anchor.href = href;
  if (external) {
    anchor.target = '_blank';
    anchor.rel = 'noopener noreferrer';
  }
  anchor.innerHTML = el.innerHTML;
  el.replaceWith(anchor);
}

/* --------------------------------------------------------------------------
   2. HEADER SCROLL, SCROLL SPY E BOTÃO FLUTUANTE
   -------------------------------------------------------------------------- */
function initHeaderAndScrollSpy() {
  const header = document.getElementById('topo-header');
  const floatingCta = document.getElementById('floating-cta');
  const bookingSection = document.getElementById('agendamento');
  const footerEl = document.querySelector('.site-footer');
  const navLinks = Array.from(document.querySelectorAll('.site-nav__link'));
  const observedSections = navLinks
    .map((link) => {
      const id = link.getAttribute('href')?.slice(1);
      return id ? document.getElementById(id) : null;
    })
    .filter(Boolean);

  let bookingInView = false;
  let footerInView = false;
  let scrollTicking = false;

  const updateActiveNav = () => {
    const scrollPos = window.scrollY + 140;
    let activeId = null;

    if (window.scrollY >= 160) {
      for (const section of observedSections) {
        if (section.offsetTop <= scrollPos) {
          activeId = `#${section.id}`;
        }
      }
    }

    navLinks.forEach((link) => {
      if (activeId && link.getAttribute('href') === activeId) {
        link.setAttribute('aria-current', 'true');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  };

  const updateScrollUI = () => {
    scrollTicking = false;
    const y = window.scrollY;
    if (header) {
      header.classList.toggle('is-scrolled', y > 32);
    }
    if (floatingCta) {
      floatingCta.classList.toggle('is-visible', y > 520 && !bookingInView && !footerInView);
    }
    updateActiveNav();
  };

  const onScroll = () => {
    if (!scrollTicking) {
      scrollTicking = true;
      requestAnimationFrame(updateScrollUI);
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('hashchange', updateScrollUI);
  updateScrollUI();

  if ('IntersectionObserver' in window && floatingCta) {
    const hideZoneObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.target === bookingSection) {
            bookingInView = entry.isIntersecting;
          } else if (entry.target === footerEl) {
            footerInView = entry.isIntersecting;
          }
        });
        updateScrollUI();
      },
      { threshold: 0.08 }
    );

    if (bookingSection) hideZoneObserver.observe(bookingSection);
    if (footerEl) hideZoneObserver.observe(footerEl);
  }
}

/* --------------------------------------------------------------------------
   3. MENU RESPONSIVO MOBILE ACESSÍVEL
   -------------------------------------------------------------------------- */
function initMobileDrawer() {
  const openBtn = document.getElementById('menu-toggle');
  const closeBtn = document.getElementById('menu-close');
  const drawer = document.getElementById('mobile-drawer');
  if (!openBtn || !closeBtn || !drawer) return;

  const closeTriggers = drawer.querySelectorAll('[data-drawer-close]');
  let isOpen = false;

  const openDrawer = () => {
    isOpen = true;
    drawer.hidden = false;
    requestAnimationFrame(() => drawer.classList.add('is-open'));
    openBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  };

  const closeDrawer = ({ restoreFocus = true } = {}) => {
    if (!isOpen) return;
    isOpen = false;
    drawer.classList.remove('is-open');
    openBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    setTimeout(() => {
      if (!isOpen) drawer.hidden = true;
    }, 320);
    if (restoreFocus) openBtn.focus();
  };

  openBtn.addEventListener('click', openDrawer);
  closeBtn.addEventListener('click', () => closeDrawer());
  closeTriggers.forEach((el) => {
    el.addEventListener('click', () => closeDrawer({ restoreFocus: false }));
  });

  document.addEventListener('keydown', (event) => {
    if (!isOpen) return;
    if (event.key === 'Escape') {
      closeDrawer();
      return;
    }
    if (event.key === 'Tab') {
      const focusables = drawer.querySelectorAll('a[href], button:not([disabled])');
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (!first || !last) return;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });
}

/* --------------------------------------------------------------------------
   4. FILTRO DE SERVIÇOS E SINCRONIZAÇÃO COM O AGENDAMENTO
   -------------------------------------------------------------------------- */
function initServiceFiltersAndSelection() {
  const tabs = Array.from(document.querySelectorAll('.services-tab'));
  const rows = Array.from(document.querySelectorAll('#services-list .service-row'));
  const selectButtons = Array.from(document.querySelectorAll('[data-select-service]'));

  const activateTab = (tab) => {
    const filter = tab.dataset.filter || 'todos';
    tabs.forEach((btn) => {
      const selected = btn === tab;
      btn.setAttribute('aria-selected', String(selected));
      btn.tabIndex = selected ? 0 : -1;
    });

    rows.forEach((row) => {
      const match = filter === 'todos' || row.dataset.category === filter;
      row.hidden = !match;
    });
  };

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => activateTab(tab));
    tab.addEventListener('keydown', (event) => {
      if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
      event.preventDefault();
      const dir = event.key === 'ArrowRight' ? 1 : -1;
      const next = tabs[(index + dir + tabs.length) % tabs.length];
      activateTab(next);
      next.focus();
    });
  });

  selectButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const serviceId = btn.dataset.selectService;
      if (!serviceId) return;

      const checkboxes = Array.from(
        document.querySelectorAll('#booking-services input[type="checkbox"]')
      );
      checkboxes.forEach((cb) => {
        cb.checked = cb.dataset.serviceId === serviceId;
      });

      syncServiceButtonsState();
      document.dispatchEvent(new CustomEvent('booking:update'));

      const bookingEl = document.getElementById('agendamento');
      bookingEl?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      const nameInput = document.getElementById('client-name');
      setTimeout(() => nameInput?.focus({ preventScroll: true }), 420);
    });
  });

  syncServiceButtonsState();
}

function syncServiceButtonsState() {
  const checkedIds = new Set(
    Array.from(document.querySelectorAll('#booking-services input[type="checkbox"]:checked'))
      .map((cb) => cb.dataset.serviceId)
  );

  document.querySelectorAll('[data-select-service]').forEach((btn) => {
    const active = checkedIds.has(btn.dataset.selectService);
    btn.classList.toggle('is-selected', active);
    const label = btn.querySelector('span');
    if (label) label.textContent = active ? 'Selecionado' : 'Selecionar';
  });
}

/* --------------------------------------------------------------------------
   5. AGENDAMENTO INTERATIVO COM VALIDAÇÃO E PRÉVIA WHATSAPP
   -------------------------------------------------------------------------- */
function initBookingForm() {
  const form = document.getElementById('booking-form');
  const nameInput = document.getElementById('client-name');
  const daySelect = document.getElementById('preferred-day');
  const periodSelect = document.getElementById('preferred-period');
  const notesInput = document.getElementById('client-notes');
  const previewBox = document.getElementById('whatsapp-message-preview');
  const copyBtn = document.getElementById('copy-message-btn');
  const feedback = document.getElementById('booking-feedback');
  const errServices = document.getElementById('error-services');
  const errName = document.getElementById('error-name');

  if (!form || !nameInput || !daySelect || !periodSelect || !notesInput || !previewBox) return;

  const getSelectedServices = () =>
    Array.from(form.querySelectorAll('input[name="service"]:checked')).map((el) => el.value);

  const buildMessage = () => {
    const services = getSelectedServices();
    const name = nameInput.value.trim();
    const day = daySelect.value;
    const period = periodSelect.value;
    const notes = notesInput.value.trim();

    const lines = [
      `Olá! Gostaria de verificar disponibilidade na ${SITE_CONFIG.brand.fullName}.`,
      '',
    ];
    if (name) lines.push(`Nome: ${name}`);
    lines.push(`Serviço(s): ${services.length > 0 ? services.join(', ') : 'A definir'}`);
    lines.push(`Preferência: ${day}, no período da ${period}`);
    if (notes) lines.push(`Observação: ${notes}`);

    return lines.join('\n');
  };

  const updatePreview = () => {
    previewBox.textContent = buildMessage();
    syncServiceButtonsState();
  };

  const clearFeedback = () => {
    if (!feedback) return;
    feedback.className = 'booking-feedback';
    feedback.textContent = '';
  };

  const showFeedback = (text, variant) => {
    if (!feedback) return;
    feedback.textContent = text;
    feedback.className = `booking-feedback is-visible booking-feedback--${variant}`;
  };

  form.addEventListener('input', () => {
    updatePreview();
    if (nameInput.value.trim().length >= 2) {
      nameInput.removeAttribute('aria-invalid');
      errName?.classList.remove('is-visible');
    }
    if (getSelectedServices().length > 0) {
      errServices?.classList.remove('is-visible');
    }
  });

  form.addEventListener('change', () => {
    updatePreview();
    if (getSelectedServices().length > 0) {
      errServices?.classList.remove('is-visible');
    }
  });

  document.addEventListener('booking:update', updatePreview);

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    clearFeedback();

    const services = getSelectedServices();
    const name = nameInput.value.trim();
    let firstInvalid = null;

    if (services.length === 0) {
      errServices?.classList.add('is-visible');
      firstInvalid = form.querySelector('input[name="service"]');
    } else {
      errServices?.classList.remove('is-visible');
    }

    if (name.length < 2) {
      nameInput.setAttribute('aria-invalid', 'true');
      errName?.classList.add('is-visible');
      if (!firstInvalid) firstInvalid = nameInput;
    } else {
      nameInput.removeAttribute('aria-invalid');
      errName?.classList.remove('is-visible');
    }

    if (firstInvalid) {
      firstInvalid.focus();
      showFeedback('Verifique os campos destacados antes de continuar o agendamento.', 'error');
      return;
    }

    const message = buildMessage();
    const cleanPhone = (SITE_CONFIG.contact.whatsappNumber || '').replace(/\D/g, '');

    if (cleanPhone.length >= 10) {
      const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
      window.open(url, '_blank', 'noopener,noreferrer');
      showFeedback('Conversa preparada no WhatsApp oficial. Caso não abra automaticamente, copie a mensagem ao lado.', 'success');
    } else {
      showFeedback(
        'Solicitação validada em modo demonstrativo. Copie a mensagem pronta ao lado ou configure o WhatsApp oficial em scripts/site-config.js para envio direto.',
        'success'
      );
    }
  });

  copyBtn?.addEventListener('click', async () => {
    const text = buildMessage();
    try {
      await navigator.clipboard.writeText(text);
      showFeedback('Mensagem copiada para a área de transferência.', 'success');
    } catch {
      const helper = document.createElement('textarea');
      helper.value = text;
      helper.setAttribute('readonly', '');
      helper.style.position = 'absolute';
      helper.style.left = '-9999px';
      document.body.appendChild(helper);
      helper.select();
      document.execCommand('copy');
      document.body.removeChild(helper);
      showFeedback('Mensagem copiada para a área de transferência.', 'success');
    }
  });

  updatePreview();
}

/* --------------------------------------------------------------------------
   6. LIGHTBOX ACESSÍVEL DA GALERIA (<dialog> NATIVO)
   -------------------------------------------------------------------------- */
function initGalleryLightbox() {
  const dialog = document.getElementById('gallery-lightbox');
  const imgEl = document.getElementById('lightbox-img');
  const captionEl = document.getElementById('lightbox-caption');
  const counterEl = document.getElementById('lightbox-counter');
  const closeBtn = document.getElementById('lightbox-close');
  const prevBtn = document.getElementById('lightbox-prev');
  const nextBtn = document.getElementById('lightbox-next');
  const items = Array.from(document.querySelectorAll('.gallery-item'));

  if (!dialog || !imgEl || !captionEl || !counterEl || items.length === 0) return;

  let currentIndex = 0;

  const renderSlide = (index) => {
    currentIndex = (index + items.length) % items.length;
    const item = items[currentIndex];
    const thumb = item.querySelector('img');
    imgEl.src = item.dataset.fullSrc || thumb?.src || '';
    imgEl.alt = thumb?.alt || item.dataset.caption || '';
    captionEl.textContent = item.dataset.caption || '';
    counterEl.textContent = `${String(currentIndex + 1).padStart(2, '0')} / ${String(items.length).padStart(2, '0')}`;
  };

  items.forEach((item, index) => {
    item.addEventListener('click', () => {
      renderSlide(index);
      if (typeof dialog.showModal === 'function') {
        dialog.showModal();
      } else {
        dialog.setAttribute('open', '');
      }
      closeBtn?.focus();
    });
  });

  closeBtn?.addEventListener('click', () => dialog.close());
  prevBtn?.addEventListener('click', () => renderSlide(currentIndex - 1));
  nextBtn?.addEventListener('click', () => renderSlide(currentIndex + 1));

  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  });

  dialog.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      renderSlide(currentIndex - 1);
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      renderSlide(currentIndex + 1);
    }
  });
}

/* --------------------------------------------------------------------------
   UTILITÁRIOS
   -------------------------------------------------------------------------- */
function setText(selector, value) {
  if (typeof value !== 'string') return;
  document.querySelectorAll(selector).forEach((el) => {
    el.textContent = value;
  });
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
