/* eslint-env browser */
/* global $, M */

class Sidenav extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    let sidebarState = sessionStorage.getItem('viewflow_site_drawer_state');
    if (window.innerWidth >= 992 && sidebarState == 'closed') {
      $(this).find('.sidenav').removeClass('sidenav-fixed');
    }

    $(this).find('.sidenav').sidenav();
    $(document).activeNavigation('#slide-out');
    $('#slide-out').perfectScrollbar();
  }

  disconnectedCallback() {
    $(this).find('.sidenav').sidenav('destroy');
    $('#slide-out').perfectScrollbar('destroy');
  }
};

class SidenavTrigger extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this._trigger = this.querySelector('.sidenav-trigger');
    this._main = document.querySelector('main');
    this._trigger.addEventListener('click', this.onClick);

    let sidebarState = sessionStorage.getItem('viewflow_site_drawer_state');

    if (window.innerWidth >= 992 && sidebarState == 'closed') {
      const sidenavId = M.getIdFromTrigger(this._trigger);
      const sidenavInstance = document.getElementById(sidenavId).M_Sidenav;
      sidenavInstance.close();
      this._main.style.marginLeft='0';
    }
  }

  disconnectedCallback() {
    this._trigger.removeEventListener('click', this.onClick);
  }

  onClick = (event) => {
      const sidenavId = M.getIdFromTrigger(this._trigger);
      const sidenavInstance = document.getElementById(sidenavId).M_Sidenav;
      if (sidenavInstance) {
        if (sidenavInstance.isOpen) {
          sidenavInstance.close();
          sidenavInstance.isFixed = false;
          $(document).find('.sidenav').removeClass('sidenav-fixed');
          this._main.style.marginLeft='0';
          sessionStorage.setItem('viewflow_site_drawer_state', 'closed');
        } else {
          sidenavInstance.isFixed = true;
          $(document).find('.sidenav').addClass('sidenav-fixed');
          sidenavInstance.open();
          this._main.style.marginLeft=null;
          sessionStorage.setItem('viewflow_site_drawer_state', 'open');
        }
      }
      event.preventDefault();
      event.stopPropagation();
  }
}

window.addEventListener('load', () => {
  window.customElements.define('dmc-sidenav', Sidenav);
  window.customElements.define('dmc-sidenav-trigger', SidenavTrigger);
});
