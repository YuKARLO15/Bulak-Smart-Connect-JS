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
                                            'data-bs-target="#controllers-links-module-AppModule-ff64a2221db07d6317c1d4f187e6015e91d45d6407b2b5ff61873c041a0bc9fa44d479519abc69c81a9fcac7a4d4dbc0702bcfe51391cc9af587e8cd772cd1bb"' : 'data-bs-target="#xs-controllers-links-module-AppModule-ff64a2221db07d6317c1d4f187e6015e91d45d6407b2b5ff61873c041a0bc9fa44d479519abc69c81a9fcac7a4d4dbc0702bcfe51391cc9af587e8cd772cd1bb"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-AppModule-ff64a2221db07d6317c1d4f187e6015e91d45d6407b2b5ff61873c041a0bc9fa44d479519abc69c81a9fcac7a4d4dbc0702bcfe51391cc9af587e8cd772cd1bb"' :
                                            'id="xs-controllers-links-module-AppModule-ff64a2221db07d6317c1d4f187e6015e91d45d6407b2b5ff61873c041a0bc9fa44d479519abc69c81a9fcac7a4d4dbc0702bcfe51391cc9af587e8cd772cd1bb"' }>
                                            <li class="link">
                                                <a href="controllers/AppController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-AppModule-ff64a2221db07d6317c1d4f187e6015e91d45d6407b2b5ff61873c041a0bc9fa44d479519abc69c81a9fcac7a4d4dbc0702bcfe51391cc9af587e8cd772cd1bb"' : 'data-bs-target="#xs-injectables-links-module-AppModule-ff64a2221db07d6317c1d4f187e6015e91d45d6407b2b5ff61873c041a0bc9fa44d479519abc69c81a9fcac7a4d4dbc0702bcfe51391cc9af587e8cd772cd1bb"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AppModule-ff64a2221db07d6317c1d4f187e6015e91d45d6407b2b5ff61873c041a0bc9fa44d479519abc69c81a9fcac7a4d4dbc0702bcfe51391cc9af587e8cd772cd1bb"' :
                                        'id="xs-injectables-links-module-AppModule-ff64a2221db07d6317c1d4f187e6015e91d45d6407b2b5ff61873c041a0bc9fa44d479519abc69c81a9fcac7a4d4dbc0702bcfe51391cc9af587e8cd772cd1bb"' }>
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
                                            'data-bs-target="#controllers-links-module-AuthModule-cba678f9d088d94d77841ba24ecbf189382b68d0b08bf37a310dee9c7f587e84617434021a02f4c4dd781ff7a4262e120db669d6ee8da63c53f278f9a4d2d963"' : 'data-bs-target="#xs-controllers-links-module-AuthModule-cba678f9d088d94d77841ba24ecbf189382b68d0b08bf37a310dee9c7f587e84617434021a02f4c4dd781ff7a4262e120db669d6ee8da63c53f278f9a4d2d963"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-AuthModule-cba678f9d088d94d77841ba24ecbf189382b68d0b08bf37a310dee9c7f587e84617434021a02f4c4dd781ff7a4262e120db669d6ee8da63c53f278f9a4d2d963"' :
                                            'id="xs-controllers-links-module-AuthModule-cba678f9d088d94d77841ba24ecbf189382b68d0b08bf37a310dee9c7f587e84617434021a02f4c4dd781ff7a4262e120db669d6ee8da63c53f278f9a4d2d963"' }>
                                            <li class="link">
                                                <a href="controllers/AuthController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AuthController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-AuthModule-cba678f9d088d94d77841ba24ecbf189382b68d0b08bf37a310dee9c7f587e84617434021a02f4c4dd781ff7a4262e120db669d6ee8da63c53f278f9a4d2d963"' : 'data-bs-target="#xs-injectables-links-module-AuthModule-cba678f9d088d94d77841ba24ecbf189382b68d0b08bf37a310dee9c7f587e84617434021a02f4c4dd781ff7a4262e120db669d6ee8da63c53f278f9a4d2d963"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AuthModule-cba678f9d088d94d77841ba24ecbf189382b68d0b08bf37a310dee9c7f587e84617434021a02f4c4dd781ff7a4262e120db669d6ee8da63c53f278f9a4d2d963"' :
                                        'id="xs-injectables-links-module-AuthModule-cba678f9d088d94d77841ba24ecbf189382b68d0b08bf37a310dee9c7f587e84617434021a02f4c4dd781ff7a4262e120db669d6ee8da63c53f278f9a4d2d963"' }>
                                        <li class="link">
                                            <a href="injectables/AuthService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AuthService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/JwtStrategy.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >JwtStrategy</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/RolesModule.html" data-type="entity-link" >RolesModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-RolesModule-8afb9733798d1ab7a9bbf2b9975657c09d505a9939b9c2f76890e3b03a6c4efc2893e17b180daaa3a96fb4c5598731a659701af9c988adea47a10980d97e1144"' : 'data-bs-target="#xs-controllers-links-module-RolesModule-8afb9733798d1ab7a9bbf2b9975657c09d505a9939b9c2f76890e3b03a6c4efc2893e17b180daaa3a96fb4c5598731a659701af9c988adea47a10980d97e1144"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-RolesModule-8afb9733798d1ab7a9bbf2b9975657c09d505a9939b9c2f76890e3b03a6c4efc2893e17b180daaa3a96fb4c5598731a659701af9c988adea47a10980d97e1144"' :
                                            'id="xs-controllers-links-module-RolesModule-8afb9733798d1ab7a9bbf2b9975657c09d505a9939b9c2f76890e3b03a6c4efc2893e17b180daaa3a96fb4c5598731a659701af9c988adea47a10980d97e1144"' }>
                                            <li class="link">
                                                <a href="controllers/RolesController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RolesController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-RolesModule-8afb9733798d1ab7a9bbf2b9975657c09d505a9939b9c2f76890e3b03a6c4efc2893e17b180daaa3a96fb4c5598731a659701af9c988adea47a10980d97e1144"' : 'data-bs-target="#xs-injectables-links-module-RolesModule-8afb9733798d1ab7a9bbf2b9975657c09d505a9939b9c2f76890e3b03a6c4efc2893e17b180daaa3a96fb4c5598731a659701af9c988adea47a10980d97e1144"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-RolesModule-8afb9733798d1ab7a9bbf2b9975657c09d505a9939b9c2f76890e3b03a6c4efc2893e17b180daaa3a96fb4c5598731a659701af9c988adea47a10980d97e1144"' :
                                        'id="xs-injectables-links-module-RolesModule-8afb9733798d1ab7a9bbf2b9975657c09d505a9939b9c2f76890e3b03a6c4efc2893e17b180daaa3a96fb4c5598731a659701af9c988adea47a10980d97e1144"' }>
                                        <li class="link">
                                            <a href="injectables/RolesService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RolesService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/UsersModule.html" data-type="entity-link" >UsersModule</a>
                            </li>
                </ul>
                </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#entities-links"' :
                                'data-bs-target="#xs-entities-links"' }>
                                <span class="icon ion-ios-apps"></span>
                                <span>Entities</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="entities-links"' : 'id="xs-entities-links"' }>
                                <li class="link">
                                    <a href="entities/Role.html" data-type="entity-link" >Role</a>
                                </li>
                                <li class="link">
                                    <a href="entities/User.html" data-type="entity-link" >User</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#classes-links"' :
                            'data-bs-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/LoginDto.html" data-type="entity-link" >LoginDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/RegisterDto.html" data-type="entity-link" >RegisterDto</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#injectables-links"' :
                                'data-bs-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/JwtAuthGuard.html" data-type="entity-link" >JwtAuthGuard</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#guards-links"' :
                            'data-bs-target="#xs-guards-links"' }>
                            <span class="icon ion-ios-lock"></span>
                            <span>Guards</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="guards-links"' : 'id="xs-guards-links"' }>
                            <li class="link">
                                <a href="guards/RolesGuard.html" data-type="entity-link" >RolesGuard</a>
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