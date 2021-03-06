---
title: Apps, Clients and Tools
layout: en
permalink: /user/apps/
---

There is a wide range of tools you can use to interact with Travis CI:

* **[Websites](#websites)**: [Full Web Clients](#Full-Web-Clients), [Dashboards](#Dashboards), [Tools](#Tools)
* **[Mobile Applications](#mobile)**: [Android](#Android), [iOS](#iOS), [Windows Phone](#Windows-Phone)
* **[Desktop](#desktop)**: [Mac OS X](#Mac-OS-X), [Linux](#Linux), [Windows](#Windows), [Cross Platform](#Cross-Platform)
* **[Command Line Tools](#commandline)**: [Full Clients](#Full-Clients), [Build Monitoring](#Build-Monitoring), [Generators](#Generators)
* **[Plugins](#plugins)**: [Google Chrome](#Google-Chrome), [Mozilla Firefox](#Mozilla-Firefox), [Opera](#Opera), [Editors](#Editors), [Other](#Other)
* **[Libraries](#libraries)**: [Ruby](#Ruby), [JavaScript](#JavaScript), [PHP](#PHP), [Python](#Python)
{: .toc-list}

And if you don't find anything that fits your needs, you can also interact with our [API](/api/) directly.

Note however that Travis CI can not take any responsibility of for third-party tools you might use.

# Websites {#websites}

## Full Web Clients

### Travis CI Web Client

![travis-web](/images/apps/travis-web.jpg){:.app}{:.official}

Our official web interface, written in [Ember.js](http://www.emberjs.com)

* [travis-ci.org](https://travis-ci.org)
* [travis-ci.com](https://travis-ci.org)
* [source code](https://github.com/travis-ci/travis-web)

### Mantis CI (web)

![mantis](/images/apps/mantis.jpg){:.app}

Web client optimized for mobile use<br>
By Hari Menon

* [application](http://floydpink.github.io/Mantis-CI-www/)
* [website](http://floydpink.github.io/Mantis-CI/)
* [source code](https://github.com/floydpink/Mantis-CI-www)

## Dashboards

### TravisLight

![travis-light](/images/apps/travis-light.jpg){:.app}

Online build monitoring tool<br>
By William Durand

* [website](http://williamdurand.fr/TravisLight/)
* [source code](https://github.com/willdurand/TravisLight)


### TravisWall

![travis-wall](/images/apps/travis-wall.jpg){:.app}

Online build monitoring tool for public/private repos<br>
By Eric Geloen

* [website](http://egeloen.fr/travis-wall/)
* [source code](https://github.com/egeloen/travis-wall)


### Team Dashboard

![travis-light](/images/apps/team-dashboard.jpg){:.app}

Visualize your team's metrics all in one place<br>
By Frederik Dietz

* [website](http://fdietz.github.io/team_dashboard/)
* [source code](https://github.com/fdietz/team_dashboard)


### Ducksboard Travis

![travis-light](/images/apps/ducksboard.jpg){:.app}

Integrates Travis CI with [Ducksboard](https://ducksboard.com/)<br>
By Divshot, Inc.

* [website](https://ducksboard-travis.herokuapp.com/)
* [source code](https://github.com/divshot/ducksboard-travis)


### CI Status

![ci-status](/images/apps/ci-status.png){:.app}

Travis CI dashboard<br>
By Piwik.

* [website](https://ci-status.com/)
* [source code](https://github.com/piwik/ci-status)


### node-build-monitor

![node-build-monitor](/images/apps/node-build-monitor.jpg){:.app}

Simple and extensible Build Monitor written in Node.js<br>
By Marcell Spies

* [website](http://marcells.github.io/node-build-monitor)
* [source code](https://github.com/marcells/node-build-monitor)

## Tools


### Travis WebLint

![weblint](/images/apps/weblint.jpg){:.app}{:.official}

Validates your .travis.yml

* [lint.travis-ci.org](http://lint.travis-ci.org/)
* [source code](https://github.com/travis-ci/travis-yaml)


### Travis Cron

![travis-cron](/images/apps/cron.jpg){:.app}

Trigger builds on a regular schedule<br>
By Filippo Valsorda

* [source code](https://github.com/FiloSottile/travis-cron)


### Travis Web Encrypter

![travis-encrypt](/images/apps/travis-encrypt.jpg){:.app}

Encrypt Secure Variables<br>
By Konstantin Haase

* [website](http://rkh.github.io/travis-encrypt/public/index.html)
* [source code](https://github.com/rkh/travis-encrypt)


### Tron CI

![travis-cron](/images/apps/tron.png){:.app}

Cron jobs for your Travis CI projects<br>
By Fabio Menegazzo

* [website](https://tron-ci.herokuapp.com/)
* [source code](https://github.com/menegazzo/tron-ci)

<a name='mobile'></a>

# Mobile Applications

## Android

### Mantis CI (Android)

![mantis](/images/apps/mantis.jpg){:.app}

Android version of Mantis CI<br>
By Hari Menon

* [website](http://floydpink.github.io/Mantis-CI/)
* [play store](https://play.google.com/store/apps/details?id=com.floydpink.android.travisci)
* [source code](https://github.com/floydpink/Mantis-CI)

### Comrade Travis

![Comrade Travis](/images/apps/comradetravis.jpg){:.app}

Follow your project builds anywhere<br>
By Christian S. Perone

* [play store](https://play.google.com/store/apps/details?id=com.perone.comradetravis)

### Siren of Shame (Android)

![Siren of Shame](/images/apps/siren-android.jpg){:.app}

Gamification for your builds<br>
By Automated Architecture

* [website](http://sirenofshame.com/)
* [play store](https://play.google.com/store/apps/details?id=com.automatedarchitecture.sirenofshame&feature=nav_result#?t=W251bGwsMSwyLDNd)

## iOS


### Jarvis

![jarvis](/images/apps/jarvis.jpg){:.app}

iPad client for Travis CI, supports private projects<br>
By NinjaConcept GmbH

* [website](http://www.ninjaconcept.com/jarvis)
* [app store](https://itunes.apple.com/us/app/jarvis/id846922611)


### Mantis CI (iOS)

![mantis](/images/apps/mantis.jpg){:.app}

iOS version of Mantis CI<br>
By Hari Menon

* [website](http://floydpink.github.io/Mantis-CI/)
* [app store](https://itunes.apple.com/us/app/travis-ci-mobile/id665742482?mt=8&ign-mpt=uo%3D4)
* [source code](https://github.com/floydpink/Mantis-CI-iOS)


### Project Monitor

![Project Monitor](/images/apps/project-monitor.jpg){:.app}

iPhone app that monitors public and private builds<br>
By Dimitri Roche

* [app store](https://itunes.apple.com/us/app/project-monitor/id857272990?ls=1&mt=8)
* [source code](https://github.com/dimroc/iOS.ProjectMonitor)

### Siren of Shame (iOS)

![Siren of Shame](/images/apps/siren-ios.jpg){:.app}

Gamification for your builds<br>
By Automated Architecture

* [website](http://sirenofshame.com/)
* [app store](https://itunes.apple.com/us/app/siren-of-shame/id637677118?ls=1&mt=8)

## Windows Phone

### Siren of Shame (Windows Phone)

![Siren of Shame](/images/apps/siren-windows-phone.jpg){:.app}

Gamification for your builds<br>
By Automated Architecture

* [website](http://sirenofshame.com/)
* [windows phone store](http://www.windowsphone.com/en-us/store/app/siren-of-shame/bd501294-b9a1-4c0f-b9cf-e6ec4596cdb1)


### Travis7

![travis7](/images/apps/travis7.jpg){:.app}

A Windows Phone client for Travis CI<br>
By Tim Felgentreff

* [website](http://travis7.codeplex.com/)

<a name='desktop'></a>

# Desktop

If you are looking for **desktop notifications**, our command line client [supports them](https://github.com/travis-ci/travis.rb#monitor).

## Mac OS X


### CCMenu

![CCMenu](/images/apps/ccmenu.jpg){:.app}

OS X status bar app<br>
By ThoughtWorks Inc.

* [website](http://ccmenu.org/)
* [app store](https://itunes.apple.com/us/app/ccmenu/id603117688?mt=12&ign-mpt=uo%3D4)
* [tutorial](/user/cc-menu/)

![Travis CI in Screensaver Ninja with Custom CSS](/images/apps/screensaver-ninja.gif){:.app}

### Screensaver Ninja

Screensaver that displays websites with the ability to have custom CSS and JavaScript.<br>
By [Carousel Apps](https://carouselapps.com)

* [website](https://Screensaver.Ninja)
* [CSS recipe for Travis CI](https://screensaver.ninja/knowledge-base/travis-ci/)

## Linux

### BuildNotify

![BuildNotify](/images/apps/buildnotify.jpg){:.app}

Linux alternative to CCMenu<br>
By Anay Nayak

* [website](https://bitbucket.org/Anay/buildnotify/wiki/Home)
* [tutorial](/user/cc-menu/)

## Windows

### CCTray

![CCTray](/images/apps/cctray.jpg){:.app}

System Tray client<br>
By CCNet and ThoughtWorks Inc.

* [website](http://www.cruisecontrolnet.org/projects/cctray)
* [sourceforge](http://sourceforge.net/projects/ccnet/files/CruiseControl.NET%20Releases/CruiseControl.NET%201.8.4/)
* [tutorial](/user/cc-menu/)

### Siren of Shame (Windows 8)

![Siren of Shame](/images/apps/siren-windows.jpg){:.app}

Gamification for your builds<br>
By Automated Architecture

* [website](http://sirenofshame.com/)
* [windows 8 store](http://apps.microsoft.com/windows/en-US/app/siren-of-shame/1af0feaf-0801-4ad3-8a95-3f1226e313b9)

## Cross Platform

### Build Checker App

![BuildCheckerApp](/images/apps/build-checker-app.png){:.app}

Check CI-server build statuses<br>
By Will Mendes.

* [website](https://github.com/willmendesneto/build-checker-app#readme)

<a name='commandline'></a>

# Command Line Tools

## Full Clients


### Travis CLI

![cli](/images/apps/cli.jpg){:.app}

Feature complete command line client

* [website](https://github.com/travis-ci/travis#readme)

## Build Monitoring

### Bickle

![bickle](/images/apps/bickle.jpg){:.app}

Display build status in your terminal<br>
By Jiri Pospisil

* [website](https://github.com/mekishizufu/bickle#readme)

### Travis Inside

![travis-inside](/images/apps/travis-inside.jpg){:.app}

Check the build status from your terminal<br>
By Benjamin Reed

* [website](https://github.com/codeblooded/travis-inside#readme)

### Travis Surveillance

![travis-surveillance](/images/apps/travis-surveillance.jpg){:.app}

Monitor a project in your terminal<br>
By Dylan Egan

* [website](https://github.com/dylanegan/travis-surveillance#readme)

### Travis Build Watcher

![travis-build-watcher](/images/apps/travis-build-watcher.jpg){:.app}

Trigger a script on build changes<br>
By Andrew Sutherland

* [website](https://github.com/asutherland/travis-build-watcher)

### Status Gravatar

![status-gravatar](/images/apps/status-gravatar.jpg){:.app}

Sets Gravatar profile image depending on build status<br>
By Gleb Bahmutov

* [website](https://github.com/bahmutov/status-gravatar)

## Generators

### travis-encrypt

![travis-encrypt](/images/apps/node-travis-encrypt.jpg){:.app}

Encrypt environment variables<br>
By Patrick Williams

* [website](https://github.com/pwmckenna/node-travis-encrypt)

### travis-tools

![travis-tools](/images/apps/travis-tools.jpg){:.app}

Easy secure data encryption<br>
By Michael van der Weg

* [website](https://github.com/eventEmitter/travis-tools)

### Travisify (Ruby)

![travisify-ruby](/images/apps/travisify-ruby.jpg){:.app}

Creates .travis.yml with tagging and env variables<br>
By James Smith

* [website](https://github.com/theodi/travisify)

### Travisify (Node.js)

![travisify-node](/images/apps/travisify-node.jpg){:.app}

Add Travis CI hooks to your GitHub project<br>
By James Halliday

* [website](https://github.com/substack/travisify)

<a name='plugins'></a>

# Plugins

## Google Chrome

### My Travis

![chrome-my-travis](/images/apps/chrome-my-travis.jpg){:.app}

Monitor your projects builds within Chrome<br>
By Leonardo Quixad??

* [website](https://chrome.google.com/webstore/detail/my-travis/ddlafmkcenhiahiikbgjemcbdengmjbg)

### github+travis

![chrome-github-travis](/images/apps/chrome-github-travis.jpg){:.app}

Display build status next to project name on GitHub<br>
By Tomas Carnecky

* [website](https://chrome.google.com/webstore/detail/klbmicjanlggbmanmpneloekhajhhbfb)

### GitHub Status

![chrome-github-status](/images/apps/chrome-github-status.jpg){:.app}

Display build status next to project name on GitHub<br>
By excellenteasy

* [website](https://chrome.google.com/webstore/detail/github-status/mgbkbopoincdiimlleifbpfjfhcndahp)

## Mozilla Firefox

### Github+Travis

![chrome-github-travis](/images/apps/chrome-github-travis.jpg){:.app}

Display build status next to project name on GitHub<br>
By David Burns

* [website](https://addons.mozilla.org/en-US/firefox/addon/githubtravis/)

### Link to Travis Lite

![firefox-travis-lite](/images/apps/firefox-travis-lite.jpg){:.app}

Add a links to corresponding Travis Lite page<br>
By Nigel Babu

* [website](https://addons.mozilla.org/en-US/firefox/addon/link-to-travis-lite/)

## Opera

### GitHub+Travis

![chrome-github-travis](/images/apps/chrome-github-travis.jpg){:.app}

Display build status next to project name on GitHub<br>
By smasty

* [website](https://addons.opera.com/en/extensions/details/travisgithub/)

## Editors

### Atom Plugin

![atom](/images/apps/atom.jpg){:.app}

Travis CI integration for [Atom](https://atom.io/)<br>
By Tom Bell

* [website](https://github.com/tombell/travis-ci-status)

### Brackets Plugin

![brackets](/images/apps/brackets.jpg){:.app}

Travis CI integration for [Brackets](http://brackets.io/)<br>
By Cas du Plessis

* [website](https://github.com/AgileAce/Brackets-TravisCI)

### Vim Plugin

![vim](/images/apps/vim.jpg){:.app}

Travis CI integration for [Vim](http://www.vim.org/)<br>
By Keith Smiley

* [website](https://github.com/Keithbsmiley/travis.vim)

## Other

### git-travis

![git-travis](/images/apps/git.png){:.app}

Git subcommand to display build status<br>
By Dav Glass

* [website](https://github.com/davglass/git-travis#readme)

### gh-travis

![NodeGH](/images/apps/nodegh.jpg){:.app}

NodeGH plugin for integrating Travis CI<br>
By Eduardo Antonio Lundgren Melo and Zeno Rocha Bueno Netto

* [website](https://github.com/node-gh/gh-travis)

<a name='libraries'></a>

# Libraries

## Ruby

* [travis.rb](https://github.com/travis-ci/travis.rb) **(official)**
* [TravisMiner](https://github.com/smcintosh/travisminer) by Shane McIntosh
* [hoe-travis](https://github.com/drbrain/hoe-travis) by Eric Hodel

## JavaScript

* [travis-ci](https://github.com/pwmckenna/node-travis-ci) by Patrick Williams
* [node-travis-ci](https://github.com/mmalecki/node-travis-ci) by Maciej Ma??ecki
* [travis-api-wrapper](https://github.com/cmaujean/travis-api-wrapper) by Christopher Maujean
* [travis.js](https://github.com/travis-ci/travis.js) by Konstantin Haase
* [ee-travis](https://github.com/eventEmitter/ee-travis) by Michael van der Weg
* [Favis CI](https://github.com/jaunesarmiento/favis-ci) by Jaune Sarmiento

## PHP

* [php-travis-client](https://github.com/l3l0/php-travis-client) by Leszek Prabucki

## Python

* [TravisPy](http://travispy.readthedocs.org/en/latest/) by Fabio Menegazzo
