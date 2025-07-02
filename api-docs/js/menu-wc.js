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
                                            'data-bs-target="#controllers-links-module-AppModule-4eb7d5572787475bcb3f459852ae8c588b905fe4e126444b82cfbd1522f51a6a7083c2f482835749c43456b92c17e8a7a61d9656a57efa3eb24fd1d2c804b955"' : 'data-bs-target="#xs-controllers-links-module-AppModule-4eb7d5572787475bcb3f459852ae8c588b905fe4e126444b82cfbd1522f51a6a7083c2f482835749c43456b92c17e8a7a61d9656a57efa3eb24fd1d2c804b955"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-AppModule-4eb7d5572787475bcb3f459852ae8c588b905fe4e126444b82cfbd1522f51a6a7083c2f482835749c43456b92c17e8a7a61d9656a57efa3eb24fd1d2c804b955"' :
                                            'id="xs-controllers-links-module-AppModule-4eb7d5572787475bcb3f459852ae8c588b905fe4e126444b82cfbd1522f51a6a7083c2f482835749c43456b92c17e8a7a61d9656a57efa3eb24fd1d2c804b955"' }>
                                            <li class="link">
                                                <a href="controllers/AppController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-AppModule-4eb7d5572787475bcb3f459852ae8c588b905fe4e126444b82cfbd1522f51a6a7083c2f482835749c43456b92c17e8a7a61d9656a57efa3eb24fd1d2c804b955"' : 'data-bs-target="#xs-injectables-links-module-AppModule-4eb7d5572787475bcb3f459852ae8c588b905fe4e126444b82cfbd1522f51a6a7083c2f482835749c43456b92c17e8a7a61d9656a57efa3eb24fd1d2c804b955"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AppModule-4eb7d5572787475bcb3f459852ae8c588b905fe4e126444b82cfbd1522f51a6a7083c2f482835749c43456b92c17e8a7a61d9656a57efa3eb24fd1d2c804b955"' :
                                        'id="xs-injectables-links-module-AppModule-4eb7d5572787475bcb3f459852ae8c588b905fe4e126444b82cfbd1522f51a6a7083c2f482835749c43456b92c17e8a7a61d9656a57efa3eb24fd1d2c804b955"' }>
                                        <li class="link">
                                            <a href="injectables/AppService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/EmailService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >EmailService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/OTPService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >OTPService</a>
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
                                            'data-bs-target="#controllers-links-module-AuthModule-24d984c79240c7909f6d23aa459e7f2d64e481e255164f10a246b1716da0538de7d054db9fecf68be0f361b851e194e17e6f1f891f0e37c17e92fd933fcee761"' : 'data-bs-target="#xs-controllers-links-module-AuthModule-24d984c79240c7909f6d23aa459e7f2d64e481e255164f10a246b1716da0538de7d054db9fecf68be0f361b851e194e17e6f1f891f0e37c17e92fd933fcee761"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-AuthModule-24d984c79240c7909f6d23aa459e7f2d64e481e255164f10a246b1716da0538de7d054db9fecf68be0f361b851e194e17e6f1f891f0e37c17e92fd933fcee761"' :
                                            'id="xs-controllers-links-module-AuthModule-24d984c79240c7909f6d23aa459e7f2d64e481e255164f10a246b1716da0538de7d054db9fecf68be0f361b851e194e17e6f1f891f0e37c17e92fd933fcee761"' }>
                                            <li class="link">
                                                <a href="controllers/AuthController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AuthController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-AuthModule-24d984c79240c7909f6d23aa459e7f2d64e481e255164f10a246b1716da0538de7d054db9fecf68be0f361b851e194e17e6f1f891f0e37c17e92fd933fcee761"' : 'data-bs-target="#xs-injectables-links-module-AuthModule-24d984c79240c7909f6d23aa459e7f2d64e481e255164f10a246b1716da0538de7d054db9fecf68be0f361b851e194e17e6f1f891f0e37c17e92fd933fcee761"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AuthModule-24d984c79240c7909f6d23aa459e7f2d64e481e255164f10a246b1716da0538de7d054db9fecf68be0f361b851e194e17e6f1f891f0e37c17e92fd933fcee761"' :
                                        'id="xs-injectables-links-module-AuthModule-24d984c79240c7909f6d23aa459e7f2d64e481e255164f10a246b1716da0538de7d054db9fecf68be0f361b851e194e17e6f1f891f0e37c17e92fd933fcee761"' }>
                                        <li class="link">
                                            <a href="injectables/AuthService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AuthService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/EmailService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >EmailService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/JwtStrategy.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >JwtStrategy</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/OTPService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >OTPService</a>
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
                                            'data-bs-target="#controllers-links-module-QueueModule-feb4a189b7eec35329f5bb7bd756f7c5827328ce06c55186a9d0eff0d22a9b9ff842e7748375b58bbd86492d8340047a57c39a9bec551f37e938c8d3cff958a6"' : 'data-bs-target="#xs-controllers-links-module-QueueModule-feb4a189b7eec35329f5bb7bd756f7c5827328ce06c55186a9d0eff0d22a9b9ff842e7748375b58bbd86492d8340047a57c39a9bec551f37e938c8d3cff958a6"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-QueueModule-feb4a189b7eec35329f5bb7bd756f7c5827328ce06c55186a9d0eff0d22a9b9ff842e7748375b58bbd86492d8340047a57c39a9bec551f37e938c8d3cff958a6"' :
                                            'id="xs-controllers-links-module-QueueModule-feb4a189b7eec35329f5bb7bd756f7c5827328ce06c55186a9d0eff0d22a9b9ff842e7748375b58bbd86492d8340047a57c39a9bec551f37e938c8d3cff958a6"' }>
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
                                        'data-bs-target="#injectables-links-module-QueueModule-feb4a189b7eec35329f5bb7bd756f7c5827328ce06c55186a9d0eff0d22a9b9ff842e7748375b58bbd86492d8340047a57c39a9bec551f37e938c8d3cff958a6"' : 'data-bs-target="#xs-injectables-links-module-QueueModule-feb4a189b7eec35329f5bb7bd756f7c5827328ce06c55186a9d0eff0d22a9b9ff842e7748375b58bbd86492d8340047a57c39a9bec551f37e938c8d3cff958a6"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-QueueModule-feb4a189b7eec35329f5bb7bd756f7c5827328ce06c55186a9d0eff0d22a9b9ff842e7748375b58bbd86492d8340047a57c39a9bec551f37e938c8d3cff958a6"' :
                                        'id="xs-injectables-links-module-QueueModule-feb4a189b7eec35329f5bb7bd756f7c5827328ce06c55186a9d0eff0d22a9b9ff842e7748375b58bbd86492d8340047a57c39a9bec551f37e938c8d3cff958a6"' }>
                                        <li class="link">
                                            <a href="injectables/QueueSchedulerService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >QueueSchedulerService</a>
                                        </li>
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
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-UsersModule-65854dba71a8fd584fa8e06b9f8056ed6044c8f029b90c38e351db6283dfc7b37d709e4d02af007b28a6a9e252cfebd670f2d40ee34f23667d85931c3e46f35d"' : 'data-bs-target="#xs-controllers-links-module-UsersModule-65854dba71a8fd584fa8e06b9f8056ed6044c8f029b90c38e351db6283dfc7b37d709e4d02af007b28a6a9e252cfebd670f2d40ee34f23667d85931c3e46f35d"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-UsersModule-65854dba71a8fd584fa8e06b9f8056ed6044c8f029b90c38e351db6283dfc7b37d709e4d02af007b28a6a9e252cfebd670f2d40ee34f23667d85931c3e46f35d"' :
                                            'id="xs-controllers-links-module-UsersModule-65854dba71a8fd584fa8e06b9f8056ed6044c8f029b90c38e351db6283dfc7b37d709e4d02af007b28a6a9e252cfebd670f2d40ee34f23667d85931c3e46f35d"' }>
                                            <li class="link">
                                                <a href="controllers/UsersController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UsersController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-UsersModule-65854dba71a8fd584fa8e06b9f8056ed6044c8f029b90c38e351db6283dfc7b37d709e4d02af007b28a6a9e252cfebd670f2d40ee34f23667d85931c3e46f35d"' : 'data-bs-target="#xs-injectables-links-module-UsersModule-65854dba71a8fd584fa8e06b9f8056ed6044c8f029b90c38e351db6283dfc7b37d709e4d02af007b28a6a9e252cfebd670f2d40ee34f23667d85931c3e46f35d"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-UsersModule-65854dba71a8fd584fa8e06b9f8056ed6044c8f029b90c38e351db6283dfc7b37d709e4d02af007b28a6a9e252cfebd670f2d40ee34f23667d85931c3e46f35d"' :
                                        'id="xs-injectables-links-module-UsersModule-65854dba71a8fd584fa8e06b9f8056ed6044c8f029b90c38e351db6283dfc7b37d709e4d02af007b28a6a9e252cfebd670f2d40ee34f23667d85931c3e46f35d"' }>
                                        <li class="link">
                                            <a href="injectables/UsersService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UsersService</a>
                                        </li>
                                    </ul>
                                </li>
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
                                    <a href="entities/OTP.html" data-type="entity-link" >OTP</a>
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
                                <a href="classes/ApplicationNotificationDto.html" data-type="entity-link" >ApplicationNotificationDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/ApplicationStatusHistory.html" data-type="entity-link" >ApplicationStatusHistory</a>
                            </li>
                            <li class="link">
                                <a href="classes/AppointmentNotificationDto.html" data-type="entity-link" >AppointmentNotificationDto</a>
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
                                <a href="classes/CreateUserDto.html" data-type="entity-link" >CreateUserDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/DocumentApplication.html" data-type="entity-link" >DocumentApplication</a>
                            </li>
                            <li class="link">
                                <a href="classes/DocumentFile.html" data-type="entity-link" >DocumentFile</a>
                            </li>
                            <li class="link">
                                <a href="classes/ForgotPasswordDto.html" data-type="entity-link" >ForgotPasswordDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/LoginDto.html" data-type="entity-link" >LoginDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/PaginatedUsersResponseDto.html" data-type="entity-link" >PaginatedUsersResponseDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/QueueGateway.html" data-type="entity-link" >QueueGateway</a>
                            </li>
                            <li class="link">
                                <a href="classes/QueueNotificationDto.html" data-type="entity-link" >QueueNotificationDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/RegisterDto.html" data-type="entity-link" >RegisterDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/ResetPasswordDto.html" data-type="entity-link" >ResetPasswordDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/SendOtpDto.html" data-type="entity-link" >SendOtpDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/TestOtpDto.html" data-type="entity-link" >TestOtpDto</a>
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
                            <li class="link">
                                <a href="classes/UpdateUserStatusDto.html" data-type="entity-link" >UpdateUserStatusDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UserQueryDto.html" data-type="entity-link" >UserQueryDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UserResponseDto.html" data-type="entity-link" >UserResponseDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UsersByRoleDto.html" data-type="entity-link" >UsersByRoleDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UserStatsResponseDto.html" data-type="entity-link" >UserStatsResponseDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/VerifyOtpDto.html" data-type="entity-link" >VerifyOtpDto</a>
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
                                <a href="interfaces/FindAllOptions.html" data-type="entity-link" >FindAllOptions</a>
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
                            <li class="link">
                                <a href="interfaces/UserStats.html" data-type="entity-link" >UserStats</a>
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