/**
 * 美脳デザイン 静的サイト
 * FAQ・フォーム・計測学習用イベントの処理
 */

"use strict";

document.addEventListener("DOMContentLoaded", () => {
  setupFaq();
  setupContactForm();
  setupMeasurementHooks();
});

/* ==================================================
   FAQ accordion
   ================================================== */
function setupFaq() {
  const faqButtons = document.querySelectorAll(".faq-item button");

  faqButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const answerId = button.getAttribute("aria-controls");
      const answer = document.getElementById(answerId);
      const icon = button.querySelector("b");
      const willOpen = button.getAttribute("aria-expanded") !== "true";

      button.setAttribute("aria-expanded", String(willOpen));
      answer.hidden = !willOpen;
      icon.textContent = willOpen ? "−" : "＋";

      if (willOpen) {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
          event: "faq_open",
          content_id: answerId,
        });
      }
    });
  });
}

/* ==================================================
   Contact form demo
   実運用時は、送信先サービスやAPIへ接続してください。
   ================================================== */
function setupContactForm() {
  const form = document.getElementById("contact-form");
  const thanks = document.getElementById("contact-thanks");

  if (!form || !thanks) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!form.reportValidity()) return;

    form.hidden = true;
    thanks.hidden = false;

    // GTMでフォーム完了を受け取る場合の学習用イベント例です。
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "contact_form_submit",
      form_name: "contact",
      form_location: "contact",
    });
  });
}

/* ==================================================
   Measurement hooks
   data-track="cta" を持つ要素のクリック情報をdataLayerへ送ります。
   GTM導入前でもエラーにならず、導入後はカスタムイベントとして利用できます。
   ================================================== */
function setupMeasurementHooks() {
  const trackedElements = document.querySelectorAll('[data-track="cta"]');

  trackedElements.forEach((element) => {
    element.addEventListener("click", () => {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: "cta_click",
        cta_name: element.dataset.ctaName || "",
        cta_location: element.dataset.ctaLocation || "",
        cta_type: element.dataset.ctaType || "",
      });
    });
  });
  // セクションが画面内に入ったら section_view を送信
  const trackedSections = document.querySelectorAll("[data-track-section]");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const section = entry.target;

        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
          event: "section_view",
          section_name: section.dataset.trackSection || "",
          section_order: section.dataset.sectionOrder || "",
        });

        // 同じセクションを何度も送らない
        observer.unobserve(section);
      });
    },
    {
      threshold: 0.5,
    },
  );

  trackedSections.forEach((section) => {
    observer.observe(section);
  });
}
