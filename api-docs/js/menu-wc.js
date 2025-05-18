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
                                            'data-bs-target="#controllers-links-module-AppModule-24391538de68b64e9b1632a83e8c8db7246f403a709e20e4763ee75cf80287e2610451b762339bc6e9ea0dafe216a7e606d83159a24740df5e41b5c930e423f4"' : 'data-bs-target="#xs-controllers-links-module-AppModule-24391538de68b64e9b1632a83e8c8db7246f403a709e20e4763ee75cf80287e2610451b762339bc6e9ea0dafe216a7e606d83159a24740df5e41b5c930e423f4"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-AppModule-24391538de68b64e9b1632a83e8c8db7246f403a709e20e4763ee75cf80287e2610451b762339bc6e9ea0dafe216a7e606d83159a24740df5e41b5c930e423f4"' :
                                            'id="xs-controllers-links-module-AppModule-24391538de68b64e9b1632a83e8c8db7246f403a709e20e4763ee75cf80287e2610451b762339bc6e9ea0dafe216a7e606d83159a24740df5e41b5c930e423f4"' }>
                                            <li class="link">
                                                <a href="controllers/AppController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-AppModule-24391538de68b64e9b1632a83e8c8db7246f403a709e20e4763ee75cf80287e2610451b762339bc6e9ea0dafe216a7e606d83159a24740df5e41b5c930e423f4"' : 'data-bs-target="#xs-injectables-links-module-AppModule-24391538de68b64e9b1632a83e8c8db7246f403a709e20e4763ee75cf80287e2610451b762339bc6e9ea0dafe216a7e606d83159a24740df5e41b5c930e423f4"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AppModule-24391538de68b64e9b1632a83e8c8db7246f403a709e20e4763ee75cf80287e2610451b762339bc6e9ea0dafe216a7e606d83159a24740df5e41b5c930e423f4"' :
                                        'id="xs-injectables-links-module-AppModule-24391538de68b64e9b1632a83e8c8db7246f403a709e20e4763ee75cf80287e2610451b762339bc6e9ea0dafe216a7e606d83159a24740df5e41b5c930e423f4"' }>
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
                                            'data-bs-target="#controllers-links-module-AuthModule-03b3d51f73eb3f1e8ac3cee4e2040b68bb84503692904ec121736f97476d0398194ee210881a6c040d1206ca768050e1781e4ce9ac7062af3bcae731a8df727e"' : 'data-bs-target="#xs-controllers-links-module-AuthModule-03b3d51f73eb3f1e8ac3cee4e2040b68bb84503692904ec121736f97476d0398194ee210881a6c040d1206ca768050e1781e4ce9ac7062af3bcae731a8df727e"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-AuthModule-03b3d51f73eb3f1e8ac3cee4e2040b68bb84503692904ec121736f97476d0398194ee210881a6c040d1206ca768050e1781e4ce9ac7062af3bcae731a8df727e"' :
                                            'id="xs-controllers-links-module-AuthModule-03b3d51f73eb3f1e8ac3cee4e2040b68bb84503692904ec121736f97476d0398194ee210881a6c040d1206ca768050e1781e4ce9ac7062af3bcae731a8df727e"' }>
                                            <li class="link">
                                                <a href="controllers/AuthController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AuthController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-AuthModule-03b3d51f73eb3f1e8ac3cee4e2040b68bb84503692904ec121736f97476d0398194ee210881a6c040d1206ca768050e1781e4ce9ac7062af3bcae731a8df727e"' : 'data-bs-target="#xs-injectables-links-module-AuthModule-03b3d51f73eb3f1e8ac3cee4e2040b68bb84503692904ec121736f97476d0398194ee210881a6c040d1206ca768050e1781e4ce9ac7062af3bcae731a8df727e"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AuthModule-03b3d51f73eb3f1e8ac3cee4e2040b68bb84503692904ec121736f97476d0398194ee210881a6c040d1206ca768050e1781e4ce9ac7062af3bcae731a8df727e"' :
                                        'id="xs-injectables-links-module-AuthModule-03b3d51f73eb3f1e8ac3cee4e2040b68bb84503692904ec121736f97476d0398194ee210881a6c040d1206ca768050e1781e4ce9ac7062af3bcae731a8df727e"' }>
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
                                <a href="modules/QueueModule.html" data-type="entity-link" >QueueModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-QueueModule-c802354c95e89006d662eaf1f4277bd1852198f3c1995e386890abe38399226063e41febdf82ab10ac107c060e2a72bef924fb70c878efe4c22614db5d7697fe"' : 'data-bs-target="#xs-controllers-links-module-QueueModule-c802354c95e89006d662eaf1f4277bd1852198f3c1995e386890abe38399226063e41febdf82ab10ac107c060e2a72bef924fb70c878efe4c22614db5d7697fe"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-QueueModule-c802354c95e89006d662eaf1f4277bd1852198f3c1995e386890abe38399226063e41febdf82ab10ac107c060e2a72bef924fb70c878efe4c22614db5d7697fe"' :
                                            'id="xs-controllers-links-module-QueueModule-c802354c95e89006d662eaf1f4277bd1852198f3c1995e386890abe38399226063e41febdf82ab10ac107c060e2a72bef924fb70c878efe4c22614db5d7697fe"' }>
                                            <li class="link">
                                                <a href="controllers/QueueController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >QueueController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-QueueModule-c802354c95e89006d662eaf1f4277bd1852198f3c1995e386890abe38399226063e41febdf82ab10ac107c060e2a72bef924fb70c878efe4c22614db5d7697fe"' : 'data-bs-target="#xs-injectables-links-module-QueueModule-c802354c95e89006d662eaf1f4277bd1852198f3c1995e386890abe38399226063e41febdf82ab10ac107c060e2a72bef924fb70c878efe4c22614db5d7697fe"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-QueueModule-c802354c95e89006d662eaf1f4277bd1852198f3c1995e386890abe38399226063e41febdf82ab10ac107c060e2a72bef924fb70c878efe4c22614db5d7697fe"' :
                                        'id="xs-injectables-links-module-QueueModule-c802354c95e89006d662eaf1f4277bd1852198f3c1995e386890abe38399226063e41febdf82ab10ac107c060e2a72bef924fb70c878efe4c22614db5d7697fe"' }>
                                        <li class="link">
                                            <a href="injectables/QueueService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >QueueService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/RolesModule.html" data-type="entity-link" >RolesModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-RolesModule-a9f49fa21c08f260118a0234645d2de2fb4457a4c72d4fc917238582dfb061c5c63d63f0f81cc0d0cae2e2f70a5be49bd50dddfd3aca494c20327107ded01181"' : 'data-bs-target="#xs-controllers-links-module-RolesModule-a9f49fa21c08f260118a0234645d2de2fb4457a4c72d4fc917238582dfb061c5c63d63f0f81cc0d0cae2e2f70a5be49bd50dddfd3aca494c20327107ded01181"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-RolesModule-a9f49fa21c08f260118a0234645d2de2fb4457a4c72d4fc917238582dfb061c5c63d63f0f81cc0d0cae2e2f70a5be49bd50dddfd3aca494c20327107ded01181"' :
                                            'id="xs-controllers-links-module-RolesModule-a9f49fa21c08f260118a0234645d2de2fb4457a4c72d4fc917238582dfb061c5c63d63f0f81cc0d0cae2e2f70a5be49bd50dddfd3aca494c20327107ded01181"' }>
                                            <li class="link">
                                                <a href="controllers/RolesController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RolesController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-RolesModule-a9f49fa21c08f260118a0234645d2de2fb4457a4c72d4fc917238582dfb061c5c63d63f0f81cc0d0cae2e2f70a5be49bd50dddfd3aca494c20327107ded01181"' : 'data-bs-target="#xs-injectables-links-module-RolesModule-a9f49fa21c08f260118a0234645d2de2fb4457a4c72d4fc917238582dfb061c5c63d63f0f81cc0d0cae2e2f70a5be49bd50dddfd3aca494c20327107ded01181"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-RolesModule-a9f49fa21c08f260118a0234645d2de2fb4457a4c72d4fc917238582dfb061c5c63d63f0f81cc0d0cae2e2f70a5be49bd50dddfd3aca494c20327107ded01181"' :
                                        'id="xs-injectables-links-module-RolesModule-a9f49fa21c08f260118a0234645d2de2fb4457a4c72d4fc917238582dfb061c5c63d63f0f81cc0d0cae2e2f70a5be49bd50dddfd3aca494c20327107ded01181"' }>
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
                                    <a href="entities/Counter.html" data-type="entity-link" >Counter</a>
                                </li>
                                <li class="link">
                                    <a href="entities/Queue.html" data-type="entity-link" >Queue</a>
                                </li>
                                <li class="link">
                                    <a href="entities/QueueDetails.html" data-type="entity-link" >QueueDetails</a>
                                </li>
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
                                <a href="classes/CreateQueueDto.html" data-type="entity-link" >CreateQueueDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/LoginDto.html" data-type="entity-link" >LoginDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/QueueGateway.html" data-type="entity-link" >QueueGateway</a>
                            </li>
                            <li class="link">
                                <a href="classes/RegisterDto.html" data-type="entity-link" >RegisterDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateQueueDto.html" data-type="entity-link" >UpdateQueueDto</a>
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
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#interfaces-links"' :
                            'data-bs-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/JwtPayload.html" data-type="entity-link" >JwtPayload</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/RequestWithUser.html" data-type="entity-link" >RequestWithUser</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/RequestWithUser-1.html" data-type="entity-link" >RequestWithUser</a>
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
                                <a href="miscellaneous/enumerations.html" data-type="entity-link">Enums</a>
                            </li>
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