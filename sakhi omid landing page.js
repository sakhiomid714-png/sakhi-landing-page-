(() => {

  "use strict";


  /* ==================================================
     ELEMENTS
  =================================================== */

  const navToggle =
    document.getElementById("navToggle");

  const nav =
    document.getElementById("nav");

  const yearEl =
    document.getElementById("year");


  const projectModal =
    document.getElementById("projectModal");

  const projectModalDialog =
    projectModal?.querySelector(
      ".project-modal__dialog"
    );

  const projectModalClose =
    document.getElementById(
      "projectModalClose"
    );

  const projectModalImage =
    document.getElementById(
      "projectModalImage"
    );

  const projectModalTitle =
    document.getElementById(
      "projectModalTitle"
    );

  const projectModalDescription =
    document.getElementById(
      "projectModalDescription"
    );

  const projectModalLink =
    document.getElementById(
      "projectModalLink"
    );


  const caseStudyButtons =
    document.querySelectorAll(
      ".case-study-btn"
    );


  const contactForm =
    document.getElementById(
      "contactForm"
    );

  const formStatus =
    document.getElementById(
      "formStatus"
    );


  let lastFocusedElement = null;



  /* ==================================================
     MOBILE NAVIGATION
  =================================================== */

  const setNavState = (open) => {

    if (!navToggle || !nav) {
      return;
    }


    nav.classList.toggle(
      "open",
      open
    );


    navToggle.setAttribute(
      "aria-expanded",
      String(open)
    );


    navToggle.setAttribute(
      "aria-label",
      open
        ? "Close navigation"
        : "Open navigation"
    );

  };


  navToggle?.addEventListener(
    "click",
    () => {

      const currentlyOpen =
        navToggle.getAttribute(
          "aria-expanded"
        ) === "true";


      setNavState(
        !currentlyOpen
      );

    }
  );


  nav?.querySelectorAll("a")
    .forEach((link) => {

      link.addEventListener(
        "click",
        () => {

          setNavState(false);

        }
      );

    });


  window.addEventListener(
    "resize",
    () => {

      if (
        window.innerWidth > 780
      ) {

        setNavState(false);

      }

    }
  );



  /* ==================================================
     SMOOTH SCROLLING
  =================================================== */

  document
    .querySelectorAll(
      'a[href^="#"]'
    )
    .forEach((link) => {

      link.addEventListener(
        "click",
        (event) => {

          const href =
            link.getAttribute("href");


          if (
            !href ||
            href === "#" ||
            !href.startsWith("#")
          ) {

            return;

          }


          const target =
            document.querySelector(
              href
            );


          if (!target) {
            return;
          }


          event.preventDefault();


          const reducedMotion =
            window.matchMedia(
              "(prefers-reduced-motion: reduce)"
            ).matches;


          target.scrollIntoView({

            behavior:
              reducedMotion
                ? "auto"
                : "smooth",

            block: "start"

          });

        }
      );

    });



  /* ==================================================
     YEAR
  =================================================== */

  if (yearEl) {

    yearEl.textContent =
      String(
        new Date().getFullYear()
      );

  }



  /* ==================================================
     PROJECT MODAL
  =================================================== */

  const getFocusableElements = () => {

    if (!projectModalDialog) {
      return [];
    }


    return [
      ...projectModalDialog.querySelectorAll(
        `
        a[href],
        button:not([disabled]),
        input:not([disabled]),
        textarea:not([disabled]),
        select:not([disabled]),
        [tabindex]:not([tabindex="-1"])
        `
      )
    ];

  };


  const openProjectModal = (
    button
  ) => {

    if (!projectModal) {
      return;
    }


    lastFocusedElement =
      document.activeElement;


    const title =
      button.dataset.title ||
      "Project Preview";


    const image =
      button.dataset.image ||
      "";


    const url =
      button.dataset.url ||
      "#";


    const description =
      button.dataset.description ||
      "Project preview.";



    /* Title */

    if (projectModalTitle) {

      projectModalTitle.textContent =
        title;

    }



    /* Description */

    if (projectModalDescription) {

      projectModalDescription.textContent =
        description;

    }



    /* Image */

    if (projectModalImage) {

      projectModalImage.src =
        image;

      projectModalImage.alt =
        `${title} screenshot`;

    }



    /* Project link */

    if (projectModalLink) {

      if (
        url &&
        url !== "#"
      ) {

        projectModalLink.href =
          url;

        projectModalLink.hidden =
          false;

      } else {

        projectModalLink.hidden =
          true;

      }

    }



    /* Open */

    projectModal.classList.add(
      "is-open"
    );


    projectModal.setAttribute(
      "aria-hidden",
      "false"
    );


    document.body.classList.add(
      "modal-open"
    );


    requestAnimationFrame(
      () => {

        projectModalClose?.focus();

      }
    );

  };


  const closeProjectModal = () => {

    if (
      !projectModal ||
      !projectModal.classList.contains(
        "is-open"
      )
    ) {

      return;

    }


    projectModal.classList.remove(
      "is-open"
    );


    projectModal.setAttribute(
      "aria-hidden",
      "true"
    );


    document.body.classList.remove(
      "modal-open"
    );


    if (projectModalImage) {

      projectModalImage.removeAttribute(
        "src"
      );

      projectModalImage.alt = "";

    }


    lastFocusedElement?.focus?.();


    lastFocusedElement = null;

  };



  /*
    IMPORTANT:

    Project buttons use type="button".

    Therefore they cannot submit
    the contact form.
  */

  caseStudyButtons.forEach(
    (button) => {

      button.addEventListener(
        "click",
        (event) => {

          event.preventDefault();

          openProjectModal(
            button
          );

        }
      );

    }
  );



  /* Close buttons */

  projectModal
    ?.querySelectorAll(
      "[data-close-modal]"
    )
    .forEach((element) => {

      element.addEventListener(
        "click",
        closeProjectModal
      );

    });



  /* Escape */

  document.addEventListener(
    "keydown",
    (event) => {

      if (
        !projectModal?.classList.contains(
          "is-open"
        )
      ) {

        return;

      }


      if (
        event.key === "Escape"
      ) {

        event.preventDefault();

        closeProjectModal();

        return;

      }



      /* Focus trap */

      if (
        event.key === "Tab"
      ) {

        const focusable =
          getFocusableElements();


        if (!focusable.length) {

          event.preventDefault();

          return;

        }


        const first =
          focusable[0];

        const last =
          focusable[
            focusable.length - 1
          ];


        if (
          event.shiftKey &&
          document.activeElement === first
        ) {

          event.preventDefault();

          last.focus();

        }


        else if (
          !event.shiftKey &&
          document.activeElement === last
        ) {

          event.preventDefault();

          first.focus();

        }

      }

    }
  );



  /* ==================================================
     CONTACT FORM
  =================================================== */

  const setFormStatus = (
    message,
    type = ""
  ) => {

    if (!formStatus) {
      return;
    }


    formStatus.className =
      `form-status${
        type
          ? ` ${type}`
          : ""
      }`;


    formStatus.textContent =
      message;

  };



  contactForm?.addEventListener(
    "submit",
    async (event) => {

      /*
        Prevent a normal browser
        form submission.
      */

      event.preventDefault();

      const name = contactForm.elements.name?.value.trim() || "";


      const email =
        contactForm.elements.email
          ?.value
          .trim() || "";


      const project =
        contactForm.elements.project
          ?.value
          .trim() || "";



      /* Validation */

      if (
        !name ||
        !email ||
        !project
      ) {

        setFormStatus(
          "Please complete your name, email, and project details.",
          "error"
        );

        return;

      }



      const emailInput =
        contactForm.elements.email;


      if (
        !emailInput ||
        !emailInput.checkValidity()
      ) {

        setFormStatus(
          "Please enter a valid email address.",
          "error"
        );


        emailInput?.focus();

        return;

      }



      /* ==================================================
         OWNER EMAIL
      =================================================== */

      const ownerEmail =
        "sakhiomid714@gmail.com";



      /* ==================================================
         EMAIL CONTENT
      =================================================== */

      const subject =
        `New Project Inquiry from ${name}`;


      const body =
`Hello Sakhi,

I am contacting you through your portfolio website.

Name:
${name}

Email:
${email}

Project Details:
${project}

--------------------------------
Sent from the portfolio website.
`;



      /* ==================================================
         MAILTO
      =================================================== */

      const mailtoURL =
        `mailto:${ownerEmail}` +
        `?subject=${encodeURIComponent(
          subject
        )}` +
        `&body=${encodeURIComponent(
          body
        )}`;



      try {

        const response =
          await fetch("/.netlify/functions/contact", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Accept": "application/json"
            },
            body: JSON.stringify({ name, email, project })
          });

        if (!response.ok) {
          throw new Error("Contact service is unavailable.");
        }

        setFormStatus(
          "Thanks. Your project inquiry has been sent.",
          "success"
        );

        contactForm.reset();

        return;

      } catch {

        setFormStatus(
          "Direct delivery is unavailable. Opening your email app instead.",
          "success"
        );

        window.location.href = mailtoURL;

      }

    }
  );



  /* ==================================================
     SCROLL REVEAL
  =================================================== */

  const revealItems =
    document.querySelectorAll(
      `
      .portfolio-card,
      .service-card,
      .process-card,
      .about-panel,
      .final-cta-box,
      .contact-form
      `
    );


  const reducedMotion =
    window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;



  if (
    !reducedMotion &&
    "IntersectionObserver" in window
  ) {


    revealItems.forEach(
      (item) => {

        item.style.opacity = "0";

        item.style.transform =
          "translateY(18px)";

        item.style.transition =
          "opacity 0.55s ease, transform 0.55s ease";

      }
    );



    const observer =
      new IntersectionObserver(
        (
          entries,
          currentObserver
        ) => {

          entries.forEach(
            (entry) => {

              if (
                !entry.isIntersecting
              ) {

                return;

              }


              entry.target.style.opacity =
                "1";


              entry.target.style.transform =
                "translateY(0)";


              currentObserver.unobserve(
                entry.target
              );

            }
          );

        },
        {
          threshold: 0.1
        }
      );



    revealItems.forEach(
      (item) => {

        observer.observe(item);

      }
    );

  }

})();