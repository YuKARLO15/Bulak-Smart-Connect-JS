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
                                <a href="modules/AnnouncementModule.html" data-type="entity-link" >AnnouncementModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-AnnouncementModule-7ac2e227c807c4f5c2000907c7a88d97a150facfdd1b190ab34e8ff2e1fc7dd9841c4deb12bdc9a9e49a7cec3025bb2fe6af1f687e18fc1f386852cbd42f8947"' : 'data-bs-target="#xs-controllers-links-module-AnnouncementModule-7ac2e227c807c4f5c2000907c7a88d97a150facfdd1b190ab34e8ff2e1fc7dd9841c4deb12bdc9a9e49a7cec3025bb2fe6af1f687e18fc1f386852cbd42f8947"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-AnnouncementModule-7ac2e227c807c4f5c2000907c7a88d97a150facfdd1b190ab34e8ff2e1fc7dd9841c4deb12bdc9a9e49a7cec3025bb2fe6af1f687e18fc1f386852cbd42f8947"' :
                                            'id="xs-controllers-links-module-AnnouncementModule-7ac2e227c807c4f5c2000907c7a88d97a150facfdd1b190ab34e8ff2e1fc7dd9841c4deb12bdc9a9e49a7cec3025bb2fe6af1f687e18fc1f386852cbd42f8947"' }>
                                            <li class="link">
                                                <a href="controllers/AnnouncementController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AnnouncementController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-AnnouncementModule-7ac2e227c807c4f5c2000907c7a88d97a150facfdd1b190ab34e8ff2e1fc7dd9841c4deb12bdc9a9e49a7cec3025bb2fe6af1f687e18fc1f386852cbd42f8947"' : 'data-bs-target="#xs-injectables-links-module-AnnouncementModule-7ac2e227c807c4f5c2000907c7a88d97a150facfdd1b190ab34e8ff2e1fc7dd9841c4deb12bdc9a9e49a7cec3025bb2fe6af1f687e18fc1f386852cbd42f8947"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AnnouncementModule-7ac2e227c807c4f5c2000907c7a88d97a150facfdd1b190ab34e8ff2e1fc7dd9841c4deb12bdc9a9e49a7cec3025bb2fe6af1f687e18fc1f386852cbd42f8947"' :
                                        'id="xs-injectables-links-module-AnnouncementModule-7ac2e227c807c4f5c2000907c7a88d97a150facfdd1b190ab34e8ff2e1fc7dd9841c4deb12bdc9a9e49a7cec3025bb2fe6af1f687e18fc1f386852cbd42f8947"' }>
                                        <li class="link">
                                            <a href="injectables/AnnouncementService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AnnouncementService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link" >AppModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-AppModule-1984c2d2aa7af15127c69b25f489d7570d2b2b56b98de5f9dffff237d13f8acec6e7ebd366d427a2125f5da57bf6ebf36028ddfa694b1964ff79bcf12f481daa"' : 'data-bs-target="#xs-controllers-links-module-AppModule-1984c2d2aa7af15127c69b25f489d7570d2b2b56b98de5f9dffff237d13f8acec6e7ebd366d427a2125f5da57bf6ebf36028ddfa694b1964ff79bcf12f481daa"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-AppModule-1984c2d2aa7af15127c69b25f489d7570d2b2b56b98de5f9dffff237d13f8acec6e7ebd366d427a2125f5da57bf6ebf36028ddfa694b1964ff79bcf12f481daa"' :
                                            'id="xs-controllers-links-module-AppModule-1984c2d2aa7af15127c69b25f489d7570d2b2b56b98de5f9dffff237d13f8acec6e7ebd366d427a2125f5da57bf6ebf36028ddfa694b1964ff79bcf12f481daa"' }>
                                            <li class="link">
                                                <a href="controllers/AppController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-AppModule-1984c2d2aa7af15127c69b25f489d7570d2b2b56b98de5f9dffff237d13f8acec6e7ebd366d427a2125f5da57bf6ebf36028ddfa694b1964ff79bcf12f481daa"' : 'data-bs-target="#xs-injectables-links-module-AppModule-1984c2d2aa7af15127c69b25f489d7570d2b2b56b98de5f9dffff237d13f8acec6e7ebd366d427a2125f5da57bf6ebf36028ddfa694b1964ff79bcf12f481daa"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AppModule-1984c2d2aa7af15127c69b25f489d7570d2b2b56b98de5f9dffff237d13f8acec6e7ebd366d427a2125f5da57bf6ebf36028ddfa694b1964ff79bcf12f481daa"' :
                                        'id="xs-injectables-links-module-AppModule-1984c2d2aa7af15127c69b25f489d7570d2b2b56b98de5f9dffff237d13f8acec6e7ebd366d427a2125f5da57bf6ebf36028ddfa694b1964ff79bcf12f481daa"' }>
                                        <li class="link">
                                            <a href="injectables/AppService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/AppointmentModule.html" data-type="entity-link" >AppointmentModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-AppointmentModule-aac8200fdd254eb828b2aa1a3e83568bf0f5cc26e4665e4818c64977449ef44bea1deba7b1901d489a2e25c72764278830f8d5e31eb7a02a6bac700bef81ade2"' : 'data-bs-target="#xs-controllers-links-module-AppointmentModule-aac8200fdd254eb828b2aa1a3e83568bf0f5cc26e4665e4818c64977449ef44bea1deba7b1901d489a2e25c72764278830f8d5e31eb7a02a6bac700bef81ade2"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-AppointmentModule-aac8200fdd254eb828b2aa1a3e83568bf0f5cc26e4665e4818c64977449ef44bea1deba7b1901d489a2e25c72764278830f8d5e31eb7a02a6bac700bef81ade2"' :
                                            'id="xs-controllers-links-module-AppointmentModule-aac8200fdd254eb828b2aa1a3e83568bf0f5cc26e4665e4818c64977449ef44bea1deba7b1901d489a2e25c72764278830f8d5e31eb7a02a6bac700bef81ade2"' }>
                                            <li class="link">
                                                <a href="controllers/AppointmentController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppointmentController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-AppointmentModule-aac8200fdd254eb828b2aa1a3e83568bf0f5cc26e4665e4818c64977449ef44bea1deba7b1901d489a2e25c72764278830f8d5e31eb7a02a6bac700bef81ade2"' : 'data-bs-target="#xs-injectables-links-module-AppointmentModule-aac8200fdd254eb828b2aa1a3e83568bf0f5cc26e4665e4818c64977449ef44bea1deba7b1901d489a2e25c72764278830f8d5e31eb7a02a6bac700bef81ade2"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AppointmentModule-aac8200fdd254eb828b2aa1a3e83568bf0f5cc26e4665e4818c64977449ef44bea1deba7b1901d489a2e25c72764278830f8d5e31eb7a02a6bac700bef81ade2"' :
                                        'id="xs-injectables-links-module-AppointmentModule-aac8200fdd254eb828b2aa1a3e83568bf0f5cc26e4665e4818c64977449ef44bea1deba7b1901d489a2e25c72764278830f8d5e31eb7a02a6bac700bef81ade2"' }>
                                        <li class="link">
                                            <a href="injectables/AppointmentService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppointmentService</a>
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
                                <a href="modules/DocumentApplicationsModule.html" data-type="entity-link" >DocumentApplicationsModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-DocumentApplicationsModule-990b684955205e602756b67f86ad246f7c79c355119c2b2ab1b43c5e4867a4522409c659991735ddabb22cf526bbae12307006815b44e46b42a5c684cb9f4767"' : 'data-bs-target="#xs-controllers-links-module-DocumentApplicationsModule-990b684955205e602756b67f86ad246f7c79c355119c2b2ab1b43c5e4867a4522409c659991735ddabb22cf526bbae12307006815b44e46b42a5c684cb9f4767"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-DocumentApplicationsModule-990b684955205e602756b67f86ad246f7c79c355119c2b2ab1b43c5e4867a4522409c659991735ddabb22cf526bbae12307006815b44e46b42a5c684cb9f4767"' :
                                            'id="xs-controllers-links-module-DocumentApplicationsModule-990b684955205e602756b67f86ad246f7c79c355119c2b2ab1b43c5e4867a4522409c659991735ddabb22cf526bbae12307006815b44e46b42a5c684cb9f4767"' }>
                                            <li class="link">
                                                <a href="controllers/DocumentApplicationsController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DocumentApplicationsController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-DocumentApplicationsModule-990b684955205e602756b67f86ad246f7c79c355119c2b2ab1b43c5e4867a4522409c659991735ddabb22cf526bbae12307006815b44e46b42a5c684cb9f4767"' : 'data-bs-target="#xs-injectables-links-module-DocumentApplicationsModule-990b684955205e602756b67f86ad246f7c79c355119c2b2ab1b43c5e4867a4522409c659991735ddabb22cf526bbae12307006815b44e46b42a5c684cb9f4767"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-DocumentApplicationsModule-990b684955205e602756b67f86ad246f7c79c355119c2b2ab1b43c5e4867a4522409c659991735ddabb22cf526bbae12307006815b44e46b42a5c684cb9f4767"' :
                                        'id="xs-injectables-links-module-DocumentApplicationsModule-990b684955205e602756b67f86ad246f7c79c355119c2b2ab1b43c5e4867a4522409c659991735ddabb22cf526bbae12307006815b44e46b42a5c684cb9f4767"' }>
                                        <li class="link">
                                            <a href="injectables/DocumentApplicationsService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DocumentApplicationsService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/MinioService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >MinioService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/QueueModule.html" data-type="entity-link" >QueueModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-QueueModule-b5e0b1677f82db789467298c11ec45153e8de24e738863fd1bbd10c70924e390715367429cd988a8438eba312f7ae0ae9e1583b0e8b0d0fe22eabb5b7d92fd56"' : 'data-bs-target="#xs-controllers-links-module-QueueModule-b5e0b1677f82db789467298c11ec45153e8de24e738863fd1bbd10c70924e390715367429cd988a8438eba312f7ae0ae9e1583b0e8b0d0fe22eabb5b7d92fd56"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-QueueModule-b5e0b1677f82db789467298c11ec45153e8de24e738863fd1bbd10c70924e390715367429cd988a8438eba312f7ae0ae9e1583b0e8b0d0fe22eabb5b7d92fd56"' :
                                            'id="xs-controllers-links-module-QueueModule-b5e0b1677f82db789467298c11ec45153e8de24e738863fd1bbd10c70924e390715367429cd988a8438eba312f7ae0ae9e1583b0e8b0d0fe22eabb5b7d92fd56"' }>
                                            <li class="link">
                                                <a href="controllers/QueueController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >QueueController</a>
                                            </li>
                                            <li class="link">
                                                <a href="controllers/QueuesController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >QueuesController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-QueueModule-b5e0b1677f82db789467298c11ec45153e8de24e738863fd1bbd10c70924e390715367429cd988a8438eba312f7ae0ae9e1583b0e8b0d0fe22eabb5b7d92fd56"' : 'data-bs-target="#xs-injectables-links-module-QueueModule-b5e0b1677f82db789467298c11ec45153e8de24e738863fd1bbd10c70924e390715367429cd988a8438eba312f7ae0ae9e1583b0e8b0d0fe22eabb5b7d92fd56"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-QueueModule-b5e0b1677f82db789467298c11ec45153e8de24e738863fd1bbd10c70924e390715367429cd988a8438eba312f7ae0ae9e1583b0e8b0d0fe22eabb5b7d92fd56"' :
                                        'id="xs-injectables-links-module-QueueModule-b5e0b1677f82db789467298c11ec45153e8de24e738863fd1bbd10c70924e390715367429cd988a8438eba312f7ae0ae9e1583b0e8b0d0fe22eabb5b7d92fd56"' }>
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
                                    <a href="entities/Announcement.html" data-type="entity-link" >Announcement</a>
                                </li>
                                <li class="link">
                                    <a href="entities/ApplicationStatusHistory.html" data-type="entity-link" >ApplicationStatusHistory</a>
                                </li>
                                <li class="link">
                                    <a href="entities/Appointment.html" data-type="entity-link" >Appointment</a>
                                </li>
                                <li class="link">
                                    <a href="entities/Counter.html" data-type="entity-link" >Counter</a>
                                </li>
                                <li class="link">
                                    <a href="entities/DocumentApplication.html" data-type="entity-link" >DocumentApplication</a>
                                </li>
                                <li class="link">
                                    <a href="entities/DocumentFile.html" data-type="entity-link" >DocumentFile</a>
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
                                <a href="classes/AdminUpdateUserDto.html" data-type="entity-link" >AdminUpdateUserDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/ApplicationStatusHistory.html" data-type="entity-link" >ApplicationStatusHistory</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateAnnouncementDto.html" data-type="entity-link" >CreateAnnouncementDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateAppointmentDto.html" data-type="entity-link" >CreateAppointmentDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateDocumentApplicationDto.html" data-type="entity-link" >CreateDocumentApplicationDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateQueueDto.html" data-type="entity-link" >CreateQueueDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/DocumentApplication.html" data-type="entity-link" >DocumentApplication</a>
                            </li>
                            <li class="link">
                                <a href="classes/DocumentFile.html" data-type="entity-link" >DocumentFile</a>
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
                                <a href="classes/UpdateAnnouncementDto.html" data-type="entity-link" >UpdateAnnouncementDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateAppointmentDto.html" data-type="entity-link" >UpdateAppointmentDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateDocumentApplicationDto.html" data-type="entity-link" >UpdateDocumentApplicationDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateQueueDto.html" data-type="entity-link" >UpdateQueueDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateUserDto.html" data-type="entity-link" >UpdateUserDto</a>
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
                                <li class="link">
                                    <a href="injectables/MinioService.html" data-type="entity-link" >MinioService</a>
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
                                <a href="interfaces/AuthenticatedUser.html" data-type="entity-link" >AuthenticatedUser</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/JwtPayload.html" data-type="entity-link" >JwtPayload</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/QueueDetails.html" data-type="entity-link" >QueueDetails</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/RequestWithUser.html" data-type="entity-link" >RequestWithUser</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/RequestWithUser-1.html" data-type="entity-link" >RequestWithUser</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/RequestWithUser-2.html" data-type="entity-link" >RequestWithUser</a>
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