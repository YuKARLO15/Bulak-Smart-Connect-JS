'use strict';

customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">bsc-js-backend documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                                <li class="link">
                                    <a href="properties.html" data-type="chapter-link">
                                        <span class="icon ion-ios-apps"></span>Properties
                                    </a>
                                </li>
                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-bs-toggle="collapse" ${ isNormalMode ?
                                'data-bs-target="#modules-links"' : 'data-bs-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link" >AppModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-AppModule-70bfe0b0872eb2ca59a1e917a1d126a631052006a4b6b70af7425d32cfb4e492992afd9872c3f11a920076104c7c98e5d426c6a0bd008a5fadda7ae87f2789fe"' : 'data-bs-target="#xs-controllers-links-module-AppModule-70bfe0b0872eb2ca59a1e917a1d126a631052006a4b6b70af7425d32cfb4e492992afd9872c3f11a920076104c7c98e5d426c6a0bd008a5fadda7ae87f2789fe"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-AppModule-70bfe0b0872eb2ca59a1e917a1d126a631052006a4b6b70af7425d32cfb4e492992afd9872c3f11a920076104c7c98e5d426c6a0bd008a5fadda7ae87f2789fe"' :
                                            'id="xs-controllers-links-module-AppModule-70bfe0b0872eb2ca59a1e917a1d126a631052006a4b6b70af7425d32cfb4e492992afd9872c3f11a920076104c7c98e5d426c6a0bd008a5fadda7ae87f2789fe"' }>
                                            <li class="link">
                                                <a href="controllers/AppController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-AppModule-70bfe0b0872eb2ca59a1e917a1d126a631052006a4b6b70af7425d32cfb4e492992afd9872c3f11a920076104c7c98e5d426c6a0bd008a5fadda7ae87f2789fe"' : 'data-bs-target="#xs-injectables-links-module-AppModule-70bfe0b0872eb2ca59a1e917a1d126a631052006a4b6b70af7425d32cfb4e492992afd9872c3f11a920076104c7c98e5d426c6a0bd008a5fadda7ae87f2789fe"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AppModule-70bfe0b0872eb2ca59a1e917a1d126a631052006a4b6b70af7425d32cfb4e492992afd9872c3f11a920076104c7c98e5d426c6a0bd008a5fadda7ae87f2789fe"' :
                                        'id="xs-injectables-links-module-AppModule-70bfe0b0872eb2ca59a1e917a1d126a631052006a4b6b70af7425d32cfb4e492992afd9872c3f11a920076104c7c98e5d426c6a0bd008a5fadda7ae87f2789fe"' }>
                                        <li class="link">
                                            <a href="injectables/AppService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/AuthModule.html" data-type="entity-link" >AuthModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-AuthModule-c77d985880c5f558a70b015719e2660cbb0e73eeb9208066e0ac74943c982b07acdf7af54255c081e269206eb45ecf0fec196cae2c37f55f2313a3bcbb738597"' : 'data-bs-target="#xs-controllers-links-module-AuthModule-c77d985880c5f558a70b015719e2660cbb0e73eeb9208066e0ac74943c982b07acdf7af54255c081e269206eb45ecf0fec196cae2c37f55f2313a3bcbb738597"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-AuthModule-c77d985880c5f558a70b015719e2660cbb0e73eeb9208066e0ac74943c982b07acdf7af54255c081e269206eb45ecf0fec196cae2c37f55f2313a3bcbb738597"' :
                                            'id="xs-controllers-links-module-AuthModule-c77d985880c5f558a70b015719e2660cbb0e73eeb9208066e0ac74943c982b07acdf7af54255c081e269206eb45ecf0fec196cae2c37f55f2313a3bcbb738597"' }>
                                            <li class="link">
                                                <a href="controllers/AuthController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AuthController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-AuthModule-c77d985880c5f558a70b015719e2660cbb0e73eeb9208066e0ac74943c982b07acdf7af54255c081e269206eb45ecf0fec196cae2c37f55f2313a3bcbb738597"' : 'data-bs-target="#xs-injectables-links-module-AuthModule-c77d985880c5f558a70b015719e2660cbb0e73eeb9208066e0ac74943c982b07acdf7af54255c081e269206eb45ecf0fec196cae2c37f55f2313a3bcbb738597"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AuthModule-c77d985880c5f558a70b015719e2660cbb0e73eeb9208066e0ac74943c982b07acdf7af54255c081e269206eb45ecf0fec196cae2c37f55f2313a3bcbb738597"' :
                                        'id="xs-injectables-links-module-AuthModule-c77d985880c5f558a70b015719e2660cbb0e73eeb9208066e0ac74943c982b07acdf7af54255c081e269206eb45ecf0fec196cae2c37f55f2313a3bcbb738597"' }>
                                        <li class="link">
                                            <a href="injectables/AuthService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AuthService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                </ul>
                </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#miscellaneous-links"'
                            : 'data-bs-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/functions.html" data-type="entity-link">Functions</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank" rel="noopener noreferrer">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});