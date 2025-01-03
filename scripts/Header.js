class Header {
    // Объект selectors - используем, чтобы в дальнейшем не обращаться к строкам напрямую 
    selectors = {
        root: '[data-js-header]',
        overtlay: '[data-js-header-overlay]',
        burgerButton: '[data-js-header-burger-button]',
    }

    // Классы состояний
    stateClasses = {
        isActive: "is-active",
        isLock: "is-lock",
    }

    constructor() {
        this.rootElement = document.querySelector(this.selectors.root)
        this.overlayElement = this.rootElement.querySelector(this.selectors.overtlay)
        this.burgerButtonElement = this.rootElement.querySelector(this.selectors.burgerButton)
        this.bindEvents()
    }

    onBurgerButtonClick = () => {
        this.burgerButtonElement.classList.toggle(this.stateClasses.isActive)
        this.overlayElement.classList.toggle(this.stateClasses.isActive)
        document.documentElement.classList.toggle(this.stateClasses.isLock)
    }

    // Метод для привязки различных событий к DOM-элементам
    bindEvents() {
        this.burgerButtonElement.addEventListener('click', this.onBurgerButtonClick)
    }
}

export default Header;